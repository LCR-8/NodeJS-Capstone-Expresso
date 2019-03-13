const express = require('express');
const apiRouter = express.Router();

const empRouter = require('./employees')
const menuRouter = require('./menus')

apiRouter.use('/employees', empRouter);
apiRouter.use('/menus', menuRouter);

module.exports = apiRouter;
