/**
 * @version DAL-V2
 * @copyright Elliot Systems
 * @author sarangshisode
 */

const MONGO_UTIL = require('../utils/mongo_util');
const MONGO_CONFIG = require('../configurations/mongo-config');

exports.getValueForPowerFactor = async (obj) => {
    try {
        let register_value_to_be_fetched = null;
        if (obj.element.RegisterId == 17) { //If we have kWH
            register_value_to_be_fetched = 23;  //We have to fetch kVAH
        } else {
            register_value_to_be_fetched = 17;
        }

        let mongo_client = await MONGO_UTIL.dbClient();
        let result = await mongo_client.collection(MONGO_CONFIG.COLLECTION_NAMES.energyMeterValues).aggregate([
            { '$match': { 'RegisterId': register_value_to_be_fetched, 'AssetId': obj.AssetId, 'ValueReceivedDate': obj.CurrDatetime } },
            { '$sort': { 'ValueReceivedDate': -1 } },
            { '$limit': 1 }
        ]).toArray();

        if (result.length == 0) {
            return (null);
        }

        if (typeof obj.CurrDatetime == 'number' && typeof result[0].ValueReceivedDate == 'number') {
            return (result);
        }

    } catch (error) {
        console.error(error);
    }
};
