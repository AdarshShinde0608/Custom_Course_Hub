/**
 * Custom Course Hub Main Application Controller
 */

(function () {
  const config = window.CourseHubConfig;
  const renderer = window.CourseRenderer;
  const filters = window.CourseFilters;
  const navigation = window.CourseNavigation;
  const modal = window.CourseModal;

  // Application State
  const AppState = {
    courses: [],
    viewMode: 'grid', // 'grid' | 'list'
    theme: 'dark', // 'dark' | 'light'
    containerEl: null
  };

  /**
   * Initialize theme from localStorage or system preference
   */
  function initTheme() {
    const savedTheme = localStorage.getItem('course_hub_theme');
    const queryParams = navigation.parseQueryParams();

    if (queryParams.theme && (queryParams.theme === 'light' || queryParams.theme === 'dark')) {
      AppState.theme = queryParams.theme;
    } else if (savedTheme) {
      AppState.theme = savedTheme;
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      AppState.theme = 'light';
    } else {
      AppState.theme = 'dark';
    }

    applyTheme(AppState.theme);
  }

  /**
   * Apply theme to DOM
   */
  function applyTheme(theme) {
    AppState.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('course_hub_theme', theme);

    const themeBtn = document.getElementById('btn-theme-toggle');
    if (themeBtn) {
      themeBtn.innerHTML = theme === 'dark' ? config.icons.sun : config.icons.moon;
      themeBtn.title = `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`;
    }
  }

  /**
   * Toggle between Dark and Light mode
   */
  function toggleTheme() {
    const newTheme = AppState.theme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
  }

  /**
   * Load courses data with multi-tier fallback
   */
  async function loadCourses() {
    // 1. Check if user has saved custom courses in localStorage
    const savedCourses = localStorage.getItem('course_hub_custom_courses');
    if (savedCourses) {
      try {
        AppState.courses = JSON.parse(savedCourses);
        console.log('Loaded courses from localStorage cache');
        updateUI();
        return;
      } catch (e) {
        console.warn('Failed to parse cached courses, falling back to fetch/defaults');
      }
    }

    // 2. Attempt fetching data/courses.json
    try {
      const res = await fetch(config.dataUrl);
      if (res.ok) {
        AppState.courses = await res.json();
        console.log('Loaded courses from data/courses.json');
        updateUI();
        return;
      }
    } catch (e) {
      console.warn('Fetch data/courses.json failed (likely file:// or offline), falling back to config defaults', e);
    }

    // 3. Fallback to embedded default data in config.js
    AppState.courses = [...config.defaultCourses];
    console.log('Loaded courses from embedded default config');
    updateUI();
  }

  /**
   * Update filtered UI, counts, and stats
   */
  function updateUI() {
    const filtered = filters.applyFilters(AppState.courses);
    renderer.renderCourses(filtered, AppState.containerEl);
    renderer.updateStats(filtered.length, AppState.courses.length);
    updateFilterPillCounts();
  }

  /**
   * Update badges on filter pills
   */
  function updateFilterPillCounts() {
    const counts = filters.calculateCounts(AppState.courses);
    
    const setPillCount = (selector, count) => {
      const el = document.querySelector(selector);
      if (el) el.textContent = `(${count})`;
    };

    setPillCount('[data-filter-count="all"]', counts.all);
    setPillCount('[data-filter-count="theory"]', counts.theory);
    setPillCount('[data-filter-count="lab"]', counts.lab);
    setPillCount('[data-filter-count="project"]', counts.project);
  }

  /**
   * Toggle favorite/pinned status for a course
   */
  function toggleCourseFavorite(courseId) {
    const course = AppState.courses.find(c => c.id === courseId);
    if (!course) return;

    course.isFavorite = !course.isFavorite;
    localStorage.setItem('course_hub_custom_courses', JSON.stringify(AppState.courses));
    updateUI();
    modal.showToast(course.isFavorite ? `Pinned "${course.title}" to top` : `Unpinned "${course.title}"`);
  }

  /**
   * Setup all event listeners
   */
  function bindEvents() {
    // Search input
    const searchInput = document.getElementById('course-search-input');
    const clearSearchBtn = document.getElementById('btn-clear-search');

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        filters.setSearchQuery(e.target.value);
        if (clearSearchBtn) {
          clearSearchBtn.style.display = e.target.value ? 'flex' : 'none';
        }
        updateUI();
      });
    }

    if (clearSearchBtn) {
      clearSearchBtn.addEventListener('click', () => {
        if (searchInput) {
          searchInput.value = '';
          searchInput.focus();
        }
        clearSearchBtn.style.display = 'none';
        filters.setSearchQuery('');
        updateUI();
      });
    }

    // Filter pills
    const filterPills = document.querySelectorAll('.filter-pill[data-filter-type]');
    filterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        filterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');

        const filterType = pill.getAttribute('data-filter-type');
        filters.setType(filterType);
        updateUI();
      });
    });

    // Semester dropdown / filter
    const semFilter = document.getElementById('select-semester');
    if (semFilter) {
      semFilter.addEventListener('change', (e) => {
        filters.setSemester(e.target.value);
        updateUI();
      });
    }

    // View switcher (grid / list)
    const btnGridView = document.getElementById('btn-view-grid');
    const btnListView = document.getElementById('btn-view-list');

    if (btnGridView && btnListView) {
      btnGridView.addEventListener('click', () => {
        btnGridView.classList.add('active');
        btnListView.classList.remove('active');
        AppState.viewMode = 'grid';
        AppState.containerEl.classList.remove('list-view');
      });

      btnListView.addEventListener('click', () => {
        btnListView.classList.add('active');
        btnGridView.classList.remove('active');
        AppState.viewMode = 'list';
        AppState.containerEl.classList.add('list-view');
      });
    }

    // Theme toggle button
    const themeBtn = document.getElementById('btn-theme-toggle');
    if (themeBtn) {
      themeBtn.addEventListener('click', toggleTheme);
    }

    // Delegate favorite button clicks and clear filter actions
    if (AppState.containerEl) {
      AppState.containerEl.addEventListener('click', (e) => {
        const favBtn = e.target.closest('[data-action="toggle-fav"]');
        if (favBtn) {
          const courseId = favBtn.getAttribute('data-id');
          toggleCourseFavorite(courseId);
          return;
        }

        if (e.target.id === 'btn-clear-filters') {
          filters.resetFilters();
          if (searchInput) searchInput.value = '';
          if (clearSearchBtn) clearSearchBtn.style.display = 'none';
          filterPills.forEach(p => p.classList.toggle('active', p.getAttribute('data-filter-type') === 'all'));
          if (semFilter) semFilter.value = 'all';
          updateUI();
        }
      });
    }

    // Modal Triggers
    const btnOpenEmbed = document.getElementById('btn-open-embed-modal');
    if (btnOpenEmbed) {
      btnOpenEmbed.addEventListener('click', () => modal.openModal('modal-embed'));
    }

    const btnOpenManager = document.getElementById('btn-open-manager-modal');
    if (btnOpenManager) {
      btnOpenManager.addEventListener('click', () => modal.openModal('modal-manager'));
    }

    // Modal Close Buttons
    document.querySelectorAll('[data-action="close-modal"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const modalEl = btn.closest('.modal-overlay');
        if (modalEl) modal.closeModal(modalEl.id);
      });
    });

    // Close modal on overlay click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          modal.closeModal(overlay.id);
        }
      });
    });

    // Embed Modal Controls
    const heightInput = document.getElementById('embed-height-input');
    const embedModeCheckbox = document.getElementById('embed-mode-checkbox');
    const btnCopyEmbed = document.getElementById('btn-copy-embed-code');

    if (heightInput) heightInput.addEventListener('input', modal.updateEmbedSnippet);
    if (embedModeCheckbox) embedModeCheckbox.addEventListener('change', modal.updateEmbedSnippet);
    if (btnCopyEmbed) btnCopyEmbed.addEventListener('click', modal.copyEmbedCode);

    // Course Manager Actions
    const btnExportJson = document.getElementById('btn-export-courses-json');
    if (btnExportJson) {
      btnExportJson.addEventListener('click', () => modal.exportCoursesJson(AppState.courses));
    }

    const btnResetCourses = document.getElementById('btn-reset-default-courses');
    if (btnResetCourses) {
      btnResetCourses.addEventListener('click', () => {
        if (confirm('Reset all course data back to factory defaults?')) {
          localStorage.removeItem('course_hub_custom_courses');
          AppState.courses = [...config.defaultCourses];
          updateUI();
          modal.closeModal('modal-manager');
          modal.showToast('Reset courses to factory defaults!');
        }
      });
    }

    // Add Course Form Submit
    const addCourseForm = document.getElementById('form-add-course');
    if (addCourseForm) {
      addCourseForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const code = document.getElementById('new-course-code').value.trim();
        const title = document.getElementById('new-course-title').value.trim();
        const semester = document.getElementById('new-course-sem').value;
        const type = document.getElementById('new-course-type').value;
        const theme = document.getElementById('new-course-theme').value;
        const theoryId = document.getElementById('new-course-theory-id').value.trim();
        const labId = document.getElementById('new-course-lab-id').value.trim();

        const links = [];
        if (theoryId) {
          links.push({
            name: 'Theory',
            url: `https://moodle.mitaoe.ac.in/course/view.php?id=${theoryId}`,
            badge: 'Lecture',
            type: 'theory'
          });
        }
        if (labId) {
          links.push({
            name: 'Lab',
            url: `https://moodle.mitaoe.ac.in/course/view.php?id=${labId}`,
            badge: 'Practical',
            type: 'lab'
          });
        }
        if (links.length === 0) {
          links.push({
            name: 'Course Page',
            url: `https://moodle.mitaoe.ac.in`,
            badge: 'General',
            type: 'project'
          });
        }

        const newCourse = {
          id: 'course-' + Date.now(),
          code: code || 'NEW101',
          title: title,
          semester: semester,
          academicYear: config.defaultAcademicYear,
          type: type,
          theme: theme,
          icon: theme === 'emerald' ? 'code' : (theme === 'purple' ? 'layers' : 'database'),
          instructor: 'Dept. of Computer Engineering',
          description: `Course for ${title} (${semester})`,
          links: links,
          isFavorite: false
        };

        AppState.courses.unshift(newCourse);
        localStorage.setItem('course_hub_custom_courses', JSON.stringify(AppState.courses));
        updateUI();
        addCourseForm.reset();
        modal.closeModal('modal-manager');
        modal.showToast(`Added course "${title}"!`);
      });
    }

    // Global Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
      // '/' to focus search
      if (e.key === '/' && document.activeElement !== searchInput) {
        if (!document.querySelector('.modal-overlay.active')) {
          e.preventDefault();
          if (searchInput) searchInput.focus();
        }
      }
      // 'Esc' to close modals or blur search
      if (e.key === 'Escape') {
        const activeModal = document.querySelector('.modal-overlay.active');
        if (activeModal) {
          modal.closeModal(activeModal.id);
        } else if (document.activeElement === searchInput) {
          searchInput.blur();
        }
      }
    });
  }

  /**
   * Handle embed query parameters
   */
  function handleQueryParams() {
    const params = navigation.parseQueryParams();
    if (params.isEmbed) {
      document.body.classList.add('embed-mode');
    }
    if (params.search) {
      const searchInput = document.getElementById('course-search-input');
      if (searchInput) searchInput.value = params.search;
      filters.setSearchQuery(params.search);
    }
    if (params.semester) {
      const semFilter = document.getElementById('select-semester');
      if (semFilter) semFilter.value = params.semester;
      filters.setSemester(params.semester);
    }
  }

  /**
   * Main Initialization Function
   */
  function init() {
    AppState.containerEl = document.getElementById('courses-grid-container');
    initTheme();
    handleQueryParams();
    bindEvents();
    loadCourses();
    navigation.initIframeAutoResize();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
