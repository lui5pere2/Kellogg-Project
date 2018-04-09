/*
 Copyright 2016 Brian Donohue.
*/

'use strict';
var Alexa = require("alexa-sdk");

exports.handler = function(event, context) {
    var alexa = Alexa.handler(event, context);
    alexa.registerHandlers(handlers, questionHandlers, conslusionHandlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
        this.emit('SayHello');
    },
    'HelloWorldIntent': function () {
        this.emit('SayHello');
    },
    'MyNameIsIntent': function () {
        this.emit('SayHelloName');
    },
    'SayHello': function () {
      this.handler.state = "_QUESTIONS";
        this.response.speak('Hello World! Guys tell me Yes or No Bro')
                     .listen('Can you say or no');
        this.emit(':responseReady');
    },
    'SayHelloName': function () {
        var name = this.event.request.intent.slots.name.value;
        this.response.speak('Hello ' + name)
            .cardRenderer('hello world', 'hello ' + name);
        this.emit(':responseReady');
    },
    'SessionEndedRequest' : function() {
        console.log('Session ended with reason: ' + this.event.request.reason);
    },
    'AMAZON.StopIntent' : function() {
        this.response.speak('Bye');
        this.emit(':responseReady');
    },
    'AMAZON.HelpIntent' : function() {
        this.response.speak("SOME RANDOM CALL'");
        this.emit(':responseReady');
    },
    // MAKING THE NEW CHANGES
    // 'AMAZON.YESIntent' : function() {
    //     this.response.speak("You said YES'");
    //     this.emit(':responseReady');
    //   },
    //   'AMAZON.NOIntent' : function() {
    //       this.response.speak("You said no'");
    //   this.emit(':responseReady');
    //   },
    'AMAZON.CancelIntent' : function() {
        this.response.speak('Bye');
        this.emit(':responseReady');
    },
    'Unhandled': function () {
        //log the event sent by the Alexa Service in human readable format
        console.log(JSON.stringify(this.event));
        let skillId, requestType, dialogState, intent ,intentName, intentConfirmationStatus, slotArray, slots, count;

        try {
            //Parse necessary data from JSON object using dot notation
            //build output strings and check for undefined
            skillId = this.event.session.application.applicationId;
            requestType = "This is an Unhandled request. The request type is, "+this.event.request.type+" .";
            dialogState = this.event.request.dialogState;
            intent = this.event.request.intent;
            if (intent != undefined) {
                intentName = " The intent name is, "+this.event.request.intent.name+" .";
                slotArray = this.event.request.intent.slots;
                intentConfirmationStatus = this.event.request.intent.confirmationStatus;
                if (intentConfirmationStatus != "NONE" && intentConfirmationStatus != undefined ) {
                    intentConfirmationStatus = " and its confirmation status is "+ intentConfirmationStatus+" . ";
                    intentName = intentName+intentConfirmationStatus;
                }
            } else {
                intentName = "";
                slotArray = "";
                intentConfirmationStatus = "";
            }
            slots = "";
            count = 0;

            if (slotArray == undefined || slots == undefined) {
                slots = "";
            }
            //Iterating through slot array
            for (let slot in slotArray) {
                count += 1;
                let slotName = slotArray[slot].name;
                let slotValue = slotArray[slot].value;
                let slotConfirmationStatus = slotArray[slot].confirmationStatus;
                slots = slots + "The <say-as interpret-as='ordinal'>"+count+"</say-as> slot is, " + slotName + ", its value is, " +slotValue;

                if (slotConfirmationStatus!= undefined && slotConfirmationStatus != "NONE") {
                  slots = slots+" and its confirmation status is "+slotConfirmationStatus+" . ";
                } else {
                  slots = slots+" . ";
                }
            }
            //Delegate to Dialog Manager when needed
            //<reference to docs>
            if (dialogState == "STARTED" || dialogState == "IN_PROGRESS") {
              this.emit(":delegate");
            }
        } catch(err) {
            console.log("Error: " + err.message);
        }

        let speechOutput = "Your end point receive a request, here's a breakdown. " + requestType + " " + intentName + slots;
        let cardTitle = "Skill ID: " + skillId;
        let cardContent = speechOutput;

        this.response.cardRenderer(cardTitle, cardContent);
        this.response.speak(speechOutput);
        this.emit(':responseReady');
      }
};





