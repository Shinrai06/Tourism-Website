const SqlDB = require("../../../config/SqlDB");

class Attractions {
  constructor(name, description, loc, hotel, P_id) {
    this.name = name;
    this.description = description;
    this.loc = loc;
    this.hotel = hotel;
    this.P_id = P_id;
  }

  save() {
    let query = `INSERT INTO TOURISM_ATTRACTION (name, description, hotel, M_location, Plan_id)
    VALUES(
        '${this.name}',
        '${this.description}',
        '${this.hotel}',
        '${this.loc}',
        ${this.P_id}
        )`;

    return SqlDB.execute(query);
  }

  static findAll() {
    const query = `select * from TOURISM_ATTRACTION;`;
    return SqlDB.execute(query);
  }

  static getById(id) {
    const query = `select * from TOURISM_ATTRACTION where Plan_id = ${id}`;
    return SqlDB.execute(query);
  }

  static removeById(id) {
    const query = `DELETE FROM TOURISM_ATTRACTION WHERE T_id = '${id}';`;
    return SqlDB.execute(query);
  }
}

module.exports = Attractions;
