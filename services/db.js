const { MongoClient } = require("mongodb");
const connectionString = process.env.ATLAS_URI;
const client = new MongoClient(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

let dbConnection;

module.exports = {
    connectToServer: function (callback) {
        return new Promise((resolve, reject) => {
            client.connect(function (err, db) {
                if (err || !db) {
                    reject(err);
                    return;
                }
    
                dbConnection = db.db(process.env.DB_NAME);
    
                resolve(dbConnection);
            });
        });
    }
};