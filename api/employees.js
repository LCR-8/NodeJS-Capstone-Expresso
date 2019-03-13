const empRouter = require ('express').Router();

module.exports = empRouter;

const {dbGetAll,
       dbGetById,
       dbEmpInsert,
       dbEmpUpdate,
       dbEmpInactivate
      } = require('../db');

const tableName = 'Employee';

empRouter.param('id', (req, res, next, id) => {
    req.tableName = tableName;
    if (!isNaN(id)){
      req.id = id;
    } else {
      res.status(404).send();
    }
    next();
  });

empRouter.get('/', (req, res, next) => {
    req.tableName = tableName;
    req.filter = 'is_current_employee = 1';
    next();
  }, dbGetAll, (req, res, next) => {
  res.status(200).json({employees: req.elements});
});

empRouter.post('/', dbEmpInsert, (req, res, next) => {
    req.tableName = tableName;
    next();
  }, dbGetById, (req, res, next) => {
  res.status(201).json({employee: req.element});
});

empRouter.get('/:id', dbGetById, (req, res, next) => {
  res.status(200).json({employee: req.element});
});

empRouter.put('/:id', dbGetById, dbEmpUpdate, dbGetById, (req, res, next) => {
  res.status(200).json({employee: req.element});
});

empRouter.delete('/:id', dbGetById, dbEmpInactivate, dbGetById, (req, res, next) => {
  res.status(200).send({employee: req.element});
});

const timesheetRouter = require('./timesheets');

empRouter.use('/:employeeId/timesheets', timesheetRouter);
