/**
 * Course Hub Navigation & Iframe Integration Module
 */

window.CourseNavigation = (function () {
  /**
   * Send height update to parent window if embedded in iframe
   */
  function notifyParentOfResize() {
    if (window.parent && window.parent !== window) {
      try {
        const height = document.documentElement.scrollHeight || document.body.scrollHeight;
        window.parent.postMessage(
          {
            type: 'COURSE_HUB_RESIZE',
            height: height + 20, // add a small breathing margin
            source: 'custom-course-hub'
          },
          '*'
        );
      } catch (e) {
        // Suppress cross-origin postMessage errors
      }
    }
  }

  /**
   * Parse query parameters on load
   */
  function parseQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
      isEmbed: params.get('embed') === 'true' || params.get('iframe') === 'true',
      theme: params.get('theme'),
      search: params.get('search') || params.get('q'),
      semester: params.get('sem') || params.get('semester')
    };
  }

  /**
   * Initialize iframe listeners and observers
   */
  function initIframeAutoResize() {
    // Notify on load and window resize
    window.addEventListener('load', notifyParentOfResize);
    window.addEventListener('resize', notifyParentOfResize);

    // Observe DOM mutations to notify parent whenever cards are filtered or updated
    if (window.MutationObserver) {
      const observer = new MutationObserver(() => {
        notifyParentOfResize();
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true
      });
    }
  }

  return {
    notifyParentOfResize,
    parseQueryParams,
    initIframeAutoResize
  };
})();
