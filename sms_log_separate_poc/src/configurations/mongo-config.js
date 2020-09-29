const CONFIG = require('./env.config');

// database connection string
const DATABASE = {
    URL: CONFIG.DATABASE.DATABASE_URL || 'mongodb://127.0.0.1:27017/',
    NAME: CONFIG.DATABASE.DATABASE_NAME || 'ems_db_dev'
}

// collection names in mongo db
const COLLECTION_NAMES = {

    companies: 'companies',
    assetTypes: 'assetTypes',
    companyAssets: 'companyAssets',
    allRegisters: 'allRegisters',
    energyMeterRawData: 'energyMeterRawData',
    energyMeterValues: 'energyMeterValues',
    energyMeterMDValues: 'energyMeterMDValues',
    energyMeterMonthlyMDValues: 'energyMeterMonthlyMDValues',
    energyMeterMonthlyValues: 'energyMeterMonthlyValues',
    energyMeterDailyValues: 'energyMeterDailyValues',
    halfHours: 'halfHours',
    users: 'users',
    powerFactorAlerts: 'powerFactorAlerts',
    modbusRaw: 'modbusRaw',
    smsLog: 'smsLog'
}

module.exports = {
    DATABASE,
    COLLECTION_NAMES
};
