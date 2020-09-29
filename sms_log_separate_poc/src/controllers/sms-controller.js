/**
 * @version DAL-V2
 * @copyright Elliot Systems
 * @author prafullajoshi
 */

const SMS = require('msg91-sms');
const FS = require('fs');
const CONFIG = require('../configurations/env.config');
const AUTH_KEY = CONFIG.SMS.AUTH_KEY;

let SENDER_ID = CONFIG.SMS.SENDER_ID;
let ROUTE = '4';                      // Transacational = 4 & Promotion = 1
let DIAL_CODE = '91';

/**
 * @summary Sends sms on the given numbers provided as parameter to this function.
 * @param {Array of numbers} NUMBERS 
 * @param {Sms message} message 
 * @returns Promise<void>.
 */
exports.sendSMS = async (NUMBERS, message) => {
    try {
        SMS.sendMultiple(AUTH_KEY, NUMBERS, message, SENDER_ID, ROUTE, DIAL_CODE, (response) => {
            // File IO Logging
            let log_message = `
                        \n*********************************************
                        \nalert message: \n${message}
                        \ncontact numbers: ${NUMBERS}
                        \nresponse: ${response}
                        \ntimestamp: ${new Date().toString()}
                        \n*********************************************`;

            FS.appendFile('after_sending_sms_log.txt', log_message, err => {
                if (err) {
                    throw err;
                }
            });
            console.log(response);
        });
    } catch (error) {
        throw error;
    }
};


exports.sendReport = async (p_Data_NUMBERS, p_Data_message) => {
    try {    
        return new Promise(function(resolve,reject)
        {
            //sendone foreach on number and catch the response in array and then save in db.
         
            // for(i=0; i<p_Data.NUMBERS.length; i++)
            // {
                SMS.sendOne(AUTH_KEY, p_Data_NUMBERS, p_Data_message, SENDER_ID, ROUTE, DIAL_CODE, (response) => {

                   console.log('response : ',response);
                    let log_message = `
                                \n*********************************************
                                \nalert message: ${p_Data_message}
                                \ncontact numbers: ${p_Data_NUMBERS}
                                \nresponse: ${response}
                                \ntimestamp: ${new Date().toString()}
                                \n*********************************************`;
        
        
                    let obj = {
                        numbers : p_Data_NUMBERS,
                        message : p_Data_message,
                        response : response,
                        timestamp: new Date().toString()
                
                    }
    
                    resolve(obj);
        
                });

           // }

        })
       
    } catch (error) {
        throw error;
    }
};

exports.deliveryReport = async (NUMBERS, message) => {
    try {
        
        return new Promise(function(resolve,reject)
        {
            SMS.sendMultiple(AUTH_KEY, NUMBERS, message, SENDER_ID, ROUTE, DIAL_CODE, (response) => {

            
                let log_message = `
                            \n*********************************************
                            \nalert message: ${message}
                            \ncontact numbers: ${NUMBERS}
                            \nresponse: ${response}
                            \ntimestamp: ${new Date().toString()}
                            \n*********************************************`;
    
    
                let obj = {
                    numbers : NUMBERS,
                    message : message,
                
                }
                resolve(obj);
    
            });

        })
       
    } catch (error) {
        throw error;
    }
};

