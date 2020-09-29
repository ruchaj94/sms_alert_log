const RAW_DATA = require('./wsRawData');
const ALERT_LOG = require('./wsAlertLog');

exports.applyRoutes = async (app) => {
    
    app.post('/api/DAL/RawData', RAW_DATA.insertRawData);
    app.post('/api/DAL/AlertLogs', ALERT_LOG.getAlertLog);
    app.post('/api/DAL/saveDeliveryReport',ALERT_LOG.saveDeliveryReport);
    //app.get('/api/DAL/getSmsLog',ALERT_LOG.getSmsLog);
    //app.get('/api/DAL/getDeliveryReport',ALERT_LOG.getDeliveryReport);
};
