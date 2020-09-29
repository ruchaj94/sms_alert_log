/**
 * @version DAL-V2
 * @copyright Elliot Systems
 * @author omkarlanghe
 */

const softwareGateway = require('../db/setSoftwareGatewayData');
const hardwareGateway = require('../db/setHardwareGatewayData');

/**
 * @summary Calles inner functions to save historical data coming from gatway.
 * @description This function contains if-else if-else ladder to check whether the incoming historical data is from software or hardware gateway.
 *              Need of this check is because both software and hardware gateway sends data in different json format, hence ww need to decide if,
 *              format specific to software gateway should be navigated to different insert function and format specific to hardware gateway should
 *              be navigated to different insert function.
 * 
 *              if ( incoming json object has property = element )
 *                  call to software gateway specific insertion function.
 *              else if ( incoming json object has property = bot_id )
 *                  call to hardware gatewat specific insertion function.
 *              else
 *                  Is empty for future gateway's
 * 
 * @param {.} mObject
 * @returns Promise<void>
 */
exports.saveEnergyMeterResponse = async (mObject) => {
    try {
        if (mObject.hasOwnProperty('element')) { // software gateway insertion check

            // make call to software gateway specific insertion functions
            softwareGateway.setEnergyMeterData(mObject);

        } else if (mObject.hasOwnProperty('bot_id')) { // hardware gateway insertion check
            let asset_details = null;

            // extract slave id from system_id field of incoming JSON object and add new field as slave_id.
            // let reg_ex = /ES0005/;
            // mObject.slave_id = mObject.system_id.replace(reg_ex, ''); 

            if (mObject.hasOwnProperty('slave_id')) {

                // get assetId from bot_id for database as hardware gateway do not send asset information
                asset_details = await require('./getAssetDetailsController').getAssetDetials({ 'GatewayId': mObject.bot_id, 'SlaveId': mObject.slave_id });
                mObject.AssetId = asset_details.AssetId;
                await hardwareGateway.setEnergyMeterMultipleRegisterData(mObject);
            } else {

                // get assetId from bot_id for database as hardware gateway do not send asset information
                asset_details = await require('./getAssetDetailsController').getAssetDetials({ 'GatewayId': mObject.bot_id });
                mObject.AssetId = asset_details.AssetId;

                if (mObject.hasOwnProperty('AssetId')) {
                    // make call to hardware gateway specific insertion functions
                    hardwareGateway.setEnergyMeterData(mObject);
                }
            }
        } else {
            // This block is for the hardware gateway supporting multiple meters : Future scope
        }
    } catch (error) {
        console.error(error);
    }
};