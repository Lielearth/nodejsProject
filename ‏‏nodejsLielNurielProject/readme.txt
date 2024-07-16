
NODEJS LIEL'S PROJECT

In this project i used mongoDb, express.js, mongoose, chalk, cors, morgan, config, jsonwebtoken, joi, and bcryptjs.

The full documentation is on postman in the link: https://documenter.getpostman.com/view/33658895/2sA3kRJ44L

This documentation explains how to make requests including: routes, request's body and allowed users for each request.

Before running - type npm i -  in the terminal to add the node modules.

To start the server on dev mode - which is the local host - type npm run dev in the terminal.

To start the server on prod mode - which is the Atlas cloud environment - type npm run prod in the terminal.

The project is split to folders:

*controllers hold the functions.

*routes hold the routes of the requests.

*data hold the initial data that includes 3 users and 3 cards.

*models includes the mongoose model of a user and a card.

*schemas holds the joi models.

*.env includes the 2 optional environments uri.

*config holds the function that changes the environments.

*the file server is the main file.

*the file seed inserts cards and users as well as allows you to delete all of them.