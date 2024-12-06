const { Pool } = require("pg")

const client = new Pool({
    "user" : "ubuntu",
    "password" : "1234",
    "host" : "localhost",
    "database" : "dmap",
    "port" : 5432,
    "max" : 10
})

client.connect()

module.exports = client;