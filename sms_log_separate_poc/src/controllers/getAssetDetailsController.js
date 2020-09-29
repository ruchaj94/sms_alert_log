/**
 * @version DAL-V2
 * @copyright Elliot Systems
 * @author omkarlanghe
 */

/**
 * @summary returns meter details by calling function from database layer.
 * @param {obj.GatewayId} obj
 * @returns JSON Object containing meter details.
 */
exports.getAssetDetials = async (obj) => {
    try {
        const { getAssetDetails } = require('../db/getAssetDetails');
        return (await getAssetDetails(obj.GatewayId, obj.SlaveId));
    } catch (error) {
        console.error(error);
    }
};

this.getAssetDetials({ 'GatewayId': 5})