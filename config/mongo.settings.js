const mongoose = require( 'mongoose' );
const url = "mongodb://localhost:27017";

require('dotenv').config();

let database;

module.exports.connectToDb = ( callback ) => {
        mongoose.connect(`${process.env.DB_URL}`,  {useNewUrlParser: true, useUnifiedTopology: true}, function( err, client ) {
          database  = client.db(process.env.DB_NAME);
          return callback( err );
        });
    }

module.exports.getDb = () => {
    return database;
  }