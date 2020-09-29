/**
 * @version DAL-V2
 * @copyright Elliot Systems
 * @author omkarlanghe
 */

/**
 * @description Returns a Json requred to save daily data in database for hardware gateway's historical data.
 * @param {registerId of converted value} registerId 
 * @param {converted value from byte array} actVal 
 * @param {timestamp of previous day} dtDate 
 * @param {asset id} assetId 
 * @param {gateway id i.e id of hardware gateway} gatewayId 
 * @param {insertion time} createdDate 
 * @param {historical generation time} generationTime 
 */
exports.generateJsonStructureForDailyData = (registerId, actVal, dtDate, assetId, gatewayId, createdDate, generationTime) => {
    return {
        RegisterId: registerId,
        ActValue: actVal,
        DtDate: dtDate,
        CreatedDate: createdDate,
        GenerationTime: generationTime,
        AssetId: assetId,
        GatewayId: gatewayId
    }
};

/**
 * @description Returns a Json requred to save monthly data in database for hardware gateway's historical data.
 * @param {registerId of converted value} registerId 
 * @param {converted value from byte array} actVal 
 * @param {timestamp of day-1 of current month eg. 01/02/2020 12:30:00 AM} dtDate 
 * @param {asset id} assetId 
 * @param {gateway id i.e id of hardware gateway} gatewayId 
 * @param {insertion time} createdDate 
 * @param {historical generation time} generationTime 
 */
exports.generateJsonStructureForMonthlyData = (registerId, actVal, dtDate, assetId, gatewayId, createdDate, generationTime) => {
    return {
        RegisterId: registerId,
        ActValue: actVal,
        DtDate: dtDate,
        AssetId: assetId,
        GatewayId: gatewayId,
        CreatedDate: createdDate,
        GenerationTime: generationTime
    }
};

/**
 * @description Returns a Json requred to save hourly data in database for hardware gateway's historical data.
 * @param {registerId of converted value} registerId 
 * @param {converted value from byte array} actVal 
 * @param {timestamp of hourly value generated in meter} valueReceivedDate 
 * @param {half hour id} hourlyId 
 * @param {insertion time} createdDate 
 * @param {asset id, refers to meter id} assetId 
 */
exports.generateJsonStructureForHourlyData = (registerId, actVal, valueReceivedDate, hourlyId, createdDate, assetId) => {
    return {
        RegisterId: registerId,
        ActValue: actVal,
        ValueReceivedDate: valueReceivedDate,
        HourlyId: hourlyId,
        CreatedDate: createdDate,
        AssetId: assetId
    }
};

/**
 * @description Returns a Json requred to save max demand monthly data in database for hardware gateway's historical data.
 * @param {registerId of converted value} registerId 
 * @param {converted value from byte array} actVal 
 * @param {timestamp of max demand monthly} actDate 
 * @param {asset id refers to the meter id} assetId 
 * @param {gateway id i.e id of hardware gateway} gatewayId 
 */
exports.generateJsonStructureForMaxDemandMonthly = (registerId, actVal, actDate, assetId, gatewayId) => {
    return {
        RegisterId: registerId,
        ActValue: actVal,
        ActDate: actDate,
        AssetId: assetId,
        GatewayId: gatewayId
    }
};

/**
 * @description Returns a Json requred to save max demand daily data in database for hardware gateway's historical data.
 * @param {registerId of converted value} registerId 
 * @param {converted value from byte array} actVal 
 * @param {timestamp of max demand monthly} actDate 
 * @param {asset id refers to the meter id} assetId 
 * @param {gateway id i.e id of hardware gateway} gatewayId 
 */
exports.generateJsonStructureForMaxDemandDaily = (registerId, actVal, actDate, assetId, gatewayId) => {
    return {
        RegisterId: registerId,
        ActValue: actVal,
        ActDate: actDate,
        AssetId: assetId,
        GatewayId: gatewayId
    }
};

/**
 * @description Returns a Json requred to send and save alerts data in database for hardware gateway's historical data.
 * @param {registerId of converted value} registerId 
 * @param {converted value from byte array} actVal 
 * @param {half hour id. There are 48 half hours and 24 hours in a day} hourlyId 
 * @param {timestamp of hourly value generated in meter which is called ValueReceivedDate in database} currDateTime 
 * @param {asset id refers to the meter id} assetId 
 */
exports.generateJsonStructureForAlerts = (registerId, actVal, hourlyId, currDateTime, assetId) => {
    return {
        element: {
            RegisterId: registerId,
            ActValue: actVal
        },
        hourlyId: hourlyId,
        CurrDatetime: currDateTime,
        AssetId: assetId
    }
};