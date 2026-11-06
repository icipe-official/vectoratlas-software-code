document.addEventListener('DOMContentLoaded', function () {
  var logoLink = document.querySelector('.wy-side-nav-search > a.icon-home');
  if (logoLink) {
    logoLink.setAttribute('href', 'https://vectoratlas.icipe.org/');
  }

  // Hide the version/language switch dropdown confirmed at .switch-menus
  document.querySelectorAll('.wy-side-nav-search .switch-menus').forEach(function (el) {
    el.style.display = 'none';
  });
});

// Injects the EN/FR/PT language switcher + GitHub icon into the
// breadcrumbs bar. Done in JS (rather than relying solely on a
// layout.html block override) so it works regardless of the
// installed sphinx_rtd_theme version's internal template structure,
// and regardless of whether a template-only change triggered a
// full Sphinx rebuild.
//
// Two URL layouts are supported:
//   Local (python -m http.server):   /<page>, /fr/<page>, /pt/<page>
//   Read the Docs:                   /<lang>/<version>/<page>
//                                    e.g. /fr/latest/quick-start.html
// On Read the Docs, the French and Portuguese translation projects can
// also be opened on their own domains (<project>-fr.readthedocs.io), which
// only serve their own language, so links always point at the main domain.
document.addEventListener("DOMContentLoaded", function () {
  var breadcrumbs = document.querySelector(".wy-breadcrumbs");

  // Guard: if a layout.html override ever does render this itself,
  // don't insert a second copy.
  if (!breadcrumbs || document.querySelector(".va-top-actions")) {
    return;
  }

  var loc = window.location;
  var path = loc.pathname;
  var host = loc.hostname;

  var onReadTheDocs =
    /\.readthedocs\.(io|org)$/.test(host) ||
    typeof window.READTHEDOCS_DATA !== "undefined";

  var lang = "en";
  var enHref, frHref, ptHref;

  if (onReadTheDocs) {
    // Main domain, even when viewing a translation project's own domain.
    var origin = loc.origin;
    var sub = host.match(/^(.+)-(?:fr|pt)\.(readthedocs\.(?:io|org))$/);
    if (sub) {
      origin = loc.protocol + "//" + sub[1] + "." + sub[2];
    }

    var rtd = path.match(/^\/(en|fr|pt)\/([^\/]+)\/(.*)$/);
    var version = "latest";
    var rest = "";
    if (rtd) {
      lang = rtd[1];
      version = rtd[2];
      rest = rtd[3];
    }

    var rtdHref = function (code) {
      return origin + "/" + code + "/" + version + "/" + rest;
    };
    enHref = rtdHref("en");
    frHref = rtdHref("fr");
    ptHref = rtdHref("pt");
  } else {
    // Local layout: English at the root, other languages under /fr and /pt.
    var pagePath = path;
    if (path.indexOf("/fr/") === 0) {
      lang = "fr";
      pagePath = path.slice(3) || "/";
    } else if (path.indexOf("/pt/") === 0) {
      lang = "pt";
      pagePath = path.slice(3) || "/";
    }

    enHref = pagePath;
    frHref = "/fr" + pagePath;
    ptHref = "/pt" + pagePath;
  }

  var li = document.createElement("li");
  li.className = "wy-breadcrumbs-aside";
  li.innerHTML =
    '<div class="va-top-actions">' +
      '<div class="va-lang-switch">' +
        '<a href="' + enHref + '" class="' + (lang === "en" ? "active" : "") + '">EN</a>' +
        '<span class="va-lang-sep">|</span>' +
        '<a href="' + frHref + '" class="' + (lang === "fr" ? "active" : "") + '">FR</a>' +
        '<span class="va-lang-sep">|</span>' +
        '<a href="' + ptHref + '" class="' + (lang === "pt" ? "active" : "") + '">PT</a>' +
      '</div>' +
      '<a href="https://github.com/icipe-official/vectoratlas-software-code" ' +
         'target="_blank" rel="noopener noreferrer" class="va-github-link" ' +
         'title="View source on GitHub" aria-label="GitHub Repository">' +
        '<i class="fa-brands fa-github"></i>' +
      '</a>' +
    '</div>';

  breadcrumbs.appendChild(li);
});

// Floating scroll indicator: shows a down-arrow near the top of a
// long page ("more content below"), flips to an up-arrow once
// you're near the bottom ("back to top"), and hides entirely on
// pages short enough to fit in the viewport.
document.addEventListener("DOMContentLoaded", function () {
  var btn = document.createElement("button");
  btn.className = "va-scroll-btn";
  btn.type = "button";
  btn.innerHTML = '<i class="fa-solid fa-arrow-down"></i>';
  document.body.appendChild(btn);

  function nearBottom() {
    return (window.innerHeight + window.scrollY) >=
      (document.documentElement.scrollHeight - 40);
  }

  function update() {
    var docHeight = document.documentElement.scrollHeight;
    var winHeight = window.innerHeight;

    if (docHeight <= winHeight + 40) {
      btn.classList.remove("visible");
      return;
    }

    btn.classList.add("visible");

    if (nearBottom()) {
      btn.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
      btn.setAttribute("aria-label", "Back to top");
      btn.dataset.direction = "up";
    } else {
      btn.innerHTML = '<i class="fa-solid fa-arrow-down"></i>';
      btn.setAttribute("aria-label", "Scroll for more content");
      btn.dataset.direction = "down";
    }
  }

  btn.addEventListener("click", function () {
    if (btn.dataset.direction === "up") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollBy({ top: window.innerHeight * 0.8, behavior: "smooth" });
    }
  });

  window.addEventListener("scroll", update);
  window.addEventListener("resize", update);
  update();
});