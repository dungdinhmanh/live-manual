---
title: bugs
slug: bugs
---
# Reporting bugs

[694](#694)

# 14\. Reporting bugs

[695](#695)

Live systems are far from being perfect, but we want to make it as close as possible to perfect - with your help. Do not hesitate to report a bug. It is better to fill a report twice than never. However, this chapter includes recommendations on how to file good bug reports.

[696](#696)

For the impatient:

[697](#697)

-   First check whether the bugs has been reported already. You can see the full list of bugs that are assigned to the live-team at ‹[https://bugs.debian.org/cgi-bin/pkgreport.cgi?maint=debian-live%40lists.debian.org](https://bugs.debian.org/cgi-bin/pkgreport.cgi?maint=debian-live%40lists.debian.org)›.

[698](#698)

-   Before submitting a bug report always try to reproduce the bug with the **most recent versions** of the packages of _live-build_, _live-boot_, _live-config_ and _live-tools_ that you're using.

[699](#699)

-   Try to give **as specific information as possible** about the bug. This includes (at least) the version of _live-build_, _live-boot_, _live-config_, and _live-tools_ used and the distribution of the live system you are building.

[700](#700)

14.1 Known issues

[701](#701)

Currently known issues are listed in the BTS at ‹[https://bugs.debian.org/cgi-bin/pkgreport.cgi?maint=debian-live%40lists.debian.org](https://bugs.debian.org/cgi-bin/pkgreport.cgi?maint=debian-live%40lists.debian.org)›.

[702](#702)

Note: Since Debian **testing** and Debian **unstable** distributions are moving targets, when you specify either of them as the target system distribution, a successful build may not always be possible.

[703](#703)

If this causes too much difficulty for you, do not build a system based on **testing** or **unstable**, but rather, use **stable**. _live-build_ always defaults to the **stable** release.

[704](#704)

It is out of the scope of this manual to train you to correctly identify and fix problems in packages of the development distributions, however, you can always try the following: If a build fails when the target distribution is **testing**, try **unstable**. If **unstable** does work, revert to **testing** and pin the newer version of the failing package from **unstable** (see [APT pinning](/chapters/customizing-package-installation#apt-pinning) for details).

[705](#705)

14.2 Do the research

[706](#706)

Before filing the bug, please search the web for the particular error message or symptom you are getting. As it is highly unlikely that you are the only person experiencing a particular problem. There is always a chance that it has been discussed elsewhere and a possible solution, patch, or workaround has been proposed.

[707](#707)

You should pay particular attention to the live systems mailing list, as well as the homepage, as these are likely to contain the most up-to-date information. If such information exists, always include the references to it in your bug report.

[708](#708)

In addition, you should check the current bug lists for _live-build_, _live-boot_, _live-config_ and _live-tools_ to see whether something similar has already been reported.

[709](#709)

14.3 Rebuild from scratch

[710](#710)

To ensure that a particular bug is not caused by an uncleanly built system, please always rebuild the whole live system from scratch to see if the bug is reproducible.

[711](#711)

14.4 Use up-to-date packages

[712](#712)

Using outdated packages can cause significant problems when trying to reproduce (and ultimately fix) your problem. Make sure your build system is up-to-date and any packages included in your image are up-to-date as well. If possible, try to reproduce the bug with the newest code from source, see [Installation](/chapters/installation#installation) for details.

[713](#713)

14.5 Collect information

[714](#714)

Please provide enough information with your report. Include, at least, the exact version of _live-build_ where the bug is encountered and the steps to reproduce it. Please use your common sense and provide any other relevant information if you think that it might help in solving the problem.

[715](#715)

To make the most out of your bug report, we require at least the following information:

[716](#716)

-   Architecture of the host system

[717](#717)

-   Distribution of the host system

[718](#718)

-   Version of _live-build_ on the host system

[719](#719)

-   Version of _debootstrap_ on the host system

[720](#720)

-   Architecture of the live system

[721](#721)

-   Distribution of the live system

[722](#722)

-   Version of _live-boot_ on the live system

[723](#723)

-   Version of _live-config_ on the live system

[724](#724)

-   Version of _live-tools_ on the live system

[725](#725)

You can generate a log of the build process by using the tee command. We recommend doing this automatically with an auto/build script (see [Managing a configuration](/chapters/managing-a-configuration#managing-a-configuration) for details).

[726](#726)

\# lb build 2>&1 | tee build.log  

[727](#727)

At boot time, _live-boot_ and _live-config_ store their logfiles in /var/log/live/. Check them for error messages.

[728](#728)

Additionally, to rule out other errors, it is always a good idea to tar up your config/ directory and upload it somewhere (do **not** send it as an attachment to the mailing list), so that we can try to reproduce the errors you encountered. If this is difficult (e.g. due to size) you can use the output of lb config --dump which produces a summary of your config tree (i.e. lists files in subdirectories of config/ but does not include them).

[729](#729)

Remember to send in any logs that were produced with English locale settings, e.g. run your _live-build_ commands with a leading LC\_ALL=C or LC\_ALL=en\_US.

[730](#730)

14.6 Isolate the failing case if possible

[731](#731)

If possible, isolate the failing case to the smallest possible change that breaks. It is not always easy to do this so if you cannot manage it for your report, do not worry. However, if you plan your development cycle well, using small enough change sets per iteration, you may be able to isolate the problem by constructing a simpler 'base' configuration that closely matches your actual configuration plus just the broken change set added to it. If you have a hard time sorting out which of your changes broke, it may be that you are including too much in each change set and should develop in smaller increments.

[732](#732)

14.7 Use the correct package to report the bug against

[733](#733)

In general, you should report build time errors against the _live-build_ package, boot time errors against _live-boot_, and run time errors against _live-config_. If you are unsure of which package is appropriate or need more help before submitting a bug report, please report it against the debian-live pseudo-package. We will then take care about it and reassign it where appropriate.

[734](#734)

However, we would appreciate it if you try to narrow it down according to where the bug appears.

[735](#735)

14.7.1 At build time while bootstrapping

[736](#736)

_live-build_ first bootstraps a basic Debian system with _debootstrap_. If a bug appears here, check if the error is related to a specific Debian package (most likely), or if it is related to the bootstrapping tool itself.

[737](#737)

In both cases, this is not a bug in the live system, but rather in Debian itself and probably we cannot fix it directly. Please report such a bug against the bootstrapping tool or the failing package.

[738](#738)

14.7.2 At build time while installing packages

[739](#739)

_live-build_ installs additional packages from the Debian archive and depending on the Debian distribution used and the daily archive state, it can fail. If a bug appears here, check if the error is also reproducible on a normal system.

[740](#740)

If this is the case, this is not a bug in the live system, but rather in Debian - please report it against the failing package. Running _debootstrap_ separately from the Live system build or running lb bootstrap --debug will give you more information.

[741](#741)

Also, if you are using a local mirror and/or any sort of proxy and you are experiencing a problem, please always reproduce it first by bootstrapping from an official mirror.

[742](#742)

14.7.3 At boot time

[743](#743)

If your image does not boot, please report it to the mailing list together with the information requested in [Collect information](/chapters/bugs#collect-information). Do not forget to mention, how/when the image failed exactly, whether using virtualization or real hardware. If you are using a virtualization technology of any kind, please always run it on real hardware before reporting a bug. Providing a screenshot of the failure is also very helpful.

[744](#744)

14.7.4 At run time

[745](#745)

If a package was successfully installed, but fails while actually running the Live system, this is probably a bug in _live-config_.

[746](#746)

14.8 Where to report bugs

[747](#747)

The Debian Live Project keeps track of all bugs in the Bug Tracking System (BTS). For information on how to use the system, please see ‹[https://bugs.debian.org/](https://bugs.debian.org/)›. You can also submit the bugs by using the reportbug command from the package with the same name.

[748](#748)

Please note that bugs found in distributions derived from Debian (such as Ubuntu and others) should **not** be reported to the Debian BTS unless they can be also reproduced on a Debian system using official Debian packages.
