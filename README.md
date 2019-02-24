# Lifen level5 frontend
## Table of content
 * [Table of content](#table-of-content)
 * [Description](#description)
 * [Features](#features)
   * [Shifts](#shifts)
   * [Workers](#workers)
 * [Tree](#tree)
 * [Development related content](#development-related-content)
   * [Compiles and hot-reloads for development](#compiles-and-hot-reloads-for-development)
   * [Compiles and minifies for production](#compiles-and-minifies-for-production)
   * [Run your tests](#run-your-tests)
   * [Lints and fixes files](#lints-and-fixes-files)
   * [Customize configuration](#customize-configuration)


## Description
This project is the frontend part of the lifen test level5
It's created with `vue-cli v3.0` and deployed on heroku.

This is a full working Single Page Application which allow you to manage workers and shifts and to know the service fee and total fee for every programmed fee

## Features

### Shifts
- Create a new shift and link a worker to it.
- A shift can be a range of many days.
- Price total for a new shift will include weekend day additional fee multiplied by worker basic price per day
- If interim worker is selected additional 80 euros will be added to pdg_fee
- You can decide when creating a new shift to allow it to lap on others already created shifts(or not)

### Workers
- Create a new worker based on one of the 3 available status
- Custom price per day can be set if basic doesn't match requirements

## Tree
``` 
./
├── README.md
├── babel.config.js
├── package-lock.json
├── package.json
├── public
│   ├── favicon.ico
│   └── index.html
├── server.js // static nodejs server file to serve builded vue app
├── src
│   ├── App.vue // vue main component
│   ├── assets
│   │   ├── logo.png
│   │   └── logo.svg
│   ├── components
│   │   ├── Shifts
│   │   │   ├── ShiftActionMenu.vue // sub menu
│   │   │   ├── ShiftCreateForm.vue // form to create new shifts
│   │   │   └── Shifts.vue
│   │   └── Workers 
│   │       ├── WorkerCreateForm.vue // form to create new workers
│   │       ├── Workers.vue
│   │       └── WorkersActionMenu.vue // sub menu
│   ├── configuration.js
│   ├── main.js // code entry point
│   ├── plugins
│   │   └── vuetify.js 
│   ├── router.js // vue js application router
│   └── views
│       ├── Shifts.vue // shifts management main vue
│       └── Workers.vue // workers management main vue
└── vue.config.js // config vue js to disable unauthorized cors

```
## Development related content

```
npm install
```

#### Compiles and hot-reloads for development
```
npm run serve
```

#### Compiles and minifies for production
```
npm run build
```

#### Run your tests
```
npm run test
```

#### Lints and fixes files
```
npm run lint
```

#### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
