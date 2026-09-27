// BATU HUB — tema geçişi
// Harici bağımlılık yok, veri toplama yok, sadece localStorage'da tema tercihi tutulur.

(function () {
  "use strict";

  var THEME_KEY = "batuhub-theme";
  var root = document.documentElement;
  var toggleBtn = document.getElementById("themeToggle");

  function currentTheme() {
    return root.getAttribute("data-theme") === "light" ? "light" : "dark";
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
  }

  toggleBtn.addEventListener("click", function () {
    setTheme(currentTheme() === "light" ? "dark" : "light");
  });
})();
