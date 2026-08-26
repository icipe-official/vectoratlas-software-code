# Configuration file for the Sphinx documentation builder.
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
html_static_path = ['_static']
html_css_files = ['custom.css']
html_show_sourcelink = False
html_js_files = ['custom.js']

html_theme_options = {
    'logo_only': False,
    'collapse_navigation': False,
    'sticky_navigation': True,
    'navigation_depth': 4,
}

html_logo = '_static/vector-atlas-logo.svg'
html_favicon = '_static/Animals-Mosquito-icon.png'
