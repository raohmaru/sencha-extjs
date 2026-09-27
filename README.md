# Sencha Ext JS

Sencha Ext JS exercises 🍃

<img src="sencha-neko.gif" alt="Sencha Neko" width="64">

## Setup

### Licensed Sencha Users

Login in the terminal as described in https://docs.sencha.com/extjs/7.5.0/guides/getting_started/getting_started_with_npm.html.

Execute `npm i`.

### Community Edition

Use the Ext JS 30-day trial packages to install Ext.js.

Install `ext-gen` globally:
```bash
npm install -g @sencha/ext-gen
```
then create a new Ext.js app anywhere:
```bash
ext-gen app -t classicdesktop -c theme-triton -n App
```
Copy the folder `node_modules` from the app you just created into this repository.

## Development

Execute `npm run dev -- <task folder>` to run Ext.js app in the given task folder.
```bash
npm run dev -- task-1
```

## Note About Ext.js Versions

This repository works on Ext.js 8.0.0 (latest Ext.js version released as of 27/09/26). I was not able to successfully run v7.5.0 because the `build` task or the `dev` task was not generating any files in the `generatedFiles` folder.

## License

Released under The MIT License (MIT).