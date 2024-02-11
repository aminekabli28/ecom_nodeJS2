const mongoose = require("mongoose");

const dbConect = () => {
  mongoose
    .connect(`mongodb+srv://${process.env.DB_CONN}@4store.jsdpp45.mongodb.net/`)
    .then(() => {
      console.log("connection successfuly");
    });
  //.catch((err) => { console.log('connection failed ' + err) })
};

module.exports = dbConect;
