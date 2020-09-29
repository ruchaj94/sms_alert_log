const DB_ALERT_LOG = require('../database/dbAlertLog');


exports.getAlertLog = async (p_Data) => {
    
    try {
        let result = await DB_ALERT_LOG.getAlertLog(p_Data);
         return (result);
    } catch (error) {
        console.log("-------------------------------------------------------------");
        console.log(error);
        console.log("-------------------------------------------------------------");
        throw error;
    }
};


exports.saveDeliveryReport = async (p_query,p_Data) => {
    
    try {
        let result = await DB_ALERT_LOG.saveDeliveryReport(p_query,p_Data);
         return (result);
    } catch (error) {
        console.log("-------------------------------------------------------------");
        console.log(error);
        console.log("-------------------------------------------------------------");
        throw error;
    }
};
