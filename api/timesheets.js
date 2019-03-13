const timesheetRouter = require('express').Router({mergeParams: true});

module.exports = timesheetRouter;

const {dbGetAll,
       dbGetById,
       dbTimesheetValidEmployee,
       dbTimesheetInsert,
       dbTimesheetUpdate,
       dbTimesheetDelete
      } = require('../db');

const tableName = 'Timesheet';

const getEmployeeId = (req, res, next) => {
  const empId = req.params.employeeId;
    req.tableName = tableName;
    if (!isNaN(empId)){
      req.empId = empId;
    } else {
      res.status(404).send();
    }
    next();
  };

timesheetRouter.param('id', (req, res, next, id) => {
  req.tableName = tableName;
  if (!isNaN(id)){
    req.id = id;
  } else {
    res.status(404).send();
  }
  next();
});


timesheetRouter.get('/', getEmployeeId, dbTimesheetValidEmployee, (req, res, next) => {
    req.tableName = tableName;
    req.filter = "employee_id = " + req.empId;
    next();
  }, dbGetAll, (req, res, next) => {
  res.status(200).json({timesheets: req.elements});
});

timesheetRouter.post('/', getEmployeeId, dbTimesheetValidEmployee, dbTimesheetInsert, dbGetById, (req, res, next) => {
  res.status(201).json({timesheet: req.element});
});


timesheetRouter.put('/:id', getEmployeeId, dbTimesheetValidEmployee, dbGetById, dbTimesheetUpdate, dbGetById, (req, res, next) => {
  res.status(200).json({timesheet: req.element});
});

timesheetRouter.delete('/:id', dbGetById, dbTimesheetDelete, (req, res, next) => {
  res.status(204).send();
});
