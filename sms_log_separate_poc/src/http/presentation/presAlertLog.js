const DOM_ALERT_LOG = require('../domain/domAlertLog');
const { sendReport } = require('../../controllers/sms-controller');

exports.getAlertLog = async (p_Data) => {
    try {
        //console.log("P-data : ",p_Data);
        for(i=0; i<p_Data.NUMBERS.length; i++)
        {
            let result = await sendReport(p_Data.NUMBERS[i], p_Data.message);
            console.log('result : ',result);
            let result1 = await DOM_ALERT_LOG.getAlertLog(result);
        }
        return (true);
    } catch (error) {
        throw error;
    }
};

//getSmsLog
exports.getSmsLog = async () => {
    try {
       
        let result1 = await DOM_ALERT_LOG.getSmsLog();
        return (result1);
    } catch (error) {
        throw error;
    }
};

exports.saveDeliveryReport = async (p_query,p_Data) => {
    try {
        //console.log("P-data : ",p_Data);
        
        let result1 = await DOM_ALERT_LOG.saveDeliveryReport(p_query,p_Data);
        return (result1);
    } catch (error) {
        throw error;
    }
};
/**
 * Watts :: -3.0692732334136963
 * Power factor :: -0.9985030889511108
 */
let obj = {
    "bot_id": "EM_001",
    "slave_id": 7,
    "registers": [49220, 28409, 49023, 40422],
    "created_at": "2020-07-22T12:52:02Z"
}

// this.insertRawData(obj);