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