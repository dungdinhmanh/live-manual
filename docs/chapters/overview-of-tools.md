---
title: Overview of tools
slug: overview-of-tools
---

# Overview of tools

This chapter contains an overview of the three main tools used in building live systems: _live-build_, _live-boot_ and _live-config_.

## 5.1 The live-build package

_live-build_ is a collection of scripts to build live systems. These scripts are also referred to as "commands".

The idea behind _live-build_ is to be a framework that uses a configuration directory to completely automate and customize all aspects of building a Live image.

Many concepts are similar to those used to build Debian packages with _debhelper_:

-   The scripts have a central location for configuring their operation. In _debhelper_, this is the debian/ subdirectory of a package tree. For example, dh_install will look, among others, for a file called debian/install to determine which files should exist in a particular binary package. In much the same way, _live-build_ stores its configuration entirely under a config/ subdirectory.

-   The scripts are independent - that is to say, it is always safe to run each command.

Unlike _debhelper_, _live-build_ provides the tools to generate a skeleton configuration directory. This could be considered to be similar to tools such as _dh-make_. For more information about these tools, read on, since the remainder of this section discuses the four most important commands. Note that the preceding lb is a generic wrapper for _live-build_ commands.

-   **lb config**: Responsible for initializing a Live system configuration directory. See [The lb config command](/chapters/overview-of-tools#lb-config) for more information.

-   **lb build**: Responsible for starting a Live system build. See [The lb build command](/chapters/overview-of-tools#lb-build) for more information.

-   **lb clean**: Responsible for removing parts of a Live system build. See [The lb clean command](/chapters/overview-of-tools#lb-clean) for more information.

5.1.1 The lb config command

As discussed in [live-build](/chapters/overview-of-tools#live-build), the scripts that make up _live-build_ read their configuration with the source command from a single directory named config/. As constructing this directory by hand would be time-consuming and error-prone, the lb config command can be used to create the initial skeleton configuration tree.

Issuing lb config without any arguments creates the config/ subdirectory which is populated with some default settings in configuration files, and two skeleton trees named auto/ and local/.

```shell
$ lb config
[2025-02-15 12:34:56] lb config
P: Using http proxy: http://127.0.0.1:3142
P: Creating config tree for a debian/testing/amd64 system
P: Symlinking hooks...
```

Using lb config without any arguments would be suitable for users who need a very basic image, or who intend to provide a more complete configuration via auto/config later (see [Managing a configuration](/chapters/managing-a-configuration#managing-a-configuration) for details).

Normally, you will want to specify some options. For example, to specify which package manager to use while building the image:

```shell
$ lb config --apt aptitude
```

It is possible to specify many options, such as:

```shell
$ lb config --binary-images netboot --bootappend-live "boot=live components hostname=live-host username=live-user" ...
```

A full list of options is available in the lb_config man page.

5.1.2 The lb build command

The lb build command reads in your configuration from the config/ directory. It then runs the lower level commands needed to build your Live system.

5.1.3 The lb clean command

It is the job of the lb clean command to remove various parts of a build so subsequent builds can start from a clean state. By default, chroot, binary and source stages are cleaned, but the cache is left intact. Also, individual stages can be cleaned. For example, if you have made changes that only affect the binary stage, use lb clean --binary prior to building a new binary. If your changes invalidate the bootstrap and/or package caches, e.g. changes to --mode, --architecture, or --bootstrap, you must use lb clean --purge. See the lb_clean man page for a full list of options.

## 5.2 The live-boot package

_live-boot_ is a collection of scripts providing hooks for the _initramfs-tools_, used to generate an initramfs capable of booting live systems, such as those created by _live-build_. This includes the live system ISOs, netboot tarballs, and USB stick images.

At boot time it will look for read-only media containing a /live/ directory where a root filesystem (often a compressed filesystem image like squashfs) is stored. If found, it will create a writable environment, using OverlayFS, for Debian like systems to boot from.

More information on initial ramfs in Debian can be found in the Debian Linux Kernel Handbook at ‹[https://kernel-team.pages.debian.net/kernel-handbook/](https://kernel-team.pages.debian.net/kernel-handbook/)› in the chapter on initramfs.

## 5.3 The live-config package

_live-config_ consists of the scripts that run at boot time after _live-boot_ to configure the live system automatically. It handles such tasks as setting the hostname, locales and timezone, creating the live user, inhibiting cron jobs and performing autologin of the live user.
