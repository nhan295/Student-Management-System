require('dotenv').config(); // doc noi dung .env va them vao process.env
const {DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME} = process.env

module.exports = {
    client: 'mysql',
    connection: {
        host: DB_HOST,
        port: DB_PORT,
        user: DB_USER,
        password: DB_PASS,
        database: DB_NAME
    },
};