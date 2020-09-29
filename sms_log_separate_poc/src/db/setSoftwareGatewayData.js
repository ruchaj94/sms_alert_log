/**
 * @version DAL-V2
 * @copyright Elliot Systems
 * @author omkarlanghe
 * @description All the functions in this javascript file are insertion functions which inserts historical data values
 *              related to software gateway.
 */

const MONGO_UTIL = require('../utils/mongo_util');
const MONGO_CONFIG = require('../configurations/mongo-config');
const { sendPowerFactorAlert } = require('../controllers/alertsController');
const { sGetValueFromByteArray } = require('../helpers/getValuesFromByteArray');

/**
 * @description This function navigates to the appropriate insertion function based on frequency (Daily, Monthly, Hourly, Max dem Month, Max dem Daily).
 *              if (obj.element.Frequency == 'H') save hourly
 *              else if (obj.element.Frequency == 'XD') save max demand daily
 *              else if (obj.element.Frequency == 'XM') save max demand monthy
 *              else (save daily or monthly)
 * @param {*} mObject 
 * @returns Promise<void>
 */
exports.setEnergyMeterData = async (obj) => {
    try {
        if (obj.element.Frequency == 'H') {
            // Byte Conversion
            let x = sGetValueFromByteArray(obj.meterResponse.data);
            if (!isNaN(x)) { obj.element.ActValue = x; obj.element.CurrDatetime = obj.CurrDatetime; }

            // Save to Database
            insertEnergyMeterData(obj);

        } else if (obj.element.Frequency == 'XD') {
            // Byte Conversion
            let x = sGetValueFromByteArray(obj.meterResponse.data);
            if (!isNaN(x)) { obj.element.ActValue = x; }

            // Save to Database
            setMDDailyValues(parseInt(obj.element.RegisterId), parseInt(obj.element.ActValue), obj.dateTime, obj.AssetId);
        } else if (obj.element.Frequency == 'XM') {
            // Byte Conversion
            let x = sGetValueFromByteArray(obj.meterResponse.data);
            if (!isNaN(x)) { obj.element.ActValue = x; }

            // Save to Database
            setMDMonthlyValues(parseInt(obj.element.RegisterId), parseInt(obj.element.ActValue), obj.dateTime, obj.AssetId);

        } else {
            // Byte Conversion
            let x = sGetValueFromByteArray(obj.meterResponse.data);
            if (!isNaN(x)) { obj.element.ActValue = x; }

            // Save to Database
            insertEnergyMeterData(obj);
        }
    } catch (error) {
        console.error(error);
    }
};

/**
 * @description This function navigates to Hourly, Monthly and Dailt data insertion functions.
 * @param {*} obj 
 * @returns Promise<void>
 */
async function insertEnergyMeterData(obj) {
    try {

        let RegisterId = parseInt(obj.element.RegisterId);
        let ActValue = obj.element.ActValue;
        let AssetId = obj.AssetId.toString();
        let HourlyId = parseInt(obj.hourlyId);
        let CurrDatetime = parseInt(obj.element.CurrDatetime);

        let mongo_client = await MONGO_UTIL.dbClient();
        let query1 = { RegisterId: RegisterId };
        let query2 = { Frequency: 1 };

        let Frequency = await mongo_client.collection(MONGO_CONFIG.COLLECTION_NAMES.allRegisters).find(query1, query2).toArray().then(async function (result) { return (result[0].Frequency); });

        switch (Frequency) {
            case 'H':
                if (RegisterId == 17 || RegisterId == 23) { // checks on register id to send power factor alerts
                    sendPowerFactorAlert(obj);
                }
                setHalfHourValues(RegisterId, ActValue, AssetId, HourlyId, CurrDatetime);
                break;

            case 'M':
                setMonthlyValues(RegisterId, ActValue, AssetId);
                break;

            case 'D':
                setDailyValues(RegisterId, ActValue, AssetId);
                break;
        }

    } catch (error) {
        console.error(error);
    }
};

/**
 * @description This function inserts half hour values coming every 30 mins from software gateway in database.
 * @param {*} RegisterId 
 * @param {*} ActValue 
 * @param {*} AssetId 
 * @param {*} HourlyId 
 * @param {*} CurrDatetime 
 * @returns Promise<void>
 */
