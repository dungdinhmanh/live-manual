---
title: installation
slug: installation
---
# Installation

[111](#111)

# 3\. Installation

[112](#112)

3.1 Requirements

[113](#113)

Building live system images has very few system requirements for the host system:

[114](#114)

-   Superuser (root) access

[115](#115)

-   An up-to-date version of _live-build_

[116](#116)

-   A POSIX-compliant shell, such as _bash_ or _dash_

[117](#117)

-   _debootstrap_

[118](#118)

-   Linux 2.6 or newer

[119](#119)

-   A mount point with _dev_ and _exec_ rights.

[120](#120)

\# mount <your\_mount\_point> -odev,exec,remount  

[121](#121)

Note that using Debian or a Debian-derived distribution is not required - _live-build_ will run on almost any distribution with the above requirements.

[122](#122)

3.2 Installing live-build

[123](#123)

You can install _live-build_ in a number of different ways:

[124](#124)

-   From the Debian repository

[125](#125)

-   From source

[126](#126)

-   From snapshots

[127](#127)

If you are using Debian, the recommended way is to install _live-build_ via the Debian repository.

[128](#128)

3.2.1 From the Debian repository

[129](#129)

Simply install _live-build_ like any other package:

[130](#130)

\# apt-get install live-build  

[131](#131)

3.2.2 From source

[132](#132)

_live-build_ is developed using the Git version control system. On Debian based systems, this is provided by the _git_ package. To check out the latest code, execute:

[133](#133)

$ git clone https://salsa.debian.org/live-team/live-build.git  

[134](#134)

You can build and install your own Debian package by executing:

[135](#135)

$ cd live-build  
$ dpkg-buildpackage -b -uc -us  
$ cd ..  

[136](#136)

Now install whichever of the freshly built .deb files you were interested in, e.g.

[137](#137)

\# dpkg -i live-build\_4.0-1\_all.deb  

[138](#138)

You can also install _live-build_ directly to your system by executing:

[139](#139)

\# make install  

[140](#140)

and uninstall it with:

[141](#141)

\# make uninstall  

[142](#142)

3.3 Installing live-boot and live-config

[143](#143)

**Note:** You do not need to install _live-boot_ or _live-config_ on your system to create customized live systems. However, doing so will do no harm and is useful for reference purposes. If you only want the documentation, you may now install the _live-boot-doc_ and _live-config-doc_ packages separately.

[144](#144)

3.3.1 From the Debian repository

[145](#145)

Both _live-boot_ and _live-config_ are available from the Debian repository as per [Installing live-build](/chapters/installation#installing-live-build).

[146](#146)

3.3.2 From source

[147](#147)

To use the latest source from git, you can follow the process below. Please ensure you are familiar with the terms mentioned in [Terms](/chapters/about-manual#terms).

[148](#148)

-   Checkout the _live-boot_ and _live-config_ sources

[149](#149)

$ git clone https://salsa.debian.org/live-team/live-boot.git  
$ git clone https://salsa.debian.org/live-team/live-config.git  

[150](#150)

Consult the _live-boot_ and _live-config_ man pages for details on customizing if that is your reason for building these packages from source.

[151](#151)

-   Build _live-boot_ and _live-config_ .deb files

[152](#152)

You must build either on your target distribution or in a chroot containing your target platform: this means if your target is **trixie** then you should build against **trixie**.

[153](#153)

Use a personal builder such as _pbuilder_ or _sbuild_ if you need to build _live-boot_ for a target distribution that differs from your build system. For example, for **trixie** live images, build _live-boot_ in a **trixie** chroot. If your target distribution happens to match your build system distribution, you may build directly on the build system using dpkg-buildpackage (provided by the _dpkg-dev_ package):

[154](#154)

$ cd live-boot  
$ dpkg-buildpackage -b -uc -us  
$ cd ../live-config  
$ dpkg-buildpackage -b -uc -us  

[155](#155)

-   Use applicable generated .deb files

[156](#156)

As _live-boot_ and _live-config_ are installed by _live-build_ system, installing the packages in the host system is not sufficient: you should treat the generated .deb files like any other custom packages. Since your purpose for building from source is likely to test new things over the short term before the official release, follow [Installing modified or third-party packages](/chapters/customizing-package-installation#installing-modified-or-third-party-packages) to temporarily include the relevant files in your configuration. In particular, notice that both packages are divided into a generic part, a documentation part and one or more back-ends. Include the generic part, only one back-end matching your configuration, and optionally the documentation. Assuming you are building a live image in the current directory and have generated all .deb files for a single version of both packages in the directory above, these bash commands would copy all of the relevant packages including default back-ends:

[157](#157)

$ cp ../live-boot{\_,-initramfs-tools,-doc}\*.deb  config/packages.chroot/  
$ cp ../live-config{\_,-sysvinit,-doc}\*.deb  config/packages.chroot/
