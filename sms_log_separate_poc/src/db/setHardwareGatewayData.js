/**
 * @version DAL-V2
 * @copyright Elliot Systems
 * @author omkarlanghe
 * @description All the functions in this javascript file are insertion functions which inserts historical data values
 *              related to hardware gateway.
 */

const { hGetValueFromByteArray } = require('../helpers/getValuesFromByteArray');
const { getHourlyId } = require('./getHourlyId');
let { sendPowerFactorAlert } = require('../controllers/alertsController');
const JSON_HELPER = require('../helpers/json-generation');
const { getRegisterFrequency } = require('./assetType');
const { getAssetDetails } = require('./getAssetDetails');

/**
 * @description This function navigates to the appropriate insertion function based on frequency (Daily, Monthly, Hourly, Max dem Month, Max dem Daily).
 *              if (registerId > 0 && registerId <= 8)          : gateway sends daily registers with register id from 1 to 8
 *              else if (registerId > 8 && registerId <= 16)    : gateway sends monthly registers with register id from 9 to 16
 *              else if (registerId > 16 && registerId <= 35)   : gateway sends hourly registers with register id from 17 to 35
 *              else if (registerId >= 40 && registerId <= 47)  : gateway sends maximum demand monthly registers with register id from 40 to 47
 *              else if (registerId > 47 && registerId <= 55)   : gateway sends maximum demand daily registers with register id from 48 to 55
 * @param {*} mObject 
 * @returns Promise<void>
 */
exports.setEnergyMeterData = async (mObject) => {
    try {
        let assetId = mObject.AssetId;
        let registerId = parseInt(mObject.reg_id);
        let gatewayId = mObject.bot_id;
        let createdDate = new Date(mObject.time).getTime();
        let x = hGetValueFromByteArray(mObject.reg_data);
        let frequency = await getRegisterFrequency(registerId);


        saveModbusScannerIncomingJson(mObject);
        console.log("Scanner Input: \n" + mObject);
        console.log("\n-----------------------------------------\n");

        if (frequency == "D") { // gateway sends daily registers with register id from 1 to 8

            let dtDate = createdDate;
            dtDate = new Date(dtDate).setDate(new Date(dtDate).getDate() - 1);
            // historical generation time
            let generationTime = new Date(createdDate).setHours(00, 01, 00, 00);
            let dailyJson = JSON_HELPER.generateJsonStructureForDailyData(registerId, x, dtDate, assetId, gatewayId, createdDate, generationTime);
            // call to insert function
            await insertMeterDailyData(dailyJson);

        } else if (frequency == "M") { // gateway sends monthly registers with register id from 9 to 16

            let dtDate = createdDate;
            dtDate = new Date(dtDate).setDate(1);
            dtDate = new Date(dtDate).setHours(00, 30, 00, 00);
            // historical generation time
            let generationTime = new Date(createdDate).setDate(1);
            generationTime = new Date(generationTime).setHours(00, 01, 00, 00);
            let monthlyJson = JSON_HELPER.generateJsonStructureForMonthlyData(registerId, x, dtDate, assetId, gatewayId, createdDate, generationTime);
            // call to insert function
            await insertMeterMonthlyData(monthlyJson);

        } else if (frequency == "H") { // gateway sends hourly registers with register id from 17 to 35

            // hourly readings
            let ValueReceivedDate = createdDate;
            let hour = new Date(ValueReceivedDate).getHours();
            let min = new Date(ValueReceivedDate).getMinutes();
            min = (min == '0') ? '00' : min;
            let getHourlyTime = (hour + ":" + min).toString();
            // returns hourly id from database for the given hourly time
            let hourlyId = await getHourlyId(getHourlyTime);

            let hourlyJson = JSON_HELPER.generateJsonStructureForHourlyData(registerId, x, ValueReceivedDate, hourlyId, new Date().getTime(), assetId);

            let obj = JSON_HELPER.generateJsonStructureForAlerts(
                hourlyJson.RegisterId,
                hourlyJson.ActValue,
                hourlyJson.HourlyId,
                hourlyJson.ValueReceivedDate,
                hourlyJson.AssetId
            );

            if (hourlyJson.RegisterId == 17 || hourlyJson.RegisterId == 23) { // checks on register id to send power factor alerts
                sendPowerFactorAlert(obj);
            }

            await insertHourlyData(hourlyJson);

        } else if (frequency == "XM") { // gateway sends maximum demand monthly registers with register id from 40 to 47

            let actDate = createdDate;
            let maxDemandMonthlyJson = JSON_HELPER.generateJsonStructureForMaxDemandMonthly(registerId, x, actDate, assetId, gatewayId);
            await insertMeterMaxDemandMonthlyData(maxDemandMonthlyJson);

        } else if (frequency == "XD") { // gateway sends maximum demand daily registers with register id from 48 to 55

            let actDate = createdDate;
            let maxDemandDailyJson = JSON_HELPER.generateJsonStructureForMaxDemandDaily(registerId, x, actDate, assetId, gatewayId);
            await insertMeterMaxDemandDailyData(maxDemandDailyJson);
        }
    } catch (error) {
        console.error(error);
    }
};

