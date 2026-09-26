// BATU HUB — Servisler, dinamik logo yükleme, tema geçişi ve arama işlevi
(function () {
  "use strict";

  // ------------------------------------------------------------------
  // 1. SERVİSLER VERİSİ
  // ------------------------------------------------------------------
  var CATEGORIES = [
    {
      title: "Üretkenlik",
      services: [
        { name: "Docs", domain: "docs.google.com", url: "https://docs.google.com", tooltip: "Belge oluştur ve düzenle" },
        { name: "E-Tablolar", domain: "sheets.google.com", url: "https://sheets.google.com", tooltip: "Hesap tablosu oluştur" },
        { name: "Slaytlar", domain: "slides.google.com", url: "https://slides.google.com", tooltip: "Sunum hazırla" },
        { name: "Formlar", domain: "forms.google.com", url: "https://forms.google.com", tooltip: "Form ve anket oluştur" },
        { name: "Keep", domain: "keep.google.com", url: "https://keep.google.com", tooltip: "Not al ve hatırlatıcı kur" }
      ]
    },
    {
      title: "İletişim",
      services: [
        { name: "Gmail", domain: "mail.google.com", url: "https://mail.google.com", tooltip: "E-posta gönder ve al" },
        { name: "Meet", domain: "meet.google.com", url: "https://meet.google.com", tooltip: "Video görüşme başlat" },
        { name: "Chat", domain: "chat.google.com", url: "https://chat.google.com", tooltip: "Mesajlaş ve grup sohbeti" }
      ]
    },
    {
      title: "Depolama & Planlama",
      services: [
        { name: "Drive", domain: "drive.google.com", url: "https://drive.google.com", tooltip: "Dosyalarını sakla ve paylaş" },
        { name: "Calendar", domain: "calendar.google.com", url: "https://calendar.google.com", tooltip: "Takvim ve etkinlikler" },
        { name: "Google One", domain: "one.google.com", url: "https://one.google.com", tooltip: "Depolama ve abonelik yönetimi" }
      ]
    },
    {
      title: "Araçlar",
      services: [
        { name: "Maps", domain: "maps.google.com", url: "https://maps.google.com", tooltip: "Harita ve yol tarifi" },
        { name: "Fotoğraflar", domain: "photos.google.com", url: "https://photos.google.com", tooltip: "Fotoğraflarını görüntüle" },
        { name: "Translate", domain: "translate.google.com", url: "https://translate.google.com", tooltip: "Metin ve sayfa çevir" },
        { name: "Şifreler", domain: "passwords.google.com", url: "https://passwords.google.com", tooltip: "Kayıtlı şifrelerini yönet" }
      ]
    }
  ];

  // ------------------------------------------------------------------
  // 2. LOGO YÜKLEME FONKSİYONU (Google Favicon API)
  // ------------------------------------------------------------------
  var FAVICON_SIZE = 128;
  function faviconUrl(domain) {
    return "https://www.google.com/s2/favicons?sz=" + FAVICON_SIZE + "&domain=" + domain;
  }

  // ------------------------------------------------------------------
  // 3. KARTLARI VE LOGOLARI OLUŞTURMA
  // ------------------------------------------------------------------
  function buildUI() {
    var root = document.getElementById("categories");
    if (!root) return;
    var cardIndex = 0;

    CATEGORIES.forEach(function (category, catIndex) {
      var section = document.createElement("section");
      section.className = "category";
      section.style.setProperty("--cat-delay", (catIndex * 70) + "ms");
      section.setAttribute("aria-label", category.title);

      var header = document.createElement("div");
      header.className = "category__header";

      var h2 = document.createElement("h2");
      h2.className = "category__title";
      h2.textContent = category.title;

      var line = document.createElement("span");
      line.className = "category__line";
      line.setAttribute("aria-hidden", "true");

      header.appendChild(h2);
      header.appendChild(line);

      var grid = document.createElement("div");
      grid.className = "grid";

      category.services.forEach(function (service) {
        var card = document.createElement("a");
        card.className = "card";
        card.href = service.url;
        card.target = "_blank";
        card.rel = "noopener noreferrer";
        card.setAttribute("data-tooltip", service.tooltip);
        card.style.setProperty("--i-delay", Math.min(cardIndex * 35, 400) + "ms");

        var iconWrap = document.createElement("span");
        iconWrap.className = "icon";

        // LOGO EKLENEN KISIM 🎯
        var img = document.createElement("img");
        img.src = faviconUrl(service.domain);
        img.alt = service.name + " logosu";
        img.loading = "lazy";
        img.width = 24;
        img.height = 24;

        // Logo yüklenemezse (ör. internetsiz ortam) harf göster
        img.addEventListener("error", function () {
          iconWrap.textContent = service.name.charAt(0);
          iconWrap.style.fontWeight = "600";
          iconWrap.style.color = "var(--text-dim)";
        }, { once: true });

        iconWrap.appendChild(img);

        var label = document.createElement("span");
        label.className = "label";
        label.textContent = service.name;

        card.appendChild(iconWrap);
        card.appendChild(label);
        grid.appendChild(card);

        cardIndex++;
      });

      section.appendChild(header);
      section.appendChild(grid);
      root.appendChild(section);
    });
  }

  // ------------------------------------------------------------------
  // 4. TEMA GEÇİŞİ
  // ------------------------------------------------------------------
  var THEME_KEY = "batuhub-theme";
  var root = document.documentElement;
  var toggleBtn = document.getElementById("themeToggle");
  var themeIcon = document.getElementById("themeIcon");

  function currentTheme() {
    return root.getAttribute("data-theme") === "light" ? "light" : "dark";
  }

  function applyIcon() {
    if (themeIcon) {
      themeIcon.textContent = currentTheme() === "light" ? "☀️" : "🌙";
    }
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
      // localStorage kapalıysa yoksay
    }
    applyIcon();
  }

  if (toggleBtn) {
    toggleBtn.addEventListener("click", function () {
      setTheme(currentTheme() === "light" ? "dark" : "light");
    });
  }

  applyIcon();

  // ------------------------------------------------------------------
  // 5. ARAMA İŞLEVİ VE ARAMA İKONU
  // ------------------------------------------------------------------
  var searchForm = document.getElementById("searchForm");
  var searchInput = document.getElementById("searchInput");

  if (searchForm && searchInput) {
    // Arama kutusunun içine küçük bir Google / Arama ikonu koyma (opsiyonel görsel dokunuş)
    var searchIcon = document.createElement("img");
    searchIcon.src = faviconUrl("google.com");
    searchIcon.alt = "Google Logo";
    searchIcon.style.width = "18px";
    searchIcon.style.height = "18px";
    searchIcon.style.marginRight = "8px";
    searchIcon.style.verticalAlign = "middle";
    
    // Arama kutusundan hemen önce ikonu yapıştırıyoruz
    if (searchInput.parentNode) {
      searchInput.parentNode.insertBefore(searchIcon, searchInput);
    }

    searchForm.addEventListener("submit", function (event) {
      event.preventDefault();
      var query = searchInput.value.trim();
      if (!query) return;
      var url = "https://www.google.com/search?q=" + encodeURIComponent(query);
      window.open(url, "_blank", "noopener,noreferrer");
      searchInput.value = "";
    });

    // Masaüstünde açılışta odağı arama kutusuna ver
    if (window.matchMedia && window.matchMedia("(min-width: 721px)").matches) {
      searchInput.focus();
    }

    // '/' Kısayolu ile hızlı Arama Kutusu odağı
    document.addEventListener("keydown", function (event) {
      var target = event.target;
      var isTyping = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA");
      if (event.key === "/" && !isTyping) {
        event.preventDefault();
        searchInput.focus();
      }
    });
  }

  // Arayüzü başlat
  buildUI();
})();
