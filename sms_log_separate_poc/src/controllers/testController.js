const TEST_DB = require('../db/testDb');

exports.saveRVoltage = async(p_Data)=>{
    p_Data.time = new Date(p_Data.time * 1000).toLocaleString();
    let result = await TEST_DB.saveTest(p_Data);
}