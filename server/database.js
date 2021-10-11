const mysql = require("mysql2/promise");

const connectToMysql = async () => {
  const db = await mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "qwerty12",
    database: "kassa",
  });
  return db;
};

module.exports = {
  connectToMysql,
};
