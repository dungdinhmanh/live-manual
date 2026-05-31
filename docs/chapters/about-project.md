---
title: About Project
slug: about-project
---
# About the Debian Live Project

[75](#75)

# 2\. About the Debian Live Project

[76](#76)

2.1 Motivation

[77](#77)

2.1.1 What is wrong with current live systems

[78](#78)

When Debian Live Project was initiated (around 2006), there were already several Debian based live systems available and they are doing a great job. From the Debian perspective most of them have one or more of the following disadvantages:

[79](#79)

-   They are not Debian projects and therefore lack support from within Debian.

[80](#80)

-   They mix different distributions, e.g. **testing** and **unstable**.

[81](#81)

-   They support i386 only.

[82](#82)

-   They modify the behaviour and/or appearance of packages by stripping them down to save space.

[83](#83)

-   They include packages from outside of the Debian archive.

[84](#84)

-   They ship custom kernels with additional patches that are not part of Debian.

[85](#85)

-   They are large and slow due to their sheer size and thus not suitable for rescue issues.

[86](#86)

-   They are not available in different flavours, e.g. CDs, DVDs, USB-stick and netboot images.

[87](#87)

2.1.2 Why create our own live system?

[88](#88)

Debian is the Universal Operating System: Debian has a live system to show around and to accurately represent the Debian system with the following main advantages:

[89](#89)

-   It is a subproject of Debian.

[90](#90)

-   It reflects the (current) state of one distribution.

[91](#91)

-   It runs on as many architectures as possible.

[92](#92)

-   It consists of unchanged Debian packages only.

[93](#93)

-   It does not contain any packages that are not in the Debian archive.

[94](#94)

-   It uses an unaltered Debian kernel with no additional patches.

[95](#95)

2.2 Philosophy

[96](#96)

2.2.1 Only unchanged packages from Debian "main" and "non-free-firmware"

[97](#97)

We will only use packages from the Debian repository in the "main" section. The non-free section is not part of Debian and therefore cannot be used for official live system images.

[98](#98)

Starting with Debian 12 **bookworm** we added the ["non-free-firmware"](https://wiki.debian.org/Firmware) section for better support of modern hardware.

[99](#99)

We will not change any packages. Whenever we need to change something, we will do that in coordination with its package maintainer in Debian.

[100](#100)

As an exception, our own packages such as _live-boot_, _live-build_ or _live-config_ may temporarily be used from our own repository for development reasons (e.g. to create development snapshots). They will be uploaded to Debian on a regular basis.

[101](#101)

2.2.2 No package configuration of the live system

[102](#102)

In this phase we will not ship or install sample or alternative configurations. All packages are used in their default configuration as they are after a regular installation of Debian.

[103](#103)

Whenever we need a different default configuration, we will do that in coordination with its package maintainer in Debian.

[104](#104)

A system for configuring packages is provided using debconf allowing custom configured packages to be installed in your custom produced live system images, but for the [prebuilt live images](/chapters/the-basics#downloading-prebuilt-images) we choose to leave packages in their default configuration, unless absolutely necessary in order to work in the live environment. Wherever possible, we prefer to adapt packages within the Debian archive to work better in a live system versus making changes to the live toolchain or [prebuilt image configurations](/chapters/managing-a-configuration#clone-configuration-via-git). For more information, please see [Customization overview](/chapters/customization-overview#customization-overview).

[105](#105)

2.3 Contact

[106](#106)

-   **Mailing list**: The primary contact for the project is the mailing list at ‹[https://lists.debian.org/debian-live/](https://lists.debian.org/debian-live/)›. You can email the list directly by addressing your mail to ‹[debian-live@lists.debian.org](mailto:debian-live@lists.debian.org)›​. The list archives are available at ‹[https://lists.debian.org/debian-live/](https://lists.debian.org/debian-live/)›.

[107](#107)

-   **IRC**: A number of users and developers are present in the #debian-live channel on irc.debian.org (OFTC). When asking a question on IRC, please be patient for an answer. If no answer is forthcoming, please email the mailing list.

[108](#108)

-   **BTS** : The [Debian Bug Tracking System](https://www.debian.org/Bugs/) (BTS) contains details of bugs reported by users and developers. Each bug is given a number, and is kept on file until it is marked as having been dealt with. For more information, please see [Reporting bugs](/chapters/bugs#bugs).
