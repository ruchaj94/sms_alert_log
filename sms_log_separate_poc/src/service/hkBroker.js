const MQTT = require('mqtt');
const MQTT_CONFIG = require('./hkBrokerConfig');
const { connect } = require('mongodb');
const HK_FILE = require('./hkFile');

const { saveEnergyMeterResponse } = require('../controllers/saveMeterResponseController');

const ELLIOT_DBAE = MQTT.connect(MQTT_CONFIG.BROKER_OPTIONS);

ELLIOT_DBAE.on('connect', () => {
    console.info(`MQTT Client :${MQTT_CONFIG.BROKER_OPTIONS.clientId} connected to ${MQTT_CONFIG.BROKER_OPTIONS.host} on 
    ${MQTT_CONFIG.BROKER_OPTIONS.port}`);
    ELLIOT_DBAE.subscribe(MQTT_CONFIG.TOPICS.Manikaran_Satara);
});


ELLIOT_DBAE.on('message', async (p_Topic, p_Payload) => {
    switch (p_Topic) {
        case MQTT_CONFIG.TOPICS.Manikaran_Satara:
            // let data = JSON.parse(p_Payload.toString());
            // console.log(`${data}`);
            let data = await HK_FILE.getFileJSON();
            saveEnergyMeterResponse(data);
            break;

        default:
            console.log("Default");
            break;
    }
});
