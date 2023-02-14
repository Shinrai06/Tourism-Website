const SqlDB = require("../../../config/SqlDB");

class Vehicle {
  constructor(vehicle, P_id) {
    this.vehicle = vehicle;
    this.P_id = P_id;
  }

  async save() {
    const query = `INSERT INTO TRANSPORT (vehicle, P_id)
        VALUES(
            '${this.vehicle}',
            '${this.P_id}'
        );`;
    await SqlDB.execute(query);
  }

  static getById(id) {
    const query = `select vehicle from TRANSPORT where P_id='${id}'`;
    return SqlDB.execute(query);
  }
}

module.exports = Vehicle;
