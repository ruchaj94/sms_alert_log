/**
 * @version DAL-V2
 * @copyright Elliot Systems
 * @author sarangshisode, prafullajoshi
 */

const DATE_FOMRAT = require('dateformat');
const POWER_FACTOR_VALUES = require('../helpers/power-factor.json');
const REPORT_CONFIG = require('../configurations/report-config');
const ALERT_CONFIG = require('../configurations/alert-config');
const FS = require('fs');

let { getValueForPowerFactor } = require('../db/getValueForPowerFactor');
let { getAssetCompanyId, getAssetName } = require('../db/getAssetDetails');

let {
    getInfoSubscribedUsersfromCompany,
    getAlertSubscribedUsersfromCompany,
    getWarningSubscribedUsersfromCompany
} = require('../db/getUserDetails');

let { sendSMS } = require('./sms-controller');
let { savePowerFactorAlert } = require('../db/savePowerFactorAlerts');

// Testing object for software gateway alerts
let obj = {
	"meterResponse": {
		"data": [0, 0],
		"buffer": {
			"type": "Buffer",
			"data": [0, 0, 0, 0]
		}
	},
	"element": {
		"_id": "5da468a1c42c0629fc1bd6c6",
		"RegisterId": 17,
		"RegisterAddress": 0,
		"F2": 0,
		"Description": "Reactive - Import While Active Export Energy",
		"RegLength": 2,
		"Frequency": "H",
		"ConfigIndices": 6,
		"AssetTypeId": 1,
		"ActValue": 7.5,
		"CurrDatetime": 1578390541
	},
	"hourlyId": 22,
	"CurrDatetime": 1593063000000,
	"AssetId": "5",
	"dateTime": 0
};

