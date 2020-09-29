/**
 * @version DAL-V2
 * @copyright Elliot Systems
 * @author omkarlanghe
 */

/**
 * @summary returns pending hours by calling function from database layer.
 * @param {obj.Timestamp, obj.RegisterId, obj.AssetId, obj.GatewayId} obj
 * @returns JSON Object containing pending hours per register id.
 */
exports.getPendingHours = async (obj) => {
    try {
        const { getPendingHours } = require('../db/getPendingHours');
        return (await getPendingHours(obj.Timestamp, obj.RegisterId, obj.AssetId.toString(), obj.GatewayId.toString()));
    } catch (error) {
        console.error(error);
    }
};
