/**
 * @version DAL-V2
 * @copyright Elliot Systems
 * @author omkarlanghe
 */

 /**
  * @description This function converts byte array coming from software gateway to a number.
  * @param {*} act_values 
  * @param {*} reg_add 
  * @returns converted value from byte array.
  */
exports.sGetValueFromByteArray = (act_values, reg_add) => {
    const FLOATING_POINT = require('ieee-float');
    let low_bytes = [];
    let high_bytes = [];
    let byte_vals = [];

    low_bytes = toBytesInt32(act_values[1]);
    high_bytes = toBytesInt32(act_values[0]);

    byte_vals[0] = high_bytes[3];
    byte_vals[1] = high_bytes[2];
    byte_vals[2] = low_bytes[3];
    byte_vals[3] = low_bytes[2];

    let result = FLOATING_POINT.readFloatLE(byte_vals);
    return result;
};

/**
 * @description This function converts number to byte int 32 array.
 * @param {*} num 
 * @returns array
 */
function toBytesInt32(num) {
    arr = new Uint8Array([
        (num & 0xff000000) >> 24,
        (num & 0x00ff0000) >> 16,
        (num & 0x0000ff00) >> 8,
        (num & 0x000000ff)
    ]);
    return arr;
};

/**
 * @description This function converts byte array coming from hardware gateway to a number.
 * @param {*} meterResponse 
 * @returns converted value from byte array.
 */
exports.hGetValueFromByteArray = (meterResponse) => {
    try {
        let aBuffer = new ArrayBuffer(4);
        let dView = new DataView(aBuffer);

        for (let i = 0; i < meterResponse.length; i++) {
            dView.setUint8(i, meterResponse[i]);
        }

        let convertedValue = dView.getFloat32(0);
        convertedValue = parseFloat(convertedValue.toFixed(4));
        return (convertedValue);
    } catch (error) {
        console.error(error);
    }
};
