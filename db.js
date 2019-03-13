const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

const dbGetAll = (req, res, next) =>{
  let filter = ";";
  if (typeof req.filter !== 'undefined'){
    filter = " WHERE " + req.filter + ";"
  }

  const query = "SELECT * FROM " + req.tableName + filter;

  db.all(query, function(err, rows) {
    if (!err) {
      req.elements = rows;
      next();
    } else {
      next(err);
    }
  });
};

const dbGetById = (req, res, next) =>{
  const query = "SELECT * FROM " + req.tableName + " WHERE id = " + req.id + ";";

  db.get(query, (err, row) => {
    if (!err && !(typeof row === 'undefined')) {
      req.element = row;
      next();
    } else {
      res.status(404).send();
    }
  });
};

//Employees specific functions=================================>
const dbEmpInsert = (req, res, next) => {
  const newEmp = req.body.employee;

  if (typeof newEmp.name !== 'undefined' && typeof newEmp.position !== 'undefined' && typeof newEmp.wage !== 'undefined'){
    db.run("INSERT INTO Employee (name, position, wage, is_current_employee) VALUES ($name, $position, $wage, $isCurrentEmployee);", {
      $name: newEmp.name,
      $position: newEmp.position,
      $wage: newEmp.wage,
      $isCurrentEmployee: newEmp.isCurrentEmployee || 1
    }, function(err){
          if(!err){
            req.id = this.lastID;
            next();
          } else {
            next(err);
          }
        });
  } else {
    res.status(400).send();
  }
};

const dbEmpUpdate = (req, res, next) => {
  const updEmp = req.body.employee;

  if(typeof updEmp.name !== 'undefined'
  && typeof updEmp.position !== 'undefined'
  && typeof updEmp.wage !== 'undefined'){
    db.run("UPDATE Employee SET name = $name, position = $position, wage = $wage WHERE id = $id;", {
        $id: req.id,
        $name: updEmp.name,
        $position: updEmp.position,
        $wage: updEmp.wage
      }, function(err) {
          if(!err){
            next();
          } else {
            next(err);
          };
      }
    );
  }else {
    res.status(400).send();
  };
};

const dbEmpInactivate = (req, res, next) => {
  db.run("UPDATE Employee SET is_current_employee = 0 WHERE id = $id;", {
      $id: req.id
    }, function(err) {
        if(!err){
          next();
        } else {
          next(err);
        };
    }
  );
};

//Menu specific functions=================================>
const dbMenuInsert = (req, res, next) => {
  const newMenu = req.body.menu;

  if (typeof newMenu.title !== 'undefined'){
    db.run("INSERT INTO Menu (title) VALUES ($title);", {
      $title: newMenu.title
    }, function(err){
          if(!err){
            req.id = this.lastID;
            next();
          } else {
            next(err);
          }
        });
  } else {
    res.status(400).send();
  }
};

const dbMenuUpdate = (req, res, next) => {
  const updMenu = req.body.menu;

  if(typeof updMenu.title !== 'undefined'){
    db.run("UPDATE Menu SET title = $title WHERE id = $id;", {
        $id: req.id,
        $title: updMenu.title
      }, function(err) {
          if(!err){
            next();
          } else {
            next(err);
          };
      }
    );
  }else {
    res.status(400).send();
  };
};

const dbMenuDelete = (req, res, next) => {
  const menuId = req.id;

  db.get("SELECT COUNT(1) as count FROM MenuItem WHERE menu_id = $menuId;", {$menuId: menuId}, (err, row) => {
    if(!err && row.count === 0){
      db.run("DELETE FROM Menu WHERE id = $menuId;", {$menuId: menuId}, err => {
        if(!err){
          next();
        } else {
          next(err);
        }
      });
    } else {
      res.status(400).send();
    }
  });
};

//Timesheets specific functions=================================>
const dbTimesheetValidEmployee = (req, res, next) => {
  const query = "SELECT * FROM Employee WHERE id = " + req.empId + ";";

  db.get(query, (err, row) => {
    if (!err && !(typeof row === 'undefined')) {
      req.emp = row;
      next();
    } else {
      res.status(404).send();
    }
  });

};

const dbTimesheetInsert = (req, res, next) => {
  const newTimesheet = req.body.timesheet;
  newTimesheet.empId = Number(req.empId);

  if(typeof newTimesheet.hours !== 'undefined'
  && typeof newTimesheet.rate !== 'undefined'
  && typeof newTimesheet.date !== 'undefined'
  && typeof newTimesheet.empId !== 'undefined'
  ){
    db.run("INSERT INTO Timesheet (hours, rate, date, employee_id) VALUES ($hours, $rate, $date, $empId);", {
        $hours: newTimesheet.hours,
        $rate: newTimesheet.rate,
        $date: newTimesheet.date,
        $empId: newTimesheet.empId
      }, function(err) {
          if(!err){
            req.id = this.lastID;
            next();
          } else {
            next(err);
          };
      }
    );
  }else {
    res.status(400).send();
  };

};