async function setHalfHourValues(RegisterId, ActValue, AssetId, HourlyId, CurrDatetime) {
    try {
        let mongo_client = await MONGO_UTIL.dbClient();
        let regId = await mongo_client.collection(MONGO_CONFIG.COLLECTION_NAMES.energyMeterValues).aggregate([
            {
                '$match': {
                    'AssetId': AssetId,
                    'RegisterId': RegisterId,
                    'ValueReceivedDate': CurrDatetime
                }
            }
            // {
            //     '$project': {
            //         'year': { '$year': { '$toDate': '$ValueReceivedDate' } },
            //         'month': { '$month': { '$toDate': '$ValueReceivedDate' } },
            //         'day': { '$dayOfMonth': { '$toDate': '$ValueReceivedDate' } },
            //         'document': '$$ROOT'
            //     }
            // }, {
            //     '$match': {
            //         'document.RegisterId': RegisterId,
            //         'document.HourlyId': HourlyId,
            //         'document.AssetId': AssetId,
            //         'year': new Date(CurrDatetime).getFullYear(),
            //         'month': new Date(CurrDatetime).getMonth() + 1,
            //         'day': new Date(CurrDatetime).getDate()
            //     }
            // }
        ]).toArray();

        if (regId.length === 0) {
            // Update
            // query1 = {
            //     '$and': [
            //         { 'HourlyId': { '$eq': HourlyId } },
            //         { 'AssetId': { '$eq': AssetId } },
            //         { 'RegisterId': { '$eq': RegisterId } },
            //         {
            //             '$expr': {
            //                 '$and': [
            //                     { '$eq': [{ '$dayOfMonth': { '$toDate': '$ValueReceivedDate' } }, new Date(CurrDatetime).getDate()] },
            //                     { '$eq': [{ '$month': { '$toDate': '$ValueReceivedDate' } }, new Date(CurrDatetime).getMonth() + 1] },
            //                     { '$eq': [{ '$year': { '$toDate': '$ValueReceivedDate' } }, new Date(CurrDatetime).getFullYear()] }
            //                 ]
            //             }
            //         }
            //     ]
            // };
            // query2 = { '$set': { 'ActValue': ActValue } };
            // console.log(`Update :: ${query2}`);
            // await mongo_client.collection(MONGO_CONFIG.COLLECTION_NAMES.energyMeterValues).updateOne(query1, query2, function (err, obj) {
            //     if (err) { console.error(err); }
            //     console.log(`Updated H :: ${obj.result}`);
            // });
            // } else {
            // Insert
            query1 = { 'RegisterId': RegisterId, 'ActValue': ActValue, 'ValueReceivedDate': CurrDatetime, 'AssetId': AssetId, 'HourlyId': HourlyId, 'CreatedDate': new Date().getTime() };
            try {
                let obj = await mongo_client.collection(MONGO_CONFIG.COLLECTION_NAMES.energyMeterValues).insertOne(query1);
                // console.log(`${obj.insertedCount} no. of document(s) inserted`);
            } catch (error) {
                console.error(error);
            }
        } else {
            console.log('hourly instance of this data already exists.');
        }
    } catch (error) {
        console.error(error);
    }
};

/**
 * @description This function insert daily values in database.
 * @param {*} RegisterId 
 * @param {*} ActValue 
 * @param {*} AssetId 
 * @returns Promise<void>
 */
