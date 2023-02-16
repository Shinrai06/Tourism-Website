const SqlDB = require("../../../config/SqlDB");
const getDate = require("../controllers/getDate");

class Plans {
  constructor(A_id, title, loc, expense, photo, days, date, maxPeople) {
    this.title = title;
    this.loc = loc;
    this.expense = expense;
    this.photo = photo;
    this.A_id = A_id;
    this.days = days;
    this.date = date;
    this.maxPeople = maxPeople;
    this.availSlots = maxPeople;
  }

  save() {
    const query = `INSERT INTO plans (A_id, title, G_location, expense, photo, days, date, maxPeople, 
      availSlots) VALUES(
      ${this.A_id},
      '${this.title}',
      '${this.loc}',
      ${this.expense},
      '${this.photo}',
      ${this.days},
      '${this.date}',
      ${this.maxPeople},
      ${this.availSlots}
    );`;
    return SqlDB.execute(query);
  }

  static findAll() {
    const query = `select * from PLANS`;
    return SqlDB.execute(query);
  }

  static findAllWithAdminName() {
    let today = getDate.getDate();
    const query = `select P_id, a.A_id, title, G_location, expense, photo, days, maxPeople, availSlots, name as admin_name, date
    from dbd.PLANS as p, dbd.ADMINISTRATORS as a where a.A_id=p.A_id and date>= '${today}'`;
    return SqlDB.execute(query);
  }

  static findPlanWithAdminDetails(id) {
    const query = `select title, G_location, days, name as admin_name, date, email, contact
    from dbd.PLANS as p, dbd.ADMINISTRATORS as a where a.A_id=p.A_id and p.P_id = ${id};`;
    return SqlDB.execute(query);
  }

  static getById(id) {
    const query = `select * from PLANS where A_id = ${id}`;
    return SqlDB.execute(query);
  }

  static getByNoOfPeople(availPeople) {
    let today = getDate.getDate();
    const query = `select P_id, a.A_id, title, G_location, expense, photo, days, maxPeople, availSlots, name as admin_name, date
    from dbd.PLANS as p, dbd.ADMINISTRATORS as a where a.A_id=p.A_id and date>= '${today}' and availSlots>=${availPeople}`;
    return SqlDB.execute(query);
  }

  static removeById(id) {
    const query = `DELETE FROM PLANS WHERE P_id = '${id}';`;
    return SqlDB.execute(query);
  }

  static async updateSlots(id, peopleSelected) {
    let query = `SELECT availSlots FROM dbd.plans WHERE P_id = ${id};`;
    const [avail, setAvail] = await SqlDB.execute(query);
    if (avail[0].availSlots < peopleSelected) {
      console.log("No enough Seats");
      return false;
    }
    query = `UPDATE plans SET availSlots = availSlots-${peopleSelected} WHERE P_id = ${id};`;
    try {
      await SqlDB.execute(query);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  static getCostById(id) {
    const query = `select expense from plans where P_id = ${id};`;
    return SqlDB.execute(query);
  }

  static getAvailSlotsById(id) {
    const query = `SELECT availSlots FROM plans where P_id = ${id};`;
    return SqlDB.execute(query);
  }
}

module.exports = Plans;
