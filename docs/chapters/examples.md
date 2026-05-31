---
title: examples
slug: examples
---
# Examples

[803](#803)

# 16\. Examples

[804](#804)

This chapter covers example builds for specific use cases with live systems. If you are new to building your own live system images, we recommend you first look at the three tutorials in sequence, as each one teaches new techniques that will help you use and understand the remaining examples.

[805](#805)

16.1 Using the examples

[806](#806)

To use these examples you need a system to build them on that meets the requirements listed in [Requirements](/chapters/installation#requirements) and has _live-build_ installed as described in [Installing live-build](/chapters/installation#installing-live-build).

[807](#807)

Note that, for the sake of brevity, in these examples we do not specify a local mirror to use for the build. You can speed up downloads considerably if you use a local mirror. You may specify the options when you use lb config, as described in [Distribution mirrors used at build time](/chapters/customizing-package-installation#distribution-mirrors-build-time), or for more convenience, set the default for your build system in /etc/live/build.conf. Simply create this file and in it, set the corresponding LB\_MIRROR\_\* variables to your preferred mirror. All other mirrors used in the build will be defaulted from these values. For example:

[808](#808)

LB\_MIRROR\_BOOTSTRAP="http://mirror/debian/"  
LB\_MIRROR\_CHROOT\_SECURITY="http://mirror/debian-security/"  
LB\_MIRROR\_CHROOT\_BACKPORTS="http://mirror/debian-backports/"  

[809](#809)

16.2 Tutorial 1: A default image

[810](#810)

**Use case:** Create a simple first image, learning the basics of _live-build_.

[811](#811)

In this tutorial, we will build a default ISO hybrid live system image containing only base packages (no Xorg) and some live system support packages, as a first exercise in using _live-build_.

[812](#812)

You can't get much simpler than this:

[813](#813)

$ mkdir tutorial1 ; cd tutorial1 ; lb config  

[814](#814)

Examine the contents of the config/ directory if you wish. You will see stored here a skeletal configuration, ready to customize or, in this case, use immediately to build a default image.

[815](#815)

Now, as superuser, build the image, saving a log as you build with tee.

[816](#816)

\# lb build 2>&1 | tee build.log  

[817](#817)

Assuming all goes well, after a while, the current directory will contain live-image-amd64.hybrid.iso. This ISO hybrid image can be booted directly in a virtual machine as described in [Testing an ISO image with Qemu](/chapters/the-basics#testing-iso-with-qemu) and [Testing an ISO image with VirtualBox](/chapters/the-basics#testing-iso-with-virtualbox), or else imaged onto optical media or a USB flash device as described in [Burning an ISO image to a physical medium](/chapters/the-basics#burning-iso-image) and [Copying an ISO hybrid image to a USB stick](/chapters/the-basics#copying-iso-hybrid-to-usb), respectively.

[818](#818)

16.3 Tutorial 2: A web browser utility

[819](#819)

**Use case:** Create a web browser utility image, learning how to apply customizations.

[820](#820)

In this tutorial, we will create an image suitable for use as a web browser utility, serving as an introduction to customizing live system images.

[821](#821)

$ mkdir tutorial2  
$ cd tutorial2  
$ lb config  
$ echo "task-lxde-desktop firefox-esr" >> config/package-lists/my.list.chroot  

[822](#822)

Our choice of LXDE for this example reflects our desire to provide a minimal desktop environment, since the focus of the image is the single use we have in mind, the web browser. We could go even further and provide a default configuration for the web browser in config/includes.chroot/etc/iceweasel/profile/, or additional support packages for viewing various kinds of web content, but we leave this as an exercise for the reader.

[823](#823)

Build the image, again as superuser, keeping a log as in [Tutorial 1](/chapters/examples#tutorial-1):

[824](#824)

\# lb build 2>&1 | tee build.log  

[825](#825)

Again, verify the image is OK and test, as in [Tutorial 1](/chapters/examples#tutorial-1).

[826](#826)

16.4 Tutorial 3: A personalized image

[827](#827)

**Use case:** Create a project to build a personalized image, containing your favourite software to take with you on a USB stick wherever you go, and evolving in successive revisions as your needs and preferences change.

[828](#828)

Since we will be changing our personalized image over a number of revisions, and we want to track those changes, trying things experimentally and possibly reverting them if things don't work out, we will keep our configuration in the popular git version control system. We will also use the best practice of autoconfiguration via auto scripts as described in [Managing a configuration](/chapters/managing-a-configuration#managing-a-configuration).

[829](#829)

16.4.1 First revision

[830](#830)

$ mkdir -p tutorial3/auto  
$ cp /usr/share/doc/live-build/examples/auto/\* tutorial3/auto/  
$ cd tutorial3  

[831](#831)

Edit auto/config to read as follows:

[832](#832)

#!/bin/sh  
  
lb config noauto \\  
     --distribution stable \\  
     "${@}"  

[833](#833)

Perform lb config to generate the config tree, using the auto/config script you just created:

[834](#834)

$ lb config  

[835](#835)

Now populate your local package list:

[836](#836)

$ echo "task-lxde-desktop spice-vdagent hexchat" >> config/package-lists/my.list.chroot  

[837](#837)

First, \--distribution stable ensures that ⌠stable} is used instead of the default {testing⌡. Second, we have added _spice-vdagent_ for easier testing the image in _qemu_. And finally, we have added an initial favourite package: _hexchat_.

[838](#838)

Now, build the image:

[839](#839)

\# lb build  

[840](#840)

Note that unlike in the first two tutorials, we no longer have to type 2>&1 | tee build.log as that is now included in auto/build.

[841](#841)

Once you've tested the image (as in [Tutorial 1](/chapters/examples#tutorial-1)) and are satisfied it works, it's time to initialize our git repository, adding only the auto scripts we just created, and then make the first commit:

[842](#842)

$ git init  
$ cp /usr/share/doc/live-build/examples/gitignore .gitignore  
$ git add .gitignore auto config  
$ git commit -m "Initial import."  

[843](#843)

16.4.2 Second revision

[844](#844)

In this revision, we're going to clean up from the first build, replace the _smplayer_ package with _vlc_ package, rebuild, test and commit.

[845](#845)

The lb clean command will clean up all generated files from the previous build except for the cache, which saves having to re-download packages. This ensures that the subsequent lb build will re-run all stages to regenerate the files from our new configuration.

[846](#846)

\# lb clean  

[847](#847)

Now install the _vlc_ package before the _lxde_ package chooses between _smplayer_, _vlc_ and _mplayer-gui_ in our local package list in config/package-lists/my.list.chroot:

[848](#848)

$ echo "vlc task-lxde-desktop spice-vdagent hexchat" >> config/package-lists/my.list.chroot  

[849](#849)

Build again:

[850](#850)

\# lb build  

[851](#851)

Test, and when you're satisfied, commit the next revision:

[852](#852)

$ git commit -a -m "Replacing smplayer with vlc."  

[853](#853)

Of course, more complicated changes to the configuration are possible, perhaps adding files in subdirectories of config/. When you commit new revisions, just take care not to hand edit or commit the top-level files in config containing LB\_\* variables, as these are build products, too, and are always cleaned up by lb clean and re-created with lb config via their respective auto scripts.

[854](#854)

We've come to the end of our tutorial series. While many more kinds of customization are possible, even just using the few features explored in these simple examples, an almost infinite variety of different images can be created. The remaining examples in this section cover several other use cases drawn from the collected experiences of users of live systems.

[855](#855)

16.5 A VNC Kiosk Client

[856](#856)

**Use case:** Create an image with _live-build_ to boot directly to a VNC server.

[857](#857)

Make a build directory and create an skeletal configuration inside it, disabling recommends to make a minimal system. And then create two initial package lists: the first one generated with a script provided by _live-build_ named Packages (see [Generated package lists](/chapters/customizing-package-installation#generated-package-lists)), and the second one including _xorg_, _gdm3_, _metacity_ and _xvnc4viewer_.

[858](#858)

$ mkdir vnc-kiosk-client  
$ cd vnc-kiosk-client  
$ lb config --apt-recommends false  
$ echo '! Packages Priority standard' > config/package-lists/standard.list.chroot  
$ echo "xorg gdm3 metacity xtightvncviewer" > config/package-lists/my.list.chroot  

[859](#859)

As explained in [Tweaking APT to save space](/chapters/customizing-package-installation#tweaking-apt-to-save-space) you may need to re-add some recommended packages to make your image work properly.

[860](#860)

An easy way to list recommends is using _apt-cache_. For example:

[861](#861)

$ apt-cache depends live-config live-boot  

[862](#862)

In this example we found out that we had to re-include several packages recommended by _live-config_ and _live-boot_: user-setup to make autologin work and sudo as an essential program to shutdown the system. Besides, it could be handy to add live-tools to be able to copy the image to RAM and eject to eventually eject the live medium. So:

[863](#863)

$ echo "live-tools user-setup sudo eject" > config/package-lists/recommends.list.chroot  

[864](#864)

After that, create the directory /etc/skel in config/includes.chroot and put a custom .xsession in it for the default user that will launch _metacity_ and start _xvncviewer_, connecting to port 5901 on a server at 192.168.1.2:

[865](#865)

$ mkdir -p config/includes.chroot/etc/skel  
$ cat > config/includes.chroot/etc/skel/.xsession << EOF  
#!/bin/sh  
  
/usr/bin/metacity &  
/usr/bin/xvncviewer 192.168.1.2:1  
  
exit  
EOF  

[866](#866)

Build the image:

[867](#867)

\# lb build  

[868](#868)

Enjoy.

[869](#869)

16.6 A minimal image for a 512MB USB key

[870](#870)

**Use case:** Create a default image with some components removed in order to fit on a 512MB USB key with a little space left over to use as you see fit.

[871](#871)

When optimizing an image to fit a certain media size, you need to understand the tradeoffs you are making between size and functionality. In this example, we trim only so much as to make room for additional material within a 512MB media size, but without doing anything to destroy the integrity of the packages contained within, such as the purging of locale data via the _localepurge_ package, or other such "intrusive" optimizations. Of particular note, we use \--debootstrap-options to create a minimal system from scratch and \--binary image hdd to create an image that can be copied to a USB key.

[872](#872)

$ lb config --binary-image hdd --apt-indices false --apt-recommends false --debootstrap-options "--variant=minbase" --firmware-chroot false --memtest none  

[873](#873)

To make the image work properly, we must re-add, at least, two recommended packages which are left out by the \--apt-recommends false option. See [Tweaking APT to save space](/chapters/customizing-package-installation#tweaking-apt-to-save-space)

[874](#874)

$ echo "user-setup sudo" > config/package-lists/recommends.list.chroot  

[875](#875)

Additionally, you'll want to have network access, so another two recommended packages need to be re-added:

[876](#876)

$ echo "ifupdown isc-dhcp-client" >> config/package-lists/recommends.list.chroot  

[877](#877)

Now, build the image in the usual way:

[878](#878)

\# lb build 2>&1 | tee build.log  

[879](#879)

On the author's system at the time of writing this, the above configuration produced a 298MiB image. This compares favourably with the 380MiB image produced by the default configuration in [Tutorial 1](/chapters/examples#tutorial-1), when \--binary-image hdd is added.

[880](#880)

Leaving off APT's indices with \--apt-indices false saves a fair amount of space, the tradeoff being that you need to do an apt-get update before using _apt_ in the live system. Dropping recommended packages with \--apt-recommends false saves some additional space, at the expense of omitting some packages you might otherwise expect to be there. \--debootstrap-options "--variant=minbase" bootstraps a minimal system from the start. Not automatically including firmware packages with \--firmware-chroot false saves some space too. And finally, \--memtest none prevents the installation of a memory tester.

[881](#881)

**Note:** A minimal system can also be achieved using hooks, like for example the stripped.hook.chroot hook found in /usr/share/doc/live-build/examples/hooks. It may shave off additional small amounts of space and produce an image of 277MiB. However, it does so by removal of documentation and other files from packages installed on the system. This violates the integrity of those packages and that, as the comment header warns, may have unforeseen consequences. That is why using a minimal _debootstrap_ is the recommended way of achieving this goal.

[882](#882)

16.7 A localized GNOME desktop and installer

[883](#883)

**Use case:** Create a GNOME desktop image, localized for Switzerland and including an installer.

[884](#884)

We want to make an iso-hybrid image using our preferred desktop, in this case GNOME, containing all of the same packages that would be installed by the standard Debian installer for GNOME.

[885](#885)

Our initial problem is the discovery of the names of the appropriate language tasks. Currently, _live-build_ cannot help with this. While we might get lucky and find this by trial-and-error, there is a tool, grep-dctrl, which can be used to dig it out of the task descriptions in tasksel-data, so to prepare, make sure you have both of those things:

[886](#886)

\# apt-get install dctrl-tools tasksel-data  

[887](#887)

Now we can search for the appropriate tasks, first with:

[888](#888)

$ grep-dctrl -FTest-lang de /usr/share/tasksel/descs/debian-tasks.desc -sTask  
Task: german  

[889](#889)

By this command, we discover the task is called, plainly enough, german. Now to find the related tasks:

[890](#890)

$ grep-dctrl -FEnhances german /usr/share/tasksel/descs/debian-tasks.desc -sTask  
Task: german-desktop  
Task: german-kde-desktop  

[891](#891)

At boot time we will generate the **de\_CH.UTF-8** locale and select the **ch** keyboard layout. Now let's put the pieces together. Recalling from [Using metapackages](/chapters/customizing-package-installation#using-metapackages) that task metapackages are prefixed task-, we just specify these language boot parameters, then add standard priority packages and all our discovered task metapackages to our package list as follows:

[892](#892)

$ mkdir live-gnome-ch  
$ cd live-gnome-ch  
$ lb config \\  
     --bootappend-live "boot=live components locales=de\_CH.UTF-8 keyboard-layouts=ch" \\  
     --debian-installer live  
$ echo '! Packages Priority standard' > config/package-lists/standard.list.chroot  
$ echo task-gnome-desktop task-german task-german-desktop >> config/package-lists/desktop.list.chroot  
$ echo debian-installer-launcher >> config/package-lists/installer.list.chroot  

[893](#893)

Note that we have included the _debian-installer-launcher_ package to launch the installer from the live desktop.
