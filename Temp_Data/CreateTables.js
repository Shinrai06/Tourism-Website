const dotenv = require("dotenv");
const mysql = require("mysql2");

const customerData = require("./rawData/customer");
const adminData = require("./rawData/admin");
// const plans = require("./rawData/plans");
// const attractions = require("./rawData/tourismAttraction");
// const transport = require("./rawData/transport");

const Customer = require("../Public/js/models/Customer");
const Admin = require("../Public/js/models/Admin");
const Plans = require("../Public/js/models/Plans");

dotenv.config({ path: "../.env" });

const connection = mysql.createConnection({
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
});

// reset the database
connection.query("drop database dbd", (err, row, col) => {
  console.log("Deleted DBD");
});
connection.query("create database dbd", (err, row, col) => {
  if (err) console.log(err.sqlMessage);
  console.log("Created DBD");
});
connection.query("use dbd", (err, row, col) => {
  if (err) console.log(err.sqlMessage);
  console.log("Switched DBD");
});

//queries
const CUSTOMERS = `CREATE TABLE CUSTOMERS (
                  U_id INT NOT NULL AUTO_INCREMENT,
                  name VARCHAR(40) NOT NULL,
                  email VARCHAR(45) NOT NULL,
                  contact VARCHAR(45) NOT NULL,
                  address VARCHAR(100) NULL,
                  password VARCHAR(45) NOT NULL,
                  PRIMARY KEY (U_id),
                  UNIQUE INDEX email_UNIQUE (email ASC) VISIBLE)`;

const ADMINISTRATORS = `CREATE TABLE ADMINISTRATORS (
                        A_id INT NOT NULL AUTO_INCREMENT,
                        name VARCHAR(40) NOT NULL,
                        email VARCHAR(55) NOT NULL,
                        contact VARCHAR(25) NOT NULL,
                        contact2 VARCHAR(25) NULL,
                        password VARCHAR(45) NOT NULL,
                        PRIMARY KEY (A_id),
                        UNIQUE INDEX email_UNIQUE (email ASC) VISIBLE);`;

const BILLING = `CREATE TABLE BILLING (
                id INT NOT NULL AUTO_INCREMENT,
                user_id INT NULL,
                pl_id INT NULL,
                date DATE NOT NULL,
                ref_no VARCHAR(45) NULL,
                type VARCHAR(45) NULL,
                coupons VARCHAR(45) NULL,
                tot_amount DECIMAL(10,2) NOT NULL,
                PRIMARY KEY (id),
                INDEX user_id_idx (user_id ASC) VISIBLE,
                INDEX plan_id_idx (pl_id ASC) VISIBLE,
                CONSTRAINT user_id
                  FOREIGN KEY (user_id)
                  REFERENCES customers (U_id)
                  ON DELETE SET NULL
                  ON UPDATE CASCADE,
                CONSTRAINT pl_id
                  FOREIGN KEY (pl_id)
                  REFERENCES plans (P_id)
                  ON DELETE SET NULL
                  ON UPDATE CASCADE);`;

const PLANS = `CREATE TABLE PLANS (
              P_id INT NOT NULL AUTO_INCREMENT,
              title VARCHAR(45) NOT NULL,
              category VARCHAR(5) NULL,
              G_location VARCHAR(45) NOT NULL,
              cost DECIMAL(10,2) NOT NULL,
              photo VARCHAR(200) NULL,
              days INT NULL,
              A_id INT NULL,
              PRIMARY KEY (P_id),
              INDEX A_id_idx (A_id ASC) VISIBLE,
              CONSTRAINT A_id
              FOREIGN KEY (A_id)
              REFERENCES administrators (A_id)
                ON DELETE SET NULL
                ON UPDATE CASCADE);`;

const TRANSPORT = `CREATE TABLE TRANSPORT (
                    vehicle VARCHAR(20) NOT NULL,
                    P_id INT NOT NULL,
                    PRIMARY KEY (vehicle, P_id),
                    INDEX P_id_idx (P_id ASC) VISIBLE,
                    CONSTRAINT P_id
                      FOREIGN KEY (P_id)
                      REFERENCES plans (P_id)
                      ON DELETE CASCADE
                      ON UPDATE CASCADE);`;

const TOURISM_ATTRACTION = `CREATE TABLE TOURISM_ATTRACTION (
                            T_id INT NOT NULL AUTO_INCREMENT,
                            name VARCHAR(45) NOT NULL,
                            description VARCHAR(200) NULL,
                            cost DECIMAL(10,2) NOT NULL,
                            hotel VARCHAR(45) NULL,
                            M_location VARCHAR(45) NOT NULL,
                            Plan_id INT NULL,
                            PRIMARY KEY (T_id),
                            INDEX P_id_idx (Plan_id ASC) VISIBLE,
                            CONSTRAINT Plan_id
                              FOREIGN KEY (Plan_id)
                              REFERENCES plans (P_id)
                              ON DELETE CASCADE
                              ON UPDATE CASCADE);`;

// create Tables
connection.query(CUSTOMERS, (err, row, col) => {
  console.log("Created Table CUSTOMERS");
});
connection.query(ADMINISTRATORS, (err, row, col) => {
  console.log("Created Table ADMINISTRATORS");
});
connection.query(PLANS, (err, row, col) => {
  console.log("Created Table PLANS");
});
connection.query(TOURISM_ATTRACTION, (err, row, col) => {
  console.log("Created Table TOURISM_ATTRACTION");
});
connection.query(TRANSPORT, (err, row, col) => {
  console.log("Created Table TRANSPORT");
});
connection.query(BILLING, (err, row, col) => {
  console.log("Created Table BILLING");
});

// fix the auto-increments
const admin_inc = `ALTER TABLE ADMINISTRATORS AUTO_INCREMENT=1000`;
const plan_inc = `ALTER TABLE PLANS AUTO_INCREMENT=2000`;
const bill_inc = `ALTER TABLE BILLING AUTO_INCREMENT=3000`;
const tour_inc = `ALTER TABLE TOURISM_ATTRACTION AUTO_INCREMENT=4000`;

let queries = [admin_inc, plan_inc, bill_inc, tour_inc];

for (let q of queries) {
  connection.query(q, (err, results, cols) => {
    if (err) console.log(err.sqlMessage);
  });
}

// add data
async function add() {
  for (const item of adminData) {
    const { name, email, password, contact1, contact2 } = item;
    let raw = `insert into ADMINISTRATORS (name,
      email,
      contact,
      contact2,
      password) values( 
          '${name}', 
          '${email}', 
          '${contact1}', 
          '${contact2}', 
          '${password}')`;
    connection.query(raw, (err, results, cols) => {
      if (err) {
        console.log(err.sqlMessage);
      }
    });
  }

  for (const item of customerData) {
    const { name, email, password, contact, address } = item;
    const raw = `insert into CUSTOMERS (name, email, contact, address, password) values( 
      '${name}', 
      '${email}', 
      '${contact}', 
      '${address}', 
      '${password}')`;
    connection.query(raw, (err, results, cols) => {
      if (err) {
        console.log(err.sqlMessage);
      }
    });
  }
}

add();
