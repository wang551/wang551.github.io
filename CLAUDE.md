# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal blog site built with Hexo, a fast static site generator. The blog is titled "拾知|Pick-Knowledge" and uses the Fluid theme.

## Common Commands

### Development
- `npm run server` or `hexo server` - Start local development server (default: http://localhost:4000)
- `npm run build` or `hexo generate` - Generate static files to `public/` directory
- `npm run clean` or `hexo clean` - Clean generated files and cache

### Creating Content
- `hexo new post <title>` - Create a new blog post in `source/_posts/`
- `hexo new page <name>` - Create a new page
- `hexo new draft <title>` - Create a draft post

### Deployment
- `npm run deploy` or `hexo deploy` - Deploy the site (requires configured deployment in `_config.yml`)

## Architecture

### Directory Structure
- `source/` - Source content directory
  - `_posts/` - Blog posts (Markdown files)
  - `about/` - About page content
- `scaffolds/` - Post templates (default template: `post.md`)
- `scripts/` - Custom Hexo scripts
  - `live2d.js` - Injects Live2D widget script
- `public/` - Generated static files (created by `hexo generate`)
- `_config.yml` - Main Hexo configuration
- `_config.fluid.yml` - Fluid theme configuration
- `package.json` - Dependencies and npm scripts

### Key Configuration Files
- `_config.yml` - Main Hexo config (URL, directories, writing settings, theme selection)
- `_config.fluid.yml` - Theme-specific settings (navigation, appearance, about page, etc.)

### Post Asset Folder
The site uses `post_asset_folder: true`, meaning each post can have its own asset folder. When creating a post titled "My Post", a folder `source/_posts/My Post/` will be created alongside `source/_posts/My Post.md` for images and other assets.

### Content Front Matter
Posts use the following front matter format (defined in `scaffolds/post.md`):
```yaml
---
title: {{ title }}
date: {{ date }}
tags:
---
```

### Custom Scripts
Hexo scripts in the `scripts/` directory extend functionality. The `live2d.js` script uses `hexo.extend.injector` to inject the Live2D widget script into the `head_begin` section.

### Theme
The site uses the **Fluid** theme (`hexo-theme-fluid`), configured via `_config.fluid.yml`. Theme features include:
- Navigation menu with icons
- Dark mode support (set to auto)
- Statistics (PV/UV via busuanzi)
- Typewriter slogan effect with Hitokoto API
- About page with avatar and banner

## Language & Timezone
- Language: `zh-CN` (Chinese)
- Timezone: `Asia/Shanghai`
- Date format: `YYYY-MM-DD`
- Permalink structure: `:year/:month/:day/:title/`
