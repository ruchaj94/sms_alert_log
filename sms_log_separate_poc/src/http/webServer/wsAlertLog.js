const PRES_Alert_Log = require('../presentation/presAlertLog');

exports.getAlertLog = async (req, res) => {
    try {
        if (!req._body) {
            let error = new Error('Body cannot be empty.');
            throw error;
        }

        if (Object.keys(req.body).length === 0) {
            let error = new Error('Object cannot be empty.');
            throw error;
        }
        await PRES_Alert_Log.getAlertLog(req.body);
        res.json(true);
    } catch (error) {
        res.status(400).json(error.message);
    }
};

exports.saveDeliveryReport = async (req, res) => {
    try {
        // if (!req._body) {
        //     let error = new Error('Body cannot be empty.');
        //     throw error;
        // }

        // if (Object.keys(req.body).length === 0) {
        //     let error = new Error('Object cannot be empty.');
        //     throw error;
       // }
        await PRES_Alert_Log.saveDeliveryReport(req.query,req.body);
        res.json(true);
    } catch (error) {
        res.status(400).json(error.message);
    }
};