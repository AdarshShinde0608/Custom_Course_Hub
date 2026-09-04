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
    viewMode: 'grid',
    theme: 'dark',
    isEmbed: false,
    containerEl: null
  };

  const STORAGE_KEYS = {
    favorites: 'course_hub_favorites',
    customCourses: 'course_hub_custom_courses'
  };

  /**
   * Load favorite flags from localStorage
   */
  function loadFavoritesMap() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.favorites) || '{}');
    } catch {
      return {};
    }
  }

  /**
   * Save a single favorite flag
   */
  function saveFavorite(courseId, isFavorite) {
    const favorites = loadFavoritesMap();
    favorites[courseId] = isFavorite;
    localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(favorites));
  }

  /**
   * Load user-added courses from localStorage
   */
  function loadCustomCourses() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.customCourses) || '[]');
    } catch {
      return [];
    }
  }

  /**
   * Apply favorite flags from localStorage onto course list
   */
  function applyFavorites(courses) {
    const favorites = loadFavoritesMap();
    return courses.map(course => ({
      ...course,
      isFavorite: favorites[course.id] !== undefined ? favorites[course.id] : !!course.isFavorite
    }));
  }

  /**
   * Merge base courses with custom local courses (dedupe by id)
   */
  function mergeCourses(baseCourses, customCourses) {
    const merged = [...baseCourses];
    const ids = new Set(baseCourses.map(c => c.id));
    customCourses.forEach(course => {
      if (!ids.has(course.id)) {
        merged.push(course);
        ids.add(course.id);
      }
    });
    return merged;
  }

  /**
   * Update header badge from course data
   */
  function updateHeaderBadge(courses) {
    const badgeEl = document.getElementById('brand-semester-badge');
    if (!badgeEl || !courses.length) return;

    const semesters = [...new Set(courses.map(c => c.semester).filter(Boolean))];
    const years = [...new Set(courses.map(c => c.academicYear).filter(Boolean))];

    const semLabel = semesters.length === 1 ? semesters[0] : (semesters.length > 1 ? 'Multi-Sem' : config.defaultSemester);
    const yearLabel = years.length === 1 ? years[0] : (years.length > 1 ? 'Multi-Year' : config.defaultAcademicYear);
    badgeEl.textContent = `${semLabel} • ${yearLabel}`;
  }

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
   * Load courses: always fetch JSON, overlay favorites & custom courses
   */
  async function loadCourses() {
    let baseCourses = [];

    try {
      const res = await fetch(config.dataUrl);
      if (res.ok) {
        baseCourses = await res.json();
        console.log('Loaded courses from data/courses.json');
      }
    } catch (e) {
      console.warn('Fetch data/courses.json failed, falling back to config defaults', e);
    }

    if (!baseCourses.length) {
      baseCourses = [...config.defaultCourses];
      console.log('Loaded courses from embedded default config');
    }

    // Migrate legacy full-list localStorage override to favorites-only storage
    const legacyRaw = localStorage.getItem(STORAGE_KEYS.customCourses);
    if (legacyRaw && !localStorage.getItem(STORAGE_KEYS.favorites)) {
      try {
        const legacyCourses = JSON.parse(legacyRaw);
        if (Array.isArray(legacyCourses) && legacyCourses.length > 0 && legacyCourses[0].title) {
          const favorites = {};
          legacyCourses.forEach(c => {
            if (c.isFavorite) favorites[c.id] = true;
          });
          localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(favorites));
          localStorage.removeItem(STORAGE_KEYS.customCourses);
        }
      } catch { /* ignore */ }
    }

    const customCourses = loadCustomCourses();
    AppState.courses = applyFavorites(mergeCourses(baseCourses, customCourses));
    updateHeaderBadge(AppState.courses);
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
    setPillCount('[data-filter-count="elective"]', counts.elective);
  }

  /**
   * Toggle favorite/pinned status for a course
   */
  function toggleCourseFavorite(courseId) {
    const course = AppState.courses.find(c => c.id === courseId);
    if (!course) return;

    course.isFavorite = !course.isFavorite;
    saveFavorite(courseId, course.isFavorite);
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
        if (AppState.isEmbed) return;
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
          localStorage.removeItem(STORAGE_KEYS.favorites);
          localStorage.removeItem(STORAGE_KEYS.customCourses);
          loadCourses();
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
        const customCourses = loadCustomCourses();
        customCourses.unshift(newCourse);
        localStorage.setItem(STORAGE_KEYS.customCourses, JSON.stringify(customCourses));
        updateHeaderBadge(AppState.courses);
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
   * Configure embed mode: compact UI, force 2-column grid
   */
  function applyEmbedMode() {
    if (!AppState.isEmbed) return;

    document.body.classList.add('embed-mode');

    // Hide admin-only controls inside Moodle iframe
    ['btn-open-embed-modal', 'btn-open-manager-modal'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = 'none';
    });

    // Force grid view for side-by-side cards
    AppState.viewMode = 'grid';
    if (AppState.containerEl) {
      AppState.containerEl.classList.remove('list-view');
    }
    const btnGrid = document.getElementById('btn-view-grid');
    const btnList = document.getElementById('btn-view-list');
    if (btnGrid) btnGrid.classList.add('active');
    if (btnList) btnList.classList.remove('active');
  }

  /**
   * Handle embed query parameters
   */
  function handleQueryParams() {
    const params = navigation.parseQueryParams();
    AppState.isEmbed = params.isEmbed;
    if (params.isEmbed) {
      applyEmbedMode();
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
