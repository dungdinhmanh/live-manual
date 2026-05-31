---
title: Customizing Contents
slug: customizing-contents
---
# Customizing contents

[521](#521)

# 9\. Customizing contents

[522](#522)

This chapter discusses fine-tuning customization of the live system contents beyond merely choosing which packages to include. Includes allow you to add or replace arbitrary files in your live system image, hooks allow you to execute arbitrary commands at different stages of the build and at boot time, and preseeding allows you to configure packages when they are installed by supplying answers to debconf questions.

[523](#523)

9.1 Includes

[524](#524)

While ideally a live system would include files entirely provided by unmodified packages, it is sometimes convenient to provide or modify some content by means of files. Using includes, it is possible to add (or replace) arbitrary files in your live system image. _live-build_ provides two mechanisms for using them:

[525](#525)

-   Chroot local includes: These allow you to add or replace files to the chroot/Live filesystem. Please see [Live/chroot local includes](/chapters/customizing-contents#live-chroot-local-includes) for more information.

[526](#526)

-   Binary local includes: These allow you to add or replace files in the binary image. Please see [Binary local includes](/chapters/customizing-contents#binary-local-includes) for more information.

[527](#527)

Please see [Terms](/chapters/about-manual#terms) for more information about the distinction between the "Live" and "binary" images.

[528](#528)

9.1.1 Live/chroot local includes

[529](#529)

Chroot local includes can be used to add or replace files in the chroot/Live filesystem so that they may be used in the Live system. A typical use is to populate the skeleton user directory (/etc/skel) used by the Live system to create the live user's home directory. Another is to supply configuration files that can be simply added or replaced in the image without processing; see [Chroot local hooks](/chapters/customizing-contents#chroot-local-hooks) if processing is needed.

[530](#530)

To include files, simply add them to your config/includes.chroot directory. This directory corresponds to the root directory / of the live system. For example, to add a file /var/www/index.html in the live system, use:

[531](#531)

$ mkdir -p config/includes.chroot/var/www  
$ cp /path/to/my/index.html config/includes.chroot/var/www  

[532](#532)

Your configuration will then have the following layout:

[533](#533)

\-- config  
    \[...\]  
     |-- includes.chroot  
     |   \`-- var  
     |       \`-- www  
     |           \`-- index.html  
    \[...\]  

[534](#534)

Chroot local includes are installed after package installation so that files installed by packages are overwritten.

[535](#535)

9.1.2 Binary local includes

[536](#536)

To include material such as documentation or videos on the medium filesystem so that it is accessible immediately upon insertion of the medium without booting the Live system, you can use binary local includes. This works in a similar fashion to chroot local includes. For example, suppose the files ~/video\_demo.\* are demo videos of the live system described by and linked to by an HTML index page. Simply copy the material to config/includes.binary/ as follows:

[537](#537)

$ cp ~/video\_demo.\* config/includes.binary/  

[538](#538)

These files will now appear in the root directory of the live medium.

[539](#539)

9.2 Hooks

[540](#540)

Hooks allow commands to be run in the chroot and binary stages of the build in order to customize the image. Depending on whether you are building a live image or a regular system image you have to place your hooks in config/hooks/live or config/hooks/normal respectively. These are frequently referred to as local hooks because they are executed inside the build environment.

[541](#541)

There are also boot-time hooks that allow you to run commands once the image has already been built, during the boot process.

[542](#542)

9.2.1 Chroot local hooks

[543](#543)

To run commands in the chroot stage, create a hook script with a .hook.chroot suffix containing the commands either in the config/hooks/live or config/hooks/normal directories. The hook will run in the chroot after the rest of your chroot configuration has been applied, so remember to ensure your configuration includes all packages and files your hook needs in order to run. See the example chroot hook scripts for various common chroot customization tasks provided in /usr/share/doc/live-build/examples/hooks which you can copy or symlink to use them in your own configuration.

[544](#544)

9.2.2 Binary local hooks

[545](#545)

To run commands in the binary stage, create a hook script with a .hook.binary suffix containing the commands either in the config/hooks/live or config/hooks/normal directories. The hook will run after all other binary commands are run, but before binary\_checksums, the very last binary command. The commands in your hook do not run in the chroot, so take care not to modify any files outside of the build tree, or you may damage your build system! See the example binary hook scripts for various common binary customization tasks provided in /usr/share/doc/live-build/examples/hooks which you can copy or symlink to use them in your own configuration.

[546](#546)

9.2.3 Boot-time hooks

[547](#547)

To execute commands at boot time, you can supply _live-config_ hooks as explained in the "Customization" section of its man page. Examine _live-config_'s own hooks provided in /lib/live/config/, noting the sequence numbers. Then provide your own hook prefixed with an appropriate sequence number, either as a chroot local include in config/includes.chroot/lib/live/config/, or as a custom package as discussed in [Installing modified or third-party packages](/chapters/customizing-package-installation#installing-modified-or-third-party-packages).

[548](#548)

9.3 Preseeding Debconf questions

[549](#549)

Files in the config/preseed/ directory suffixed with .cfg followed by the stage (.chroot or .binary) are considered to be debconf preseed files and are installed by _live-build_ using debconf-set-selections during the corresponding stage.

[550](#550)

For more information about debconf, please see debconf(7) in the _debconf_ package.
