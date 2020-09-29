const FS = require('fs');
const PATH = require('path');
const CONFIG = require('./env.config');
const CA_PATH = PATH.resolve(__dirname, '../../Mosquitto_Certificates_and_README/ca.crt');
const CERT_PATH = PATH.resolve(__dirname, '../../Mosquitto_Certificates_and_README/gateway_001.crt');
const KEY_PATH = PATH.resolve(__dirname, '../../Mosquitto_Certificates_and_README/gateway_001.key');

const BROKER = {
    URL: CONFIG.MQTT.BROKER_URL//'mqtts://broker.elliotsystemsonline.com'
};

let ENVIRONMENT = 'DEVELOPMENT';

const BROKER_OPTIONS = {
    port: 8883, // Default Mqtt Port = 1883, Mqtts = 8883
    useSSL: true,
    ca: FS.readFileSync(CA_PATH),
    cert: FS.readFileSync(CERT_PATH),
    key: FS.readFileSync(KEY_PATH),
    protocolId: 'MQIsdp',
    protocolVersion: 3,
    encoding: 'utf8',
    keepalive: 10,
    clientId: 'ELLIOT DATABASE ACCESS ENGINE INITIALIZED TO - ' + ENVIRONMENT + ' WITH TIMESTAMP : ' + new Date().getTime().toString(),
    clean: true,
    qos: 1,
    retain: false
};

const TOPICS = {
    singleLvlElliot: CONFIG.MQTT.TOPICS.singleLvlElliot, //'elliot/+',
    singleLvlElliotHistorical: CONFIG.MQTT.TOPICS.singleLvlElliotHistorical, //'elliot/+/historical',
    singleLvlHkHistorical: CONFIG.MQTT.TOPICS.singleLvlHkHistorical, //'heliokraft/+/historical',
    singleLvlHkRealtime: CONFIG.MQTT.TOPICS.singleLvlHkRealtime, //'heliokraft/+/realtime',
    assetLvl: CONFIG.MQTT.TOPICS.assetLvl, //'elliot/getAssetDetails',
    registerLvl: CONFIG.MQTT.TOPICS.registerLvl, //'elliot/getRegisters',
    pendingHrsLvl: CONFIG.MQTT.TOPICS.pendingHrsLvl, //'elliot/getPendingHrs',
};

module.exports = {
    BROKER,
    TOPICS,
    BROKER_OPTIONS
};