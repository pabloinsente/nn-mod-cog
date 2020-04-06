# jupyterlab-openbayes-theme

OpenBayes Theme, a fork from official JupyterLab  [light theme](https://github.com/jupyterlab/jupyterlab/tree/master/packages/theme-light-extension) and [dark theme](https://github.com/jupyterlab/jupyterlab/tree/master/packages/theme-dark-extension) with auto color scheme switching support.

该主题为官方 `theme-light-extension` 和 `theme-dark-extension` 的缝合怪版，由于官方主题的样式和 SVG 图标覆盖方法写的实在是太烂了，无法轻易通过增加样式对其进行覆盖。为了方便与上流跟进和维护，该主题目前只对官方的主题进行了整合，并加上了对 `prefers-color-scheme` 的支持

在 2.0.0 中，SVG 图标混乱的局面可能会 [有所改善](https://github.com/jupyterlab/jupyterlab/commit/55043911dc4e9b84acb45426cb56777052c836ef)

## Prerequisites

* JupyterLab

## Installation

```bash
jupyter labextension install jupyterlab-openbayes-theme
```

## Development

For a development install (requires npm version 4 or later), do the following in the repository directory:

```bash
npm install
npm run build
jupyter labextension link .
```

To rebuild the package and the JupyterLab app:

```bash
npm run build
jupyter lab build
```

## Sync styles from upstream

- Download the source zipball from [jupyterlab/jupyterlab](https://github.com/jupyterlab/jupyterlab)
- Compare `packages/theme-light-extension` and `packages/theme-dark-extension` side by side
- Copy and paste updated files and override the old ones in this repo
