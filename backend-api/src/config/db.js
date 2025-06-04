const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'NTruong123@',     // đổi nếu có mật khẩu
  database: 'quanlyhocvien'
});

connection.connect((err) => {
  if (err) {
    console.error('Disconnected to SQL:', err);
  } else {
    console.log('Connected to SQL successfully!');
  }
});

module.exports = connection;
