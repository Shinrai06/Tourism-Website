const SqlDB = require("../../../config/SqlDB");

class Plans {
  constructor(title, type, loc, cost, Photo, days, a_id) {
    this.title = title;
    this.type = type;
    this.loc = loc;
    this.cost = cost;
    this.Photo = Photo;
    this.a_id = a_id;
    this.days = days;
  }

  async save() {
    const query = `INSERT INTO plans (title,category,G_location,cost,photo,days,A_id) VALUES (
      '${this.title}',
      '${this.type}',
      '${this.loc}',
       ${this.cost},
      '${this.Photo}',
       ${this.days},
       ${this.a_id}
    );`;
    await SqlDB.execute(query);
  }

  static findAll() {
    const query = `select * from PLANS;`;
    return SqlDB.execute(query);
  }

  static getById(id) {
    const query = `select * from PLANS where A_id = ${id}`;
    return SqlDB.execute(query);
  }

  static removeById(id) {
    const query = `DELETE FROM PLANS WHERE P_id = '${id}';`;
    return SqlDB.execute(query);
  }
}

module.exports = Plans;
