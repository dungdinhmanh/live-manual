---
title: Customizing package installation
slug: customizing-package-installation
---

# Customizing package installation

Perhaps the most basic customization of a live system is the selection of packages to be included in the image. This chapter guides you through the various build-time options to customize _live-build_'s installation of packages. The broadest choices influencing which packages are available to install in the image are the distribution and archive areas. To ensure decent download speeds, you should choose a nearby distribution mirror. You can also add your own repositories for backports, experimental or custom packages, or include packages directly as files. You can define lists of packages, including metapackages which will install many related packages at once, such as packages for a particular desktop or language. Finally, a number of options give some control over _apt_, or if you prefer, _aptitude_, at build time when packages are installed. You may find these handy if you use a proxy, want to disable installation of recommended packages to save space, or need to control which versions of packages are installed via APT pinning, to name a few possibilities.

## 8.1 Package sources

### 8.1.1 Distribution, archive areas and mode

The distribution you choose has the broadest impact on which packages are available to include in your live image. Specify the codename, which defaults to **testing**. Any current distribution carried in the archive may be specified by its codename here. (See [Terms](/chapters/about-manual#terms) for more details.) The \--distribution option not only influences the source of packages within the archive, but also instructs _live-build_ to enable other sources.

For example, to build against the **stable** release, with _security_, _updates_ (enabled per default) and additionally _proposed-updates_ and _backports_, specify:

```shell
$ lb config --distribution stable --proposed-updates true --backports true
```

Similarly, for the **unstable** release, **sid**, which has neither _security_ nor _updates_, specify:

```shell
$ lb config --distribution sid
```

Within the distribution archive, archive areas are major divisions of the archive. In Debian, these are main, contrib and non-free. Only main contains software that is part of the Debian distribution, hence that is the default. One or more values may be specified, e.g.

```shell
$ lb config --archive-areas "main contrib non-free"
```

Experimental support is available for some Debian derivatives through a \--mode option. By default, this option is set to debian only if you are building on a Debian or on an unknown system. If lb config is invoked on any of the supported derivatives, it will default to create an image of that derivative. If lb config is run in e.g. ubuntu mode, the distribution names and archive areas for the specified derivative are supported instead of the ones for Debian. The mode also modifies _live-build_ behaviour to suit the derivatives.

**Note:** The projects for whom these modes were added are primarily responsible for supporting users of these options. The Debian Live Project, in turn, provides development support on a best-effort basis only, based on feedback from the derivative projects as we do not develop or support these derivatives ourselves.

### 8.1.2 Distribution mirrors

The Debian archive is replicated across a large network of mirrors around the world so that people in each region can choose a nearby mirror for best download speed. Each of the \--mirror-* options governs which distribution mirror is used at various stages of the build. Recall from [Stages of the build](/chapters/customization-overview#stages-of-the-build) that the **bootstrap** stage is when the chroot is initially populated by _debootstrap_ with a minimal system, and the **chroot** stage is when the chroot used to construct the live system's filesystem is built. Thus, the corresponding mirror switches are used for those stages, and later, in the **binary** stage, the \--mirror-binary and \--mirror-binary-security values are used, superseding any mirrors used in an earlier stage.

### 8.1.3 Distribution mirrors used at build time

To set the distribution mirrors used at build time to point at a local mirror, it is sufficient to set \--mirror-bootstrap and \--mirror-chroot-security as follows.

```shell
$ lb config --mirror-bootstrap http://localhost/debian/ \

          --mirror-chroot-security http://localhost/debian-security/
```

The chroot mirror, specified by \--mirror-chroot, defaults to the \--mirror-bootstrap value.

### 8.1.4 Distribution mirrors used at run time

The \--mirror-binary* options govern the distribution mirrors placed in the binary image. These may be used to install additional packages while running the live system. The defaults employ deb.debian.org, a service that chooses a geographically close mirror based, among other things, on the user's IP family and the availability of the mirrors. This is a suitable choice when you cannot predict which mirror will be best for all of your users. Or you may specify your own values as shown in the example below. An image built from this configuration would only be suitable for users on a network where "mirror" is reachable.

```shell
$ lb config --mirror-binary http://mirror/debian/ \

          --mirror-binary-security http://mirror/debian-security/ \

          --mirror-binary-backports http://mirror/debian-backports/
```

### 8.1.5 Additional repositories

You may add more repositories, broadening your package choices beyond what is available in your target distribution. These may be, for example, for backports, experimental or custom packages. To configure additional repositories, create config/archives/your-repository.list.chroot, and/or config/archives/your-repository.list.binary files. As with the \--mirror-* options, these govern the repositories used in the **chroot** stage when building the image, and in the **binary** stage, i.e. for use when running the live system.

For example, config/archives/live.list.chroot allows you to install packages from the debian-live snapshot repository at live system build time.

```shell
deb http://debian-live.alioth.debian.org/ sid-snapshots main contrib non-free
```

If you add the same line to config/archives/live.list.binary, the repository will be added to your live system's /etc/apt/sources.list.d/ directory.

If such files exist, they will be picked up automatically.

You should also put the ASCII-armored GPG key used to sign the repository into config/archives/your-repository.key.{binary,chroot} files.

Should you need custom APT pinning, such APT preferences snippets can be placed in config/archives/your-repository.pref.{binary,chroot} files and will be automatically added to your live system's /etc/apt/preferences.d/ directory.

Similarly, if you need custom APT_AUTH.CONF(5) authentication configuration, this can be placed in config/archives/your-repository.auth.{binary,chroot} files and will be automatically added to your live system's /etc/apt/auth.conf.d/ directory

## 8.2 Choosing packages to install

There are a number of ways to choose which packages _live-build_ will install in your image, covering a variety of different needs. You can simply name individual packages to install in a package list. You can also use metapackages in those lists, or select them using package control file fields. And finally, you may place package files in your config/ tree, which is well suited to testing of new or experimental packages before they are available from a repository.

### 8.2.1 Package lists

Package lists are a powerful way of expressing which packages should be installed. The list syntax supports conditional sections which makes it easy to build lists and adapt them for use in multiple configurations. Package names may also be injected into the list using shell helpers at build time.

**Note:** The behaviour of _live-build_ when specifying a package that does not exist is determined by your choice of APT utility. See [Choosing apt or aptitude](/chapters/customizing-package-installation#choosing-apt-or-aptitude) for more details.

### 8.2.2 Using metapackages

The simplest way to populate your package list is to use a task metapackage maintained by your distribution. For example:

```shell
$ lb config

$ echo task-gnome-desktop > config/package-lists/desktop.list.chroot
```

This supersedes the older predefined list method supported in live-build 2.x. Unlike predefined lists, task metapackages are not specific to the Live System project. Instead, they are maintained by specialist working groups within the distribution and therefore reflect the consensus of each group about which packages best serve the needs of the intended users. They also cover a much broader range of use cases than the predefined lists they replace.

All task metapackages are prefixed task-, so a quick way to determine which are available (though it may contain a handful of false hits that match the name but aren't metapackages) is to match on the package name with:

```shell
$ apt-cache search --names-only ^task-
```

In addition to these, you will find other metapackages with various purposes. Some are subsets of broader task packages, like gnome-core, while others are individual specialized parts of a Debian Pure Blend, such as the education-* metapackages. To list all metapackages in the archive, install the debtags package and list all packages with the role::metapackage tag as follows:

```shell
$ debtags search role::metapackage
```

### 8.2.3 Local package lists

Whether you list metapackages, individual packages, or a combination of both, all local package lists are stored in config/package-lists/. Since more than one list can be used, this lends itself well to modular designs. For example, you may decide to devote one list to a particular choice of desktop, another to a collection of related packages that might as easily be used on top of a different desktop. This allows you to experiment with different combinations of sets of packages with a minimum of fuss, sharing common lists between different live image projects.

Package lists that exist in this directory need to have a .list suffix in order to be processed, and then an additional stage suffix, .chroot or .binary to indicate which stage the list is for.

The packages in the .list.chroot_install list are present both in the live system and in the installed system.

**Note:** If you don't specify the stage suffix, the list will be used for both stages. Normally, you want to specify .list.chroot so that the packages will only be installed in the live filesystem and not have an extra copy of the .deb placed on the medium.

### 8.2.4 Local binary package lists

To make a binary stage list, place a file suffixed with .list.binary in config/package-lists/. These packages are not installed in the live filesystem, but are included on the live medium under pool/. You would typically use such a list with one of the non-live installer variants. As mentioned above, if you want this list to be the same as your chroot stage list, simply use the .list suffix by itself.

### 8.2.5 Generated package lists

It sometimes happens that the best way to compose a list is to generate it with a script. Any line starting with an exclamation point indicates a command to be executed within the chroot when the image is built. For example, one might include the line ! grep-aptavail -n -sPackage -FPriority standard | sort in a package list to produce a sorted list of available packages with Priority: standard.

In fact, selecting packages with the grep-aptavail command (from the dctrl-tools package) is so useful that live-build provides a Packages helper script as a convenience. This script takes two arguments: field and pattern. Thus, you can create a list with the following contents:

```shell
$ lb config

$ echo '! Packages Priority standard' > config/package-lists/standard.list.chroot
```

### 8.2.6 Using conditionals inside package lists

Any of the _live-build_ configuration variables stored in config/* (minus the LB_ prefix) may be used in conditional statements in package lists. Generally, this means any lb config option uppercased and with dashes changed to underscores. But in practice, it is only the ones that influence package selection that make sense, such as DISTRIBUTION, ARCHITECTURES or ARCHIVE_AREAS.

For example, to install ia32-libs if the \--architectures amd64 is specified:

```shell
#if ARCHITECTURES amd64

ia32-libs

#endif
```

You may test for any one of a number of values, e.g. to install _memtest86+_ if either \--architectures i386 or \--architectures amd64 is specified:

```shell
#if ARCHITECTURES i386 amd64

memtest86+

#endif
```

You may also test against variables that may contain more than one value, e.g. to install _vrms_ if either contrib or non-free is specified via \--archive-areas:

```shell
#if ARCHIVE_AREAS contrib non-free

vrms

#endif
```

The nesting of conditionals is not supported.

### 8.2.7 Removing packages at install time

You can list packages in files with .list.chroot_live and .list.chroot_install suffixes inside the config/package-lists directory. If both a live and an install list exist, the packages in the .list.chroot_live list are removed with a hook after the installation (if the user uses the installer). The packages in the .list.chroot_install list are present both in the live system and in the installed system. This is a special tweak for the installer and may be useful if you have \--debian-installer live set in your config, and wish to remove live system-specific packages at install time.

### 8.2.8 Summary

The table below shows which configuration files are required to achieve the desired availability of the package.

X.chroot

X.chroot_live

X

X.binary

Package is installed in the live system

Yes

Yes

Yes

No

Package is removed after installing the live system

No

Yes

No

N/A

Package can be installed from the live system without network

N/A

N/A

Yes *1

Yes

*1: Because the installer needs this package

X = config/package-lists/custom_name.list

### 8.2.9 Desktop and language tasks

Desktop and language tasks are special cases that need some extra planning and configuration. Live images are different from Debian Installer images in this respect. In the Debian Installer, if the medium was prepared for a particular desktop environment flavour, the corresponding task will be automatically installed. Thus, there are internal gnome-desktop, kde-desktop, lxde-desktop and xfce-desktop tasks, none of which are offered in tasksel's menu. Likewise, there are no menu entries for tasks for languages, but the user's language choice during the install influences the selection of corresponding language tasks.

When developing a desktop live image, the image typically boots directly to a working desktop, the choices of both desktop and default language having been made at build time, not at run time as in the case of the Debian Installer. That's not to say that a live image couldn't be built to support multiple desktops or multiple languages and offer the user a choice, but that is not _live-build_'s default behaviour.

Because there is no provision made automatically for language tasks, which include such things as language-specific fonts and input-method packages, if you want them, you need to specify them in your configuration. For example, a GNOME desktop image containing support for German might include these task metapackages:

```shell
$ lb config

$ echo "task-gnome-desktop task-laptop" >> config/package-lists/my.list.chroot

$ echo "task-german task-german-desktop task-german-gnome-desktop" >> config/package-lists/my.list.chroot
```

### 8.2.10 Kernel flavour and version

One or more kernel flavours will be included in your image by default, depending on the architecture. You can choose different flavours via the \--linux-flavours option. Each flavour is suffixed to the default stub linux-image to form each metapackage name which in turn depends on an exact kernel package to be included in your image.

Thus by default, an amd64 architecture image will include the linux-image-amd64 flavour metapackage, and an i386 architecture image will include the linux-image-586 metapackage.

When more than one kernel package version is available in your configured archives, you can specify a different kernel package name stub with the \--linux-packages option. For example, supposing you are building an amd64 architecture image and add the experimental archive for testing purposes so you can install the linux-image-3.18.0-trunk-amd64 kernel. You would configure that image as follows:

```shell
$ lb config --linux-packages linux-image-3.18.0-trunk

$ echo "deb http://deb.debian.org/debian/ experimental main" > config/archives/experimental.list.chroot
```

### 8.2.11 Custom kernels

You can build and include your own custom kernels, so long as they are integrated within the Debian package management system. The _live-build_ system does not support kernels not built as .deb packages.

The proper and recommended way to deploy your own kernel packages is to follow the instructions in the kernel-handbook. Remember to modify the ABI and flavour suffixes appropriately, then include a complete build of the linux and matching linux-latest packages in your repository.

If you opt to build the kernel packages without the matching metapackages, you need to specify an appropriate \--linux-packages stub as discussed in [Kernel flavour and version](/chapters/customizing-package-installation#kernel-flavour-and-version). As we explain in [Installing modified or third-party packages](/chapters/customizing-package-installation#installing-modified-or-third-party-packages), it is best if you include your custom kernel packages in your own repository, though the alternatives discussed in that section work as well.

It is beyond the scope of this document to give advice on how to customize your kernel. However, you must at least ensure your configuration satisfies these minimum requirements:

-   Use an initial ramdisk.

-   Include the union filesystem module (i.e. usually OverlayFS).

-   Include any other filesystem modules required by your configuration (i.e. usually squashfs).

## 8.3 Installing modified or third-party packages

While it is against the philosophy of a live system, it may sometimes be necessary to build a live system with modified versions of packages that are in the Debian repository. This may be to modify or support additional features, languages and branding, or even to remove elements of existing packages that are undesirable. Similarly, "third-party" packages may be used to add bespoke and/or proprietary functionality.

This section does not cover advice regarding building or maintaining modified packages. Joachim Breitner's 'How to fork privately' method from ‹[http://www.joachim-breitner.de/blog/archives/282-How-to-fork-privately.html](http://www.joachim-breitner.de/blog/archives/282-How-to-fork-privately.html)› may be of interest, however. The creation of bespoke packages is covered in the Debian New Maintainers' Guide at ‹[https://www.debian.org/doc/manuals/maint-guide/](https://www.debian.org/doc/manuals/maint-guide/)› and elsewhere.

There are two ways of installing modified custom packages:

-   packages.chroot

-   Using a custom APT repository

Using packages.chroot is simpler to achieve and useful for "one-off" customizations but has a number of drawbacks, while using a custom APT repository is more time-consuming to set up.

8.3.1 Using packages.chroot to install custom packages

To install a custom package, simply copy it to the config/packages.chroot/ directory. Packages that are inside this directory will be automatically installed into the live system during build - you do not need to specify them elsewhere.

Packages **must** be named in the prescribed way. One simple way to do this is to use dpkg-name.

Using packages.chroot for installation of custom packages has disadvantages:

-   It is not possible to use secure APT.

-   You must install all appropriate packages in the config/packages.chroot/ directory.

-   It does not lend itself to storing live system configurations in revision control.

### 8.3.2 Using an APT repository to install custom packages

Unlike using packages.chroot, when using a custom APT repository you must ensure that you specify the packages elsewhere. See [Choosing packages to install](/chapters/customizing-package-installation#choosing-packages-to-install) for details.

While it may seem unnecessary effort to create an APT repository to install custom packages, the infrastructure can be easily re-used at a later date to offer updates of the modified packages.

The APT repository does not necessarily need to be online, you can use a local repository instead. However, in both cases the repository needs to be signed.

Example:

```shell
$ gpg --armor --output config/archives/custom_repo.gpg.key${EXTENSION} --export-options export-minimal --export ${SIGNING_KEY}

$ cat  config/archives/custom_repo.list${EXTENSION}

deb [signed-by=/etc/apt/trusted.gpg.d/custom_repo.gpg.key${EXTENSION}.asc] ${URI} ${SUITE} ${COMPONENTS}

EOF

$ echo "${PACKAGES_FROM_REPOSITORY}" > config/package-lists/custom_repo.list${EXTENSION}
```

Where:

-   ${EXTENSION} : the optional stage suffix, see the [summary](/chapters/customizing-package-installation#package-list-extension-summary)

-   ${SIGNING_KEY}: the keyID of the signature of the repository

-   ${URI}: the URI to the repository, e.g. http://deb.debian.org/debian/ or file://$(pwd)/my_local_repository

-   ${SUITE}: the suite within the repository, e.g. my-debian-based-distro

-   ${COMPONENTS}: the components within the repository, e.g. main

-   ${PACKAGES_FROM_REPOSITORY}: the names of the packages to install (dependencies will automatically be installed as well)

### 8.3.3 Custom packages and APT

_live-build_ uses APT to install all packages into the live system so will therefore inherit behaviours from this program. One relevant example is that (assuming a default configuration) given a package available in two different repositories with different version numbers, APT will elect to install the package with the higher version number.

Because of this, you may wish to increment the version number in your custom packages' debian/changelog files to ensure that your modified version is installed over one in the official Debian repositories. This may also be achieved by altering the live system's APT pinning preferences - see [APT pinning](/chapters/customizing-package-installation#apt-pinning) for more information.

## 8.4 Configuring APT at build time

You can configure APT through a number of options applied only at build time. (APT configuration used in the running live system may be configured in the normal way for live system contents, that is, by including the appropriate configurations through config/includes.chroot/.) For a complete list, look for options starting with apt in the lb_config man page.

### 8.4.1 Choosing apt or aptitude

You can elect to use either _apt_ or _aptitude_ when installing packages at build time. Which utility is used is governed by the \--apt argument to lb config. Choose the method implementing the preferred behaviour for package installation, the notable difference being how missing packages are handled.

-   apt: With this method, if a missing package is specified, the package installation will fail. This is the default setting.

-   aptitude: With this method, if a missing package is specified, the package installation will succeed.

### 8.4.2 Using a proxy with APT

One commonly required APT configuration is to deal with building an image behind a proxy. You may specify your APT proxy with the \--apt-http-proxy option as needed, e.g.

```shell
$ lb config --apt-http-proxy http://proxy/
```

### 8.4.3 Tweaking APT to save space

You may find yourself needing to save some space on the image medium, in which case one or the other or both of the following options may be of interest.

If you don't want to include APT indices in the image, you can omit those with:

```shell
$ lb config --apt-indices false
```

This will not influence the entries in /etc/apt/sources.list, but merely whether /var/lib/apt contains the indices files or not. The tradeoff is that APT needs those indices in order to operate in the live system, so before performing apt-cache search or apt-get install, for instance, the user must apt-get update first to create those indices.

If you find the installation of recommended packages bloats your image too much, provided you are prepared to deal with the consequences discussed below, you may disable that default option of APT with:

```shell
$ lb config --apt-recommends false
```

The most important consequence of turning off recommends is that live-boot and live-config themselves recommend some packages that provide important functionality used by most Live configurations.

Two packages which you most probably will want to add again are:

-   user-setup which live-config recommends is used to create the live user.

-   sudo which live-config recommends is used to obtain root access in the live-image, which is needed to shutdown the computer.

```shell
$ lb config --apt-recommends false

$ echo "user-setup sudo" > config/package-lists/recommends.list.chroot
```

In all but the most exceptional circumstances you need to add back at least some of these recommends to your package lists or else your image will not work as expected, if at all. Look at the recommended packages for each of the live-* packages included in your build and if you are not certain you can omit them, add them back into your package lists.

The more general consequence is that if you don't install recommended packages for any given package, that is, "packages that would be found together with this one in all but unusual installations" ( [Debian Policy Manual, section 7.2](https://www.debian.org/doc/debian-policy/ch-relationships.html#binary-dependencies-depends-recommends-suggests-enhances-pre-depends) ), some packages that users of your Live system actually need may be omitted. Therefore, we suggest you review the difference turning off recommends makes to your packages list (see the binary.packages file generated by lb build) and re-include in your list any missing packages that you still want installed. Alternatively, if you find you only want a small number of recommended packages left out, leave recommends enabled and set a negative APT pin priority on selected packages to prevent them from being installed, as explained in [APT pinning](/chapters/customizing-package-installation#apt-pinning).

### 8.4.4 Passing options to apt or aptitude

If there is not a lb config option to alter APT's behaviour in the way you need, use \--apt-options or \--aptitude-options to pass any options through to your configured APT tool. See the man pages for apt and aptitude for details. Note that both options have default values that you will need to retain in addition to any overrides you may provide. So, for example, suppose you have included something from snapshot.debian.org for testing purposes and want to specify Acquire::Check-Valid-Until=false to make APT happy with the stale Release file, you would do so as per the following example, appending the new option after the default value \--yes:

```shell
$ lb config --apt-options "--yes -oAcquire::Check-Valid-Until=false"
```

Please check the man pages to fully understand these options and when to use them. This is an example only and should not be construed as advice to configure your image this way. This option would not be appropriate for, say, a final release of a live image.

For more complicated APT configurations involving apt.conf options you might want to create a config/apt/apt.conf file instead. See also the other apt-* options for a few convenient shortcuts for frequently needed options.

### 8.4.5 APT pinning

For background, please first read the apt_preferences(5) man page. APT pinning can be configured either for build time, or else for run time. For the former, create config/archives/*.pref, config/archives/*.pref.chroot, and config/apt/preferences. For the latter, create config/includes.chroot/etc/apt/preferences.

Let's say you are building a **trixie** live system but need all the live packages that end up in the binary image to be installed from **sid** at build time. You need to add **sid** to your APT sources and pin the live packages from it higher, but all other packages from it lower, than the default priority. Thus, only the packages you want are installed from **sid** at build time and all others are taken from the target system distribution, **trixie**. The following will accomplish this:

```shell
$ echo "deb http://mirror/debian/ sid main" > config/archives/sid.list.chroot

$ cat >> config/archives/sid.pref.chroot << EOF

Package: live-*

Pin: release n=sid

Pin-Priority: 600

Package: *

Pin: release n=sid

Pin-Priority: 1

EOF
```

Negative pin priorities will prevent a package from being installed, as in the case where you do not want a package that is recommended by another package. Suppose you are building an LXDE image using task-lxde-desktop in config/package-lists/desktop.list.chroot, but don't want the user prompted to store wifi passwords in the keyring. This metapackage depends on _lxde-core_, which recommends _gksu_, which in turn recommends _gnome-keyring_. So you want to omit the recommended _gnome-keyring_ package. This can be done by adding the following stanza to config/apt/preferences:

```shell
Package: gnome-keyring

Pin: version *

Pin-Priority: -1
```
