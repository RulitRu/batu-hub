// BATU HUB — tema geçişi ve arama işlevi
// Harici bağımlılık yok, veri toplama yok, sadece localStorage'da tema tercihi tutulur.

(function () {
  "use strict";

  var THEME_KEY = "batuhub-theme";
  var root = document.documentElement;
  var toggleBtn = document.getElementById("themeToggle");
  var themeIcon = document.getElementById("themeIcon");
  var searchForm = document.getElementById("searchForm");
  var searchInput = document.getElementById("searchInput");

  // --- Tema ---

  function currentTheme() {
    return root.getAttribute("data-theme") === "light" ? "light" : "dark";
  }

  function applyIcon() {
    // Koyu temadayken ay, açık temadayken güneş gösterilir
    themeIcon.textContent = currentTheme() === "light" ? "☀️" : "🌙";
  }

  function setTheme(theme) {
    if (theme === "light") {
      root.setAttribute("data-theme", "light");
    } else {
      root.removeAttribute("data-theme");
    }
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {
      // localStorage kullanılamıyorsa sessizce yoksay (gizli sekme vb.)
    }
    applyIcon();
  }

  toggleBtn.addEventListener("click", function () {
    setTheme(currentTheme() === "light" ? "dark" : "light");
  });

  applyIcon();

  // --- Arama ---

  searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var query = searchInput.value.trim();
    if (!query) return;
    var url = "https://www.google.com/search?q=" + encodeURIComponent(query);
    window.open(url, "_blank", "noopener,noreferrer");
    searchInput.value = "";
  });

  // Sayfa açıldığında arama kutusuna odaklan (masaüstünde klavye ile hızlı arama)
  if (window.matchMedia && window.matchMedia("(min-width: 721px)").matches) {
    searchInput.focus();
  }
})();
