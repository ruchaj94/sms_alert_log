const DOM_RAW_DATA = require('../domain/domRawData');
const { saveEnergyMeterResponse } = require('../../controllers/saveMeterResponseController');


exports.insertRawData = async (p_Data) => {
    try {
        console.log("P-data",p_Data);
        p_Data["receive_time"] = new Date().toLocaleString();
        let result1 = await DOM_RAW_DATA.insertRawData(p_Data);
        // console.log(p_Data.registers);
        let raw_data = new ArrayBuffer(4); 
        let view = new DataView(raw_data);
        view.setInt16(0, p_Data.registers[0], false);
        view.setInt16(2, p_Data.registers[1], false);
        let watts = view.getFloat32(0, false);
        // console.log(`Watts: ${watts}`);
        view.setInt16(0, p_Data.registers[2], false);
        view.setInt16(2, p_Data.registers[3], false);
        let pf = view.getFloat32(0, false);
        // console.log(`Power Factor: ${pf}`);        // view.setInt16(0, obj.registers[], false);        // view.setInt16(2, 0, false);
        p_Data['t_watth'] = watts;
        p_Data['t_pf'] = pf;
        p_Data['time'] = p_Data.created_at;
        console.log(`Slave Id :: ${p_Data.slave_id} Time:: ${p_Data.created_at} Watts :: ${p_Data.t_watth} Power factor :: ${p_Data.t_pf} `);
        // console.log(`Watts :: ${p_Data.t_watth}`);
        // console.log(`Power factor :: ${p_Data.t_pf}`);
        p_Data.time = new Date().getTime();;
        let result = await saveEnergyMeterResponse(p_Data);
        return (result);
    } catch (error) {
        throw error;
    }
};
/**
 * Watts :: -3.0692732334136963
 * Power factor :: -0.9985030889511108
 */
let obj = {
    "bot_id": "EM_001",
    "slave_id": 7,
    "registers": [49220, 28409, 49023, 40422],
    "created_at": "2020-07-22T12:52:02Z"
}

// this.insertRawData(obj);