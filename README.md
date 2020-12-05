# Getting Started with AR JS React App

### Install node and npm to run this project

## `npm install`

Before you run this project you need to install project dependencies.
You can install the dependencies by excuting `npm install` command at the root directory of this project.

## `npm start`

Next, you need to run the app in the development mode. Run by executing `npm start` at the root of this project.

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Load Reports

In order to edit existing reports, you need to add the respective reports under `public/reports` directory. `reports` directory doesn't exist by default. You can create it yourself. Use `Load Report` button on the top of app to load reports from the `public/reports` directory.

## Saving Reports

Reports can be save by clicking the `save` icon in the menu bar. Alternatively, pressing `ctrl + s` will also save the reports.

Note: Reports are saved only in react's state which can be lost if you refresh page. Make sure to `export report` often to save it on your local filesystem.

## Export Reports

Click on the `Export Report` button located at the top in the menu bar to save reports to your local filesystem.
