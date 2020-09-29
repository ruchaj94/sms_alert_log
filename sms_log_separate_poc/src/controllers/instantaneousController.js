/**
 * @version DAL-V2
 * @copyright Elliot Systems
 * @author omkarlanghe
 */
const HELPER = require('../helpers/getValuesFromByteArray');
let MODEL = require('../helpers/instantaneous-model');
/**
 * @summary customize and returns instantanous JSON response for hardware gateway.
 * @param {contains data in the form of array coming from hardware gateway} inputJson
 * @returns JSON Object containing Instantanous response.
 * Cases represents register id's
 */
exports.customizeInstantaneousResponse = (inputJson) => {
    let registerId = parseInt(inputJson.reg_id);

    switch (registerId) {
        case 56:
            try {
                let R_PhaseNeutral_Voltage = [];
                let Y_PhaseNeutral_Voltage = [];
                let B_PhaseNeutral_Voltage = [];
                let averageVoltage = [];
                for (let i = 0; i < 4; i++) {
                    R_PhaseNeutral_Voltage.push(inputJson.reg_data[i]);
                }
                for (let j = 4; j < 8; j++) {
                    Y_PhaseNeutral_Voltage.push(inputJson.reg_data[j]);
                }
                for (let k = 8; k < 12; k++) {
                    B_PhaseNeutral_Voltage.push(inputJson.reg_data[k]);
                }
                for (let l = 12; l < 16; l++) {
                    averageVoltage.push(inputJson.reg_data[l]);
                }
                let rPhaseNeutralVoltage = HELPER.hGetValueFromByteArray(R_PhaseNeutral_Voltage);
                let yPhaseNeutralVoltage = HELPER.hGetValueFromByteArray(Y_PhaseNeutral_Voltage);
                let bPhaseNeutralVoltage = HELPER.hGetValueFromByteArray(B_PhaseNeutral_Voltage);
                let avgVoltage = HELPER.hGetValueFromByteArray(averageVoltage);

                let neutralVoltage = MODEL.neutralVoltage(rPhaseNeutralVoltage, yPhaseNeutralVoltage, bPhaseNeutralVoltage, avgVoltage);
                // console.log(neutralVoltage);
                return (neutralVoltage);
            } catch (error) {
                console.error(error);
            }
            break;

        case 57:
            try {
                let R_PhaseVoltage_THD = [];
                let Y_PhaseVoltage_THD = [];
                let B_PhaseVoltage_THD = [];
                for (let i = 0; i < 4; i++) {
                    R_PhaseVoltage_THD.push(inputJson.reg_data[i]);
                }
                for (let j = 4; j < 8; j++) {
                    Y_PhaseVoltage_THD.push(inputJson.reg_data[j]);
                }
                for (let k = 8; k < 12; k++) {
                    B_PhaseVoltage_THD.push(inputJson.reg_data[k]);
                }

                let rPhaseVoltageTHD = HELPER.hGetValueFromByteArray(R_PhaseVoltage_THD);
                let yPhaseVoltageTHD = HELPER.hGetValueFromByteArray(Y_PhaseVoltage_THD);
                let bPhaseVoltageTHD = HELPER.hGetValueFromByteArray(B_PhaseVoltage_THD);

                let phaseVoltageTHD = MODEL.totalVoltageHarmonicDistortion(rPhaseVoltageTHD, yPhaseVoltageTHD, bPhaseVoltageTHD);
                // console.log(phaseVoltageTHD);
                return (phaseVoltageTHD);
            } catch (error) {
                console.error(error);
            }
            break;

        case 58:
            try {
                let R_PhaseLine_Current = [];
                let Y_PhaseLine_Current = [];
                let B_PhaseLine_Current = [];
                let neutralLineCurrent = []
                for (let i = 0; i < 4; i++) {
                    R_PhaseLine_Current.push(inputJson.reg_data[i]);
                }
                for (let j = 4; j < 8; j++) {
                    Y_PhaseLine_Current.push(inputJson.reg_data[j]);
                }
                for (let k = 8; k < 12; k++) {
                    B_PhaseLine_Current.push(inputJson.reg_data[k]);
                }
                for (let l = 12; l < 16; l++) {
                    neutralLineCurrent.push(inputJson.reg_data[l]);
                }
                let rPhaseLineCurrent = HELPER.hGetValueFromByteArray(R_PhaseLine_Current);
                let yPhaseLineCurrent = HELPER.hGetValueFromByteArray(Y_PhaseLine_Current);
                let bPhaseLineCurrent = HELPER.hGetValueFromByteArray(B_PhaseLine_Current);
                let nLineCurrent = HELPER.hGetValueFromByteArray(neutralLineCurrent);

                let lineCurrent = MODEL.lineCurrent(rPhaseLineCurrent, yPhaseLineCurrent, bPhaseLineCurrent, nLineCurrent);
                // console.log(lineCurrent);
                return (lineCurrent);
            } catch (error) {
                console.error(error);
            }
            break;

        case 59:
            try {
                let R_PhaseCurrent_THD = [];
                let Y_PhaseCurrent_THD = [];
                let B_PhaseCurrent_THD = [];
                for (let i = 0; i < 4; i++) {
                    R_PhaseCurrent_THD.push(inputJson.reg_data[i]);
                }
                for (let j = 4; j < 8; j++) {
                    Y_PhaseCurrent_THD.push(inputJson.reg_data[j]);
                }
                for (let k = 8; k < 12; k++) {
                    B_PhaseCurrent_THD.push(inputJson.reg_data[k]);
                }
                let rPhaseCurrentTHD = HELPER.hGetValueFromByteArray(R_PhaseCurrent_THD);
                let yPhaseCurrentTHD = HELPER.hGetValueFromByteArray(Y_PhaseCurrent_THD);
                let bPhaseCurrentTHD = HELPER.hGetValueFromByteArray(B_PhaseCurrent_THD);

                let phaseCurrentTHD = MODEL.totalCurrentHarmonicDistortion(rPhaseCurrentTHD, yPhaseCurrentTHD, bPhaseCurrentTHD);
                // console.log(phaseCurrentTHD);
                return (phaseCurrentTHD);
            } catch (error) {
                console.error(error);
            }
            break;

        case 60:
            try {
                let R_PhaseActive_Power = [];
                let Y_PhaseActive_Power = [];
                let B_PhaseActive_Power = [];
                let Three_PhaseActive_Power = [];

                for (let i = 0; i < 4; i++) {
                    R_PhaseActive_Power.push(inputJson.reg_data[i]);
                }
                for (let j = 4; j < 8; j++) {
                    Y_PhaseActive_Power.push(inputJson.reg_data[j]);
                }
                for (let k = 8; k < 12; k++) {
                    B_PhaseActive_Power.push(inputJson.reg_data[k]);
                }
                for (let l = 12; l < 16; l++) {
                    Three_PhaseActive_Power.push(inputJson.reg_data[l]);
                }

                let rPhaseActivePower = HELPER.hGetValueFromByteArray(R_PhaseActive_Power);
                let yPhaseActivePower = HELPER.hGetValueFromByteArray(Y_PhaseActive_Power);
                let bPhaseActivePower = HELPER.hGetValueFromByteArray(B_PhaseActive_Power);
                let threePhaseActivePower = HELPER.hGetValueFromByteArray(Three_PhaseActive_Power);

                let activePower = MODEL.activePower(rPhaseActivePower, yPhaseActivePower, bPhaseActivePower, threePhaseActivePower);
                // console.log(activePower);
                return (activePower);
            } catch (error) {
                console.error(error);
            }
            break;

        case 61:
            try {
                let R_PhaseReactive_Power = [];
                let Y_PhaseReactive_Power = [];
                let B_PhaseReactive_Power = [];
                let Three_PhaseReactive_Power = [];

                for (let i = 0; i < 4; i++) {
                    R_PhaseReactive_Power.push(inputJson.reg_data[i]);
                }
                for (let j = 4; j < 8; j++) {
                    Y_PhaseReactive_Power.push(inputJson.reg_data[j]);
                }
                for (let k = 8; k < 12; k++) {
                    B_PhaseReactive_Power.push(inputJson.reg_data[k]);
                }
                for (let l = 12; l < 16; l++) {
                    Three_PhaseReactive_Power.push(inputJson.reg_data[l]);
                }

                let rPhaseReactivePower = HELPER.hGetValueFromByteArray(R_PhaseReactive_Power);
                let yPhaseReactivePower = HELPER.hGetValueFromByteArray(Y_PhaseReactive_Power);
                let bPhaseReactivePower = HELPER.hGetValueFromByteArray(B_PhaseReactive_Power);
                let threePhaseReactivePower = HELPER.hGetValueFromByteArray(Three_PhaseReactive_Power);

                let reactivePower = MODEL.reactivePower(rPhaseReactivePower, yPhaseReactivePower, bPhaseReactivePower, threePhaseReactivePower);
                // console.log(reactivePower);
                return (reactivePower);
            } catch (error) {
                console.error(error);
            }
            break;

        case 62:
            try {
                let R_PhaseApparentPower = [];
                let Y_PhaseApparentPower = [];
                let B_PhaseApparentPower = [];
                let Three_PhaseApparent_Power = [];

                for (let i = 0; i < 4; i++) {
                    R_PhaseApparentPower.push(inputJson.reg_data[i]);
                }
                for (let j = 4; j < 8; j++) {
                    Y_PhaseApparentPower.push(inputJson.reg_data[j]);
                }
                for (let k = 8; k < 12; k++) {
                    B_PhaseApparentPower.push(inputJson.reg_data[k]);
                }
                for (let l = 12; l < 16; l++) {
                    Three_PhaseApparent_Power.push(inputJson.reg_data[l]);
                }

                let rPhaseApparentPower = HELPER.hGetValueFromByteArray(R_PhaseApparentPower);
                let yPhaseApparentPower = HELPER.hGetValueFromByteArray(Y_PhaseApparentPower);
                let bPhaseApparentPower = HELPER.hGetValueFromByteArray(B_PhaseApparentPower);
                let threePhaseApparentPower = HELPER.hGetValueFromByteArray(Three_PhaseApparent_Power);

                let apparentPower = MODEL.apparentPower(rPhaseApparentPower, yPhaseApparentPower, bPhaseApparentPower, threePhaseApparentPower);
                // console.log(apparentPower);
                return (apparentPower);
            } catch (error) {
                console.error(error);
            }
            break;

        case 63:
            try {
                let Q1_PowerFactor = [];
                let Q2_PowerFactor = [];
                let Q3_PowerFactor = [];
                let QA_Avg_PowerFactor = [];

                for (let i = 0; i < 4; i++) {
                    Q1_PowerFactor.push(inputJson.reg_data[i]);
                }
                for (let j = 4; j < 8; j++) {
                    Q2_PowerFactor.push(inputJson.reg_data[j]);
                }
                for (let k = 8; k < 12; k++) {
                    Q3_PowerFactor.push(inputJson.reg_data[k]);
                }
                for (let l = 12; l < 16; l++) {
                    QA_Avg_PowerFactor.push(inputJson.reg_data[l]);
                }

                let q1PowerFactor = HELPER.hGetValueFromByteArray(Q1_PowerFactor);
                let q2PowerFactor = HELPER.hGetValueFromByteArray(Q2_PowerFactor);
                let q3PowerFactor = HELPER.hGetValueFromByteArray(Q3_PowerFactor);
                let qA_AvgPowerFactor = HELPER.hGetValueFromByteArray(QA_Avg_PowerFactor);

                let powerFactor = MODEL.powerFactor(q1PowerFactor, q2PowerFactor, q3PowerFactor, qA_AvgPowerFactor);
                // console.log(powerFactor);
                return (powerFactor);
            } catch (error) {
                console.error(error);
            }
            break;

        default:
            console.error('invalid register id');
            break;
    }
};
