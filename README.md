kouch-meteor
============

What does kouch-meteor ? 

 - Remote controle for mplayer via Web interface.
 - Plays youtube videos(implemented) and other Video/Streaming sides
 - Integrated Playlist

Meteor is not officially supported on windows. See [here](https://github.com/oortcloud/meteorite#notes)

# Installing Dependencies 

 - [meteor](https://github.com/meteor/meteor)
Installation of meteor 
```bash
curl https://install.meteor.com | sh
```
 - [nodejs](http://nodejs.org/)
Installation with arch
```bash
sudo pacman -Sy nodejs
```
 - [meteorite](https://github.com/oortcloud/meteorite)
Installer & smart package manager for Meteor 
```bash
sudo npm install -g meteorite
```
 - [mplayer](http://www.mplayerhq.hu)
```bash
sudo pacman -Sy mplayer
```
 - [youtube-dl](https://github.com/rg3/youtube-dl)
```bash
sudo pip install youtube-dl
```
 - [livestreamer](https://github.com/chrippa/livestreamer)
```bash
sudo pip install livestreamer
``` 
 - [Chromium](https://github.com/chrippa/livestreamer) optional
```bash
sudo packman -Sy chromium
``` 

## Install Kouch

```bash
git clone https://github.com/zerocity/kouch-meteor.git
cd kouch-meteor
mrt
```
 
## TODOS

- integration of REST interface (required for bookmarklet)
- add other video resources like vimeo, soundclound 
	- add direct video url
- improve webinterface 
	- higher level of information of the played or upcomming videos
	- dark theme 
- create idle screen
- local libary of videos 

