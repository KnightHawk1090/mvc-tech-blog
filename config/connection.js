// reqire the sequelize package
const Sequelize = require('sequelize');
// require the dotenv package and call the config method to load env. variables
require('dotenv').config();

// create a new sequelized instance with the connection URL 
let sequelize

if(process.env.JAWSDB_URL) {
    sequelize = new Sequelize(process.env.JAWSDB_URL);

} else {
    sequelize = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASSWORD,
        {
            host: 'localhost',
            dialect: 'mysql',
            port: 3306
        }
    );
}
// export the sequelize instances to be used by the application
module.exports = sequelize;