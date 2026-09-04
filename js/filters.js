/**
 * Course Hub Filters & Search Module
 */

window.CourseFilters = (function () {
  let state = {
    searchQuery: '',
    selectedSemester: 'all',
    selectedType: 'all',
    onlyFavorites: false
  };

  /**
   * Set search query
   */
  function setSearchQuery(query) {
    state.searchQuery = (query || '').toLowerCase().trim();
  }

  /**
   * Set semester filter
   */
  function setSemester(sem) {
    state.selectedSemester = sem;
  }

  /**
   * Set course type filter
   */
  function setType(type) {
    state.selectedType = type;
  }

  /**
   * Toggle only favorites filter
   */
  function toggleFavorites(val) {
    state.onlyFavorites = typeof val === 'boolean' ? val : !state.onlyFavorites;
  }

  /**
   * Reset all filter states
   */
  function resetFilters() {
    state.searchQuery = '';
    state.selectedSemester = 'all';
    state.selectedType = 'all';
    state.onlyFavorites = false;
  }

  /**
   * Apply active filters to master course list
   */
  function applyFilters(courses) {
    if (!courses) return [];

    return courses.filter(course => {
      // 1. Search Query Check
      if (state.searchQuery) {
        const titleMatch = (course.title || '').toLowerCase().includes(state.searchQuery);
        const codeMatch = (course.code || '').toLowerCase().includes(state.searchQuery);
        const descMatch = (course.description || '').toLowerCase().includes(state.searchQuery);
        const instMatch = (course.instructor || '').toLowerCase().includes(state.searchQuery);
        const typeMatch = (course.type || '').toLowerCase().includes(state.searchQuery);

        if (!titleMatch && !codeMatch && !descMatch && !instMatch && !typeMatch) {
          return false;
        }
      }

      // 2. Semester Filter Check
      if (state.selectedSemester !== 'all') {
        if ((course.semester || '').toUpperCase() !== state.selectedSemester.toUpperCase()) {
          return false;
        }
      }

      // 3. Type Filter Check
      if (state.selectedType !== 'all') {
        const cType = (course.type || '').toLowerCase();
        const linkTypes = (course.links || []).map(l => (l.type || '').toLowerCase());
        if (state.selectedType === 'theory' && !cType.includes('theory') && !linkTypes.includes('theory')) return false;
        if (state.selectedType === 'lab' && !cType.includes('lab') && !linkTypes.includes('lab')) return false;
        if (state.selectedType === 'project' && !cType.includes('project') && !linkTypes.includes('project')) return false;
        if (state.selectedType === 'elective' && !cType.includes('elective') && !linkTypes.includes('elective')) return false;
      }

      // 4. Favorites Check
      if (state.onlyFavorites && !course.isFavorite) {
        return false;
      }

      return true;
    });
  }

  /**
   * Calculate counts for filter pills
   */
  function calculateCounts(courses) {
    const counts = {
      all: courses.length,
      theory: 0,
      lab: 0,
      project: 0,
      elective: 0,
      favorites: 0
    };

    courses.forEach(c => {
      const type = (c.type || '').toLowerCase();
      const linkTypes = (c.links || []).map(l => (l.type || '').toLowerCase());
      if (type.includes('theory') || linkTypes.includes('theory')) counts.theory++;
      if (type.includes('lab') || linkTypes.includes('lab')) counts.lab++;
      if (type.includes('project') || linkTypes.includes('project')) counts.project++;
      if (type.includes('elective') || linkTypes.includes('elective')) counts.elective++;
      if (c.isFavorite) counts.favorites++;
    });

    return counts;
  }

  return {
    state,
    setSearchQuery,
    setSemester,
    setType,
    toggleFavorites,
    resetFilters,
    applyFilters,
    calculateCounts
  };
})();
