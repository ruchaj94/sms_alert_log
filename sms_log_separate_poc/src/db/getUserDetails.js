/**
 * @version DAL-V2
 * @copyright Elliot Systems
 * @author sarangshisode, prafullajoshi
 */

const MONGO_UTIL = require('../utils/mongo_util');
const MONGO_CONFIG = require('../configurations/mongo-config');

/**
 * @description This function returns all users who are subscribed to Info subscription.
 * @param {*} p_company_id 
 * @returns list of all users subscribed to Info subscription.
 */
exports.getInfoSubscribedUsersfromCompany = async (p_company_id) => {
    try {
        let mongo_client = await MONGO_UTIL.dbClient();
        let result = await mongo_client.collection(MONGO_CONFIG.COLLECTION_NAMES.users).find(
            { 'company_id': p_company_id, 'subscription.sms.info': true }
        ).toArray();

        if (result.length == 0) {
            return (null);
        }
        return (result);
    }
    catch (error) {
        console.log(error);
    }
};

/**
 * @description This function returns all users who are subscribed to Alert subscription.
 * @param {*} p_company_id 
 * @returns list of all users subscribed to Alert subscription.
 */
exports.getAlertSubscribedUsersfromCompany = async (p_company_id) => {
    try {
        let mongo_client = await MONGO_UTIL.dbClient();
        let result = await mongo_client.collection(MONGO_CONFIG.COLLECTION_NAMES.users).find(
            { 'company_id': p_company_id, 'subscription.sms.alert': true }
        ).toArray();

        if (result.length == 0) {
            return (null);
        }
        return (result);
    }
    catch (error) {
        console.log(error);
    }
};

/**
 * @description This function returns all users who are subscribed to Warning subscription.
 * @param {*} p_company_id 
 * @returns list of all users subscribed to Warning subscription.
 */
exports.getWarningSubscribedUsersfromCompany = async (p_company_id) => {
    try {
        let mongo_client = await MONGO_UTIL.dbClient();
        let result = await mongo_client.collection(MONGO_CONFIG.COLLECTION_NAMES.users).find(
            { 'company_id': p_company_id, 'subscription.sms.warning': true }
        ).toArray();

        if (result.length == 0) {
            return (null);
        }
        return (result);
    }
    catch (error) {
        console.log(error);
    }
};
