// scripts/init-db.js

const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');

// Konfigurasi DB
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  multipleStatements: true
});

// Path file SQL
const sqlPath = path.join(__dirname, '../sql/setup.sql');
const setupSql = fs.readFileSync(sqlPath, 'utf8');

// SQL tambahan buat create & use database agrocycle
const initDbSql = `
  CREATE DATABASE IF NOT EXISTS agrocycle;
  USE agrocycle;
`;

// Eksekusi
connection.connect((err) => {
  if (err) throw err;
  console.log('✅ Terhubung ke MySQL...');

  // Eksekusi create database dan use database dulu
  connection.query(initDbSql, (err) => {
    if (err) throw err;
    console.log('✅ Database agrocycle siap digunakan.');

    // Lalu eksekusi setup.sql yang sudah ada
    connection.query(setupSql, (err, results) => {
      if (err) throw err;
      console.log('✅ Database berhasil di-setup!');
      connection.end();
    });
  });
});
