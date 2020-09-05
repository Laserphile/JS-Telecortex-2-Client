<!-- markdownlint-disable MD041 -->
```txt

  ______________    ________________  ____  _____________  __    ________
 /_  __/ ____/ /   / ____/ ____/ __ \/ __ \/_  __/ ____/ |/ /   /  _/  _/
  / / / __/ / /   / __/ / /   / / / / /_/ / / / / __/  |   /    / / / /
 / / / /___/ /___/ /___/ /___/ /_/ / _, _/ / / / /___ /   |   _/ /_/ /
/_/ /_____/_____/_____/\____/\____/_/ |_| /_/ /_____//_/|_|  /___/___/


```

A rewrite of the [TeleCortex](https://github.com/laserphile/telecortex) project in NodeJS which controls APA102/SK9822 LED strips over OPC

[![Build Status](https://travis-ci.org/Laserphile/JS-Telecortex-2-Client.svg?branch=master)](https://travis-ci.com/Laserphile/JS-Telecortex-2-Client)
[![Maintainability](https://api.codeclimate.com/v1/badges/3a81693e65cfd8c8c555/maintainability)](https://codeclimate.com/github/Laserphile/JS-Telecortex-2-Client/maintainability)
[![codecov](https://codecov.io/gh/Laserphile/JS-Telecortex-2-Client/branch/master/graph/badge.svg)](https://codecov.io/gh/Laserphile/JS-Telecortex-2-Client)
[![Known Vulnerabilities](https://snyk.io/test/github/Laserphile/JS-Telecortex-2-Client/badge.svg?targetFile=package.json)](https://snyk.io/test/github/Laserphile/JS-Telecortex-2-Client?targetFile=package.json)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/Laserphile/JS-Telecortex-2-Client.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/Laserphile/JS-Telecortex-2-Client/context:javascript)
[![Total alerts](https://img.shields.io/lgtm/alerts/g/Laserphile/JS-Telecortex-2-Client.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/Laserphile/JS-Telecortex-2-Client/alerts/)

## Gifs

![Timecrime DJing](img/telecortex-timecrime-djing-short.gif?raw=true)
![inside dome](img/telecortex-inside-dome.gif?raw=true)

## Coverage

![codecoverage-svg-sunburst](https://codecov.io/gh/Laserphile/JS-Telecortex-2-Client/branch/master/graphs/sunburst.svg)

## OSX setup

There are many ways to scream in frustration about opencv4nodejs. But this is my favorite way.

Make sure your Node version is shit. My favorite outdated version is `v11.15.0`. Anything newer and you are in the _*\*DANGER ZONE\**_.

```bash
brew install nvm
```

Follow the instructions output by brew to install nvm. it might look something like this

```bash
mkdir ~/.nvm
cat << EOF >> ~/.zshrc
export NVM_DIR="$HOME/.nvm"
[ -s "/usr/local/opt/nvm/nvm.sh" ] && . "/usr/local/opt/nvm/nvm.sh"  # This loads nvm
[ -s "/usr/local/opt/nvm/etc/bash_completion" ] && . "/usr/local/opt/nvm/etc/bash_completion"  # This loads nvm bash_completion
EOF
```

```txt
nvm install 11.15
```

Make sure opencv is _not_ installed. Seriously, I spent days on this and only a pristine slate worked for me.

- `brew uninstall opencv opencv@2 opencv@3`
- `brew uninstall ffmpeg tesseract`

Install yarn `brew install yarn`

Now you can run `yarn`. It will hide the build output, but be patient and it should work.
IF you are stuck on this for ages its a good thing:

```txt
[1/4] 🔍  Resolving packages...
[2/4] 🚚  Fetching packages...
[3/4] 🔗  Linking dependencies...
[4/4] 🔨  Building fresh packages...
[1/10] ⠄ opencv-build
[-/10] ⠄ waiting...
[-/10] ⠄ waiting...
[-/10] ⡀ waiting...
[-/10] ⡀ waiting...
```

### You lied and it still fails to build

Try this: ¯\\\_(ツ)\_/¯

```bash
nvm install 11.15
brew uninstall yarn
brew install yarn
rm -rf node_modules
yarn
yarn add opencv4nodejs
brew update
brew install opencv@4
brew link --force opencv@4
yarn add opencv4nodejs
```

### Balena dev setup

If you want to push to your pi without going through the pipeline. Make sure you also "enable local mode" on BalenaCloud if its a cloud image.

- `npm install --global --production --unsafe-perm balena-cli`
- `sudo balena local scan`
  Get the ip address of the device you want to push to from the output.
- `sudo balena push 192.168.1.120` or whatever the IP is.

# Usage

## Run the server (the raspberry pi) in development mode (refreshing on change)

```bash
yarn dev
```

## Run the client (your computer) in development mode (refreshing on change)

```bash
yarn dev
```

client options (`yarn dev --help`)

```txt
Options:
  --help               Show help                                       [boolean]
  --version            Show version number                             [boolean]
  --animation                                 [default: "directSimplexRainbows"]
  --servers                                                    [default: "five"]
  --mapping                                           [default: "dome_overhead"]
  --videoFile          Pick the video used in the video animation
  --enablePreview, -p                                                  [boolean]
  --frameRateCap                                             [default: Infinity]
  --canvasSize                                                    [default: 512]
  --text                                                   [default: "MOONBASE"]
  --host                                                  [default: "localhost"]
```

Examples:

```bash
yarn dev --animation 'rainbowText' --servers 'one-host' --host '10.1.1.53' --mapping 'square_serp_12' --canvasSize 12 --frameRateCap 20 --text 'BEANS'
```

```bash
yarn dev --animation 'directSimplexRainbows' --servers 'one-raspberrypi' --mapping 'square_serp_12' --frameRateCap 20
```
