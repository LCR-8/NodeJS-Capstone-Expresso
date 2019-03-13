const menuItemRouter = require('express').Router({mergeParams: true});

module.exports = menuItemRouter;

const {dbGetAll,
       dbGetById,
       dbMenuItemValidMenu,
       dbMenuItemInsert,
       dbMenuItemUpdate,
       dbMenuItemDelete
      } = require('../db');

const tableName = 'MenuItem';

const getMenuId = (req, res, next) => {
  const menuId = req.params.menuId;
    req.tableName = tableName;
    if (!isNaN(menuId)){
      req.menuId = menuId;
    } else {
      res.status(404).send();
    }
    next();
  };

menuItemRouter.param('id', (req, res, next, id) => {
  req.tableName = tableName;
  if (!isNaN(id)){
    req.id = id;
  } else {
    res.status(404).send();
  }
  next();
});


menuItemRouter.get('/', getMenuId, dbMenuItemValidMenu, (req, res, next) => {
    req.tableName = tableName;
    req.filter = "menu_id = " + req.menuId;
    next();
  }, dbGetAll, (req, res, next) => {
  res.status(200).json({menuItems: req.elements});
});

menuItemRouter.post('/', getMenuId, dbMenuItemValidMenu, dbMenuItemInsert, dbGetById, (req, res, next) => {
  res.status(201).json({menuItem: req.element});
});


menuItemRouter.put('/:id', getMenuId, dbMenuItemValidMenu, dbGetById, dbMenuItemUpdate, dbGetById, (req, res, next) => {
  res.status(200).json({menuItem: req.element});
});

menuItemRouter.delete('/:id', dbGetById, dbMenuItemDelete, (req, res, next) => {
  res.status(204).send();
});
