const MONGO_CONFIG = require('../../configurations/mongo-config');
const MONGO_UTIL = require('../../utils/mongo_util');

exports.getAlertLog = async (p_Data) => {
    try {
        console.log(p_Data);
        let mongo_client = await MONGO_UTIL.dbClient();
        let response = await mongo_client.collection(MONGO_CONFIG.COLLECTION_NAMES.smsLog).insertOne(p_Data);
        if (response.result.n === 1) {
            return (response.result);
        }
        return (response.result);
    } catch (error) {
        throw error;
    }
};

//getSmsLog
exports.getSmsLog = async () => {
    try {
        let mongo_client = await MONGO_UTIL.dbClient();
        let result = await mongo_client.collection(MONGO_CONFIG.COLLECTION_NAMES.smsLog).find().toArray();
        // console.log("result", result)
        return (result);
    } catch (error) {
        throw error;
    }
};

exports.saveDeliveryReport = async (p_query, p_Data) => {
    try {
        console.log('p_Data : ', p_Data);
        let mongo_client = await MONGO_UTIL.dbClient();
        let dataArray = [];

        if (Array.isArray(p_Data) && p_Data.length) {
            dataArray = p_Data;
        } else if (Object.keys(p_Data).length != 0) {
            dataArray.push(p_Data)
        }
        if (dataArray.length) {


            for (i = 0; i < p_Data.length; i++) {
                console.log('reqId : ', p_Data[i].requestId);

                let record = await mongo_client.collection(MONGO_CONFIG.COLLECTION_NAMES.smsLog).findOne({ response: p_Data[i].requestId });

                console.log('record : ', record);
                let res = "";
                if (record) {
                    res = await mongo_client.collection(MONGO_CONFIG.COLLECTION_NAMES.smsLog).
                        update(
                            { response: p_Data[i].requestId },
                            {
                                $set: {
                                    requestId: p_Data[i].requestId, senderId: p_Data[i].senderId, report: p_Data[i].report,
                                    userId: p_Data[i].userId, campaignName: p_Data[i].campaignName
                                }
                            })
                } else {
                    res = await mongo_client.collection(MONGO_CONFIG.COLLECTION_NAMES.smsLog).
                        insertOne(
                            {
                                response: p_Data[i].requestId,
                                requestId: p_Data[i].requestId,
                                senderId: p_Data[i].senderId,
                                report: p_Data[i].report,
                                userId: p_Data[i].userId,
                                campaignName: p_Data[i].campaignName
                            })

                }

            }
            return true;

        } else {
            return 0;
        }
    } catch (error) {
        throw error;
    }
};