async function setDailyValues(RegisterId, ActValue, AssetId) {
    try {
        let mongo_client = await MONGO_UTIL.dbClient();

        let lastDate = new Date();
        lastDate.setDate(lastDate.getDate() - 1);
        lastDate = lastDate.getTime();

        let startDayTime = new Date(lastDate).setHours(00, 00, 00, 00);
        let endDayTime = new Date(lastDate).setHours(23, 59, 59, 00);

        let regId = await mongo_client.collection(MONGO_CONFIG.COLLECTION_NAMES.energyMeterMonthlyValues).aggregate([
            {
                '$project': {
                    'year': { '$year': { '$toDate': '$DtDate' } },
                    'month': { '$month': { '$toDate': '$DtDate' } },
                    'day': { '$dayOfMonth': { '$toDate': '$DtDate' } },
                    'document': '$$ROOT'
                }
            },
            {
                '$match': {
                    'document.RegisterId': RegisterId,
                    'document.AssetId': AssetId,
                    'year': new Date(lastDate).getFullYear(),
                    'month': new Date(lastDate).getMonth() + 1,
                    'day': new Date(lastDate).getDate(),
                    'document.ActValue': { $gt: 0 }
                }
            }
        ]).toArray();

        // if not exist as per mssql syntax
        if (regId.length == 0) {
            let query1 = { 'AssetId': AssetId, 'RegisterId': RegisterId, 'DtDate': { '$gte': startDayTime, '$lt': endDayTime } };

            try {
                let obj = await mongo_client.collection(MONGO_CONFIG.COLLECTION_NAMES.energyMeterDailyValues).deleteMany(query1);
                if (obj.deletedCount > 0) {
                    console.log('documents deleted successfully in frequency : D');
                } else {
                    console.log('no documents found to delete in for frequency : D');
                }
            } catch (error) {
                console.error(error);
            }

            // Insert
            let query2 = { 'RegisterId': RegisterId, 'ActValue': ActValue, 'DtDate': lastDate, 'AssetId': AssetId };

            try {
                let obj = await mongo_client.collection(MONGO_CONFIG.COLLECTION_NAMES.energyMeterDailyValues).insertOne(query2);
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
 * @description This function insert monthly values in database.
 * @param {*} RegisterId 
 * @param {*} ActValue 
 * @param {*} AssetId 
 * @returns Promise<void>
 */
async function setMonthlyValues(RegisterId, ActValue, AssetId) {
    try {
        let mongo_client = await MONGO_UTIL.dbClient();

        let prevM = new Date();
        prevM.setMonth(prevM.getMonth());
        prevM.setDate(1);
        prevM.setHours(00, 00, 00, 00);
        let prevMonthStart = prevM.getTime()

        let prevEndM = new Date();
        prevEndM.setMonth(prevEndM.getMonth() + 1);
        prevEndM.setDate(1);
        prevEndM.setHours(00, 00, 00, 00);

        let thisM = new Date();
        thisM.setDate(1);
        thisM.setHours(00, 00, 00, 00);

        let startMonth = thisM.getTime();
        startMonth = new Date(startMonth);
        startMonth.setDate(1);
        startMonth = startMonth.setHours(00, 30, 00, 00);

        let prevMonthEnd = prevEndM.getTime();
        let prevMonthDataCount = await mongo_client.collection(MONGO_CONFIG.COLLECTION_NAMES.energyMeterMonthlyValues).aggregate([
            { '$match': { 'RegisterId': RegisterId, 'AssetId': AssetId, 'DtDate': { '$gte': prevMonthStart, '$lt': prevMonthEnd } } },
            { '$count': 'count' }
        ]).toArray();

        if (prevMonthDataCount.length == 0) {
            // Insert
            let query = { 'RegisterId': RegisterId, 'ActValue': ActValue, 'DtDate': startMonth, 'AssetId': AssetId };
            try {
                let obj = await mongo_client.collection(MONGO_CONFIG.COLLECTION_NAMES.energyMeterMonthlyValues).insertOne(query);
                console.log(`${obj.insertedCount} no. of document(s) inserted in Monthly Collection`);
            } catch (error) {
                console.error(error);
            }
        } else {
            console.log('previous month data already exist in Monthly collection');
        }
    } catch (error) {
        console.error(error);
    }
};

/**
 * @description This function insert max demand daily values in database.
 * @param {*} RegisterId 
 * @param {*} ActValue 
 * @param {*} ActDate 
 * @param {*} AssetId 
 * @returns Promise<void>
 */
async function setMDDailyValues(RegisterId, ActValue, ActDate, AssetId) {
    try {
        let mongo_client = await MONGO_UTIL.dbClient();
        let query1;

        let register = await mongo_client.collection(MONGO_CONFIG.COLLECTION_NAMES.energyMeterMDValues).aggregate([
            { '$project': { 'month': { '$month': { '$toDate': '$DtDate' } }, 'year': { '$year': { '$toDate': '$DtDate' } }, 'document': '$$ROOT' } },
            { '$match': { 'document.RegisterId': RegisterId, 'document.AssetId': AssetId, 'month': new Date(ActDate).getMonth() + 1, 'year': new Date(ActDate).getFullYear() } }
        ]).toArray();

        if (register.length != 0) {
            query1 = {
                '$and': [
                    { 'RegisterId': { '$eq': RegisterId } },
                    { 'AssetId': { '$eq': AssetId } },
                    { '$expr': { '$and': [{ '$eq': [{ '$month': { '$toDate': '$DtDate' } }, new Date(ActDate).getMonth() + 1] }, { '$eq': [{ '$year': { '$toDate': '$DtDate' } }, new Date(ActDate).getFullYear()] }] } }
                ]
            };
            try {
                let obj = await mongo_client.collection(MONGO_CONFIG.COLLECTION_NAMES.energyMeterMDValues).deleteMany(query1);
                if (obj.deletedCount > 0) {
                    console.log('documents deleted successfully in setMDDailyValues');
                } else {
                    console.log('no documents found to delete in setMDDailyValues');
                }
            } catch (error) {
                console.error(error);
            }
        }

        // insert new record
        query1 = { 'RegisterId': RegisterId, 'ActValue': ActValue, 'DtDate': ActDate, 'AssetId': AssetId, 'ActDate': new Date().getTime() };
        try {
            let obj = await mongo_client.collection(MONGO_CONFIG.COLLECTION_NAMES.energyMeterMDValues).insertOne(query1);
            console.log(`${obj.insertedCount} no. of document(s) inserted`);
        } catch (error) {
            console.error(error);
        }
    } catch (error) {
        console.error(error);
    }
};

/**
 * @description This function insert max demand monthly values in database.
 * @param {*} RegisterId 
 * @param {*} ActValue 
 * @param {*} ActDate 
 * @param {*} AssetId 
 */
async function setMDMonthlyValues(RegisterId, ActValue, ActDate, AssetId) {
    try {
        let mongo_client = await MONGO_UTIL.dbClient();
        let query1;

        let register = await mongo_client.collection(MONGO_CONFIG.COLLECTION_NAMES.energyMeterMonthlyMDValues).aggregate([
            { '$project': { 'month': { '$month': { '$toDate': '$DtDate' } }, 'year': { '$year': { '$toDate': '$DtDate' } }, 'document': '$$ROOT' } },
            { '$match': { 'document.RegisterId': RegisterId, 'document.AssetId': AssetId, 'month': new Date(ActDate).getMonth() + 1, 'year': new Date(ActDate).getFullYear(), 'document.ActValue': { $gt: 0 } } }
        ]).toArray();

        if (register.length == 0) {
            query1 = {
                '$and': [
                    { 'RegisterId': { '$eq': RegisterId } },
                    { 'AssetId': { '$eq': AssetId } },
                    {
                        '$expr': {
                            '$and': [
                                { '$eq': [{ '$month': { '$toDate': '$DtDate' } }, new Date(ActDate).getMonth() + 1] },
                                { '$eq': [{ '$year': { '$toDate': '$DtDate' } }, new Date(ActDate).getFullYear()] }]
                        }
                    }
                ]
            };

            try {
                let obj = await mongo_client.collection(MONGO_CONFIG.COLLECTION_NAMES.energyMeterMonthlyMDValues).deleteMany(query1);
                if (obj.deletedCount > 0) {
                    console.log('documents deleted successfully in setMDMonthlyValues');
                } else {
                    console.log('no documents found to delete in setMDMonthlyValues');
                }
            } catch (error) {
                console.error(error);
            }

            // insert new monthly record
            query1 = { 'RegisterId': RegisterId, 'ActValue': ActValue, 'DtDate': ActDate, 'AssetId': AssetId, 'ActDate': new Date().getTime() };
            try {
                let obj = await mongo_client.collection(MONGO_CONFIG.COLLECTION_NAMES.energyMeterMonthlyMDValues).insertOne(query1);
                console.log(`${obj.insertedCount} no. of document(s) inserted`);
            } catch (error) {
                console.error(error);
            }
        }
    } catch (error) {
        console.error(error);
    }
};
