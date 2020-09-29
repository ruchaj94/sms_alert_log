const DB_RAW_DATA = require('../database/dbRawData');


exports.insertRawData = async (p_Data) => {
    try {
        let result = await DB_RAW_DATA.insertRawData(p_Data);
        // return (result);
        let obj = p_Data;
        for (let i = 0; i < obj.registers.length; i++) {
            obj.registers[i] = parseInt(obj.registers[i]);
        }
        let raw_data = new ArrayBuffer(4); let view = new DataView(raw_data);
        view.setInt16(0, obj.registers[0], false);
        view.setInt16(2, obj.registers[1], false);
        let watts = view.getFloat32(0, false);
        console.log(`Watts: ${watts}`);
        view.setInt16(0, obj.registers[2], false);
        view.setInt16(2, obj.registers[3], false);
        let pf = view.getFloat32(0, false);
        console.log(`Power Factor: ${pf}`);        // view.setInt16(0, obj.registers[], false);        // view.setInt16(2, 0, false);
        let converted_values = {};
        converted_values['Watts'] = watts;
        converted_values['PF'] = pf;
        await DB_RAW_DATA.insertRawData(converted_values);
        return true;
    } catch (error) {
        console.log("-------------------------------------------------------------");
        console.log(error);
        console.log("-------------------------------------------------------------");
        throw error;
    }
};
