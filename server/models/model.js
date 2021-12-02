const sql = require("./db.js");

// constructor
const LogEntry = function(logEntry) {
  this.ProductName = logEntry.ProductName;
  this.LogId = logEntry.LogId;
  this.DateIn = logEntry.DateIn;
  this.DateOut = logEntry.DateOut;
  this.EmployeeIn = logEntry.EmployeeIn;
  this.EmployeeOut = logEntry.EmployeeOut;
};


LogEntry.create = (newLogEntry, result) => {
    sql.query("INSERT INTO logentries SET ?", newLogEntry, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      console.log("created log entry: ", newLogEntry);
      result(null, newLogEntry);
    });
};

LogEntry.findByLogId = (logId, result) => {
    sql.query(`SELECT * FROM logentries WHERE LogId = ${logId}`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      if (res.length) {
        console.log("found log entry: ", res[0]);
        result(null, res[0]);
        return;
      }
  
      // not found LogEntry with the name
      result({ kind: "not_found" }, null);
    });
};

LogEntry.updateByLogId = (logId, logEntry, result) => {
    sql.query(
      `UPDATE logentries SET ProductName = IfNull(?, ProductName), LogId = IfNull(?, LogId), 
      DateIn = IfNull(?, DateIn), DateOut = IfNull(?, DateOut), EmployeeIn = IfNull(?, EmployeeIn),
      EmployeeOut = IfNull(?, EmployeeOut) WHERE LogId = ?`,
      [logEntry.ProductName, logEntry.logId, logEntry.DateIn, logEntry.DateOut, logEntry.EmployeeIn, logEntry.EmployeeOut, logId],
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
  
        console.log("updated user: ", logEntry);
        result(null, logEntry);
      }
    );
};

LogEntry.remove = (logId, result) => {
    sql.query("DELETE FROM logentries WHERE LogId = ?", logId, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      if (res.affectedRows == 0) {
        // not found Log Entry with the log id
        result({ kind: "not_found" }, null);
        return;
      }
  
      console.log("deleted log entry with log id: ", logId);
      result(null, res);
    });
};

LogEntry.findByDateRange = (dateRange, result) => {
  sql.query("SELECT * FROM logentries WHERE DateIn BETWEEN DATE_SUB(CURDATE(), INTERVAL ? DAY)  AND CURDATE()", dateRange, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    } 
    
    if (res) {
      console.log('found log entries: ', res);
      result(null, res);
      return;
    }
    
    result({kind: 'not_found'}, null);

  });
}

module.exports = LogEntry;
