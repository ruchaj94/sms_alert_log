The folder "Server Certificates" contain certificates created using "broker.elliotsystemsonline.com" as Common Name which means while subscribing and publishing to any topic, hostname
should be used as "broker.elliotsystemsonline.com" with full path of cafile using "--cafile" option.

MQTT PORT : 1883
MQTTS / TLS PORT : 8883
WEBSOCKET PORT : 9001
WEBSOCKET OVER TLS PORT : 9883

|================================================= BEFORE GENERATING CLIENT CERTIFICATES =======================================================|
|																		|
|	Command for Publishing(WITHOUT CLIENT CERTIFICATES) :											|
|																		|
|	==$ mosquitto_pub -h broker.elliotsystemsonline.com -p 8883 --cafile F:\mosquitto_certs\ca.crt -t test/topic -m "TEST MESSAGE" -d	|
|																		|
|																		|
|	Command for Subscribing(WITHOUT CLIENT CERTIFICATES) :											|
|																		|
|	==$ mosquitto_sub -h broker.elliotsystemsonline.com -p 8883 --cafile F:\mosquitto_certs\ca.crt -t test/topic -d				|
|																		|
|===============================================================================================================================================|



|================================================= AFTER GENERATING CLIENT CERTIFICATES ========================================================|
|																		|
|	Command for Publishing(WITH CLIENT CERTIFICATES) :											|
|																		|
|	==$ mosquitto_pub -h broker.elliotsystemsonline.com -p 8883 --cafile F:\mosquitto_certs\ca.crt 						|
|	    --cert F:\mosquitto_certs\gateway_001.crt --key F:\mosquitto_certs\gateway_001.key  -t test/topic -m "TEST MESSAGE" -d		|
|																		|
|																		|
|	Command for Subscribing(WITH CLIENT CERTIFICATES) :											|
|																		|
|	==$ mosquitto_sub -h broker.elliotsystemsonline.com -p 8883 --cafile F:\mosquitto_certs\ca.crt 						|
|	    --cert F:\mosquitto_certs\gateway_001.crt --key F:\mosquitto_certs\gateway_001.key -t test/topic -d					|
|																		|
|===============================================================================================================================================|





NOTE :: YOU HAVE TO PROVIDE 3 FILES FROM CLIENT SIDE IN ORDER TO GET AUTHENTICATED
NOTE :: YOU HAVE TO GIVE FULL PATH OF THE RESPECTIVE CERTIFICATE
NOTE :: IF THE PATH HAS SPACE/S IN BETWEEN, THEN ENCLOSE THE PATH IN DOUBLE QUOTES i.e., ""