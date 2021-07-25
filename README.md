<h1 align="center">
  <br>
  <a href="https://sumfacts.com">
    <img src="https://raw.githubusercontent.com/amitmerchant1990/electron-markdownify/master/app/img/markdownify.png" alt="SumFacts" width="200">
  </a>
  <br>
  SumFacts
  <br>
</h1>

<h4 align="center">A serverless argument diagram editor built with React and IPFS. Visit <a href="https://sumfacts.com">SumFacts.com</a> to see the official live version.</h4>

<p align="center">
  <a href="https://www.paypal.me/AmitMerchant">
    <img src="https://img.shields.io/badge/$-donate-ff69b4.svg?maxAge=2592000&amp;style=flat">
  </a>
</p>

<p align="center">
  <a href="#motivation">Motivation</a> •
  <a href="#key-features">Key Features</a> •
  <a href="#how-to-use">How To Use</a> •
  <a href="#download">Download</a> •
  <a href="#credits">Credits</a> •
  <a href="#license">License</a>
</p>

![screenshot](/public/about-banner.png?raw=true)

## Motivation

Information today is a source of power and the majority of it is owned by relatively few organizations and people.

What we need, as the public, is a way to combine pieces of information together in a way that it is easier to make sense of the whole, reach consensus and educate each other about important topics. We need to be able to collectively sum up the facts.

## Key Features

* __Shareable Arguments__ - Arguments can be shared by simply copying and pasting a link. This means you can quickly and easily make a point. No need to write lengthy comments anymore. A picture tells a thousand words.

* __Decentralized/Open Data__ - All data is stored on the [InterPlanetary File System (IPFS)](https://ipfs.io/) which is a distributed, peer-to-peer network which means there is no central point of failure and nothing to attack. All its data is freely available meaning anybody can access it.

* __Open-Source Client__ - Not only is the data open but this app is completely open-source - anyone can freely download it, run it and audit it. The data can be viewed and edited by anyone with a computer and an internet connection.

* __Standardized and Inter-Linkable Arguments__ - arguments on all topics share the same format and structure. Which means that they can be linked together and webs of information can be made. One argument in turn supporting another and so forth. [Here you will find](https://github.com/sumfacts/sumfacts/blob/master/src/schema/v1/argument.json) the JSON Schema for an Argument in the SumFacts system.

* __Export/Import Data__ - Arguments can be completely exported as JSON and downloaded in image format as JPEG. This means you can store important data offline if need be and add diagrams to presentations (for example). And import JSON to recreate arguments stored offline.

* __Easy-to-use__ - The argument builder is designed to make it as easy as possible to quickly formulate arguments. The goal is to give you less time fighting with software and more time thinking about difficult concepts and ultimately finding truth.

## How To Use

### Official website

The easiest way to use SumFacts is at the official website: **[SumFacts.com](https://sumfacts.com)**! 🤷‍♂️


### Running locally

Another way to use SumFacts is by cloning this repository and running it locally on your computer.

The data is all stored in the same place (the IPFS), which means no matter where you create an argument you will be able to see it using this application on any computer if you have its unique CID.

Therefore, if the official website ever gets attacked or shut down, the data will live on for as long as people have it cached in the IPFS network.

To clone and run this application, you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Clone this repository
$ git clone https://github.com/sumfacts/sumfacts

# Go into the repository
$ cd sumfacts

# Install dependencies
$ npm install

# Build the app
$ npm build

# Run the app
$ npm start
```

<!-- Note: If you're using Linux Bash for Windows, [see this guide](https://www.howtogeek.com/261575/how-to-run-graphical-linux-desktop-applications-from-windows-10s-bash-shell/) or use `node` from the command prompt. -->


<!-- ## Download

You can [download](https://github.com//releases/tag/v1) the latest installable version of SumFacts for Windows, macOS and Linux. -->

## Credits

This software uses the following open source packages:

<!-- - [Electron](http://electron.atom.io/) -->
- [TypeScript](https://www.typescriptlang.org/)
- [Node.js](https://nodejs.org/)
- [IPFS](https://ipfs.io/)
- [React](https://reactjs.org/)
- [Create React App](https://reactjs.org/docs/create-a-new-react-app.html)
- [Ant Design](https://ant.design/)
- [React Flow](https://reactflow.dev/)
- [React Force Graph](https://github.com/vasturiano/react-force-graph)
- [SASS](https://sass-lang.com/)

## License

The MIT License (MIT)

Copyright © 2021 Finn Fitzsimons

---

> [sumfacts.com](https://www.sumfacts.com) &nbsp;&middot;&nbsp;
> GitHub [@sumfacts](https://github.com/sumfacts), [@finnfiddle](https://github.com/finnfiddle)



