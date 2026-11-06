import os

project = 'Vector Atlas Help'
copyright = '2026, ICIPE'
author = 'ICIPE Vector Atlas Team'
release = '1.0'

extensions = [
    'sphinx_rtd_theme',
    'myst_parser',
]

source_suffix = {
    '.rst': 'restructuredtext',
    '.md': 'markdown',
}


language = 'en'
templates_path = ['_templates']

exclude_patterns = [
    '_build',
    'Thumbs.db',
    '.DS_Store',
    'node_modules',
    'venv',
    'build',
    'static',
    'docs',
    'README.md',
    'TEST_BUILD_PUSH',
]

html_theme = 'sphinx_rtd_theme'
html_logo = '_static/vector-atlas-logo.svg'
html_favicon = '_static/Animals-Mosquito-icon.png'

html_theme_options = {
    'logo_only': False,
    'collapse_navigation': False,
    'sticky_navigation': True,
    'navigation_depth': 4,
}

html_static_path = ['_static']


html_css_files = [
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css',
    'custom.css',
]

html_js_files = ['custom.js']
html_show_sourcelink = False


html_context = {}

locale_dirs = ['locale/']
gettext_compact = False

# English images live in images/, translations in images/fr/ and images/pt/.
# images/about.png  ->  images/fr/about.png (when building with language=fr)
# If the translated file doesn't exist, Sphinx falls back to the English one.
figure_language_filename = '{path}{language}/{basename}{ext}'