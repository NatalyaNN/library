// ydb.config.js
const { v1: ydb } = require('ydb-sdk');
const env = require('dotenv').config();

const endpoint = process.env.DB_ENDPOINT;
const database = process.env.DB_PATH; // Путь к базе данных
const credentials = {
   iam: {
      type: 'service_account',
      saKeyFile: process.env.YDB_SA_KEY_FILE,
   },
};

const YDBdriver = new ydb.Driver({
   endpoint,
   credentials,
   database,
});

export default YDBdriver;