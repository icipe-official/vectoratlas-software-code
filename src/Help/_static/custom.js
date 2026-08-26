document.addEventListener('DOMContentLoaded', function () {
  var logoLink = document.querySelector('.wy-side-nav-search > a.icon-home');
  if (logoLink) {
    logoLink.setAttribute('href', 'https://vectoratlas.icipe.org/');
  }
});