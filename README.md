<p align="center">
    <a href="https://veil-project.com/" target="_blank"><img height="100" src="https://veil-project.com/dist/img/logo-icon.png"></a>
  </p>
  <h1 align="center">Veil X</h1>
  <p align="center">
A reimagined wallet experience for the pioneering privacy coin.<br>
  <a target="_blank" href="https://veil-project.com">https://veil-project.com</a>
</p>

<p align="center">
    <a href="https://github.com/Veil-Project/Veil-Link-Client/releases"><img src="https://img.shields.io/github/package-json/v/Veil-Project/Veil-Link-Client" alt="Latest Release"></a>
</p>

------

**⚠️ This is BETA software and may have serious bugs. It is only intended for beta testers and must not be used with live data. USE AT YOUR OWN RISK**

Cross platform Veil wallet interface focused on user experience and ease of use.  
The UI for Veil X is created using [Electron](https://electron.atom.io/) + [React](https://facebook.github.io/react/) + [Overmind](https://overmindjs.org) + [Tailwind CSS](https://www.tailwindcss.com).

## Table of Contents

- [Install](#install)
- [Get Help](#get-help)
- [Develop](#develop)
- [Release](#release)
- [Security](#security)
- [Community](#community)

## Install

Download the [latest release][releases] for your appropriate OS and follow the instructions below.

### macOS

Once you have the .zip file downloaded, simply **double click** on the file to unzip.

Navigate to the newly extracted folder, then drag-and-drop the `Veil X.app` file to the `Applications` folder.

Finally, **double click** on the `Veil X.app` file.

### Windows

Once you have the .exe file downloaded, simply **double click** on the file.

### Linux

Once you have the .AppImage file downloaded you must [make the file executable](https://docs.appimage.org/user-guide/run-appimages.html).

Once executible you can run either **double click** the file or run via the cli:

```bash
./file.AppImage
```

## Get Help

If you are having problems with Veil X, please report the issue in GitHub or on Discord with screenshots and/or how to reproduce the bug/error.

## Develop

### Prerequisites
You’ll need to have Node >= 8.10 and npm >= 5.6 on your machine.

### Running the app
Clone the repo, install dependencies, and run the app with `yarn dev`. This will start a development server with hot reload as well as run the Electron app with the right configuration. 

Please note that only the client-side code is recompiled automatically. If you modify code on the Electron-side, you currently need to restart the dev server. This is due to the code being written in TypeScript which requires a complication step.

### Create React App
Most of the webpack and build configuration is abstracted away thanks to [Create React App](https://reactjs.org/docs/create-a-new-react-app.html#create-react-app).

### State management

The application uses [Overmind](https://overmindjs.org/) for state management. For the best experience you should install the [Overmind Devtools extension](https://overmindjs.org/core/devtools) which allows state inspection and action debugging.

### Local database

For optimal performance, transaction details are cached in an IndexedDB database. [Dexie](https://dexie.org) is used as a thin convenience wrapper over the otherwise unwieldy IndexedDB API.

### Styling

There's virtually no custom CSS code in the whole app, relying instead on [Tailwind CSS](https://tailwindcss.com)—a highly customizable, low-level CSS framework that enables making a consistent UI with a small set of building blocks. The color ranges, spacing, typography and more are configured in `tailwind.config.js`.

## Release

1. Bump version in `package.json`
1. `yarn package-all`
1. Due to an [open issue](https://github.com/electron-userland/electron-builder/issues/4299) in electron-builder the Mac version requires manual tweaking as [described here](https://github.com/electron-userland/electron-builder/issues/4299#issuecomment-557316888)
1. Upload release artifacts to a new Github release (when the above issue has been resolved, this can be automated).

## Security

If you discover or learn about a potential error, weakness, or threat that can compromise the security of Veil X, we ask you to keep it confidential and [submit your concern directly to the Veil security team](https://veil-project.com/contact/).

## Community

[Join the Veil Discord](https://discord.veil-project.com/)
