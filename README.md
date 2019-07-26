# Firebase Hosting Connection Wizard

This is a utility that aims to walk you through the process of connecting a custom DNS to [Firebase Hosting](https://firebase.google.com/docs/hosting).

The code of this utility was uploaded to serve as an example for fellow developers 😄

You can use the live version here: 👉 https://eos-wizard.firebaseapp.com/#/ 🔥

## Installation

### Prequisites
- MacOS environment is prefered
- Make sure you have [NodeJS](https://nodejs.org/en/) and npm installed on their latest LTS version (10.15.3 at the time of this writing for NodeJS)
- Make sure you're using a robust IDE such as [WebStorm](https://www.jetbrains.com/webstorm/) (not required, but highly recommended)
- Make sure you have the latest version of [firebase-tools](https://firebase.google.com/docs/cli) installed.

### Setting up the project

Clone the project via git by running the following command:

`git clone git@github.com:mtflud/firebase-hosting-connection-wizard.git`

Place your prompt inside the project's directory and install dependencies:

`cd firebase-hosting-connection-wizard && npm install`

Initialize your Firebase project for `functions` and `hosting`:

`firebase init`

Navigate to the `functions` directoy and install its dependencies as well:

`cd functions && npm install`

### Running the application

#### For development

Run the npm script to compile your assets on any file change:

`npm run watch`

Then, on a separate command prompt window, use firebase to serve your content locally:

`firebase serve`

You're ready to start coding! 😀

#### For production

Run the npm script to compile your assets and minify them:

`npm run production`

Use firebase to deploy your project

`firebase deploy`

## Used Libraries / Technologies

[Firebase Authentication](https://firebase.google.com/docs/auth) - Handles Google Social Authentication from within the app.

[Firebase Hosting](https://firebase.google.com/docs/hosting) - Serves as the platform to host our content.

[Firebase Cloud Functions](https://firebase.google.com/docs/functions) - Used search for DNS records on specific regions.

[Creative Tim's Material Dashboard Dark](https://www.creative-tim.com/product/material-dashboard-dark) - Used as the main CSS theme.

[Vue.js](https://vuejs.org/) - Used as the main JS framework.

[Vuex](https://vuex.vuejs.org/) - Used to manage the state between components.

[Vue Router](https://router.vuejs.org/) - Used as the main application router.

[Laravel Mix](https://laravel-mix.com/) - An awesome wrapper around Webpack for asset management.

[Axios](https://github.com/axios/axios) - Promise based HTTP client for the browser and Node.js
