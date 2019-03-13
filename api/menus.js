const menuRouter = require ('express').Router();

module.exports = menuRouter;

const {dbGetAll,
       dbGetById,
       dbMenuInsert,
       dbMenuUpdate,
       dbMenuDelete
      } = require('../db');

const tableName = 'Menu';

menuRouter.param('id', (req, res, next, id) => {
    req.tableName = tableName;
    if (!isNaN(id)){
      req.id = id;
    } else {
      res.status(404).send();
    }
    next();
  });

menuRouter.get('/', (req, res, next) => {
    req.tableName = tableName;
    next();
  }, dbGetAll, (req, res, next) => {
  res.status(200).json({menus: req.elements});
});

menuRouter.post('/', dbMenuInsert, (req, res, next) => {
    req.tableName = tableName;
    next();
  }, dbGetById, (req, res, next) => {
  res.status(201).json({menu: req.element});
});

menuRouter.get('/:id', dbGetById, (req, res, next) => {
  res.status(200).json({menu: req.element});
});

menuRouter.put('/:id', dbGetById, dbMenuUpdate, dbGetById, (req, res, next) => {
  res.status(200).json({menu: req.element});
});

menuRouter.delete('/:id', dbGetById, dbMenuDelete, (req, res, next) => {
  res.status(204).send();
});

const menuItemRouter = require('./menu-items');

menuRouter.use('/:menuId/menu-items', menuItemRouter)
