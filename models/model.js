const sql = require("./db.js");

// constructor
const Entry = function (entry) {
  this.ProductName = entry.ProductName;
  this.Id = entry.Id;
  this.DateIn = entry.DateIn;
  this.DateOut = entry.DateOut;
  this.EmployeeIn = entry.EmployeeIn;
  this.EmployeeOut = entry.EmployeeOut;
};

Entry.create = (newEntry, result) => {
  sql.query("INSERT INTO entries SET ?", newEntry, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created entry: ", newEntry);
    result(null, newEntry);
  });
};

Entry.findById = (id, result) => {
  sql.query(`SELECT * FROM entries WHERE Id = ${id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found entry: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Entry with the name
    result({ kind: "not_found" }, null);
  });
};

Entry.updateById = (id, entry, result) => {
  sql.query(
    `UPDATE entries SET ProductName = IfNull(?, ProductName), Id = IfNull(?, id), 
      DateIn = IfNull(?, DateIn), DateOut = IfNull(?, DateOut), EmployeeIn = IfNull(?, EmployeeIn),
      EmployeeOut = IfNull(?, EmployeeOut) WHERE Id = ?`,
    [
      entry.ProductName,
      entry.id,
      entry.DateIn,
      entry.DateOut,
      entry.EmployeeIn,
      entry.EmployeeOut,
      id,
    ],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found user with the name
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated user: ", entry);
      result(null, entry);
    }
  );
};

Entry.remove = (id, result) => {
  sql.query("DELETE FROM entries WHERE Id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Entry with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted entry with id: ", id);
    result(null, res);
  });
};

Entry.findByDateRange = (dateRange, result) => {
  sql.query(
    "SELECT * FROM entries WHERE DateIn BETWEEN DATE_SUB(CURDATE(), INTERVAL ? DAY)  AND CURDATE()",
    dateRange,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res) {
        console.log("found entries: ", res);
        result(null, res);
        return;
      }

      result({ kind: "not_found" }, null);
    }
  );
};

module.exports = Entry;