var questionHandlers = Alexa.CreateStateHandler("_QUESTIONS", {
  'AMAZON.YesIntent' : function() {
    this.handler.state = "_CONCLUSION";
      this.response.speak("You said YES bro in the question. Would you like to continue")
                    .listen('Would you like');
      this.emit(':responseReady');
    },
    'AMAZON.NoIntent' : function() {
      this.response.speak("You said no bro in the question. Would you like to continue")
                    .listen('Would you like');
    this.emit(':responseReady');
    },
});


var conslusionHandlers = Alexa.CreateStateHandler("_CONCLUSION",{
  'AMAZON.YesIntent' : function() {
      this.response.speak("You said YES dude on the conclusion'");
      this.emit(':responseReady');
    },
    'AMAZON.NoIntent' : function() {
        this.response.speak("You said no dude on the conclusion'");
    this.emit(':responseReady');
    },
});



// MY code
// For Instruction: https://github.com/skilltemplates/basic-starter-alexa
//  For Video :https://www.youtube.com/watch?v=ukR0Aw5P3W8&index=2&list=PLR2Q1A4ici5-o6zUxjs3W9LmvYV0P54ZF



'use strict';

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.

exports.handler = function (event, context) {
    try {
        console.log("event.session.application.applicationId=" + event.session.application.applicationId);

        /**
         * Uncomment this if statement and populate with your skill's application ID to
         * prevent someone else from configuring a skill that sends requests to this function.
         */

        if (event.session.new) {
            onSessionStarted({requestId: event.request.requestId}, event.session);
        }

        if (event.request.type === "LaunchRequest") {
            onLaunch(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "IntentRequest") {
            onIntent(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "SessionEndedRequest") {
            onSessionEnded(event.request, event.session);
            context.succeed();
        }
    } catch (e) {
        context.fail("Exception: " + e);
    }
};

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    console.log("onSessionStarted requestId=" + sessionStartedRequest.requestId
        + ", sessionId=" + session.sessionId);

    // add any session init logic here
}

/**
 * Called when the user invokes the skill without specifying what they want.
 * This response should give the user some information about how to use the skill.
 */
function onLaunch(launchRequest, session, callback) {
    console.log("onLaunch requestId=" + launchRequest.requestId
        + ", sessionId=" + session.sessionId);

    var cardTitle = "Customer Orders"
    var speechOutput = "You can ask APEX how many orders are in the orders table by saying. Alexa, ask APEX how many orders there are."
    callback(session.attributes,
        buildSpeechletResponse(cardTitle, speechOutput, "", true));
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
    console.log("onIntent requestId=" + intentRequest.requestId
        + ", sessionId=" + session.sessionId);

    var intent = intentRequest.intent,
        intentName = intentRequest.intent.name;

    // dispatch custom intents to handlers here
    if (intentName == 'DistMethod') {
        handleChartRequestDistMethod(intent, session, callback);
        }
       else if (intentName == 'NumberOfRecords') {
        handleChartRequestNumberOfRecords(intent, session, callback);
        }
        else if (intentName == 'CouponType') {
        handleChartRequestCouponType(intent, session, callback);
        }
        else if (intentName == 'BrandName') {
        handleChartRequestBrandName(intent, session, callback);
        }
    else {
        throw "Invalid intent";
    }
}

/**
 * Called when the user ends the session.
 */
function onSessionEnded(sessionEndedRequest, session) {
    console.log("onSessionEnded requestId=" + sessionEndedRequest.requestId
        + ", sessionId=" + session.sessionId);

    // Add any cleanup logic here
}
const https = require('https');

function handleChartRequestDistMethod(intent, session, callbackDistMethod) {

         callAPEXDistMethod(function (result, error) {

            if (error) {
                console.log('error')
            } else {
                console.log("Final result is"+JSON.stringify(result))
                callbackDistMethod(null,buildSpeechletResponseWithoutCard(result.speech,"sample re-prompt",true))
            }
        });
}





var callAPEXDistMethod = function (callbackDistMethod) {

    var url = "https://apex.oracle.com/pls/apex/kelloggwmu/kellogg.cnhl4iqabzv5.us-east-1.rds.amazonaws.comDistMethod/";

    var req = https.get(url, (res) => {
        var body = "";

        res.on("data", (chunk) => {
            body += chunk;
        });

        res.on("end",  () => {
            var result = JSON.parse(body);

            callbackDistMethod({"speech":result.items[0].message + ". Would you like to know what was the most common distribution method in 2016?" });

            //callback('test');
        });
    }).on("error", (error) => {
        //callback(err);
        console.log('error');
    });
};

function handleChartRequestNumberOfRecords(intent, session, callbackNumberOfRecords) {

         callAPEXNumberOfRecords(function (result, error) {

            if (error) {
                console.log('error')
            } else {
                console.log("Final result is"+JSON.stringify(result))
                callbackNumberOfRecords(null,buildSpeechletResponseWithoutCard(result.speech,"sample re-prompt",true))
            }
        });
}



var callAPEXNumberOfRecords = function (callbackNumberOfRecords) {

    var url = "https://apex.oracle.com/pls/apex/kelloggwmu/kellogg.cnhl4iqabzv5.us-east-1.rds.amazonaws.comrecords/";

    var req = https.get(url, (res) => {
        var body = "";

        res.on("data", (chunk) => {
            body += chunk;
        });

        res.on("end",  () => {
            var result = JSON.parse(body);

            callbackNumberOfRecords({"speech":result.items[0].message });
            //callback('test');
        });
    }).on("error", (error) => {
        //callback(err);
        console.log('error');
    });
};

function handleChartRequestCouponType(intent, session, callbackCouponType) {

         callAPEXCouponType(function (result, error) {

            if (error) {
                console.log('error')
            } else {
                console.log("Final result is"+JSON.stringify(result))
                callbackCouponType(null,buildSpeechletResponseWithoutCard(result.speech,"sample re-prompt",true))
            }
        });
}

var callAPEXCouponType = function (callbackCouponType) {

    var url = "https://apex.oracle.com/pls/apex/kelloggwmu/kellogg.cnhl4iqabzv5.us-east-1.rds.amazonaws.comCouponType/";

    var req = https.get(url, (res) => {
        var body = "";

        res.on("data", (chunk) => {
            body += chunk;
        });

        res.on("end",  () => {
            var result = JSON.parse(body);
             var handlers = {

};

            callbackCouponType({"speech":result.items[0].message + [". Would you like to know the most common bla?"]




            });



            //callback('test');
        });



    }).on("error", (error) => {
        //callback(err);
        console.log('error');
    });
};

function handleChartRequestBrandName(intent, session, callbackBrandName) {

         callAPEXBrandName(function (result, error) {

            if (error) {
                console.log('error')
            } else {
                console.log("Final result is"+JSON.stringify(result))
                callbackBrandName(null,buildSpeechletResponseWithoutCard(result.speech,"sample re-prompt",true))
            }
        });
}

var callAPEXBrandName = function (callbackBrandName) {

    var url = "https://apex.oracle.com/pls/apex/kelloggwmu/kellogg.cnhl4iqabzv5.us-east-1.rds.amazonaws.comBrandName/";

    var req = https.get(url, (res) => {
        var body = "";

        res.on("data", (chunk) => {
            body += chunk;
        });

        res.on("end",  () => {
            var result = JSON.parse(body);

            callbackBrandName({"speech":result.items[0].message + ". Would you like to know what was the most common brand in 2016?" });
            //callback('test');
        });
    }).on("error", (error) => {
        //callback(err);
        console.log('error');
    });
};

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        card: {
            type: "Simple",
            title: title,
            content: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildSpeechletResponseWithoutCard(output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    };
}
