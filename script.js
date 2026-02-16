(function () {
  const cfg = window.TAPLINK_CONFIG || {};

  const elName = document.getElementById("name");
  const elBio = document.getElementById("bio");
  const elAvatar = document.getElementById("avatar");
  const elLinks = document.getElementById("links");
  const elSearch = document.getElementById("search");
  const elFooter = document.getElementById("footerText");

  const safeText = (v) => (typeof v === "string" ? v : "");
  const safeArr = (v) => (Array.isArray(v) ? v : []);

  elName.textContent = safeText(cfg.name) || "Geonline";
  elBio.textContent = safeText(cfg.bio) || "";
  elFooter.textContent = safeText(cfg.footerText) || "";

  // Avatar: show image if provided, else use generated initials
  const avatarUrl = safeText(cfg.avatar).trim();
  if (avatarUrl) {
    elAvatar.src = avatarUrl;
    elAvatar.onerror = () => setInitialsAvatar();
  } else {
    setInitialsAvatar();
  }

  function setInitialsAvatar() {
    // Replace image with an SVG data URL containing initials
    const name = safeText(cfg.name) || "Taplink";
    const initials = name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((x) => x[0].toUpperCase())
      .join("");

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#0ea5e9"/>
            <stop offset="1" stop-color="#1e3a8a"/>
          </linearGradient>
        </defs>
        <rect width="200" height="200" rx="36" fill="url(#g)"/>
        <text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle"
              font-family="system-ui, -apple-system, Segoe UI, Roboto, Arial"
              font-size="74" font-weight="700" fill="white">${initials}</text>
      </svg>
    `.trim();

    elAvatar.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }

  const allLinks = safeArr(cfg.links);

  function renderLinks(filterText = "") {
    const q = filterText.trim().toLowerCase();

    const filtered = allLinks.filter((l) => {
      const title = safeText(l.title).toLowerCase();
      const subtitle = safeText(l.subtitle).toLowerCase();
      return !q || title.includes(q) || subtitle.includes(q);
    });

    elLinks.innerHTML = "";

    if (filtered.length === 0) {
      const note = document.createElement("div");
      note.className = "note";
      note.textContent = "No links found. Try another search.";
      elLinks.appendChild(note);
      return;
    }

    filtered.forEach((l) => {
      const a = document.createElement("a");
      a.className = "link";
      a.href = safeText(l.url) || "#";
      a.target = "_blank";
      a.rel = "noopener noreferrer";

      const left = document.createElement("div");
      left.className = "link-left";

      const badge = document.createElement("div");
      badge.className = "badge";
      badge.textContent = safeText(l.icon) || "🔗";

      const text = document.createElement("div");
      text.className = "link-text";

      const title = document.createElement("div");
      title.className = "link-title";
      title.textContent = safeText(l.title) || "Link";

      const subtitle = document.createElement("div");
      subtitle.className = "link-subtitle";
      subtitle.textContent = safeText(l.subtitle) || "";

      text.appendChild(title);
      if (safeText(l.subtitle)) text.appendChild(subtitle);

      left.appendChild(badge);
      left.appendChild(text);

      const chev = document.createElement("div");
      chev.className = "chev";
      chev.textContent = "›";

      a.appendChild(left);
      a.appendChild(chev);

      elLinks.appendChild(a);
    });
  }

  renderLinks("");

  elSearch.addEventListener("input", (e) => {
    renderLinks(e.target.value || "");
  });
})();
