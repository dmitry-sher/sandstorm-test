# Sample project for sandstorm issue

## Environment

 - Host OS is Mac OS 10.12.6 (16G29)
 - sandstorm is working in the VM Ubuntu 16.04 x64 with mainstream 4.10 kernel (Due to https://github.com/sandstorm-io/sandstorm/issues/2526 ubuntu requires mainstream kernels for older kernel versions). It was http://kernel.ubuntu.com/~kernel-ppa/mainline/v4.10/ with amd64 arch.
 - node 4.8.6, Meteor 1.5.4
 - meteor-spk-0.3.2
 - React 0.15
 - kentonv:accounts-sandstorm 0.7.0

## Steps to reproduce

 - install node modules: `meteor npm install`
 - run app in spk-dev mode: `meteor-spk dev`
 - create new grain of an app and open it

## Steps to create VM

### 1. Install VirtualBox

### 2. Download Ubuntu 16.04.3 x64 image
For example from [osboxes](http://www.osboxes.org/ubuntu/)

### 3. Create VM in VirtualBox with selected image.

### 4. Just after creation, this VM is not ready yet.
It doesn't even has the SSHD server running. So run it in GUI mode, log in (password is the same as user name), and set up a SSHD server (and other things) first. You will need to do sudo -- the sudo password is your current user's password. Open terminal and run following commands:
```bash
sudo su
apt-get update
apt-get upgrade
```

### 5. Add developer user with a sudo privilege.
Enter password 'developer' when asked.
```bash
sudo su
adduser developer
usermod -a -G sudo developer
```

### 6. Install SSHD.
Nice [article](https://help.ubuntu.com/community/SSH/OpenSSH/Configuring) if you are interested.
```bash
sudo su
apt-get install openssh-server
```

### 7. Now let us install NVM, Node, Mongo, and Meteor.
```bash
sudo apt-get install build-essential libssl-dev curl
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh | bash
```
This command installs `nvm` version 0.33.2, the latest at the moment of writing this manual. Latest version can be other in the future. After installing nvm, we need to log out terminal and log again.

Meteor 1.5 runs on Node 4.x. Let's find the latest version `nvm` can give to us: `nvm ls-remote | grep v4.`. It's version `v4.8.6` at the moment, let's install it:
```bash
$ nvm install v4.8.6
Downloading and installing node v4.8.6...
Downloading https://nodejs.org/dist/v4.8.6/node-v4.8.6-linux-x64.tar.xz...
######################################################################## 100.0%
Computing checksum with sha256sum
Checksums matched!
Now using node v4.8.6 (npm v2.15.11)
Creating default alias: default -> v4.8.6
$ node -v
v4.8.6
```

Let's install Meteor.
```bash
curl https://install.meteor.com/ | sh
```

### 8. Time to install Sandstorm
And tools: `meteor-spk`, `capnp` and all other sandstorm-related stuff. Answer `A development server` to sandstorm install script! All other settings can be left default.
```bash
cd

# install sandstorm
curl https://install.sandstorm.io | bash

# install meteor-spk
mkdir -p ~/projects/meteor-spk
cd ~/projects/meteor-spk
curl https://dl.sandstorm.io/meteor-spk-0.3.2.tar.xz | tar Jxf -
cd meteor-spk-0.3.2
mkdir -p ~/bin
ln -s $PWD/meteor-spk ~/bin

# install capnp
cd
curl -O https://capnproto.org/capnproto-c++-0.6.1.tar.gz
tar zxf capnproto-c++-0.6.1.tar.gz
cd capnproto-c++-0.6.1
./configure
make -j6 check
sudo make install
```

### 9. Update kernel.
Before we continue, we need to switch the kernel to a mainline one due to known [sandstorm bug](https://github.com/sandstorm-io/sandstorm/issues/2526). Check your kernel version: `uname -a`. Proceed to [kernels](http://kernel.ubuntu.com/~kernel-ppa/mainline/?C=N;O=D) and download the appropriate amd64 version. On my VM kernel version is 4.8.0, or simply 4.8.

Also, sometimes Sandstorm install script forgets to add you to the proper group. So let's add user `developer` to group `sandstorm`.
```bash
# add user to group
sudo usermod -a -G sandstorm developer

# install kernel
mkdir ~/kernels
cd ~/kernels
wget http://kernel.ubuntu.com/~kernel-ppa/mainline/v4.8/linux-headers-4.8.0-040800_4.8.0-040800.201610022031_all.deb
wget http://kernel.ubuntu.com/~kernel-ppa/mainline/v4.8/linux-headers-4.8.0-040800-cloud_4.8.0-040800.201610022031_amd64.deb
wget http://kernel.ubuntu.com/~kernel-ppa/mainline/v4.8/linux-headers-4.8.0-040800-generic_4.8.0-040800.201610022031_amd64.deb
wget http://kernel.ubuntu.com/~kernel-ppa/mainline/v4.8/linux-headers-4.8.0-040800-lowlatency_4.8.0-040800.201610022031_amd64.deb
wget http://kernel.ubuntu.com/~kernel-ppa/mainline/v4.8/linux-image-4.8.0-040800-cloud_4.8.0-040800.201610022031_amd64.deb
wget http://kernel.ubuntu.com/~kernel-ppa/mainline/v4.8/linux-image-4.8.0-040800-generic_4.8.0-040800.201610022031_amd64.deb
wget http://kernel.ubuntu.com/~kernel-ppa/mainline/v4.8/linux-image-4.8.0-040800-lowlatency_4.8.0-040800.201610022031_amd64.deb
sudo dpkg -i *.deb
sudo shutdown -r now
```

### 10. Let's prepare to run Meteor projects in a Sandstorm grains. First, we need to set up a port forwarding in Virtualbox. Point port 3000 of a guest to a port 3000 of a host. Now run a test project with small Meteor 1.5 app, packaged as a Sandstorm grain. We need to install `git`.
```
sudo apt-get install git
mkdir -p ~/projects
cd ~/projects
git clone https://github.com/dmitry-sher/meteor-accounts-sandstorm.git
cd ~/projects/meteor-accounts-sandstorm/.test-app
meteor npm install

# check that Meteor is working
meteor run
^C

# now run a meteor-spk tool to see our app as a grain
meteor-spk dev
```