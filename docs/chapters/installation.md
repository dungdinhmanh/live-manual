---
title: Installation
slug: installation
---

# Installation

## 3.1 Requirements

Building live system images has very few system requirements for the host system:

- Superuser (root) access

- An up-to-date version of _live-build_

- A POSIX-compliant shell, such as _bash_ or _dash_

- _debootstrap_

- Linux 2.6 or newer

- A mount point with _dev_ and _exec_ rights.

```shell
mount -odev,exec,remount
```

Note that using Debian or a Debian-derived distribution is not required - _live-build_ will run on almost any distribution with the above requirements.

## 3.2 Installing live-build

You can install _live-build_ in a number of different ways:

- From the Debian repository

- From source

- From snapshots

If you are using Debian, the recommended way is to install _live-build_ via the Debian repository.

### 3.2.1 From the Debian repository

Simply install _live-build_ like any other package:

```shell
apt-get install live-build
```

### 3.2.2 From source

_live-build_ is developed using the Git version control system. On Debian based systems, this is provided by the _git_ package. To check out the latest code, execute:

```shell
git clone https://salsa.debian.org/live-team/live-build.git
```

You can build and install your own Debian package by executing:

```shell
cd live-build
dpkg-buildpackage -b -uc -us
cd ..
```

Now install whichever of the freshly built .deb files you were interested in, e.g.

```shell
dpkg -i live-build_4.0-1_all.deb
```

You can also install _live-build_ directly to your system by executing:

```shell
make install
```

and uninstall it with:

```shell
make uninstall
```

## 3.3 Installing live-boot and live-config

::: tip Note
You do not need to install _live-boot_ or _live-config_ on your system to create customized live systems. However, doing so will do no harm and is useful for reference purposes. If you only want the documentation, you may now install the _live-boot-doc_ and _live-config-doc_ packages separately.
:::

### 3.3.1 From the Debian repository

Both _live-boot_ and _live-config_ are available from the Debian repository as per [Installing live-build](/chapters/installation#installing-live-build).

### 3.3.2 From source

To use the latest source from git, you can follow the process below. Please ensure you are familiar with the terms mentioned in [Terms](/chapters/about-manual#terms).

- Checkout the _live-boot_ and _live-config_ sources

```shell
git clone https://salsa.debian.org/live-team/live-boot.git
git clone https://salsa.debian.org/live-team/live-config.git
```

Consult the _live-boot_ and _live-config_ man pages for details on customizing if that is your reason for building these packages from source.

- Build _live-boot_ and _live-config_ .deb files

You must build either on your target distribution or in a chroot containing your target platform: this means if your target is **trixie** then you should build against **trixie**.

Use a personal builder such as _pbuilder_ or _sbuild_ if you need to build _live-boot_ for a target distribution that differs from your build system. For example, for **trixie** live images, build _live-boot_ in a **trixie** chroot. If your target distribution happens to match your build system distribution, you may build directly on the build system using dpkg-buildpackage (provided by the _dpkg-dev_ package):

```shell
cd live-boot
dpkg-buildpackage -b -uc -us
cd ../live-config
dpkg-buildpackage -b -uc -us
```

- Use applicable generated .deb files

As _live-boot_ and _live-config_ are installed by _live-build_ system, installing the packages in the host system is not sufficient: you should treat the generated .deb files like any other custom packages. Since your purpose for building from source is likely to test new things over the short term before the official release, follow [Installing modified or third-party packages](/chapters/customizing-package-installation#installing-modified-or-third-party-packages) to temporarily include the relevant files in your configuration. In particular, notice that both packages are divided into a generic part, a documentation part and one or more back-ends. Include the generic part, only one back-end matching your configuration, and optionally the documentation. Assuming you are building a live image in the current directory and have generated all .deb files for a single version of both packages in the directory above, these bash commands would copy all of the relevant packages including default back-ends:

```shell
cp ../live-boot{_,-initramfs-tools,-doc}*.deb  config/packages.chroot/
cp ../live-config{_,-sysvinit,-doc}*.deb  config/packages.chroot/
```
