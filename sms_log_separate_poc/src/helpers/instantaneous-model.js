/**
 * @version DAL-V2
 * @copyright Elliot Systems
 * @author omkarlanghe
 */

/**
 * 
 * @param {*} rPhaseActivePower 
 * @param {*} yPhaseActivePower 
 * @param {*} bPhaseActivePower 
 * @param {*} threePhaseActivePower 
 */
exports.activePower = (rPhaseActivePower, yPhaseActivePower, bPhaseActivePower, threePhaseActivePower) => {
    return ([{
        "description": "R- Phase Active Power",
        "value": rPhaseActivePower
    }, {
        "description": "Y- Phase Active Power",
        "value": yPhaseActivePower
    }, {
        "description": "B- Phase Active Power",
        "value": bPhaseActivePower
    }, {
        "description": "3 Phase Active Power",
        "value": threePhaseActivePower
    }]);
};

/**
 * 
 * @param {*} rPhaseReactivePower 
 * @param {*} yPhaseReactivePower 
 * @param {*} bPhaseReactivePower 
 * @param {*} threePhaseReactivePower 
 */
exports.reactivePower = (rPhaseReactivePower, yPhaseReactivePower, bPhaseReactivePower, threePhaseReactivePower) => {
    return ([{
        "description": "R- Phase Reactive Power",
        "value": rPhaseReactivePower
    }, {
        "description": "Y- Phase Reactive Power",
        "value": yPhaseReactivePower
    }, {
        "description": "B- Phase Reactive Power",
        "value": bPhaseReactivePower
    }, {
        "description": "3 Phase Reactive Power",
        "value": threePhaseReactivePower
    }]);
};

/**
 * 
 * @param {*} rPhaseApparentPower 
 * @param {*} yPhaseApparentPower 
 * @param {*} bPhaseApparentPower 
 * @param {*} threePhaseApparentPower 
 */
exports.apparentPower = (rPhaseApparentPower, yPhaseApparentPower, bPhaseApparentPower, threePhaseApparentPower) => {
    return ([{
        "description": "R- Phase Apparent Power",
        "value": rPhaseApparentPower
    }, {
        "description": "Y- Phase Apparent Power",
        "value": yPhaseApparentPower
    }, {
        "description": "B- Phase Apparent Power",
        "value": bPhaseApparentPower
    }, {
        "description": "3 Phase Apparent Power",
        "value": threePhaseApparentPower
    }]);
};

/**
 * 
 * @param {*} q1PowerFactor 
 * @param {*} q2PowerFactor 
 * @param {*} q3PowerFactor 
 * @param {*} qA_AvgPowerFactor 
 */
exports.powerFactor = (q1PowerFactor, q2PowerFactor, q3PowerFactor, qA_AvgPowerFactor) => {
    return ([{
        "description": "Q1 Power Factor",
        "value": q1PowerFactor
    }, {
        "description": "Q2 Power Factor",
        "value": q2PowerFactor
    }, {
        "description": "Q3 Power Factor",
        "value": q3PowerFactor
    }, {
        "description": "QA Average Power Factor",
        "value": qA_AvgPowerFactor
    }]);
};

/**
 * 
 * @param {*} rPhaseNeutralVoltage 
 * @param {*} yPhaseNeutralVoltage 
 * @param {*} bPhaseNeutralVoltage 
 * @param {*} avgVoltage 
 */
exports.neutralVoltage = (rPhaseNeutralVoltage, yPhaseNeutralVoltage, bPhaseNeutralVoltage, avgVoltage) => {
    return ([{
        "description": "R Phase to Neutral Voltage",
        "value": rPhaseNeutralVoltage
    }, {
        "description": "Y Phase to Neutral Voltage",
        "value": yPhaseNeutralVoltage
    }, {
        "description": "B Phase to Neutral Voltage",
        "value": bPhaseNeutralVoltage
    }, {
        "description": "Average Voltage",
        "value": avgVoltage
    }]);
};

/**
 * 
 * @param {*} rPhaseCurrentTHD 
 * @param {*} yPhaseCurrentTHD 
 * @param {*} bPhaseCurrentTHD 
 */
exports.totalCurrentHarmonicDistortion = (rPhaseCurrentTHD, yPhaseCurrentTHD, bPhaseCurrentTHD) => {
    return ([{
        "description": "R-Phase Current Total Harmonic Distortion",
        "value": rPhaseCurrentTHD
    }, {
        "description": "Y-Phase Current Total Harmonic Distortion",
        "value": yPhaseCurrentTHD
    }, {
        "description": "B-Phase Current Total Harmonic Distortion",
        "value": bPhaseCurrentTHD
    }]);
};

/**
 * 
 * @param {*} rPhaseVoltageTHD 
 * @param {*} yPhaseVoltageTHD 
 * @param {*} bPhaseVoltageTHD 
 */
exports.totalVoltageHarmonicDistortion = (rPhaseVoltageTHD, yPhaseVoltageTHD, bPhaseVoltageTHD) => {
    return ([{
        "description": "R-Phase Voltage Total Harmonic Distortion",
        "value": rPhaseVoltageTHD
    }, {
        "description": "Y-Phase Voltage Total Harmonic Distortion",
        "value": yPhaseVoltageTHD
    }, {
        "description": "B-Phase Voltage Total Harmonic Distortion",
        "value": bPhaseVoltageTHD
    }]);
};

/**
 * 
 * @param {*} rPhaseLineCurrent 
 * @param {*} yPhaseLineCurrent 
 * @param {*} bPhaseLineCurrent 
 * @param {*} nLineCurrent 
 */
exports.lineCurrent = (rPhaseLineCurrent, yPhaseLineCurrent, bPhaseLineCurrent, nLineCurrent) => {
    return ([
        {
            "description": "R Phase Line current",
            "value": rPhaseLineCurrent
        }, {
            "description": "Y Phase Line current",
            "value": yPhaseLineCurrent
        }, {
            "description": "B Phase Line current",
            "value": bPhaseLineCurrent
        }, {
            "description": "Neutral Line current",
            "value": nLineCurrent
        }
    ]);
};
