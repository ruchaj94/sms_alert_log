const MONGO_CONFIG = require('../../configurations/mongo-config');
const MONGO_UTIL =require('../../utils/mongo_util');

exports.insertRawData = async (p_Data) => {
    try {
        let mongo_client = await MONGO_UTIL.dbClient();
        let response = await mongo_client.collection(MONGO_CONFIG.COLLECTION_NAMES.energyMeterRawData).insertOne(p_Data);
        if(response.result.n === 1) {
            return (response.result);
        }
        return (response.result);
    } catch (error) {
        throw error;
    }
};
