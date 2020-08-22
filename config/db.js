const mongoose = require('mongoose');
require('dotenv').config({ path: 'variables.env' });

/**
 * @name:connectDB.
 * @description:Connects server to DB.
 * @param:none.
 */
const connectDB = async () => {
    console.log(process.env.DB_MONGO);
    try {
        await mongoose.connect(process.env.DB_MONGO, {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });
        console.log('DB merntasks connected');
    } catch (error) {
        console.log(error);
        process.exit(1);//Stops server
    }
}

module.exports = connectDB;