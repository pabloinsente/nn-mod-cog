# jupyterlab-custom-theme

Colourful light theme for JupyterLab with vivid Python linting.

## Screenshot
![screenshot](./imgs/screenshot.png)

## Prerequisites

* JupyterLab >=1.0

## Installation

```bash
jupyter labextension install jupyterlab-custom-theme
```

## Development


To build the package and the JupyterLab app from source:

```bash
jlpm install
jlpm run build
jupyter labextension install .
jupyter lab build
```