const MONGO = require('mongodb').MongoClient;
const MONGO_CONFIG = require('../configurations/mongo-config');
const MONGO_URL = MONGO_CONFIG.DATABASE.URL;
const DATABASE_NAME = MONGO_CONFIG.DATABASE.NAME;
let MONGO_CLIENT;

/**
 * 
 * @param {*} p_database
 * getMongoClient() creates a mongo db instance, which is shared by all the function's 
 */
function getMongoClient(p_database) {
    if (!MONGO_CLIENT) {
        return new Promise((resolve, reject) => {
            MONGO.connect(MONGO_URL, {
                useNewUrlParser: true,
                poolSize: 200,
                reconnectTries: Number.MAX_VALUE,
                reconnectInterval: 1000,
                keepAlive: 300000,
                autoReconnect: true
            }, async function (err, client) {
                if (err) {
                    return reject(err);
                }
                MONGO_CLIENT = client.db(p_database);
                resolve(MONGO_CLIENT);
            });
        });
    } else {
        return MONGO_CLIENT;
    }
};

module.exports.dbClient = async () => {
    let database = await getMongoClient(DATABASE_NAME);
    return database;
}
