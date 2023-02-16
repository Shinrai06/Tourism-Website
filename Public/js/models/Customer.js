const SqlDB = require("../../../config/SqlDB");

class Customer {
  constructor(name, email, contact, address, password) {
    this.name = name;
    this.email = email;
    this.contact = contact;
    this.address = address;
    this.password = password;
  }

  async save() {
    let query = `insert into CUSTOMERS (name, email, contact, address, password) values( 
                '${this.name}', 
                '${this.email}', 
                '${this.contact}', 
                '${this.address}', 
                '${this.password}')`;
    try {
      await SqlDB.execute(query);
    } catch (err) {
      return [0, err];
    }
    query = `select U_id from CUSTOMERS where email='${this.email}'`;
    let res = await SqlDB.execute(query);
    let data = res[0].find((itm) => itm.U_id != "");
    return [data.U_id, ""];
  }

  static findAll() {
    const query = `select * from CUSTOMERS;`;
    return SqlDB.execute(query);
  }

  static getNameAndEmailById(id) {
    const query = `SELECT name, email FROM dbd.customers where U_id=${id};`;
    return SqlDB.execute(query);
  }

  static async validate(email, password) {
    const query = `select U_id from CUSTOMERS where email='${email}' and password='${password}'`;
    let res = await SqlDB.execute(query);
    if (res[0].length > 0) {
      let data = res[0].find((itm) => itm.U_id != "");
      return data.U_id;
    }
    return 0;
  }
}

module.exports = Customer;