exports.setEnergyMeterMultipleRegisterData = async (mObject) => {
    try {
        let assetId = mObject.AssetId;
        // let registerId = parseInt(mObject.reg_id);
        let data = [
            // { registerId: 70, value: mObject["a_vrms"] },
            { registerId: 65, value: mObject["t_pf"] },
            { registerId: 60, value: mObject["t_watth"] },
        ];

        let gatewayId = mObject.bot_id;
        let createdDate = new Date(mObject.time).getTime();
        // let x = hGetValueFromByteArray(mObject.reg_data);

        for (let i = 0; i < data.length; i++) {
            data[i]["frequency"] = await getRegisterFrequency(data[i].registerId);
        }

        let asset_details = await getAssetDetails(mObject.bot_id, mObject.slave_id);

        if (typeof asset_details != 'undefined') {
            if (true) {         //Handle Madbus Scanner and Save Raw Input
                saveModbusScannerIncomingJson(mObject);
                console.log("Scanner Input: \n" + mObject);
                console.log("\n-----------------------------------------\n");
            }
        }

        for (let i = 0; i < data.length; i++) {
            let frequency = data[i].frequency;

            if (frequency == "D") { // gateway sends daily registers with register id from 1 to 8

                let dtDate = createdDate;
                dtDate = new Date(dtDate).setDate(new Date(dtDate).getDate() - 1);
                // historical generation time
                let generationTime = new Date(createdDate).setHours(00, 01, 00, 00);
                let dailyJson = JSON_HELPER.generateJsonStructureForDailyData(registerId, x, dtDate, assetId, gatewayId, createdDate, generationTime);
                // call to insert function
                await insertMeterDailyData(dailyJson);

            } else if (frequency == "M") { // gateway sends monthly registers with register id from 9 to 16

                let dtDate = createdDate;
                dtDate = new Date(dtDate).setDate(1);
                dtDate = new Date(dtDate).setHours(00, 30, 00, 00);
                // historical generation time
                let generationTime = new Date(createdDate).setDate(1);
                generationTime = new Date(generationTime).setHours(00, 01, 00, 00);
                let monthlyJson = JSON_HELPER.generateJsonStructureForMonthlyData(registerId, x, dtDate, assetId, gatewayId, createdDate, generationTime);
                // call to insert function
                await insertMeterMonthlyData(monthlyJson);

            } else if (frequency == "H") { // gateway sends hourly registers with register id from 17 to 35

                // hourly readings
                let ValueReceivedDate = new Date().getTime();
                //  createdDate;


                
                let hour = new Date(ValueReceivedDate).getHours();
                let min = new Date(ValueReceivedDate).getMinutes();
                min = (min == '0') ? '00' : min;
                let getHourlyTime = (hour + ":" + min).toString();
                // returns hourly id from database for the given hourly time
                let hourlyId = await getHourlyId(getHourlyTime);

                // ValueReceivedDate = ValueReceivedDate - 19800000;
                let hourlyJson = JSON_HELPER.generateJsonStructureForHourlyData(data[i].registerId, data[i].value, ValueReceivedDate, hourlyId, new Date().getTime(), assetId);

                let obj = JSON_HELPER.generateJsonStructureForAlerts(
                    hourlyJson.RegisterId,
                    hourlyJson.ActValue,
                    hourlyJson.HourlyId,
                    hourlyJson.ValueReceivedDate,
                    hourlyJson.AssetId
                );

                if (hourlyJson.RegisterId == 17 || hourlyJson.RegisterId == 23) { // checks on register id to send power factor alerts
                    sendPowerFactorAlert(obj);
                }

                // console.log(hourlyJson);
                await insertHourlyDataUnfiltered(hourlyJson);
            } else if (frequency == "XM") { // gateway sends maximum demand monthly registers with register id from 40 to 47

                let actDate = createdDate;
                let maxDemandMonthlyJson = JSON_HELPER.generateJsonStructureForMaxDemandMonthly(registerId, x, actDate, assetId, gatewayId);
                await insertMeterMaxDemandMonthlyData(maxDemandMonthlyJson);

            } else if (frequency == "XD") { // gateway sends maximum demand daily registers with register id from 48 to 55

                let actDate = createdDate;
                let maxDemandDailyJson = JSON_HELPER.generateJsonStructureForMaxDemandDaily(registerId, x, actDate, assetId, gatewayId);
                await insertMeterMaxDemandDailyData(maxDemandDailyJson);
            }
        }
    } catch (error) {
        console.error(error);
    }
};



