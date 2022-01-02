const { MongoClient } = require("mongodb");
const connectionString = process.env.ATLAS_URI;
const client = new MongoClient(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

let dbConnection, dbObject;

module.exports = {
    connectToServer: function (callback) {
        return new Promise((resolve, reject) => {
            client.connect(function (err, db) {
                if (err || !db) {
                    reject(err);
                    return;
                }
    
                dbConnection = db;
                dbObject = db.db(process.env.DB_NAME);
    
                resolve();
            });
        });
    },
    getDb: function() {
        return dbObject;
    },
    close: function() {
        dbConnection.close();
    }
};