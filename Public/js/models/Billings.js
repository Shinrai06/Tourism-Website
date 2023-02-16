const SqlDB = require("../../../config/SqlDB");
const getDate = require("../controllers/getDate");

class Billings {
  constructor(U_id, P_id, ref_no, type, coupon, cost, noOfPeople) {
    this.U_id = U_id;
    this.P_id = P_id;
    this.date = getDate.getDate();
    this.ref_no = ref_no;
    this.type = type;
    this.cost = cost;
    this.coupon = coupon;
    this.noOfPeople = noOfPeople;
  }

  save() {
    const query = `INSERT INTO billing ( user_id, pl_id, date, ref_no, type, coupon, tot_amount, people)
    VALUES(
      ${this.U_id},
      ${this.P_id},
      '${this.date}',
      '${this.ref_no}',
      '${this.type}',
      '${this.coupon}',
      ${this.cost},
      ${this.noOfPeople}
    );`;
    return SqlDB.execute(query);
  }

  static getUserInfoById(id) {
    const query = `SELECT name, email, contact, tot_amount, people, date FROM dbd.billing b, dbd.customers c WHERE c.U_id = b.user_id and b.pl_id=${id};`;
    return SqlDB.execute(query);
  }
}

module.exports = Billings;
