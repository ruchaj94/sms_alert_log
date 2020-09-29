const PRES_RAW_DATA = require('../presentation/presRawData');

exports.insertRawData = async (req, res) => {
    try {
        if (!req._body) {
            let error = new Error('Body cannot be empty.');
            throw error;
        }
        if (Object.keys(req.body).length === 0) {
            let error = new Error('Object cannot be empty.');
            throw error;
        }
        await PRES_RAW_DATA.insertRawData(req.body);
        res.json(true);
    } catch (error) {
        res.status(400).json(error.message);
    }
};
