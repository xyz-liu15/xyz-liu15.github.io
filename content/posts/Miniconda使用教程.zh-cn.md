---
title: Miniconda使用教程
subtitle: 从安装到高级使用的完整指南
date: 2025-05-22T14:38:21+08:00
slug: 8f1d8ed
draft: false
author: 
  name: 刘十五
  link: https://github.com/xyz-liu15
  email: xyz.liu15@gmail.com
  avatar: https://i.pinimg.com/736x/cd/ae/3b/cdae3b65b08001cc46fe0c932e786ea1.jpg
description: Miniconda的完整使用指南，包含安装配置、环境管理、镜像源设置等详细教程
keywords: Miniconda, Conda, Python环境管理, 虚拟环境
license:
comment: true
weight: 0
tags:
  - Python
  - 开发工具
categories:
  - 编程技术
hiddenFromHomePage: false
hiddenFromSearch: false
hiddenFromRelated: false
hiddenFromFeed: false
summary: Miniconda的完整使用指南，包含从安装到高级使用的详细教程
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
# Miniconda 教程

## 1. 安装

在[这里](https://www.anaconda.com/download/success)访问官方网站以下载 Miniconda 最新版本。下载完成后，按照以下步骤进行安装：

![安装步骤1](/images/Miniconda_1.png)

![安装步骤2](/images/Miniconda_2.png)

![安装步骤3](/images/Miniconda_3.png)

![安装步骤4](/images/Miniconda_4.png)

![安装步骤5](/images/Miniconda_5.png)

> 注意：出现以下弹窗直接关闭即可。

![提示窗口](/images/proceed.png)

![安装步骤6](/images/Miniconda_6.png)

---

## 2. 配置 Miniconda

首先，打开 Anaconda PowerShell Prompt 或者 Anaconda Prompt。依次运行以下代码以配置清华镜像源：

```shell
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/conda-forge/
conda config --set show_channel_urls yes
```

### 2.1 配置命令解释

#### 添加镜像源

```shell
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/conda-forge/
```

- `conda config`：conda 的配置管理命令
- `--add channels`：添加一个新的软件源(channel)
- `https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/conda-forge/`：清华大学提供的 conda-forge 镜像源地址

**作用**：将清华大学的 conda-forge 镜像源添加到你的 conda 配置中，这样当你安装或更新软件包时，conda 会从这个国内的镜像源下载，速度会比从国际源下载快很多。

#### 显示软件包来源

```shell
conda config --set show_channel_urls yes
```

- `--set`：设置一个配置选项
- `show_channel_urls`：控制是否显示软件包来源的URL
- `yes`：启用此选项

**作用**：当这个选项设置为 yes 后：

1. 在执行 `conda install` 或类似命令时，会显示每个软件包是从哪个具体的软件源URL下载的
2. 在创建新环境或安装软件包时，输出信息会更详细，方便你确认软件包来源
3. 有助于调试软件源配置问题

### 2.2 验证配置

```shell
conda config --show channels
conda config --show custom_channels
```

#### 查看软件源列表

```shell
conda config --show channels
```

- `conda config`：conda 的配置管理命令
- `--show`：显示配置信息
- `channels`：指定要查看的配置项名称

**作用**：显示当前 conda 配置中 `channels` 的值，即 conda 搜索和安装软件包时使用的软件源列表及其优先级顺序。

#### 查看自定义软件源

```shell
conda config --show custom_channels
```

- `custom_channels`：查看自定义命名的软件源配置

**作用**：显示所有自定义命名的 channel 及其对应的 URL 映射关系。

![配置结果](/images/channels.png)

---

## 3. 创建和管理虚拟环境

### 3.1 创建虚拟环境

```shell
conda create --name python_dev python=3.12.7
```

**命令结构解析**：

- `conda create`：创建新环境的基础命令
- `--name python_dev`：指定新环境的名称为 "python_dev"
- `python=3.12.7`：指定要安装的 Python 版本为 3.12.7

![创建环境](/images/conda_activate.png)

### 3.2 激活虚拟环境

```shell
conda activate python_dev
```

### 3.3 安装所需模块

```shell
conda install jupyterlab pyecharts pandas numpy matplotlib
```

**命令结构解析**：

- `conda install`：conda 包安装命令
- `jupyterlab pyecharts pandas numpy matplotlib`：要安装的包列表（多个包用空格分隔）

### 3.4 启动 Jupyter Lab

安装成功后，运行 **jupyter lab** 命令，创建 python_dev 文件夹以及一个 data_analyse.ipynb 文件。

![数据分析文件](/images/data_analyse.png)
        