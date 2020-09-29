/**
 * @version DAL-V2
 * @copyright Elliot Systems
 * @author omkarlanghe
 */

const MONGO_UTIL = require('../utils/mongo_util');
const MONGO_CONFIG = require('../configurations/mongo-config');

/**
 * @description Function returs meter details from its associated gateway.
 * @param {*} gatewayId 
 * @returns JSON object containing meter details including IP Address.
 */
exports.getAssetDetails = async (gatewayId, slave_id) => {
    try {
        let gateway = gatewayId.toString();
        let mongo_client = await MONGO_UTIL.dbClient();
        let query = {
            'Gateway': gateway
        }
        if(typeof slave_id == 'number')
        {
            query["SlaveId"]= slave_id;
        }
        let assetDetails = await mongo_client.collection(MONGO_CONFIG.COLLECTION_NAMES.companyAssets).aggregate([
            { $match: query},
            { $project: { '_id': 0, 'CompanyId': 1, 'InstallationDate': 1, 'IPAddress': 1, 'Gateway': 1, 'AssetId': 1, 'AssetTypeId': 1} }
        ]).toArray().then((result) => {
            return (result[0])
        });
        return (assetDetails);
    } catch (error) {
        console.error(error);
    }
};

/**
 * @description Function returs company id associated with the given asset.
 * @param {*} p_asset_id 
 * @returns company id.
 */
exports.getAssetCompanyId = async (p_asset_id) => {
    try {
        let mongo_client = await MONGO_UTIL.dbClient();
        let result = await mongo_client.collection(MONGO_CONFIG.COLLECTION_NAMES.companyAssets).aggregate([
            { '$match': { 'AssetId': p_asset_id } },
            { '$project': { "CompanyId": 1 } }
        ]).toArray();
        if (result.length == 0) {
            return null;
        }
        return result[0].CompanyId;
    } catch (error) {
        console.error(error);
    }
};

/**
 * @description Function returs asset name from asset id. eg. PIBM Main incomer.
 * @param {*} p_asset_id 
 * @returns Asset name.
 */
exports.getAssetName = async (p_asset_id) => {
    try {
        let mongo_client = await MONGO_UTIL.dbClient();
        let result = await mongo_client.collection(MONGO_CONFIG.COLLECTION_NAMES.companyAssets).aggregate([
            { '$match': { 'AssetId': p_asset_id } },
            { '$project': { "AssetName": 1, "_id": -1 } }
        ]).toArray();

        if (result.length === 0) {
            return null;
        }
        return result[0].AssetName;
    } catch (error) {
        console.error(error);
    }
};
