document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.querySelector(".menu-toggle");
  const nav = document.getElementById("menu-principal");
  const iconMenu = toggleBtn?.querySelector(".icon-menu");
  const iconClose = toggleBtn?.querySelector(".icon-close");
  const desktopMedia = window.matchMedia("(min-width: 768px)");

  function syncMenuVisibility() {
    if (!toggleBtn || !nav) return;

    if (desktopMedia.matches) {
      nav.hidden = false;
      toggleBtn.setAttribute("aria-expanded", "false");
      toggleBtn.setAttribute("aria-label", "Abrir menu");
      if (iconMenu) iconMenu.hidden = false;
      if (iconClose) iconClose.hidden = true;
    } else {
      const isExpanded = toggleBtn.getAttribute("aria-expanded") === "true";
      nav.hidden = !isExpanded;
    }
  }

  function setMenuState(open) {
    if (!toggleBtn || !nav) return;
    toggleBtn.setAttribute("aria-expanded", String(open));
    toggleBtn.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    nav.hidden = !open;
    if (iconMenu) iconMenu.hidden = open;
    if (iconClose) iconClose.hidden = !open;
  }

  if (toggleBtn && nav) {
    syncMenuVisibility();
    desktopMedia.addEventListener("change", syncMenuVisibility);

    toggleBtn.addEventListener("click", () => {
      const currentlyOpen = toggleBtn.getAttribute("aria-expanded") === "true";
      setMenuState(!currentlyOpen);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !desktopMedia.matches) {
        const currentlyOpen = toggleBtn.getAttribute("aria-expanded") === "true";
        if (currentlyOpen) {
          setMenuState(false);
          toggleBtn.focus();
        }
      }
    });
  }

  // Botão Voltar ao topo
  const topBtn = document.createElement("button");
  topBtn.type = "button";
  topBtn.className = "btn btn-primary back-to-top";
  topBtn.textContent = "Voltar ao topo";
  topBtn.hidden = true;
  document.body.appendChild(topBtn);

  window.addEventListener("scroll", () => {
    topBtn.hidden = window.scrollY < 320;
  }, { passive: true });

  topBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0 });
    const main = document.getElementById("conteudo-principal");
    if (main) main.focus({ preventScroll: true });
  });
});
