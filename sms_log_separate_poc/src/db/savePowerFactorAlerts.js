/**
 * @version DAL-V2
 * @copyright Elliot Systems
 * @author sarangshisode, prafullajoshi
 */

const MONGO_UTIL = require('../utils/mongo_util');
const MONGO_CONFIG = require('../configurations/mongo-config');

/**
 * @description This function save power factor alert in database.
 * @param {*} p_asset_id 
 * @param {*} p_type 
 * @param {*} p_message 
 * @param {*} p_value 
 * @param {*} p_penalty 
 * @param {*} p_alert_time 
 * @param {*} p_theshold 
 * @returns Promise<void>
 */
exports.savePowerFactorAlert = async (p_asset_id, p_type, p_message, p_value, p_penalty, p_alert_time, p_theshold) => {
    let obj = {
        Asset_Id: p_asset_id,
        Category: p_type,
        Description: p_message,
        Value: p_value,
        Threshold: p_type,
        Penalty: p_penalty,
        Time: p_alert_time,
        Threshold: p_theshold,
        Read: false
    }

    let mongo_client = await MONGO_UTIL.dbClient();
    let result = await mongo_client.collection(MONGO_CONFIG.COLLECTION_NAMES.powerFactorAlerts).insertOne(obj);
    console.log("no. of alerts inserted:: ",result.insertedCount);
    //let alertCount = await ALERT_SSE.getAlertsCount(p_asset_id);
    //console.log(alertCount);
    //let alertCount = getAlertsCount(p_asset_id);
    //SERVER_GATEWAY.publish(MQTT_CONFIG.TOPICS.RESPONSE_ALERTS_COUNT, alertCount);
};
