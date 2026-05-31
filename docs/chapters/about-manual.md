---
title: About Manual
slug: about-manual
---
# About this manual

[4](#4)

# 1\. About this manual

[5](#5)

This manual serves as a single access point to all documentation related to the Debian Live Project and in particular applies to the software produced by the project for the Debian "**bookworm**" release. An up-to-date version can always be found at ‹[https://live-team.pages.debian.net/live-manual/](https://live-team.pages.debian.net/live-manual/)›

[6](#6)

While _live-manual_ is primarily focused on helping you build a live system and not on end-user topics, an end user may find some useful information in these sections: [The Basics](/chapters/the-basics#the-basics) covers downloading prebuilt images and preparing images to be booted from media or the network, either using the web builder or running _live-build_ directly on your system. [Customizing run time behaviours](/chapters/customizing-run-time-behaviours#customizing-run-time-behaviours) describes some options that may be specified at the boot prompt, such as selecting a keyboard layout and locale, and using persistence.

[7](#7)

Some of the commands mentioned in the text must be executed with superuser privileges which can be obtained by becoming the root user via su or by using sudo. To distinguish between commands which may be executed by an unprivileged user and those requiring superuser privileges, commands are prepended by $ or # respectively. This symbol is not a part of the command.

[8](#8)

1.1 For the impatient

[9](#9)

While we believe that everything in this manual is important to at least some of our users, we realize it is a lot of material to cover and that you may wish to experience early success using the software before delving into the details. Therefore, we suggest reading in the following order.

[10](#10)

First, read this chapter, [About this manual](/chapters/about-manual#about-manual), from the beginning and ending with the [Terms](/chapters/about-manual#terms) section. Next, skip to the three tutorials at the front of the [Examples](/chapters/examples#examples) section designed to teach you image building and customization basics. Read [Using the examples](/chapters/examples#using-the-examples) first, followed by [Tutorial 1: A default image](/chapters/examples#tutorial-1), [Tutorial 2: A web browser utility](/chapters/examples#tutorial-2) and finally [Tutorial 3: A personalized image](/chapters/examples#tutorial-3). By the end of these tutorials, you will have a taste of what can be done with live systems.

[11](#11)

We encourage you to return to more in-depth study of the manual, perhaps next reading [The basics](/chapters/the-basics#the-basics), skimming or skipping [Building a netboot image](/chapters/the-basics#building-netboot-image), and finishing by reading the [Customization overview](/chapters/customization-overview#customization-overview) and the chapters that follow it. By this point, we hope you are thoroughly excited by what can be done with live systems and motivated to read the rest of the manual, cover-to-cover.

[12](#12)

1.2 Terms

[13](#13)

-   **Live system**: An operating system that can boot without installation to a hard drive. Live systems do not alter local operating system(s) or file(s) already installed on the computer hard drive unless instructed to do so. Live systems are typically booted from media such as CDs, DVDs or USB sticks. Some may also boot over the network (via netboot images, see [Building a netboot image](/chapters/the-basics#building-netboot-image)), and over the Internet (via the boot parameter fetch=URL, see [Webbooting](/chapters/the-basics#webbooting)).

[14](#14)

-   **Live medium**: As distinct from live system, the live medium refers to the CD, DVD or USB stick where the binary produced by _live-build_ and used to boot the live system is written. More broadly, the term also refers to any place where this binary resides for the purposes of booting the live system, such as the location for the network boot files.

[15](#15)

-   **Debian Live Project**: The project which maintains, among others, the _live-boot_, _live-build_, _live-config_, _live-tools_ and _live-manual_ packages.

[16](#16)

-   **Host system**: The environment used to create the live system.

[17](#17)

-   **Target system**: The environment used to run the live system.

[18](#18)

-   **_live-boot_**: A collection of scripts used to boot live systems.

[19](#19)

-   **_live-build_**: A collection of scripts used to build customized live systems.

[20](#20)

-   **_live-config_**: A collection of scripts used to configure a live system during the boot process.

[21](#21)

-   **_live-tools_**: A collection of additional scripts used to perform useful tasks within a running live system.

[22](#22)

-   **_live-manual_**: This document is maintained in a package called _live-manual_.

[23](#23)

-   **Debian Installer (d-i)**: The official installation system for the Debian distribution.

[24](#24)

-   **Boot parameters**: Parameters that can be entered at the bootloader prompt to influence the kernel or _live-config_.

[25](#25)

-   **chroot**: The _chroot_ program, chroot(8), enables us to run different instances of the GNU/Linux environment on a single system simultaneously without rebooting.

[26](#26)

-   **Binary image**: A file containing the live system, such as live-image-amd64.hybrid.iso or live-image-amd64.img.

[27](#27)

-   **Target distribution**: The distribution upon which your live system will be based. This can differ from the distribution of your host system.

[28](#28)

-   **stable/testing/unstable**: The **stable** distribution, currently codenamed **bookworm**, contains the latest officially released distribution of Debian. The **testing** distribution, temporarily codenamed **trixie**, is the staging area for the next **stable** release. A major advantage of using this distribution is that it has more recent versions of software relative to the **stable** release. The **unstable** distribution, permanently codenamed **sid**, is where active development of Debian occurs. Generally, this distribution is run by developers and those who like to live on the edge. Throughout the manual, we tend to use codenames for the releases, such as **trixie** or **sid**, as that is what is supported by the tools themselves.

[29](#29)

1.3 Authors

[30](#30)

A list of authors (in alphabetical order):

[31](#31)

-   Ben Armstrong

[32](#32)

-   Brendan Sleight

[33](#33)

-   Carlos Zuferri

[34](#34)

-   Chris Lamb

[35](#35)

-   Daniel Baumann

[36](#36)

-   Franklin Piat

[37](#37)

-   Jonas Stein

[38](#38)

-   Kai Hendry

[39](#39)

-   Marco Amadori

[40](#40)

-   Mathieu Geli

[41](#41)

-   Matthias Kirschner

[42](#42)

-   Richard Nelson

[43](#43)

-   Roland Clobus

[44](#44)

-   Trent W. Buck

[45](#45)

1.4 Contributing to this document

[46](#46)

This manual is intended as a community project and all proposals for improvements and contributions are extremely welcome. Please see the section [Contributing to the project](/chapters/contributing-to-project#contributing-to-project) for detailed information on how to fetch the commit key and make good commits.

[47](#47)

1.4.1 Applying changes

[48](#48)

In order to make changes to the English manual you have to edit the right files in manual/en/ but prior to the submission of your contribution, please preview your work. To preview the _live-manual_, ensure the packages needed for building it are installed by executing:

[49](#49)

\# apt-get install make po4a ruby ruby-nokogiri sisu-complete  

[50](#50)

You may build the _live-manual_ from the top level directory of your Git checkout by executing:

[51](#51)

$ make build  

[52](#52)

Since it takes a while to build the manual in all supported languages, authors may find it convenient to use one of the fast proofing shortcuts when reviewing the new documentation they have added to the English manual. Using PROOF=1 builds _live-manual_ in html format, but without the segmented html files, and using PROOF=2 builds _live-manual_ in pdf format, but only the A4 and letter portraits. That is why using either of the PROOF= possibilities can save up a considerable amount of time, e.g:

[53](#53)

$ make build PROOF=1  

[54](#54)

When proofing one of the translations it is possible to build only one language by executing, e.g:

[55](#55)

$ make build LANGUAGES=de  

[56](#56)

It is also possible to build by document type, e.g:

[57](#57)

$ make build FORMATS=pdf  

[58](#58)

Or combine both, e.g:

[59](#59)

$ make build LANGUAGES=de FORMATS=html  

[60](#60)

After revising your work and making sure that everything is fine, do not use make commit unless you are updating translations in the commit, and in that case, do not mix changes to the English manual and translations in the same commit, but use separate commits for each. See the [Translation](/chapters/about-manual#translation) section for more details.

[61](#61)

1.4.2 Translation

[62](#62)

**Note:** For the translation of the man pages see [Translation of man pages](/chapters/contributing-to-project#translation-of-manpages)

[63](#63)

In order to translate _live-manual_, follow these steps depending on whether you are starting a translation from scratch or continue working on an already existing one:

[64](#64)

-   Start a new translation from scratch

[65](#65)

-   Translate the **about\_manual.ssi.pot**, **about\_project.ssi.pot** and **index.html.in.pot** files in manual/pot/ to your language with your favourite editor (such as _poedit_) and send the translated .po files to the mailing list to check their integrity. _live-manual_'s integrity check not only ensures that the .po files are 100% translated but it also detects possible errors.

[66](#66)

-   Once checked, to enable a new language in the autobuild it is enough to add the initial translated files to manual/po/${LANGUAGE}/ and edit manual/\_sisu/home/index.html adding the name of the language and its name in English between brackets. And then, add the folder manual/${LANGUAGE}/ to the file .gitignore. Finally, run make commit.

[67](#67)

-   Continue with an already started translation

[68](#68)

-   If your target language has already been added, you can randomly continue translating the remaining .po files in manual/po/${LANGUAGE}/ using your favourite editor (such as _poedit_) .

[69](#69)

-   Do not forget that you need to run make commit to ensure that the translated manuals are updated from the .po files and then you can review your changes launching make build before git add ., git commit -m "Translating..." and git push. Remember that since make build can take a considerable amount of time, you can proofread languages individually as explained in [Applying changes](/chapters/about-manual#applying-changes)

[70](#70)

After running make commit you will see some text scroll by. These are basically informative messages about the processing status and also some hints about what can be done in order to improve _live-manual_. Unless you see a fatal error, you usually can proceed and submit your contribution.

[71](#71)

_live-manual_ comes with two utilities that can greatly help translators to find untranslated and changed strings. The first one is "make translate". It launches an script that tells you in detail how many untranslated strings there are in each .po file. The second one, the "make fixfuzzy" target, only acts upon changed strings but it helps you to find and fix them one by one.

[72](#72)

Keep in mind that even though these utilities might be really helpful to do translation work on the command line, the use of an specialized tool like _poedit_ is the recommended way to do the task. It is also a good idea to read the Debian localization (l10n) documentation and, specifically to _live-manual_, the [Guidelines for translators](/chapters/style-guide#guidelines-translators).

[73](#73)

**Note:** You can use make clean to clean your git tree before pushing. This step is not compulsory thanks to the .gitignore file but it is a good practice to avoid committing files involuntarily.
