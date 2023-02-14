const SqlDB = require("../../../config/SqlDB");

class Customer {
  constructor(name, email, contact, address, password) {
    this.name = name;
    this.email = email;
    this.contact = contact;
    this.address = address;
    this.passowrd = password;
  }

  async save() {
    const query = `insert into CUSTOMERS (name, email, contact, address, password) values( 
                '${this.name}', 
                '${this.email}', 
                '${this.contact}', 
                '${this.address}', 
                '${this.password}')`;
    let res = await SqlDB.execute(query);
    let data = res[0].find((itm) => itm.A_id != "");
    console.log(data.A_id);
    return data.A_id;
  }
}

module.exports = Customer;
