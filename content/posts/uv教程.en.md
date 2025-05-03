---
title: "Comprehensive Guide to Python's uv Library"
subtitle: "A Faster, More Efficient Python Package Manager"
date: 2025-05-03T09:07:40+08:00
slug: 4b5bcb5
draft: false
author:
  name: "Liu Fifteen"
  link: "https://github.com/xyz-liu15"
  email: "xyz.liu15@gmail.com"
  avatar: "https://i.pinimg.com/736x/cd/ae/3b/cdae3b65b08001cc46fe0c932e786ea1.jpg"
description: "uv is an emerging Python package manager developed by Astral, designed to replace pip and virtualenv, offering faster dependency resolution and installation speeds."
keywords: ["Python", "uv", "package management", "dependency management", "virtual environment"]
license: "CC BY-NC-SA 4.0"
comment: true
weight: 0
tags:
  - Python
  - Tools
  - Tutorial
categories:
  - Programming
hiddenFromHomePage: false
hiddenFromSearch: false
hiddenFromRelated: false
hiddenFromFeed: false
summary: "uv is an emerging Python package manager offering faster dependency resolution and installation speeds. This article provides a detailed guide on installing, configuring, and using uv."
resources:
  - name: featured-image
    src: featured-image.jpg
  - name: featured-image-preview
    src: featured-image-preview.jpg
toc: true
math: false
lightgallery: false
---

<!--more-->

# Comprehensive Guide to Python's uv Library

uv is an emerging Python package manager developed by Astral (the same company behind popular tools like Ruff and Starlette). It aims to replace pip and virtualenv, offering faster dependency resolution and installation speeds. Below, I'll provide a detailed guide on how to use uv.

## 1. Installing uv

### Installation Methods for Different Systems

#### Windows

On Windows, you can install using PowerShell:

```powershell
irm https://astral.sh/uv/install.ps1 | iex
```

This command downloads and executes the installation script, automatically adding uv to your system PATH.

#### macOS/Linux

On macOS or Linux, you can install using curl:

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

After installation, you'll need to reload your shell or run:

```bash
source ~/.bashrc  # or other shell configuration file
```

#### Installing with pip (Alternative Method)

```bash
pip install uv
```

### Verifying Installation

After installation, run the following command to verify successful installation:

```bash
uv --version
```

## 2. Configuring Mirrors in China

Due to network constraints, users in China may experience slow connections to the official PyPI source. You can configure domestic mirrors to accelerate downloads.

### Temporary Mirror Usage

You can specify a mirror directly in the command:

```bash
uv pip install package-name --index-url https://pypi.tuna.tsinghua.edu.cn/simple
```

### Permanent Mirror Configuration

Configure a global mirror (recommended):

```bash
uv config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple
```

Common domestic mirrors in China:

- Tsinghua University: https://pypi.tuna.tsinghua.edu.cn/simple
- Alibaba Cloud: https://mirrors.aliyun.com/pypi/simple/
- Douban: https://pypi.douban.com/simple/
- USTC: https://pypi.mirrors.ustc.edu.cn/simple/

### Viewing Current Configuration

```bash
uv config list
```

## 3. Project Initialization

### Creating a New Project

```bash
uv init my_project
cd my_project
```

This creates a Python project directory with a basic structure.

### Initializing an Existing Project

In an existing project directory:

```bash
uv init
```

This creates necessary configuration files in the current directory.

## 4. Virtual Environment Configuration

uv has built-in virtual environment management functionality that's more efficient than traditional virtualenv.

### Creating a Virtual Environment

```bash
uv venv .venv
```

This creates a virtual environment directory named `.venv` in the current directory.

### Activating the Virtual Environment

Activation methods for different systems:

- **Windows (PowerShell)**:

```powershell
.\venv\Scripts\activate
```

- **macOS/Linux**:

```bash
source .venv/bin/activate
```

### Deactivating the Virtual Environment

```bash
deactivate
```

### Why Use Virtual Environments?

Virtual environments isolate dependencies between different projects, preventing package version conflicts. Each project can have its own independent Python environment and dependency packages.

