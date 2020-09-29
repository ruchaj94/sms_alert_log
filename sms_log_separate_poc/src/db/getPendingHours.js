/**
 * @version DAL-V2
 * @copyright Elliot Systems
 * @author omkarlanghe
 */

const MONGO_UTIL = require('../utils/mongo_util');
const MONGO_CONFIG = require('../configurations/mongo-config');

/**
 * @description This function takes parameters mentioned below and returns pending hours to be filled for that particulare register id.
 * @param {*} curDate 
 * @param {*} registerId 
 * @param {*} assetId 
 * @param {*} gateway 
 * @returns list of pending hours for that register.
 */
exports.getPendingHours = async (curDate, registerId, assetId, gateway) => {
    try {
        let lastValDate = await getLastValueDate(registerId, assetId);
        if (await hasGateway(assetId, gateway)) {
            let pending_hours = getHalfHours(new Date(lastValDate), new Date(curDate));
            let halfHours = await getHalfHourRegisterAddresses(pending_hours);
            let returnObject = { RegisterId: registerId, AssetId: assetId, HourlyRegArray: halfHours };
            return (returnObject);
        } else {
            console.error('Gateway not found');
        }
    } catch (error) {
        console.error(error);
    }
};

/**
 * @description This function takes parameters mentioned below and returns last timestamp inserted for that register id. If not found, returns installation date.
 * @param {*} regId 
 * @param {*} assetId 
 * @returns value recieved date. If not found, returns installation date.
 */
async function getLastValueDate(regId, assetId) {
    try {
        let mongo_client = await MONGO_UTIL.dbClient();
        let retVal = await mongo_client.collection(MONGO_CONFIG.COLLECTION_NAMES.energyMeterValues).aggregate([
            { '$match': { 'RegisterId': regId, 'AssetId': assetId } },
            { '$project': { '_id': 0 } },
            { '$sort': { 'ValueReceivedDate': -1 } },
            { '$limit': 1 }
        ]).toArray();

        if (retVal.length != 0) {
            return (retVal[0].ValueReceivedDate);
        } else {
            let query1 = { AssetId: assetId };
            let query2 = { projection: { _id: 0, InstallationDate: 1 } };
            let install_time = await mongo_client.collection(MONGO_CONFIG.COLLECTION_NAMES.companyAssets).find(query1, query2).toArray();
            return (install_time[0].InstallationDate);
        }
    } catch (error) {
        console.error(error);
    }
};

/**
 * @description Functions checks if the given meter (i.e. asset) has a gateway or not. 
 * @param {*} assetId 
 * @param {*} gatewayId 
 * @returns true if meter has gateway, else returns false.
 */
async function hasGateway(assetId, gatewayId) {
    try {
        let mongo_client = await MONGO_UTIL.dbClient();
        let hasGateway = await mongo_client.collection(MONGO_CONFIG.COLLECTION_NAMES.companyAssets).aggregate([
            { '$match': { 'AssetId': assetId, 'Gateway': gatewayId } }
        ]).toArray().then((result) => { return (result.length != 0 ? true : false); });
        return (hasGateway);
    } catch (error) {
        console.error(error);
    }
};

/**
 * @description This function calculated difference and based on that, returns pending hours between that difference calculated.
 * @param {*} from 
 * @param {*} to 
 * @returns list of pending hours
 */
function getHalfHours(from, to) {
    let difference = to.getTime() - from.getTime();
    let pending_hours = [];
    let half_hours = parseInt(difference / (30 * 60000));
    from.setSeconds(0);
    if (from.getMinutes() >= 30) {
        from.setMinutes(30);
    } else {
        from.setMinutes(0);
    }
    for (let i = 0; i < half_hours; i++) {
        from.setMinutes(from.getMinutes() + 30);
        let time = new Date(from.getTime());
        pending_hours.push(time);
    }
    return (pending_hours);
};

/**
 * @description This functions returns register addresses for every half hour id.
 * @param {*} array 
 * @returns list of half hours with their associated register addresses.
 */
async function getHalfHourRegisterAddresses(array) {
    try {
        let mongo_client = await MONGO_UTIL.dbClient();
        let HourlyRegArray = [];
        for await (const index of array) {
            try {
                let hr = new Date(index).getHours();
                let min = new Date(index).getMinutes();
                min = (min == '0') ? '00' : min;
                let query1 = { HourlyTime: { $eq: hr + ':' + min } };
                let query2 = { projection: { _id: 0 } };
                let registerAdd = await mongo_client.collection(MONGO_CONFIG.COLLECTION_NAMES.halfHours).find(query1, query2).toArray().then((registerAdd) => {
                    let obj = {
                        'HourlyId': registerAdd[0].HourlyId,
                        'HourlyTime': registerAdd[0].HourlyTime,
                        'RegisterAddress': registerAdd[0].RegisterAddress,
                        'Time': index.getTime()
                    };
                    return (obj);
                });
                HourlyRegArray.push(registerAdd);
            } catch (error) {
                console.error(error);
            }
        }
        return (HourlyRegArray);
    } catch (error) {
        console.error(error);
    }
};
