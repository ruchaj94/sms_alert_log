
const HELIOKRAFT_BROKER_URL = "broker.hivemq.com";
const HELIOKRAFT_BROKER_PORT = 1883;

const ENVIRONMENT = 'localhost';

exports.BROKER_OPTIONS = {
    port: HELIOKRAFT_BROKER_PORT, // Default Mqtt Port = 1883, Mqtts = 8883
    host: HELIOKRAFT_BROKER_URL,
    // useSSL: true,
    // ca: FS.readFileSync(CA_PATH),
    // cert: FS.readFileSync(CERT_PATH),
    // key: FS.readFileSync(KEY_PATH),
    protocolId: 'MQIsdp',
    protocolVersion: 3,
    encoding: 'utf8',
    keepalive: 10,
    clientId: 'ELLIOT_DBAE ' + ENVIRONMENT + new Date().getTime().toString(),
    clean: true,
    qos: 1,
    retain: false
};

exports.TOPICS = {
    Manikaran_Satara : "hk_mk_stra"
}

// const BROKER = {
//     URL: CONFIG.MQTT.BROKER_URL//'mqtts://broker.elliotsystemsonline.com'
// };