---
title: Customizing Run Time Behaviours
slug: customizing-run-time-behaviours
---
# Customizing run time behaviours

[552](#552)

# 10\. Customizing run time behaviours

[553](#553)

All configuration that is done during run time is done by _live-config_. Here are some of the most common options of _live-config_ that users are interested in. A full list of all possibilities can be found in the man page of _live-config_.

[554](#554)

10.1 Customizing the live user

[555](#555)

One important consideration is that the live user is created by _live-boot_ at boot time, not by _live-build_ at build time. This not only influences where materials relating to the live user are introduced in your build, as discussed in [Live/chroot local includes](/chapters/customizing-contents#live-chroot-local-includes), but also any groups and permissions associated with the live user.

[556](#556)

You can specify additional groups that the live user will belong to by using any of the possibilities to configure _live-config_. For example, to add the live user to the fuse group, you can either add the following file in config/includes.chroot/etc/live/config.conf.d/10-user-setup.conf:

[557](#557)

LIVE\_USER\_DEFAULT\_GROUPS="audio cdrom dip floppy video plugdev netdev powerdev scanner bluetooth fuse"  

[558](#558)

or use live-config.user-default-groups=audio,cdrom,dip,floppy,video,plugdev,netdev,powerdev,scanner,bluetooth,fuse as a boot parameter.

[559](#559)

It is also possible to change the default username "user" and the default password "live". If you want to do that for any reason, you can easily achieve it as follows:

[560](#560)

To change the default username you can simply specify it in your config:

[561](#561)

$ lb config --bootappend-live "boot=live components username=live-user"  

[562](#562)

One possible way of changing the default password is by means of a hook as described in [Boot-time hooks](/chapters/customizing-contents#boot-time-hooks). In order to do that you can use the "passwd" hook from /usr/share/doc/live-config/examples/hooks, prefix it accordingly (e.g. 2000-passwd) and add it to config/includes.chroot/lib/live/config/

[563](#563)

10.2 Customizing locale and language

[564](#564)

When the live system boots, language is involved in two steps:

[565](#565)

-   the locale generation

[566](#566)

-   setting the keyboard configuration

[567](#567)

The default locale when building a Live system is locales=en\_US.UTF-8. To define the locale that should be generated, use the locales parameter in the \--bootappend-live option of lb config, e.g.

[568](#568)

$ lb config --bootappend-live "boot=live components locales=de\_CH.UTF-8"  

[569](#569)

Multiple locales may be specified as a comma-delimited list.

[570](#570)

This parameter, as well as the keyboard configuration parameters indicated below, can also be used at the kernel command line. You can specify a locale by language\_country (in which case the default encoding is used) or the full language\_country.encoding word. A list of supported locales and the encoding for each can be found in /usr/share/i18n/SUPPORTED.

[571](#571)

Both the console and X keyboard configuration are performed by live-config using the console-setup package. To configure them, use the keyboard-layouts, keyboard-variants, keyboard-options and keyboard-model boot parameters via the \--bootappend-live option. Valid options for these can be found in /usr/share/X11/xkb/rules/base.lst. To find layouts and variants for a given language, try searching for the English name of the language and/or the country where the language is spoken, e.g:

[572](#572)

$ egrep -i '(^!|german.\*switzerland)' /usr/share/X11/xkb/rules/base.lst  
! model  
! layout  
   ch              German (Switzerland)  
! variant  
   legacy          ch: German (Switzerland, legacy)  
   de\_nodeadkeys   ch: German (Switzerland, eliminate dead keys)  
   de\_sundeadkeys  ch: German (Switzerland, Sun dead keys)  
   de\_mac          ch: German (Switzerland, Macintosh)  
! option  

[573](#573)

Note that each variant lists the layout to which it applies in the description.

[574](#574)

Often, only the layout needs to be configured. For example, to get the locale files for German and Swiss German keyboard layout in X use:

[575](#575)

$ lb config --bootappend-live "boot=live components locales=de\_CH.UTF-8 keyboard-layouts=ch"  

[576](#576)

However, for very specific use cases, you may wish to include other parameters. For example, to set up a French system with a French-Dvorak layout (called Bepo) on a TypeMatrix EZ-Reach 2030 USB keyboard, use:

[577](#577)

$ lb config --bootappend-live \\  
     "boot=live components locales=fr\_FR.UTF-8 keyboard-layouts=fr keyboard-variants=bepo keyboard-model=tm2030usb"  

[578](#578)

Multiple values may be specified as comma-delimited lists for each of the keyboard-\* options, with the exception of keyboard-model, which accepts only one value. Please see the keyboard(5) man page for details and examples of XKBMODEL, XKBLAYOUT, XKBVARIANT and XKBOPTIONS variables. If multiple keyboard-variants values are given, they will be matched one-to-one with keyboard-layouts values (see setxkbmap(1) \-variant option). Empty values are allowed; e.g. to define two layouts, the default being US QWERTY and the other being US Dvorak, use:

[579](#579)

$ lb config --bootappend-live \\  
     "boot=live components keyboard-layouts=us,us keyboard-variants=,dvorak"  

[580](#580)

10.3 Persistence

[581](#581)

A live cd paradigm is a pre-installed system which runs from read-only media, like a cdrom, where writes and modifications do not survive reboots of the host hardware which runs it.

[582](#582)

A live system is a generalization of this paradigm and thus supports other media in addition to CDs; but still, in its default behaviour, it should be considered read-only and all the run-time evolutions of the system are lost at shutdown.

[583](#583)

'Persistence' is a common name for different kinds of solutions for saving across reboots some, or all, of this run-time evolution of the system. To understand how it works it would be handy to know that even if the system is booted and run from read-only media, modifications to the files and directories are written on writable media, typically a ram disk (tmpfs) and ram disks' data do not survive reboots.

[584](#584)

The data stored on this ramdisk should be saved on a writable persistent medium like local storage media, a network share or even a session of a multisession (re)writable CD/DVD. All these media are supported in live systems in different ways, and all but the last one require a special boot parameter to be specified at boot time: persistence.

[585](#585)

If the boot parameter persistence is set (and nopersistence is not set), local storage media (e.g. hard disks, USB drives) will be probed for persistence volumes during boot. It is possible to restrict which types of persistence volumes to use by specifying certain boot parameters described in the _live-boot_(7) man page. A persistence volume is any of the following:

[586](#586)

-   a partition, identified by its GPT name.

[587](#587)

-   a filesystem, identified by its filesystem label.

[588](#588)

-   an image file located on the root of any readable filesystem (even an NTFS partition of a foreign OS), identified by its filename.

[589](#589)

The volume label for overlays must be persistence but it will be ignored unless it contains in its root a file named persistence.conf which is used to fully customize the volume's persistence, this is to say, specifying the directories that you want to save in your persistence volume after a reboot. See [The persistence.conf file](/chapters/customizing-run-time-behaviours#persistence-conf) for more details.

[590](#590)

Here are some examples of how to prepare a volume to be used for persistence. It can be, for instance, an ext4 partition on a hard disk or on a usb key created with, e.g.:

[591](#591)

\# mkfs.ext4 -L persistence /dev/sdb1  

[592](#592)

See also [Using the space left on a USB stick](/chapters/the-basics#using-usb-extra-space).

[593](#593)

If you already have a partition on your device, you could just change the label with one of the following:

[594](#594)

\# tune2fs -L persistence /dev/sdb1 # for ext2,3,4 filesystems  

[595](#595)

Here's an example of how to create an ext4-based image file to be used for persistence:

[596](#596)

$ dd if=/dev/null of=persistence bs=1 count=0 seek=1G # for a 1GB sized image file  
$ /sbin/mkfs.ext4 -F persistence  

[597](#597)

Once the image file is created, as an example, to make /usr persistent but only saving the changes you make to that directory and not all the contents of /usr, you can use the "union" option. If the image file is located in your home directory, copy it to the root of your hard drive's filesystem and mount it in /mnt as follows:

[598](#598)

\# cp persistence /  
\# mount -t ext4 /persistence /mnt  

[599](#599)

Then, create the persistence.conf file adding content and unmount the image file.

[600](#600)

\# echo "/usr union" >> /mnt/persistence.conf  
\# umount /mnt  

[601](#601)

Now, reboot into your live medium with the boot parameter "persistence".

[602](#602)

10.3.1 The persistence.conf file

[603](#603)

A volume with the label persistence must be configured by means of the persistence.conf file to make arbitrary directories persistent. That file, located on the volume's filesystem root, controls which directories it makes persistent, and in which way.

[604](#604)

How custom overlay mounts are configured is described in full detail in the persistence.conf(5) man page, but a simple example should be sufficient for most uses. Let's say we want to make our home directory and APT cache persistent in an ext4 filesystem on the /dev/sdb1 partition:

[605](#605)

\# mkfs.ext4 -L persistence /dev/sdb1  
\# mount -t ext4 /dev/sdb1 /mnt  
\# echo "/home" >> /mnt/persistence.conf  
\# echo "/var/cache/apt" >> /mnt/persistence.conf  
\# umount /mnt  

[606](#606)

Then we reboot. During the first boot the contents of /home and /var/cache/apt will be copied into the persistence volume, and from then on all changes to these directories will live in the persistence volume. Please note that any paths listed in the persistence.conf file cannot contain white spaces or the special . and .. path components. Also, neither /lib, /lib/live (or any of their sub-directories) nor / can be made persistent using custom mounts. As a workaround for this limitation you can add / union to your persistence.conf file to achieve full persistence.

[607](#607)

10.3.2 Using more than one persistence store

[608](#608)

There are different methods of using multiple persistence store for different use cases. For instance, using several volumes at the same time or selecting only one, among various, for very specific purposes.

[609](#609)

Several different custom overlay volumes (with their own persistence.conf files) can be used at the same time, but if several volumes make the same directory persistent, only one of them will be used. If any two mounts are "nested" (i.e. one is a sub-directory of the other) the parent will be mounted before the child so no mount will be hidden by the other. Nested custom mounts are problematic if they are listed in the same persistence.conf file. See the persistence.conf(5) man page for how to handle that case if you really need it (hint: you usually don't).

[610](#610)

One possible use case: If you wish to store the user data i.e. /home and the superuser data i.e. /root in different partitions, create two partitions with the persistence label and add a persistence.conf file in each one like this, \# echo "/home" > persistence.conf for the first partition that will save the user's files and \# echo "/root" > persistence.conf for the second partition which will store the superuser's files. Finally, use the persistence boot parameter.

[611](#611)

If a user would need multiple persistence store of the same type for different locations or testing, such as private and work, the boot parameter persistence-label used in conjunction with the boot parameter persistence will allow for multiple but unique persistence media. An example would be if a user wanted to use a persistence partition labeled private for personal data like browser bookmarks or other types, they would use the boot parameters: persistence persistence-label=private. And to store work related data, like documents, research projects or other types, they would use the boot parameters: persistence persistence-label=work.

[612](#612)

It is important to remember that each of these volumes, private and work, also needs a persistence.conf file in its root. The _live-boot_ man page contains more information about how to use these labels with legacy names.

[613](#613)

10.3.3 Using persistence with encryption

[614](#614)

Using the persistence feature means that some sensible data might get exposed to risk. Especially if the persistent data is stored on a portable device such as a usb stick or an external hard drive. That is when encryption comes in handy. Even if the entire procedure might seem complicated because of the number of steps to be taken, it is really easy to handle encrypted partitions with _live-boot_. In order to use **luks**, which is the supported encryption type, you need to install _cryptsetup_ both on the machine you are creating the encrypted partition with and also in the live system you are going to use the encrypted persistent partition with.

[615](#615)

To install _cryptsetup_ on your machine:

[616](#616)

\# apt-get install cryptsetup  

[617](#617)

To install _cryptsetup_ in your live system, add it to your package-lists:

[618](#618)

$ lb config  
$ echo "cryptsetup cryptsetup-initramfs" > config/package-lists/encryption.list.chroot  

[619](#619)

Once you have your live system with _cryptsetup_, you basically only need to create a new partition, encrypt it and boot with the persistence and persistence-encryption=luks parameters. We could have already anticipated this step and added the boot parameters following the usual procedure:

[620](#620)

$ lb config --bootappend-live "boot=live components persistence persistence-encryption=luks"  

[621](#621)

Let's go into the details for all of those who are not familiar with encryption. In the following example we are going to use a partition on a usb stick which corresponds to /dev/sdc2. Please be warned that you need to determine which partition is the one you are going to use in your specific case.

[622](#622)

The first step is plugging in your usb stick and determine which device it is. The recommended method of listing devices in _live-manual_ is using ls -l /dev/disk/by-id. After that, create a new partition and then, encrypt it with a passphrase as follows:

[623](#623)

\# cryptsetup --verify-passphrase luksFormat /dev/sdc2  

[624](#624)

Then open the luks partition in the virtual device mapper. Use any name you like. We use **live** here as an example:

[625](#625)

\# cryptsetup luksOpen /dev/sdc2 live  

[626](#626)

The next step is filling the device with zeros before creating the filesystem:

[627](#627)

\# dd if=/dev/zero of=/dev/mapper/live  

[628](#628)

Now, we are ready to create the filesystem. Notice that we are adding the label persistence so that the device is mounted as persistence store at boot time.

[629](#629)

\# mkfs.ext4 -L persistence /dev/mapper/live  

[630](#630)

To continue with our setup, we need to mount the device, for example in /mnt.

[631](#631)

\# mount /dev/mapper/live /mnt  

[632](#632)

And create the persistence.conf file in the root of the partition. This is, as explained before, strictly necessary. See [The persistence.conf file](/chapters/customizing-run-time-behaviours#persistence-conf).

[633](#633)

\# echo "/ union" > /mnt/persistence.conf  

[634](#634)

Then unmount the mount point:

[635](#635)

\# umount /mnt  

[636](#636)

And optionally, although it might be a good way of securing the data we have just added to the partition, we can close the device:

[637](#637)

\# cryptsetup luksClose live  

[638](#638)

Let's summarize the process. So far, we have created an encryption capable live system, which can be copied to a usb stick as explained in [Copying an ISO hybrid image to a USB stick](/chapters/the-basics#copying-iso-hybrid-to-usb). We have also created an encrypted partition, which can be located in the same usb stick to carry it around and we have configured the encrypted partition to be used as persistence store. So now, we only need to boot the live system. At boot time, _live-boot_ will prompt us for the passphrase and will mount the encrypted partition to be used for persistence.
