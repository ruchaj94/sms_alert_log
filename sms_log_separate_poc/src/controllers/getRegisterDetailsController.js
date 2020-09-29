/**
 * @version DAL-V2
 * @copyright Elliot Systems
 * @author omkarlanghe
 */

/**
 * @summary returns list of reigster details for that meter by calling function from database layer.
 * @param {obj.AssetTypeId, obj.Frequency} obj
 * @returns JSON Object containing list of register details.
 */
exports.getRegisterDetails = async (obj) => {
    try {
        const { getRegisterDetails } = require('../db/getRegisterDetails');
        return (await getRegisterDetails(obj.AssetTypeId, obj.Frequency));
    } catch (error) {
        console.error(error);
    }
};
