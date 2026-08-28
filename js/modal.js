/**
 * Course Hub Modals & Notification System
 */

window.CourseModal = (function () {
  const icons = window.CourseHubConfig.icons;

  /**
   * Toast notification helper
   */
  function showToast(message, type = 'success') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span>${icons.check}</span>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
      toast.classList.add('active');
    });

    // Animate out & remove
    setTimeout(() => {
      toast.classList.remove('active');
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3000);
  }

  /**
   * Open a modal by ID
   */
  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    if (modalId === 'modal-embed') {
      updateEmbedSnippet();
    }
  }

  /**
   * Close a modal by ID
   */
  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  /**
   * Generate and update the Moodle iframe snippet in the Embed Modal
   */
  function updateEmbedSnippet() {
    const heightInput = document.getElementById('embed-height-input');
    const embedModeCheckbox = document.getElementById('embed-mode-checkbox');
    const snippetEl = document.getElementById('embed-code-snippet');
    if (!snippetEl) return;

    const height = heightInput ? heightInput.value : '750';
    const isEmbedOnly = embedModeCheckbox ? embedModeCheckbox.checked : true;

    const currentUrl = window.location.href.split('?')[0];
    const embedUrl = isEmbedOnly ? `${currentUrl}?embed=true` : currentUrl;

    const snippet = `<div style="width:100%; overflow:hidden; border-radius:12px;">
  <iframe
    src="${embedUrl}"
    width="100%"
    height="${height}"
    style="border:0; width:100%; display:block;"
    loading="lazy"
    title="Custom Course Hub">
  </iframe>
</div>`;

    snippetEl.textContent = snippet;
  }

  /**
   * Copy embed code to clipboard
   */
  function copyEmbedCode() {
    const snippetEl = document.getElementById('embed-code-snippet');
    if (!snippetEl) return;

    navigator.clipboard.writeText(snippetEl.textContent)
      .then(() => {
        showToast('Iframe embed code copied to clipboard!');
      })
      .catch(() => {
        // Fallback for non-https contexts
        const textarea = document.createElement('textarea');
        textarea.value = snippetEl.textContent;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        textarea.remove();
        showToast('Iframe embed code copied!');
      });
  }

  /**
   * Export current courses as courses.json download
   */
  function exportCoursesJson(courses) {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(courses, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'courses.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Downloaded updated courses.json!');
  }

  return {
    showToast,
    openModal,
    closeModal,
    updateEmbedSnippet,
    copyEmbedCode,
    exportCoursesJson
  };
})();
