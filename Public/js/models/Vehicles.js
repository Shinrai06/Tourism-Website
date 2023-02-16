const SqlDB = require("../../../config/SqlDB");

class Vehicle {
  constructor(vehicle, query_contact, details, P_id) {
    this.vehicle = vehicle;
    this.query_contact = query_contact;
    this.details = details;
    this.P_id = P_id;
  }

  save() {
    const query = `INSERT INTO TRANSPORT (type,P_id,query_contact,details)
    VALUES(
      '${this.vehicle}',
      ${this.P_id},
      '${this.query_contact}',
      '${this.details}'
    );`;
    return SqlDB.execute(query);
  }

  static getById(id) {
    const query = `select * from TRANSPORT where P_id='${id}'`;
    return SqlDB.execute(query);
  }

  static removeById(id) {
    const query = `DELETE FROM TRANSPORT WHERE V_id = '${id}';`;
    return SqlDB.execute(query);
  }
}

module.exports = Vehicle;
