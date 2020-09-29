const MONGO = require('../utils/mongo_util');

exports.saveTest = async(p_Data)=>{
    let mongo_client = await MONGO.dbClient();
    let result = await mongo_client.collection("test").insertOne(p_Data);
    return result;
}