---
title: The basics
slug: the-basics
---

# The basics

[[toc]]

This chapter contains a brief overview of the build process and instructions for using the three most commonly used image types. The most versatile image type, iso-hybrid, may be used on a virtual machine, optical medium or USB portable storage device. In certain special cases, as explained later, the hdd type may be more suitable. The chapter includes detailed instructions for building and using a netboot type image, which is a bit more involved due to the setup required on the server. This is an slightly advanced topic for anyone who is not already familiar with netbooting, but it is included here because once the setup is done, it is a very convenient way to test and deploy images for booting on the local network without the hassle of dealing with image media.

The section finishes with a quick introduction to [webbooting](/chapters/the-basics#webbooting) which is, perhaps, the easiest way of using different images for different purposes, switching from one to the other as needed using the internet as a means.

Throughout the chapter, we will often refer to the default filenames produced by _live-build_. If you are [downloading a prebuilt image](/chapters/the-basics#downloading-prebuilt-images) instead, the actual filenames may vary.

## 4.1 What is a live system?

A live system usually means an operating system booted on a computer from a removable medium, such as a CD-ROM or USB stick, or from a network, ready to use without any installation on the usual drive(s), with auto-configuration done at run time (see [Terms](/chapters/about-manual#terms)).

With live systems, it's an operating system, built for one of the supported architectures (currently amd64 and arm64). It is made from the following parts:

-   **Linux kernel image**, usually named vmlinuz*

-   **Initial RAM disk image (initrd)**: a RAM disk set up for the Linux boot, containing modules possibly needed to mount the System image and some scripts to do it.

-   **System image**: The operating system's filesystem image. Usually, a SquashFS compressed filesystem is used to minimize the live system image size. Note that it is read-only. So, during boot the live system will use a RAM disk and 'union' mechanism to enable writing files within the running system. However, all modifications will be lost upon shutdown unless optional persistence is used (see [Persistence](/chapters/customizing-run-time-behaviours#persistence)).

-   **Bootloader**: A small piece of code crafted to boot from the chosen medium, possibly presenting a prompt or menu to allow selection of options/configuration. It loads the Linux kernel and its initrd to run with an associated system filesystem. Different solutions can be used, depending on the target medium and format of the filesystem containing the previously mentioned components: isolinux to boot from a CD or DVD in ISO9660 format, syslinux for HDD or USB drive booting from a VFAT partition, extlinux for ext2/3/4 and btrfs partitions, pxelinux for PXE netboot, GRUB for ext2/3/4 partitions, etc.

You can use _live-build_ to build the system image from your specifications, set up a Linux kernel, its initrd, and a bootloader to run them, all in one medium-dependent format (ISO9660 image, disk image, etc.).

## 4.2 Downloading prebuilt images

You can download one of the prebuilt images from ‹[https://www.debian.org/CD/live/](https://www.debian.org/CD/live/)›. For many of the popular desktop environments (GNOME, Xfce, KDE, etc.) a specific live image is prepared.

If you are unsure which file to download, use the 'Live GNOME' image from the 'stable' release. You can then skip reading the next sections and run the image in a [virtual machine](/chapters/the-basics#using-virtual-machine).

## 4.3 First steps: building an ISO hybrid image

Regardless of the image type, you will need to perform the same basic steps to build an image each time. As a first example, create a build directory, change to that directory and then execute the following sequence of _live-build_ commands to create a basic ISO hybrid image containing a default live system without X.org. It is suitable for burning to CD or DVD media, and also to copy onto a USB stick.

The name of the working directory is absolutely up to you, but if you take a look at the examples used throughout _live-manual_, it is a good idea to use a name that helps you identify the image you are working with in each directory, especially if you are working or experimenting with different image types. In this case you are going to build a default system so let's call it, for example, live-default.

```shell
$ mkdir live-default && cd live-default
```

Then, run the lb config command. This will create a "config/" hierarchy in the current directory for use by other commands:

```shell
$ lb config
```

No parameters are passed to these commands, so defaults for all of their various options will be used. See [The lb config command](/chapters/overview-of-tools#lb-config) for more details.

Now that the "config/" hierarchy exists, build the image with the lb build command:

```shell
# lb build
```

This process can take a while, depending on the speed of your computer and your network connection. When it is complete, there should be a live-image-amd64.hybrid.iso image file, ready to use, in the current directory.

::: tip Note
If you are building on an amd64 system the name of the resulting image will be live-image-amd64.hybrid.iso. Keep in mind this naming convention throughout the manual.
:::

## 4.4 Using an ISO hybrid live image

After either building or downloading an ISO hybrid image the usual next step is to prepare your medium for booting, either CD-R(W) or DVD-R(W) optical media or a USB stick.

### 4.4.1 Burning an ISO image to a physical medium

Burning an ISO image is easy. Just install _xorriso_ and use it from the command-line to burn the image. For instance:

```shell
# apt-get install xorriso
$ xorriso -as cdrecord -v dev=/dev/sr0 blank=as_needed live-image-amd64.hybrid.iso
```

### 4.4.2 Copying an ISO hybrid image to a USB stick

ISO images prepared with xorriso, can be simply copied to a USB stick with the cp program or an equivalent. Plug in a USB stick with a size large enough for your image file and determine which device it is, which we hereafter refer to as ${USBSTICK}. This is the device file of your key, such as /dev/sdb, not a partition, such as /dev/sdb1! You can find the right device name by looking in dmesg's output after plugging in the stick, or better yet, ls -l /dev/disk/by-id.

Once you are certain you have the correct device name, use the cp command to copy the image to the stick. **This will definitely overwrite any previous contents on your stick!**

```shell
$ cp live-image-amd64.hybrid.iso ${USBSTICK}
$ sync
```

::: tip Note
The _sync_ command is useful to ensure that all the data, which is stored in memory by the kernel while copying the image, is written to the USB stick.
:::

### 4.4.3 Using the space left on a USB stick

After copying the live-image-amd64.hybrid.iso to a USB stick, the first partition on the device will be filled up by the live system. To use the remaining free space, use a partitioning tool such as _gparted_ or _parted_ to create a new partition on the stick.

```shell
# gparted ${USBSTICK}
```

After the partition is created, where ${PARTITION} is the name of the partition, such as /dev/sdb2, you have to create a filesystem on it. One possible choice would be ext4.

```shell
# mkfs.ext4 ${PARTITION}
```

::: tip Note
If you want to use the extra space with Windows, apparently that OS cannot normally access any partitions but the first. Some solutions to this problem have been discussed on our [mailing list](/chapters/about-project#contact), but it seems there are no easy answers.
:::

**Remember: Every time you install a new live-image-amd64.hybrid.iso on the stick, all data on the stick will be lost because the partition table is overwritten by the contents of the image, so back up your extra partition first to restore again after updating the live image.**

### 4.4.4 Booting the live medium

The first time you boot your live medium, whether CD, DVD, USB key, or PXE boot, some setup in your computer's BIOS may be needed first. Since BIOSes vary greatly in features and key bindings, we cannot get into the topic in depth here. Some BIOSes provide a key to bring up a menu of boot devices at boot time, which is the easiest way if it is available on your system. Otherwise, you need to enter the BIOS configuration menu and change the boot order to place the boot device for the live system before your normal boot device.

Once you've booted the medium, you are presented with a boot menu. If you just press enter here, the system will boot using the default entry, Live and default options. For more information about boot options, see the "help" entry in the menu and also the _live-boot_ and _live-config_ man pages found within the live system.

Assuming you've selected Live and booted a default desktop live image, after the boot messages scroll by, you should be automatically logged into the user account and see a desktop, ready to use. If you have booted a console-only image, you should be automatically logged in on the console to the user account and see a shell prompt, ready to use.

## 4.5 Using a virtual machine for testing

It can be a great time-saver for the development of live images to run them in a virtual machine (VM). This is not without its caveats:

-   Running a VM requires enough RAM for both the guest OS and the host and a CPU with hardware support for virtualization is recommended.

-   There are some inherent limitations to running on a VM, e.g. poor video performance, limited choice of emulated hardware.

-   When developing for specific hardware, there is no substitute for running on the hardware itself.

-   Occasionally there are bugs that relate only to running in a VM. When in doubt, test your image directly on the hardware.

Provided you can work within these constraints, survey the available VM software and choose one that is suitable for your needs.

### 4.5.1 Testing an ISO image with QEMU

The most versatile VM in Debian is QEMU. If your processor has hardware support for virtualization, use the _qemu-kvm_ package; the _qemu-kvm_ package description briefly lists the requirements.

First, install _qemu-kvm_ if your processor supports it. If not, install _qemu_, in which case the program name is qemu instead of kvm in the following examples. The _qemu-utils_ package is also valuable for creating virtual disk images with qemu-img.

```shell
# apt-get install qemu-kvm qemu-utils
```

Booting an ISO image is simple:

```shell
$ kvm -cdrom live-image-amd64.hybrid.iso -m 4G
```

See the man pages for more details.

::: tip Note
For live systems containing a desktop environment that you want to test with _qemu_, you may wish to include the _spice-vdagent_ package in your _live-build_ configuration. This will automatically adjust the resolution and enable the clipboard between the virtual machine and the host.
:::

```shell
$ echo "spice-vdagent" >> config/package-lists/spice.list.chroot
```

### 4.5.2 Testing an ISO image with VirtualBox

In order to test the ISO with _virtualbox_:

```shell
# apt-get install virtualbox virtualbox-qt virtualbox-dkms
$ virtualbox
```

Create a new virtual machine, change the storage settings to use live-image-amd64.hybrid.iso as the CD/DVD device, and start the machine.

::: tip Note
For live systems containing X.org that you want to test with _virtualbox_, you may wish to include the VirtualBox X.org driver package, _virtualbox-guest-dkms_ and _virtualbox-guest-x11_, in your _live-build_ configuration. Otherwise, the resolution is limited to 800x600.
:::

```shell
$ echo "virtualbox-guest-dkms virtualbox-guest-x11" >> config/package-lists/my.list.chroot
```

In order to make the dkms package work, also the kernel headers for the kernel flavour used in your image need to be installed. Instead of manually listing the correct _linux-headers_ package in above created package list, the selection of the right package can be done automatically by _live-build_.

```shell
$ lb config --linux-packages "linux-image linux-headers"
```

## 4.6 Building and using an HDD image

Building an HDD image is similar to an ISO hybrid one in all respects except you specify -b hdd and the resulting filename is live-image-amd64.img which cannot be burnt to optical media. It is suitable for booting from USB sticks, USB hard drives, and various other portable storage devices. Normally, an ISO hybrid image can be used for this purpose instead, but if you have a BIOS which does not handle hybrid images properly, you need an HDD image.

::: tip Note
if you created an ISO hybrid image with the previous example, you will need to clean up your working directory with the lb clean command (see [The lb clean command](/chapters/overview-of-tools#lb-clean)):
:::

```shell
# lb clean --binary
```

Run the lb config command as before, except this time specifying the HDD image type:

```shell
$ lb config -b hdd
```

Now build the image with the lb build command:

```shell
# lb build
```

When the build finishes, a live-image-amd64.img file should be present in the current directory.

The generated binary image contains a VFAT partition and the syslinux bootloader, ready to be directly written on a USB device. Once again, using an HDD image is just like using an ISO hybrid one on USB. Follow the instructions in [Using an ISO hybrid live image](/chapters/the-basics#using-iso-hybrid), except use the filename live-image-amd64.img instead of live-image-amd64.hybrid.iso.

Likewise, to test an HDD image with Qemu, install _qemu_ as described above in [Testing an ISO image with QEMU](/chapters/the-basics#testing-iso-with-qemu). Then run kvm or qemu, depending on which version your host system needs, specifying live-image-amd64.img as the first hard drive.

```shell
$ kvm -hda live-image-amd64.img
```

## 4.7 Building a netboot image

The following sequence of commands will create a basic netboot image containing a default live system without X.org. It is suitable for booting over the network.

::: tip Note
if you performed any previous examples, you will need to clean up your working directory with the lb clean command:
:::

```shell
# lb clean
```

In this specific case, a lb clean --binary would not be enough to clean up the necessary stages. The cause for this is that in netboot setups, a different initramfs configuration needs to be used which _live-build_ performs automatically when building netboot images. Since the initramfs creation belongs to the chroot stage, switching to netboot in an existing build directory means to rebuild the chroot stage too. Therefore, lb clean (which will remove the chroot stage, too) needs to be used.

Run the lb config command as follows to configure your image for netbooting:

```shell
$ lb config -b netboot --net-root-path "/srv/debian-live" --net-root-server "192.168.0.2"
```

In contrast with the ISO and HDD images, netbooting does not, itself, serve the filesystem image to the client, so the files must be served via NFS. Different network filesystems can be chosen through lb config. The --net-root-path and --net-root-server options specify the location and server, respectively, of the NFS server where the filesystem image will be located at boot time. Make sure these are set to suitable values for your network and server.

Now build the image with the lb build command:

```shell
# lb build
```

In a network boot, the client runs a small piece of software which usually resides on the EPROM of the Ethernet card. This program sends a DHCP request to get an IP address and information about what to do next. Typically, the next step is getting a higher level bootloader via the TFTP protocol. That could be pxelinux, GRUB, or even boot directly to an operating system like Linux.

For example, if you unpack the generated live-image-amd64.netboot.tar archive in the /srv/debian-live directory, you'll find the filesystem image in live/filesystem.squashfs and the kernel, initrd and pxelinux bootloader in tftpboot/.

We must now configure three services on the server to enable netbooting: the DHCP server, the TFTP server and the NFS server.

### 4.7.1 DHCP server

We must configure our network's DHCP server to be sure to give an IP address to the netbooting client system, and to advertise the location of the PXE bootloader.

Here is an example for inspiration, written for the ISC DHCP server isc-dhcp-server in the /etc/dhcp/dhcpd.conf configuration file:

```shell
# /etc/dhcp/dhcpd.conf - configuration file for isc-dhcp-server
ddns-update-style none;
option domain-name "example.org";
option domain-name-servers ns1.example.org, ns2.example.org;
default-lease-time 600;
max-lease-time 7200;
log-facility local7;
subnet 192.168.0.0 netmask 255.255.255.0 {
   range 192.168.0.1 192.168.0.254;
   filename "pxelinux.0";
   next-server 192.168.0.2;
   option subnet-mask 255.255.255.0;
   option broadcast-address 192.168.0.255;
   option routers 192.168.0.1;
}
```

### 4.7.2 TFTP server

This serves the kernel and initial ramdisk to the system at run time.

You should install the _tftpd-hpa_ package. It can serve all files contained inside a root directory, usually /srv/tftp. To let it serve files inside /srv/debian-live/tftpboot, run as root the following command:

```shell
# dpkg-reconfigure -plow tftpd-hpa
```

and fill in the new tftp server directory when being asked about it.

### 4.7.3 NFS server

Once the guest computer has downloaded and booted a Linux kernel and loaded its initrd, it will try to mount the Live filesystem image through a NFS server.

You need to install the _nfs-kernel-server_ package.

Then, make the filesystem image available through NFS by adding a line like the following to /etc/exports:

```shell
/srv/debian-live *(ro,async,no_root_squash,no_subtree_check)
```

and tell the NFS server about this new export with the following command:

```shell
# exportfs -rv
```

Setting up these three services can be a little tricky. You might need some patience to get all of them working together. For more information, see the syslinux wiki at ‹[https://wiki.syslinux.org/wiki/index.php?title=PXELINUX](https://wiki.syslinux.org/wiki/index.php?title=PXELINUX)› or the Debian Installer Manual's TFTP Net Booting section at ‹[https://www.debian.org/releases/stable/amd64/ch04s05.en.html](https://www.debian.org/releases/stable/amd64/ch04s05.en.html)›. They might help, as their processes are very similar.

### 4.7.4 Netboot testing HowTo

Netboot image creation is made easy with _live-build_, but testing the images on physical machines can be really time consuming.

To make our life easier, we can use virtualization.

### 4.7.5 Qemu

-   Install _qemu_, _bridge-utils_, _sudo_.

Edit /etc/qemu-ifup:

```shell
#!/bin/sh
sudo -p "Password for $0:" /sbin/ifconfig $1 172.20.0.1
echo "Executing /etc/qemu-ifup"
echo "Bringing up $1 for bridged mode..."
sudo /sbin/ifconfig $1 0.0.0.0 promisc up
echo "Adding $1 to br0..."
sudo /usr/sbin/brctl addif br0 $1
sleep 2
```

Get, or build a grub-floppy-netboot.

Launch qemu with "-net nic,vlan=0 -net tap,vlan=0,ifname=tun0"

## 4.8 Webbooting

Webbooting is a convenient way of retrieving and booting live systems using the internet as a means. The requirements for webbooting are very few. On the one hand, you need a medium with a bootloader, an initial ramdisk and a kernel. On the other hand, a web server to store the squashfs files which contain the filesystem.

### 4.8.1 Getting the webboot files

As usual, you can build the images yourself or use the [prebuilt files](/chapters/the-basics#downloading-prebuilt-images). Using prebuilt images would be handy for doing initial testing until one can fine tune their own needs. If you have built a live image you will find the files needed for webbooting in the build directory under binary/live/. The files are called vmlinuz, initrd.img and filesystem.squashfs.

It is also possible to extract those files from an already existing iso image. In order to achieve that, loopback mount the image as follows:

```shell
# mount -o loop image.iso /mnt
```

The files are to be found under the live/ directory. In this specific case, it would be /mnt/live/. This method has the disadvantage that you need to be root to be able to mount the image. However, it has the advantage that it is easily scriptable and thus, easily automated.

But undoubtedly, the easiest way of extracting the files from an iso image and uploading it to the web server at the same time, is using the midnight commander or _mc_. If you have the _genisoimage_ package installed, the two-pane file manager allows you to browse the contents of an iso file in one pane and upload the files via ftp in the other pane. Even though this method requires manual work, it does not require root privileges.

### 4.8.2 Booting webboot images

While some users will prefer virtualization to test webbooting, we refer to real hardware here to match the following possible use case which should only be considered as an example.

In order to boot a webboot image it is enough to have the components mentioned above, i.e. vmlinuz and initrd.img in a usb stick inside a directory named live/ and install syslinux as bootloader. Then boot from the usb stick and type fetch=URL/PATH/TO/FILE at the boot options. _live-boot_ will retrieve the squashfs file and store it into ram. This way, it is possible to use the downloaded compressed filesystem as a regular live system. For example:

```shell
append boot=live components fetch=http://192.168.2.50/images/webboot/filesystem.squashfs
```

**Use case:** You have a web server in which you have stored two squashfs files, one which contains a full desktop, like for example gnome, and a standard one. If you need a graphical environment for one machine, you can plug your usb stick in and webboot the gnome image. If you need one of the tools included in the second type of image, perhaps for another machine, you can webboot the standard one.
