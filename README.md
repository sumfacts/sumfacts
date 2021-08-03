<h1 align="center">
  <br>
  <a href="https://sumfacts.com">
    <img src="https://github.com/sumfacts/sumfacts/blob/master/public/logo-large.png?raw=true" alt="SumFacts" width="200">
  </a>
  <br>
  SumFacts
  <br>
</h1>

<h4 align="center"><a href="https://sumfacts.com">SumFacts.com</a> - a client-only web application for collaboratively building logical arguments as diagrams that are shared over a peer-to-peer network.
</h4>

![https://github.com/sumfacts/sumfacts/blob/master/public/about-banner.png?raw=true](https://github.com/sumfacts/sumfacts/blob/master/public/about-banner.png?raw=true)

<p align="center">
  <a href="http://ipfs.io/">
    <img alt="IPFS" src="https://img.shields.io/badge/built_with-IPFS-blue.svg?style=flat-square">
  </a>
  <a href="https://reactjs.org/">
    <img alt="IPFS" src="https://img.shields.io/badge/built_with-React-blue.svg?style=flat-square">
  </a>
  <a href="https://www.typescriptlang.org/">
    <img alt="TypeScript" src="https://img.shields.io/badge/built_with-TypeScript-blue.svg?style=flat-square">
  </a>
  <img alt="Netlify CI" src="https://img.shields.io/netlify/e0dfd289-d0eb-49f1-8c8b-7cef447e8060">
  <a href="https://github.com/sumfacts/sumfacts/issues">
    <img alt="Github Issues" src="https://img.shields.io/github/issues/sumfacts/sumfacts.svg">
  </a>
<!--   <a href="https://github.com/sumfacts/sumfacts/network">
    <img alt="Github " src="https://img.shields.io/github/forks/sumfacts/sumfacts.svg">
  </a> -->
  <a href="https://github.com/sumfacts/sumfacts/stargazers">
    <img alt="Github " src="https://img.shields.io/github/stars/sumfacts/sumfacts.svg">
  </a>
<!--   <a href="https://github.com/sumfacts/sumfacts/releases">
    <img alt="Github " src="https://img.shields.io/github/v/release/sumfacts/sumfacts.svg">
  </a> -->
</p>

<p align="center">
  <a href="#motivation">Motivation</a> •
  <a href="#sumfacts-features">Features</a> •
  <a href="#usage">How To Use</a> •
  <a href="#credits">Credits</a> •
  <a href="#license">License</a>
</p>

## Motivation

This is a tool to be used by those who wish to spread information that others might not want to be known. The information can never be attacked because it is distributed. The client is open-source so anyone can access and add to the data. And it is specifically designed for building logical arguments with the aim of educating others and winning arguments.

## Features

* 🕒 __Easy-to-use__ - it's quick to formulate arguments that are clear and stay on-topic. Spend less time fighting with software and more time arguing with people.

* 📷 __Shareable arguments__ - share arguments simply by copying and pasting a link. Quickly and easily make a point. No need to write lengthy comments anymore. A picture tells a thousand words.

* 🕵️‍♂️ __Truth-finding__ - find holes in arguments and see where an argument falls flat. Expose logical flaws more easily - ad hominems, hate-speech, confirmation bias, etc...

* 🕸️ __Decentralized/open data__ - all data is stored on the [InterPlanetary File System (IPFS)](https://ipfs.io/) - a distributed, peer-to-peer network. There is no central point of failure and nothing to attack. All data is freely available to everybody.

* 📂 __Open-source client__ - anyone can freely download this application, run it and audit it. The data can be viewed and edited by anyone with a computer and an internet connection.

* 🔗 __Standardized and inter-linkable arguments__ - arguments on all topics share the same format and structure. They can be linked together and webs of information can be made. One argument in turn supports another and so forth. [Here](https://github.com/sumfacts/sumfacts/blob/master/src/schema/v1/argument.json) you will find the JSON Schema for an Argument in the SumFacts system.

* 📥 __Export/import data__ - arguments can be exported as JSON and downloaded as image in JPEG format. Store important data offline and add diagrams to presentations for example. Import JSON to recreate arguments stored offline.


## Usage

### Official website

The easiest way to use SumFacts is at the official website: 👉 **[SumFacts.com](https://sumfacts.com)** 👈

### Running locally

Another way to use SumFacts is by cloning this repository and running it locally on your computer.

The data is all stored in the same place (the IPFS), which means no matter where you create an argument you will be able to see it using this application on any other computer if you have its unique CID.

Therefore, if the official website ever gets attacked or shut down, the data will live on for as long as people have it cached in the IPFS network.

### Installation

To clone and run this application, you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Clone this repository
$ git clone https://github.com/sumfacts/sumfacts

# Go into the repository
$ cd sumfacts

# Install dependencies
$ npm install
```

### Development mode

```bash
# Run the app in development mode
$ npm run dev
```

The app will run at [http://localhost:3000](http://localhost:3000) and recompile each time you make changes in the `/src` directory.

### Deploying to production

```bash
# Build the app
$ npm run build
```

Then serve the files in the `/build` directory.

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
