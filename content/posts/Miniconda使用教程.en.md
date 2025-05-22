---
title: Miniconda Tutorial
subtitle: A Complete Guide from Installation to Advanced Usage
date: 2025-05-03T08:14:21+08:00
slug: 8f1d8ed
draft: false
author: 
  name: "Liu Fifteen"
  link: "https://github.com/xyz-liu15"
  email: "xyz.liu15@gmail.com"
  avatar: "https://i.pinimg.com/736x/cd/ae/3b/cdae3b65b08001cc46fe0c932e786ea1.jpg"
description: A comprehensive guide to Miniconda, including installation, configuration, environment management, and mirror settings
keywords: Miniconda, Conda, Python environment management, virtual environments
license:
comment: true
weight: 0
tags:
  - Python
  - Development Tools
categories:
  - Programming Technology
hiddenFromHomePage: false
hiddenFromSearch: false
hiddenFromRelated: false
hiddenFromFeed: false
summary: A comprehensive guide to Miniconda, from installation to advanced usage
resources:
  - name: featured-image
    src: featured-image.jpg
  - name: featured-image-preview
    src: featured-image-preview.jpg
toc: true
math: false
lightgallery: false
password:
message:
repost:
  enable: false
  url:
---

<!--more-->
# Miniconda Tutorial

## 1. Installation

Visit the official website [here](https://www.anaconda.com/download/success) to download the latest version of Miniconda. After downloading, follow these steps to install:

![Installation Step 1](/resources/_gen/images/Miniconda_1.png)

![Installation Step 2](/resources/_gen/images/Miniconda_2.png)

![Installation Step 3](/resources/_gen/images/Miniconda_3.png)

![Installation Step 4](/resources/_gen/images/Miniconda_4.png)

![Installation Step 5](/resources/_gen/images/Miniconda_5.png)

> Note: If you see the following popup, simply close it.

![Prompt Window](/resources/_gen/images/proceed.png)

![Installation Step 6](/resources/_gen/images/Miniconda_6.png)

---

## 2. Configuring Miniconda

First, open Anaconda PowerShell Prompt or Anaconda Prompt. Run the following commands to configure the Tsinghua mirror source:

```shell
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/conda-forge/
conda config --set show_channel_urls yes
```

### 2.1 Configuration Command Explanation

#### Adding Mirror Source

```shell
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/conda-forge/
```

- `conda config`: conda's configuration management command
- `--add channels`: add a new software source (channel)
- `https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/conda-forge/`: Tsinghua University's conda-forge mirror source address

**Purpose**: This adds Tsinghua University's conda-forge mirror source to your conda configuration. When you install or update packages, conda will download from this domestic mirror source, which is much faster than downloading from international sources.

#### Display Package Sources

```shell
conda config --set show_channel_urls yes
```

- `--set`: set a configuration option
- `show_channel_urls`: controls whether to display the URL of package sources
- `yes`: enable this option

**Purpose**: When this option is set to yes:

1. When executing `conda install` or similar commands, it will show which specific source URL each package is downloaded from
2. When creating new environments or installing packages, the output information will be more detailed, making it easier to confirm package sources
3. Helps debug software source configuration issues

### 2.2 Verify Configuration

```shell
conda config --show channels
conda config --show custom_channels
```

#### View Software Source List

```shell
conda config --show channels
```

- `conda config`: conda's configuration management command
- `--show`: display configuration information
- `channels`: specify the configuration item name to view

**Purpose**: Displays the value of `channels` in the current conda configuration, which is the list of software sources and their priority order that conda uses when searching for and installing packages.

#### View Custom Software Sources

```shell
conda config --show custom_channels
```

- `custom_channels`: view custom named software source configurations

**Purpose**: Displays all custom named channels and their corresponding URL mappings.

![Configuration Result](/resources/_gen/images/channels.png)

---

## 3. Creating and Managing Virtual Environments

### 3.1 Create a Virtual Environment

```shell
conda create --name python_dev python=3.12.7
```

**Command Structure Analysis**:

- `conda create`: basic command for creating a new environment
- `--name python_dev`: specify the name of the new environment as "python_dev"
- `python=3.12.7`: specify the Python version to install as 3.12.7

![Create Environment](/resources/_gen/images/conda_activate.png)

### 3.2 Activate Virtual Environment

```shell
conda activate python_dev
```

### 3.3 Install Required Modules

```shell
conda install jupyterlab pyecharts pandas numpy matplotlib
```

**Command Structure Analysis**:

- `conda install`: conda package installation command
- `jupyterlab pyecharts pandas numpy matplotlib`: list of packages to install (multiple packages separated by spaces)

### 3.4 Launch Jupyter Lab

After successful installation, run the **jupyter lab** command, create a python_dev folder and a data_analyse.ipynb file.

![Data Analysis File](/resources/_gen/images/data_analyse.png)  