const dbTimesheetUpdate = (req, res, next) => {
  const updTimesheet = req.body.timesheet;
  updTimesheet.empId = Number(req.empId);

  if(typeof updTimesheet.hours !== 'undefined'
  && typeof updTimesheet.rate !== 'undefined'
  && typeof updTimesheet.date !== 'undefined'
  && typeof updTimesheet.empId !== 'undefined'){
    db.run("UPDATE Timesheet SET hours = $hours, rate = $rate, date = $date, employee_id = $empId WHERE id  = $id;", {
        $id: req.id,
        $hours: updTimesheet.hours,
        $rate: updTimesheet.rate,
        $date: updTimesheet.date,
        $empId: updTimesheet.empId
      }, function(err) {
          if(!err){
            next();
          } else {
            next(err);
          };
      }
    );
  }else {
    res.status(400).send();
  };
};

const dbTimesheetDelete = (req, res, next) => {
  const timesheetId = req.id;

  db.run("DELETE FROM Timesheet WHERE id = $timesheetId;", {$timesheetId: timesheetId}, err => {
    if(!err){
      next();
    } else {
      next(err);
    }
  });
};


//Menu Items specific functions=================================>
const dbMenuItemValidMenu = (req, res, next) => {
  const query = "SELECT * FROM Menu WHERE id = " + req.menuId + ";";

  db.get(query, (err, row) => {
    if (!err && !(typeof row === 'undefined')) {
      req.menu = row;
      next();
    } else {
      res.status(404).send();
    }
  });

};

const dbMenuItemInsert = (req, res, next) => {
  const newMenuItem = req.body.menuItem;
  newMenuItem.menuId = Number(req.menuId);

  if(typeof newMenuItem.name !== 'undefined'
  && typeof newMenuItem.description !== 'undefined'
  && typeof newMenuItem.inventory !== 'undefined'
  && typeof newMenuItem.price !== 'undefined'
  && typeof newMenuItem.menuId !== 'undefined'
  ){
    db.run("INSERT INTO MenuItem (name, description, inventory, price, menu_id) VALUES ($name, $description, $inventory, $price, $menuId);", {
        $name: newMenuItem.name,
        $description: newMenuItem.description,
        $inventory: newMenuItem.inventory,
        $price: newMenuItem.price,
        $menuId: newMenuItem.menuId
      }, function(err) {
          if(!err){
            req.id = this.lastID;
            next();
          } else {
            next(err);
          };
      }
    );
  }else {
    res.status(400).send();
  };

};

const dbMenuItemUpdate = (req, res, next) => {
  const updMenuItem = req.body.menuItem;
  updMenuItem.menuId = Number(req.menuId);

  if(typeof updMenuItem.name !== 'undefined'
  && typeof updMenuItem.description !== 'undefined'
  && typeof updMenuItem.inventory !== 'undefined'
  && typeof updMenuItem.price !== 'undefined'
  && typeof updMenuItem.menuId !== 'undefined'){
    db.run("UPDATE MenuItem SET name = $name, description = $description, inventory = $inventory, price = $price, menu_id = $menuId WHERE id  = $id;", {
        $id: req.id,
        $name: updMenuItem.name,
        $description: updMenuItem.description,
        $inventory: updMenuItem.inventory,
        $price: updMenuItem.price,
        $menuId: updMenuItem.menuId
      }, function(err) {
          if(!err){
            next();
          } else {
            next(err);
          };
      }
    );
  }else {
    res.status(400).send();
  };
};

const dbMenuItemDelete = (req, res, next) => {
  const menuItemId = req.id;

  db.run("DELETE FROM MenuItem WHERE id = $menuItemId;", {$menuItemId: menuItemId}, err => {
    if(!err){
      next();
    } else {
      next(err);
    }
  });
};
//========================<

module.exports = {
  dbGetAll,
  dbGetById,
  dbEmpInsert,
  dbEmpUpdate,
  dbEmpInactivate,
  dbTimesheetValidEmployee,
  dbTimesheetInsert,
  dbTimesheetUpdate,
  dbTimesheetDelete,
  dbMenuInsert,
  dbMenuUpdate,
  dbMenuDelete,
  dbMenuItemValidMenu,
  dbMenuItemInsert,
  dbMenuItemUpdate,
  dbMenuItemDelete};