exports.sendPowerFactorAlert = async (obj) => {
    try {
        let result = await getValueForPowerFactor(obj);

        if (result == null) {
            console.log("All values haven't been received yet!");
            return (null);
        } else {
            let company_id = await getAssetCompanyId(obj.AssetId);
            let avg_pf = null,
                penalty = null,
                phone_numbers = [],
                message = null,
                alert_time = null,
                alert_date = null,
                meter_name = null,
                alert_type = null,
                message_line_1 = null,
                message_line_2 = null,
                message_line_3 = null,
                message_line_4 = null,
                message_line_5 = null,
                message_line_6 = null,
                created_at,
                response_at,
                data_time;

            if (obj.element.RegisterId == 17) {
                avg_pf = (obj.element.ActValue / result[0].ActValue).toFixed(3);
            } else {
                avg_pf = (result[0].ActValue / obj.element.ActValue).toFixed(3);
            }

            if (avg_pf <= POWER_FACTOR_VALUES.PF_Info_Upper_Threshold) // IF alert is to be generated
            {
                created_at = new Date().getTime();
                meter_name = await getAssetName(obj.AssetId);
                DATE_FOMRAT.masks.template = REPORT_CONFIG.TIME_MASK;
                //data_time = await HELPER.getHalfHourTime(obj.hourlyId);
                //data_time = new Date().setHours(data_time.hour, data_time.minute, 0, 0);
                alert_time = DATE_FOMRAT(obj.CurrDatetime, REPORT_CONFIG.TIME_MASK);

                //alert_time = new Date();
                alert_date = DATE_FOMRAT(result[0].CreatedDate, REPORT_CONFIG.DATE_MASK);
                //alert_date = new Date().getDate();
                penalty = await this.getPowerFactorPenalty(avg_pf);
                message_line_1 = "Elliot EMS";
                message_line_2 = "\nLow Power Factor: " + avg_pf + ".";
                message_line_3 = "\nMeter: " + meter_name + ".";
                message_line_4 = "\nPenalty: " + penalty + "%";
                message_line_5 = "\nTime: " + alert_time;
                message_line_6 = "\nDate: " + alert_date;

                // File IO Logging
                let log_message = '\n' + message_line_1 + message_line_2 + message_line_3 + message_line_4 + message_line_5 + message_line_6;
                FS.appendFile('time_of_message_format_generation_log.txt', log_message, err => {
                    if (err) {
                        throw err;
                    }
                });
            }
            //--------------------------------- ALERT ------------------------------------------------
            //----------------------------------------------------------------------------------------
            if (avg_pf < 0.001) {
                let users = await getInfoSubscribedUsersfromCompany(company_id);
                if (users.length == 0) {
                    return (null);
                }
                alert_type = ALERT_CONFIG.ALERT_TYPE.INFO;
                message_line_1 += " INFO!\n";
                message_line_2 = "Energy Meter OFF!"
                message = message_line_1 + message_line_2 + message_line_3 + message_line_4 + message_line_5 + message_line_6;

                for (let i = 0; i < users.length; i++) {
                    phone_numbers.push(users[i].phone_number);
                }

            } else if (avg_pf < POWER_FACTOR_VALUES.PF_Alert_Threshold) {
                let users = await getAlertSubscribedUsersfromCompany(company_id);
                if (users.length == 0) {
                    return (null);
                }
                alert_type = ALERT_CONFIG.ALERT_TYPE.ALERT;
                message_line_1 += " ALERT!\n";
                message = message_line_1 + message_line_2 + message_line_3 + message_line_4 + message_line_5 + message_line_6;

                for (let i = 0; i < users.length; i++) {
                    phone_numbers.push(users[i].phone_number);
                }

            } else if (avg_pf < POWER_FACTOR_VALUES.PF_Warning_Upper_Threshold) {
                let users = await getWarningSubscribedUsersfromCompany(company_id);
                if (users.length == 0) {
                    return (null);
                }
                alert_type = ALERT_CONFIG.ALERT_TYPE.WARNING;
                message_line_1 += " WARNING!\n";
                message = message_line_1 + message_line_2 + message_line_3 + message_line_4 + message_line_5 + message_line_6;

                for (let i = 0; i < users.length; i++) {
                    phone_numbers.push(users[i].phone_number);
                }

            } else if (avg_pf < POWER_FACTOR_VALUES.PF_Info_Upper_Threshold) {
                let users = await getInfoSubscribedUsersfromCompany(company_id);
                if (users.length == 0) {
                    return null;
                }
                alert_type = ALERT_CONFIG.ALERT_TYPE.INFO;
                message_line_1 += " INFO!\n";
                message = message_line_1 + message_line_2 + message_line_3 + message_line_4 + message_line_5 + message_line_6;

                for (let i = 0; i < users.length; i++) {
                    phone_numbers.push(users[i].phone_number);
                }
            }

            if (phone_numbers.length > 0) {
                // File IO Logging
                let log_message = `
                \nBEFORE SENDING SMS
                \nNUMBERS: ${phone_numbers}
                \nMESSAGE: ${message}
                `;
                FS.appendFile('before_sending_message_log.txt', log_message, err => {
                    if (err) {
                        throw err;
                    }
                });
                // sendSMS(phone_numbers, message);
                response_at = new Date().getTime();
            }

            /*
                To-Do: Save the users to whom this alert was sent and how.
            */
            let alert_object = {
                Asset_Id: result[0].AssetId,
                Category: alert_type,
                Description: ALERT_CONFIG.MESSAGE_POWER_FACTOR,
                Value: parseFloat(avg_pf),
                Threshold: alert_type,
                Penalty: penalty,
                Time: result[0].CreatedDate,
                Threshold: POWER_FACTOR_VALUES.PF_Info_Upper_Threshold,
                Read: false,
            }

            let log_object = {
                created_at: created_at,
                response_at: response_at,
                data: alert_object,
                result: null,
            }

            // log controller TODO ...

            if (avg_pf <= POWER_FACTOR_VALUES.PF_Info_Upper_Threshold) {
                savePowerFactorAlert(result[0].AssetId, alert_type, ALERT_CONFIG.MESSAGE_POWER_FACTOR, parseFloat(avg_pf), penalty, obj.CurrDatetime, POWER_FACTOR_VALUES.PF_Info_Upper_Threshold);
            }
        }

    } catch (error) {
        console.error(error);
    }
};

// Test function call
 this.sendPowerFactorAlert(obj);

exports.getPowerFactorPenalty = async (p_factor_value) => {
    let number = parseFloat(p_factor_value)
    for (let i = 0; i < POWER_FACTOR_VALUES.PowerFactorPenalty.length; i++) {
        // console.log(POWER_FACTOR_VALUES.PowerFactorPenalty[i].RangeUpperLimit);

        if (number <= POWER_FACTOR_VALUES.PowerFactorPenalty[i].RangeUpperLimit && number >= POWER_FACTOR_VALUES.PowerFactorPenalty[i].RangeLowerLimit) {
            if (POWER_FACTOR_VALUES.PowerFactorPenalty[i].Penalty < 0)
                return POWER_FACTOR_VALUES.PowerFactorPenalty[i].Penalty * -1;
            return POWER_FACTOR_VALUES.PowerFactorPenalty[i].Penalty;
        }
    }
    return (null);
};
