---
title: Overview Of Tools
slug: overview-of-tools
---
# Overview of tools

[295](#295)

# 5\. Overview of tools

[296](#296)

This chapter contains an overview of the three main tools used in building live systems: _live-build_, _live-boot_ and _live-config_.

[297](#297)

5.1 The live-build package

[298](#298)

_live-build_ is a collection of scripts to build live systems. These scripts are also referred to as "commands".

[299](#299)

The idea behind _live-build_ is to be a framework that uses a configuration directory to completely automate and customize all aspects of building a Live image.

[300](#300)

Many concepts are similar to those used to build Debian packages with _debhelper_:

[301](#301)

-   The scripts have a central location for configuring their operation. In _debhelper_, this is the debian/ subdirectory of a package tree. For example, dh\_install will look, among others, for a file called debian/install to determine which files should exist in a particular binary package. In much the same way, _live-build_ stores its configuration entirely under a config/ subdirectory.

[302](#302)

-   The scripts are independent - that is to say, it is always safe to run each command.

[303](#303)

Unlike _debhelper_, _live-build_ provides the tools to generate a skeleton configuration directory. This could be considered to be similar to tools such as _dh-make_. For more information about these tools, read on, since the remainder of this section discuses the four most important commands. Note that the preceding lb is a generic wrapper for _live-build_ commands.

[304](#304)

-   **lb config**: Responsible for initializing a Live system configuration directory. See [The lb config command](/chapters/overview-of-tools#lb-config) for more information.

[305](#305)

-   **lb build**: Responsible for starting a Live system build. See [The lb build command](/chapters/overview-of-tools#lb-build) for more information.

[306](#306)

-   **lb clean**: Responsible for removing parts of a Live system build. See [The lb clean command](/chapters/overview-of-tools#lb-clean) for more information.

[307](#307)

5.1.1 The lb config command

[308](#308)

As discussed in [live-build](/chapters/overview-of-tools#live-build), the scripts that make up _live-build_ read their configuration with the source command from a single directory named config/. As constructing this directory by hand would be time-consuming and error-prone, the lb config command can be used to create the initial skeleton configuration tree.

[309](#309)

Issuing lb config without any arguments creates the config/ subdirectory which is populated with some default settings in configuration files, and two skeleton trees named auto/ and local/.

[310](#310)

$ lb config  
\[2025-02-15 12:34:56\] lb config  
P: Using http proxy: http://127.0.0.1:3142  
P: Creating config tree for a debian/testing/amd64 system  
P: Symlinking hooks...  

[311](#311)

Using lb config without any arguments would be suitable for users who need a very basic image, or who intend to provide a more complete configuration via auto/config later (see [Managing a configuration](/chapters/managing-a-configuration#managing-a-configuration) for details).

[312](#312)

Normally, you will want to specify some options. For example, to specify which package manager to use while building the image:

[313](#313)

$ lb config --apt aptitude  

[314](#314)

It is possible to specify many options, such as:

[315](#315)

$ lb config --binary-images netboot --bootappend-live "boot=live components hostname=live-host username=live-user" ...  

[316](#316)

A full list of options is available in the lb\_config man page.

[317](#317)

5.1.2 The lb build command

[318](#318)

The lb build command reads in your configuration from the config/ directory. It then runs the lower level commands needed to build your Live system.

[319](#319)

5.1.3 The lb clean command

[320](#320)

It is the job of the lb clean command to remove various parts of a build so subsequent builds can start from a clean state. By default, chroot, binary and source stages are cleaned, but the cache is left intact. Also, individual stages can be cleaned. For example, if you have made changes that only affect the binary stage, use lb clean --binary prior to building a new binary. If your changes invalidate the bootstrap and/or package caches, e.g. changes to \--mode, \--architecture, or \--bootstrap, you must use lb clean --purge. See the lb\_clean man page for a full list of options.

[321](#321)

5.2 The live-boot package

[322](#322)

_live-boot_ is a collection of scripts providing hooks for the _initramfs-tools_, used to generate an initramfs capable of booting live systems, such as those created by _live-build_. This includes the live system ISOs, netboot tarballs, and USB stick images.

[323](#323)

At boot time it will look for read-only media containing a /live/ directory where a root filesystem (often a compressed filesystem image like squashfs) is stored. If found, it will create a writable environment, using OverlayFS, for Debian like systems to boot from.

[324](#324)

More information on initial ramfs in Debian can be found in the Debian Linux Kernel Handbook at ‹[https://kernel-team.pages.debian.net/kernel-handbook/](https://kernel-team.pages.debian.net/kernel-handbook/)› in the chapter on initramfs.

[325](#325)

5.3 The live-config package

[326](#326)

_live-config_ consists of the scripts that run at boot time after _live-boot_ to configure the live system automatically. It handles such tasks as setting the hostname, locales and timezone, creating the live user, inhibiting cron jobs and performing autologin of the live user.
