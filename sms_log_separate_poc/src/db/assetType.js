const MONGO = require('../utils/mongo_util');
const MONGO_CONFIG = require('../configurations/mongo-config');

exports.getRegisterFrequency = async(p_RegisterId) =>{
    try {
        if(typeof p_RegisterId != 'number')
        {
            throw error("Invalid Reggister Identifier!");
        }

        let mongo_client = await MONGO.dbClient();
        let result = await mongo_client.collection(MONGO_CONFIG.COLLECTION_NAMES.allRegisters).find({"RegisterId":p_RegisterId}).toArray();
        
        if(result.length == 0)
        {
            throw new error("Cannot Find The Register!");
        }
        return result[0].Frequency;
    } catch (error) {
        console.log(error);
        throw error;
    }
}