/**
 * @description This function which inserts energy meter daily values in mongo-db.
 * @param {*} inputJson
 * @returns Promise<void> 
 */
async function insertMeterDailyData(inputJson) {
    try {
        const MONGO_UTIL = require('../utils/mongo_util');
        const MONGO_CONFIG = require('../configurations/mongo-config');
        let mongo_client = await MONGO_UTIL.dbClient();
        // range generated from insertion time
        let from = new Date(inputJson.CreatedDate).setHours(00, 00, 00, 00); //day start
        let to = new Date(inputJson.CreatedDate).setHours(23, 59, 59, 00); // day end
        let dailyData = await mongo_client.collection(MONGO_CONFIG.COLLECTION_NAMES.energyMeterDailyValues).aggregate([
            { '$match': { 'AssetId': inputJson.AssetId, 'RegisterId': inputJson.RegisterId, 'CreatedDate': { '$gte': from, '$lt': to } } }
        ]).toArray();

        // If not exist, insert else ignore ...
        if (dailyData.length == 0) {
            // Delete
            try {
                let query = { 'AssetId': inputJson.AssetId, 'RegisterId': inputJson.RegisterId, 'DtDate': { '$gte': from, '$lt': to } };
                let obj = await mongo_client.collection(MONGO_CONFIG.COLLECTION_NAMES.energyMeterDailyValues).deleteMany(query);
                if (obj.deletedCount > 0) {
                    console.log('documents deleted successfully in UspSetEnergyMeterData - D');
                } else {
                    console.log('no documents found to delete in UspSetEnergyMeterData - D');
                }
            } catch (error) {
                console.error(error);
            }

            // Insert
            try {
                let obj = await mongo_client.collection(MONGO_CONFIG.COLLECTION_NAMES.energyMeterDailyValues).insertOne(inputJson);
                console.log(`${obj.insertedCount} no. of document(s) inserted`);
            } catch (error) {
                console.error(error);
            }
        } else {
            // Ignore
            console.log('daily values for previous day already exist in database');
        }
    } catch (error) {
        console.error();
    }
};

/**
 * @description This function which inserts energy meter monthly data in mongo-db.
 * @param {*} inputJson 
 * @returns Promise<void>
 */
async function insertMeterMonthlyData(inputJson) {
    try {
        const MONGO_UTIL = require('../utils/mongo_util');
        const MONGO_CONFIG = require('../configurations/mongo-config');
        let mongo_client = await MONGO_UTIL.dbClient();
        // range generated from insertion time
        let from = new Date(inputJson.CreatedDate).setDate(1);
        from = new Date(from).setHours(00, 01, 00, 00); //month start

        let to = new Date(from).setMonth(new Date(from).getMonth() + 1);
        to = new Date(to).setHours(00, 00, 00, 00); //month end

        let monthlyData = await mongo_client.collection(MONGO_CONFIG.COLLECTION_NAMES.energyMeterMonthlyValues).aggregate([
            { '$match': { 'AssetId': inputJson.AssetId, 'RegisterId': inputJson.RegisterId, 'DtDate': { '$gte': from, '$lt': to } } }
        ]).toArray();

        // if not exist, insert else ignore ...
        if (monthlyData.length == 0) {
            // Insert
            try {
                let obj = await mongo_client.collection(MONGO_CONFIG.COLLECTION_NAMES.energyMeterMonthlyValues).insertOne(inputJson);
                console.log(`${obj.insertedCount} no. of document(s) inserted`);
            } catch (error) {
                console.log(error);
            }
        } else {
            // Ignore
            console.log('monthly values for previous month already exist in database');
        }
    } catch (error) {
        console.error(error);
    }
};

