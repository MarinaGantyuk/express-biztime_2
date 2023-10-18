/** Database setup for BizTime. */
const connectionurl = "postgresql://postgres:12345@localhost:5432/biztime";

const { Client } = require("pg");

const client = new Client({
  connectionString: connectionurl,
});

client.connect();

module.exports = client;