## 5. Package Management

### Installing Packages

```bash
uv pip install package-name
```

Installing a specific version:

```bash
uv pip install package-name==1.2.3
```

Installing development dependencies (typically used for testing, documentation tools, etc.):

```bash
uv pip install --group=dev pytest
```

### Installing from requirements.txt

```bash
uv pip install -r requirements.txt
```

### Generating requirements.txt

```bash
uv pip freeze > requirements.txt
```

### Upgrading Packages

```bash
uv pip install --upgrade package-name
```

### Uninstalling Packages

```bash
uv pip uninstall package-name
```

### Viewing Installed Packages

```bash
uv pip list
```

## 6. Python Version Management

uv can manage multiple Python versions, similar to pyenv.

### Installing a Specific Python Version

```bash
uv toolchain install python@3.9.0
```

### Listing Available Python Versions

```bash
uv toolchain list
```

### Setting Project Python Version

In the project directory:

```bash
uv toolchain use python@3.9.0
```

This creates a `.python-version` file in the project directory, recording the Python version used.

### Why Manage Python Versions?

Different projects may require different versions of the Python interpreter. Version management tools allow you to switch easily.

## 7. Advanced Features

### Parallel Installation

uv uses parallel installation by default to accelerate the process:

```bash
uv pip install -r requirements.txt --parallel
```

### Dependency Resolver

uv uses a new dependency resolution algorithm that's faster and more accurate than pip:

```bash
uv pip compile requirements.in -o requirements.txt
```

### Caching Mechanism

uv has an intelligent caching system that greatly speeds up repeated installations of the same packages.

### Integration with Existing Tools

uv can replace the following combination of tools:

- pip (package installation)
- virtualenv/venv (virtual environments)
- pip-tools (dependency resolution)
- pyenv (Python version management)

## 8. Practical Workflow Examples

### New Project Startup Process

```bash
# 1. Create project directory
mkdir my_project && cd my_project

# 2. Initialize project
uv init

# 3. Create virtual environment
uv venv .venv

# 4. Activate virtual environment
source .venv/bin/activate  # or Windows activation command

# 5. Install main dependencies
uv pip install flask pandas

# 6. Install development dependencies
uv pip install --group=dev pytest black

# 7. Generate requirements file
uv pip freeze > requirements.txt
```

### Existing Project Development Process

```bash
# 1. Clone project
git clone project-url && cd project

# 2. Create virtual environment
uv venv .venv

# 3. Activate virtual environment
source .venv/bin/activate

# 4. Install dependencies
uv pip install -r requirements.txt

# 5. Add new dependencies after development
uv pip install new-package

# 6. Update requirements file
uv pip freeze > requirements.txt
```

## 9. Troubleshooting Common Issues

### Slow Installation

1. Confirm you've configured a domestic mirror
2. Check network connection
3. Try using the `--parallel` option

### Dependency Conflicts

Use uv's dependency resolver:

```bash
uv pip compile requirements.in -o requirements.txt
```

### Virtual Environment Issues

If the virtual environment is corrupted, you can delete and rebuild it:

```bash
rm -rf .venv
uv venv .venv
```

## 10. Comparing uv with Traditional Tools

| Feature | uv | Traditional Tool Combination |
|------|----|------------|
| Package Installation | uv pip install | pip install |
| Virtual Environment | uv venv | python -m venv |
| Dependency Resolution | Built-in advanced resolver | pip-tools |
| Python Version Management | uv toolchain | pyenv |
| Speed | Extremely fast | Relatively slow |
| Memory Usage | Lower | Higher |

## Summary

As a next-generation Python toolchain, uv integrates package management, virtual environments, and Python version management, providing a more unified and efficient development experience. Especially for developers in China, properly configuring mirrors can greatly improve productivity. Through the features introduced in this article, you should be able to fully utilize uv to manage Python projects.

Remember, good tool usage habits include:

1. Using an independent virtual environment for each project
2. Clearly recording dependencies and versions
3. Regularly updating dependencies
4. Properly managing Python versions

uv makes these best practices easier to implement.
