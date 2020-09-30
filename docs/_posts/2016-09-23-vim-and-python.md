---
layout: post
title:  "VIM and python"
date:   2013-01-15 08:15:17 +0800
categories:
   - Software
tags:
  - vim
  - python ide
author: David Wei Shao
mathjax: true
---

* content
{:toc}

vim with proper plugin will provide a powerful IDE environment for your programming languages. Let's get one for python mode.





## VIM version and features

You can check the version and supported features of vim by `vim --version`. For example:

```
$ vim --version
VIM - Vi IMproved 8.0 (2016 Sep 12, compiled Mar 18 2020 18:29:15)
Included patches: 1-1453
Modified by pkg-vim-maintainers@lists.alioth.debian.org
Compiled by pkg-vim-maintainers@lists.alioth.debian.org
Huge version without GUI.  Features included (+) or not (-):
+acl               +farsi             +mouse_sgr         -tag_any_white
 ...
+comments          +libcall           -python            +vreplace
+conceal           +linebreak         +python3           +wildignore
+cryptv            +lispindent        +quickfix          +wildmenu

+extra_search      +mouse_netterm     +tag_old_static
   system vimrc file: "$VIM/vimrc"
     user vimrc file: "$HOME/.vimrc"
 2nd user vimrc file: "~/.vim/vimrc"
      user exrc file: "$HOME/.exrc"
       defaults file: "$VIMRUNTIME/defaults.vim"
  fall-back for $VIM: "/usr/share/vim"
```

## Always use virtual environment

Python applications will often use packages and modules that don’t come as part of the standard library. Applications will sometimes need a specific version of a library, because the application may require that a particular bug has been fixed or the application may be written using an obsolete version of the library’s interface.

It is good to always create a virtual environment for your projects. A virtual envrionment provides a self-contained directory tree that contains a Python installation for a particular version of Python, plus a number of additional packages. Different applications can then use different virtual environments.

First, make sure you have python virtual environment installed. For example, on ubuntu, 

```sudo apt install python3-venv```

### Create a development virtual environment

Creation of virtual environments is done by executing the command venv:

```python3 -m venv /path/to/new/virtual/environment```

For example, if the path is `$HOME/dev_venv`, you do:

```python3 -m venv ~/dev_venv```

You can create multiple virtual environments for your projects that require different 3rd-party packges.
While it is ok to use different path than your python source directory, it is better to put the venv path inside your project source tree. In that case, 
you should exclude your virtual environment directory from your version control system using `.gitignore` or similar.


### Activating a virtual environment

On MacOS or Linux systems,

```source ~/dev_env/bin/activate```

Note: Replace the `~/dev_env` with the path of your actual virtual environment.

Now, you can install packages, developing your own python modules, and run program inside this virtual environment.


### Installing python packages

Once you enter the virtual environment, you can use `pip install` command to install additional python packages.
It is recommended that you document all packages in `requirements.txt`, and use

```pip install -r requirements.txt```

This helps your track the python packages in your projects and allows version control.

For the purpose of vim setup, create a requirement.txt file wth the following content

```
flake8
black
```
Flake8 is a powerful tool that checks our code’s compliance to PEP8. `black` is a python package for python code formatter. It is  an opinionated tool that formats your code in the best way possible. You can check its design decisions in the repository itself. (Note that unlike in PEP8, code length is 88 characters in black, not 79. You can re-configure the black to use 79 character limit). 

Install the packages by `pip install -r requirements.txt`.



### Leaving the virtual environment

If you want to switch projects or otherwise leave your virtual environment, simply run:

```
deactivate
```



## Vundle

Vim bundle and is a Vim plugin manager. For more information, check out the github page: [https://github.com/VundleVim/Vundle.vim](https://github.com/VundleVim/Vundle.vim).

### Set up Vundle:



1. Clone Vundle and Configure Plugins:

 ```
  git clone https://github.com/VundleVim/Vundle.vim.git ~/.vim/bundle/Vundle.vim
 ```

 Put the following at the top of your `.vimrc` to use Vundle. 

  ```
 set nocompatible              " be iMproved, required
 filetype off                  " required

   " set the runtime path to include Vundle and initialize
 set rtp+=~/.vim/bundle/Vundle.vim
 call vundle#begin()
   " alternatively, pass a path where Vundle should install plugins
   "call vundle#begin('~/some/path/here')

   " let Vundle manage Vundle, required
 Plugin 'VundleVim/Vundle.vim'

   Plugin 'git://github.com/powerline/powerline.git'
   Plugin 'git://github.com/python-mode/python-mode.git'
   Plugin 'git://github.com/ctrlpvim/ctrlp.vim.git'
   Plugin 'git://github.com/nvie/vim-flake8.git'
   Plugin 'psf/black'

   " All of your Plugins must be added before the following line
   call vundle#end()            " required
   filetype plugin indent on    " required

   " Put your non-Plugin stuff after this line
 ```   
  
2\. Install Plugins:

   Make sure you are inside the virtual envrionment that was created earlier. It should have the `black`, and `flake8` packages installed.

Launch `vim` and run `:PluginInstall`
Or to install from command line: `vim +PluginInstall +qall`

If you run into errors on Black module. e.g, with following errors

```
Error detected while processing $HOME/.vim/bundle/black/plugin/black.vim:
line  207:
Traceback (most recent call last):
  File "<string>", line 96, in <module>
ModuleNotFoundError: No module named 'black'
Press ENTER or type command to continue
```

Try to remove the dir, `rm -rf $HOME/.vim/bundle/black/plugin/black.vim`, and upgrade `black` from github source code

```
pip install --upgrade git+https://github.com/psf/black.git
```

Then re-run the vim PluginInstall.
