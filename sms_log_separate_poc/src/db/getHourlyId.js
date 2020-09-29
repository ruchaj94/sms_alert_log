/**
 * @version DAL-V2
 * @copyright Elliot Systems
 * @author omkarlanghe
 */

const MONGO_UTIL = require('../utils/mongo_util');
const MONGO_CONFIG = require('../configurations/mongo-config');

/**
 * @description Function returs hourly id associated with the given time. Eg. "00:30" returns 1.
 * @param {*} p_asset_id 
 * @returns hourly id.
 */
exports.getHourlyId = async (hourlyTime) => {
    try {
        let mongo_client = await MONGO_UTIL.dbClient();
        let hourlyId = await mongo_client.collection(MONGO_CONFIG.COLLECTION_NAMES.halfHours).aggregate([
            { '$match': { 'HourlyTime': hourlyTime } },
            { '$project': { '_id': 0, 'RegisterAddress': 0, 'HourlyTime': 0 } }
        ]).toArray().then(function (result) {
            return (result[0].HourlyId);
        });
        return (hourlyId);
    } catch (error) {
        console.error(error);
    }
};