/**
 * @description This function which inserts hourly data in mongo-db.
 * @param {*} inputJson 
 * @returns Promise<void>
 */
async function insertHourlyData(inputJson) {
    try {
        const MONGO_UTIL = require('../utils/mongo_util');
        const MONGO_CONFIG = require('../configurations/mongo-config');
        let mongo_client = await MONGO_UTIL.dbClient();
        let isMissed = await mongo_client.collection(MONGO_CONFIG.COLLECTION_NAMES.energyMeterValues).aggregate([
            { '$match': { 'AssetId': inputJson.AssetId, 'RegisterId': inputJson.RegisterId, 'ValueReceivedDate': { '$gte': inputJson.ValueReceivedDate } } }
        ]).toArray();

        if (isMissed.length != 0) {
            // query for missing data insertion
            let matchMissedOccurance = await mongo_client.collection(MONGO_CONFIG.COLLECTION_NAMES.energyMeterValues).aggregate([
                { '$match': { 'AssetId': inputJson.AssetId, 'RegisterId': inputJson.RegisterId, 'ValueReceivedDate': { '$gte': inputJson.ValueReceivedDate } } },
                { '$match': { 'AssetId': inputJson.AssetId, 'RegisterId': inputJson.RegisterId, 'HourlyId': inputJson.HourlyId, 'ValueReceivedDate': inputJson.ValueReceivedDate } }
            ]).toArray();

            // if missed matched occurance length is 0, this means data is missing hence insert that missed occurance
            if (matchMissedOccurance.length == 0) {
                try {
                    let obj = await mongo_client.collection(MONGO_CONFIG.COLLECTION_NAMES.energyMeterValues).insertOne(inputJson);
                    console.log(`${obj.insertedCount} no. of document(s) inserted which were missed in earlier insertions`);
                } catch (error) {
                    console.error(error);
                }
            } else {
                console.log('data already exist in database, no such missed occurances');
            }
        } else {
            try {
                let obj = await mongo_client.collection(MONGO_CONFIG.COLLECTION_NAMES.energyMeterValues).insertOne(inputJson);
                console.log(`${obj.insertedCount} no. of document(s) inserted`);
            } catch (error) {
                console.error(error);
            }
        }
    } catch (error) {
        console.error(error);
    }
};

async function insertHourlyDataUnfiltered(inputJson) {
    try {
        const MONGO_UTIL = require('../utils/mongo_util');
        const MONGO_CONFIG = require('../configurations/mongo-config');
        let mongo_client = await MONGO_UTIL.dbClient();
        let isMissed = await mongo_client.collection(MONGO_CONFIG.COLLECTION_NAMES.energyMeterValues).aggregate([
            { '$match': { 'AssetId': inputJson.AssetId, 'RegisterId': inputJson.RegisterId, 'ValueReceivedDate': { '$gte': inputJson.ValueReceivedDate } } }
        ]).toArray();

        if (false) {
            // query for missing data insertion
            let matchMissedOccurance = await mongo_client.collection(MONGO_CONFIG.COLLECTION_NAMES.energyMeterValues).aggregate([
                { '$match': { 'AssetId': inputJson.AssetId, 'RegisterId': inputJson.RegisterId, 'ValueReceivedDate': { '$gte': inputJson.ValueReceivedDate } } },
                { '$match': { 'AssetId': inputJson.AssetId, 'RegisterId': inputJson.RegisterId, 'HourlyId': inputJson.HourlyId, 'ValueReceivedDate': inputJson.ValueReceivedDate } }
            ]).toArray();

            // if missed matched occurance length is 0, this means data is missing hence insert that missed occurance
            if (matchMissedOccurance.length == 0) {
                try {
                    let obj = await mongo_client.collection(MONGO_CONFIG.COLLECTION_NAMES.energyMeterValues).insertOne(inputJson);
                    console.log(`${obj.insertedCount} no. of document(s) inserted which were missed in earlier insertions`);
                } catch (error) {
                    console.error(error);
                }
            } else {
                console.log('data already exist in database, no such missed occurances');
            }
        } else {
            try {
                let obj = await mongo_client.collection(MONGO_CONFIG.COLLECTION_NAMES.energyMeterValues).insertOne(inputJson);
                console.log(`${obj.insertedCount} no. of document(s) inserted`);
            } catch (error) {
                console.error(error);
            }
        }
    } catch (error) {
        console.error(error);
    }
};

