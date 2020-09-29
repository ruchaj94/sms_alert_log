/**
 * @version DAL-V2
 * @copyright Elliot Systems
 * @author omkarlanghe
 */

const MONGO_UTIL = require('../utils/mongo_util');
const MONGO_CONFIG = require('../configurations/mongo-config');

/**
 * @description This function returns list of register details from the given asset type
 * @param {*} assetTypeId 
 * @param {*} registerType if instantanous then this parameter has a value = "I", else undefined.
 * @retusn list of register details for that asset type.
 */
exports.getRegisterDetails = async (assetTypeId, registerType) => {
    try {
        let mongo_client = await MONGO_UTIL.dbClient();

        if (registerType === 'I') {
            let registers = await mongo_client.collection(MONGO_CONFIG.COLLECTION_NAMES.allRegisters).aggregate([
                { '$match': { AssetTypeId: assetTypeId, Frequency: registerType } },
                { '$project': { _id: 0 } }
            ]).toArray();

            return (registers);
        } else {
            let registers = await mongo_client.collection(MONGO_CONFIG.COLLECTION_NAMES.allRegisters).aggregate([
                { '$match': { AssetTypeId: assetTypeId, Frequency: { $ne: 'I' } } },
                { '$project': { _id: 0 } }
            ]).toArray();

            let date = new Date().getTime() / 1000;

            for (let i = 0; i < registers.length; i++) {
                registers[i]['ActValue'] = 0.000;
                registers[i]['CurrDatetime'] = Math.round(date);
            }

            return (registers);
        }
    } catch (error) {
        console.error(error);
    }
};
