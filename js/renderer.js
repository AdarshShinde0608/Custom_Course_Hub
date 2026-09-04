/**
 * Course Hub DOM Renderer Module
 */

window.CourseRenderer = (function () {
  const icons = window.CourseHubConfig.icons;

  /**
   * Render action buttons for a course
   */
  function renderActionButtons(links) {
    if (!links || links.length === 0) return '';

    return links
      .map(link => {
        let btnClass = 'course-btn';
        let btnIcon = icons.externalLink;

        if (link.type === 'theory') {
          btnClass += ' btn-theory';
          btnIcon = icons.bookOpen;
        } else if (link.type === 'lab') {
          btnClass += ' btn-lab';
          btnIcon = icons.flask;
        } else if (link.type === 'project') {
          btnClass += ' btn-project';
          btnIcon = icons.sparkles;
        } else if (link.type === 'elective') {
          btnClass += ' btn-elective';
          btnIcon = icons.bookOpen;
        }

        return `
          <a href="${link.url}" 
             class="${btnClass}" 
             target="_top" 
             rel="noopener noreferrer"
             title="Open ${link.name} on Moodle">
            ${btnIcon}
            <span>${link.name}</span>
          </a>
        `;
      })
      .join('');
  }

  /**
   * Render a single course card
   */
  function renderCourseCard(course) {
    const iconSvg = icons[course.icon] || icons.database;
    const isFav = !!course.isFavorite;

    return `
      <article class="course-card" data-id="${course.id}" data-theme-color="${course.theme || 'indigo'}">
        <div>
          <div class="card-header">
            <div class="card-title-group">
              <div class="course-icon-box" title="${course.type}">
                ${iconSvg}
              </div>
              <div>
                <div class="course-meta-top">
                  <span class="course-code">${course.code || 'COURSE'}</span>
                  <span class="course-sem-badge">${course.semester || 'SEM-IV'}</span>
                </div>
                <h3 class="card-title">${course.title}</h3>
              </div>
            </div>
            <button class="btn-fav ${isFav ? 'active' : ''}" 
                    data-action="toggle-fav" 
                    data-id="${course.id}" 
                    title="${isFav ? 'Unpin from favorites' : 'Pin to favorites'}" 
                    aria-label="Toggle favorite">
              ${isFav ? icons.starFilled : icons.star}
            </button>
          </div>

          <div class="card-body">
            <p class="course-desc">${course.description || ''}</p>
          </div>
        </div>

        <div class="card-actions">
          ${renderActionButtons(course.links)}
        </div>
      </article>
    `;
  }

  /**
   * Render full list of courses into target container
   */
  function renderCourses(courses, containerEl) {
    if (!containerEl) return;

    if (!courses || courses.length === 0) {
      containerEl.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">${icons.search}</div>
          <h3 class="empty-title">No Courses Found</h3>
          <p class="empty-subtitle">We couldn't find any courses matching your search or filter criteria.</p>
          <button class="btn-secondary" id="btn-clear-filters">Clear Filters</button>
        </div>
      `;
      return;
    }

    // Render cards sorted (pinned favorites first)
    const sorted = [...courses].sort((a, b) => {
      if (a.isFavorite === b.isFavorite) return 0;
      return a.isFavorite ? -1 : 1;
    });

    containerEl.innerHTML = sorted.map(renderCourseCard).join('');
  }

  /**
   * Update the stats counter text
   */
  function updateStats(filteredCount, totalCount) {
    const statsEl = document.getElementById('results-count');
    if (!statsEl) return;

    if (filteredCount === totalCount) {
      statsEl.textContent = `Showing all ${totalCount} courses`;
    } else {
      statsEl.textContent = `Showing ${filteredCount} of ${totalCount} courses`;
    }
  }

  return {
    renderCourses,
    updateStats
  };
})();