/**
 * @description This function which inserts energy meter maximum demand monthly value in mongo-db.
 * @param {*} inputJson 
 * @returns Promise<void>
 */
async function insertMeterMaxDemandMonthlyData(inputJson) {
    try {
        const MONGO_UTIL = require('../utils/mongo_util');
        const MONGO_CONFIG = require('../configurations/mongo-config');
        let mongo_client = await MONGO_UTIL.dbClient();
        let register = await mongo_client.collection(MONGO_CONFIG.COLLECTION_NAMES.energyMeterMonthlyMDValues).aggregate([
            { '$match': { 'RegisterId': inputJson.RegisterId, 'AssetId': inputJson.AssetId } },
            { '$sort': { 'ActDate': -1 } }, { '$limit': 1 },
            { '$project': { '_id': 0, 'ActValue': 1 } },
            { '$match': { '$or': [{ 'ActValue': { '$gt': inputJson.ActValue } }, { 'ActValue': { '$eq': inputJson.ActValue } }] } }
        ]).toArray();

        if (register.length == 0) {
            try {
                let obj = await mongo_client.collection(MONGO_CONFIG.COLLECTION_NAMES.energyMeterMonthlyMDValues).insertOne(inputJson);
                console.log(`${obj.insertedCount} no. of document(s) inserted`);
            } catch (error) {
                console.error(error);
            }
        } else {
            console.log('already present');
        }
    } catch (error) {
        console.error(error);
    }
};

/**
 * @description This function which inserts energy meter maximum demand daily value in mongo-db.
 * @param {*} inputJson 
 * @returns Promise<void>
 */
async function insertMeterMaxDemandDailyData(inputJson) {
    try {
        const MONGO_UTIL = require('../utils/mongo_util');
        const MONGO_CONFIG = require('../configurations/mongo-config');
        let mongo_client = await MONGO_UTIL.dbClient();
        let register = await mongo_client.collection(MONGO_CONFIG.COLLECTION_NAMES.energyMeterMDValues).aggregate([
            { '$match': { 'RegisterId': inputJson.RegisterId, 'AssetId': inputJson.AssetId } },
            { '$sort': { 'ActDate': -1 } }, { '$limit': 1 },
            { '$project': { '_id': 0, 'ActValue': 1 } },
            { '$match': { '$or': [{ 'ActValue': { '$gt': inputJson.ActValue } }, { 'ActValue': { '$eq': inputJson.ActValue } }] } }
        ]).toArray();

        if (register.length == 0) {
            try {
                let obj = await mongo_client.collection(MONGO_CONFIG.COLLECTION_NAMES.energyMeterMDValues).insertOne(inputJson);
                console.log(`${obj.insertedCount} no. of document(s) inserted`);
            } catch (error) {
                console.error(error);
            }
        } else {
            console.log('already present');
        }
    } catch (error) {
        console.error(error);
    }
};

async function saveModbusScannerIncomingJson(inputJson) {
    try {
        const MONGO_UTIL = require('../utils/mongo_util');
        const MONGO_CONFIG = require('../configurations/mongo-config');
        let mongo_client = await MONGO_UTIL.dbClient();
        let result = await mongo_client.collection(MONGO_CONFIG.COLLECTION_NAMES.modbusRaw).insertOne(inputJson);
        if (result.insertedCount > 0) {
            return true;
        }
        return null;
    } catch (error) {
        console.log("error");
        throw error;
    }
}

