const SqlDB = require("../../../config/SqlDB");

class Admin {
  constructor(name, email, contact1, contact2, password) {
    this.name = name;
    this.email = email;
    this.contact1 = contact1;
    this.contact2 = contact2;
    this.password = password;
  }

  async save() {
    let query = `insert into ADMINISTRATORS (name,
    email,
    contact,
    contact2,
    password) values( 
        '${this.name}', 
        '${this.email}', 
        '${this.contact1}', 
        '${this.contact2}', 
        '${this.password}')`;
    try {
      await SqlDB.execute(query);
    } catch (err) {
      return [0, err];
    }
    query = `select A_id from ADMINISTRATORS where email='${this.email}'`;
    let res = await SqlDB.execute(query);
    let data = res[0].find((itm) => itm.A_id != "");
    return [data.A_id, ""];
  }

  static findAll() {
    const query = `select * from ADMINISTRATORS;`;
    return SqlDB.execute(query);
  }

  static getNameById(id) {
    const query = `select name from ADMINISTRATORS where A_id = ${id}`;
    return SqlDB.execute(query);
  }

  static async validate(email, password) {
    const query = `select A_id from ADMINISTRATORS where email='${email}' and password='${password}'`;
    let res = await SqlDB.execute(query);
    if (res[0].length > 0) {
      let data = res[0].find((itm) => itm.A_id != "");
      return data.A_id;
    }
    return 0;
  }
}

module.exports = Admin;
