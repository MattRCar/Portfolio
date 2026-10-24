document.addEventListener("DOMContentLoaded", function () {
  const toggle = document.getElementById("nav-toggle");
  const nav = document.getElementById("nav-links");
  const header = document.querySelector(".site-header");
  if (!toggle || !nav) return;

  // initialize aria
  toggle.setAttribute("aria-expanded", "false");

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    if (header) header.classList.toggle("nav-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
    // add class for CSS animation (hamburger -> X) and update label
    toggle.classList.toggle("open", isOpen);
    toggle.setAttribute(
      "aria-label",
      isOpen ? "Close navigation" : "Open navigation",
    );
  });

  // Close nav when a link is clicked (mobile)
  nav.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
      nav.classList.remove("open");
      if (header) header.classList.remove("nav-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });

  // Theme toggle logic
  const themeToggle = document.getElementById("theme-toggle");
  const root = document.documentElement;

  function applyTheme(theme) {
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    if (themeToggle) {
      themeToggle.textContent = root.classList.contains("dark") ? "☀️" : "🌙";
      themeToggle.setAttribute(
        "aria-pressed",
        String(root.classList.contains("dark")),
      );
    }
  }

  // initialize theme from localStorage or system preference
  const stored = localStorage.getItem("theme");
  if (stored) {
    applyTheme(stored);
  } else if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    applyTheme("dark");
  } else {
    applyTheme("light");
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const isDark = root.classList.toggle("dark");
      applyTheme(isDark ? "dark" : "light");
      localStorage.setItem("theme", isDark ? "dark" : "light");
    });
  }
});

/* =========================================
   DIGITAL PUBLICATION PDF VIEWER
   ========================================= */

const publicationFrame = document.getElementById("publication-frame");

if (publicationFrame) {
  const publications = {
    final: {
      file: "PDF/publication-final.pdf",
      title: "Final publication design",
      pages: 3,
    },
    wireframes: {
      file: "PDF/publication-wireframes.pdf",
      title: "Original publication wireframes",
      pages: 3,
    },
  };

  let activePublication = "final";
  let currentPage = 1;

  const pageLabel = document.getElementById("publication-page-label");

  const prevButton = document.getElementById("publication-prev");

  const nextButton = document.getElementById("publication-next");

  const tabs = document.querySelectorAll(".publication-tab");

  function updatePublication() {
    const publication = publications[activePublication];

    publicationFrame.src = `${publication.file}#page=${currentPage}&toolbar=0`;

    publicationFrame.title = publication.title;

    pageLabel.textContent = `Page ${currentPage} of ${publication.pages}`;

    prevButton.disabled = currentPage === 1;

    nextButton.disabled = currentPage === publication.pages;

    tabs.forEach((tab) => {
      const isActive = tab.dataset.pdf === activePublication;

      tab.classList.toggle("active", isActive);

      tab.setAttribute("aria-pressed", String(isActive));
    });
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      activePublication = tab.dataset.pdf;
      currentPage = 1;
      updatePublication();
    });
  });

  prevButton.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      updatePublication();
    }
  });

  nextButton.addEventListener("click", () => {
    if (currentPage < publications[activePublication].pages) {
      currentPage++;
      updatePublication();
    }
  });

  updatePublication();
}
