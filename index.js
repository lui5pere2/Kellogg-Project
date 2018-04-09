/*
 Copyright 2016 Brian Donohue.
*/

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

    var cardTitle = "Kellogg Coupons"
    var speechOutput = "You can ask Kellogg their coupons. Try saying, Alexa, ask Kellogg What is the most common distribution method for coupons."
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
        else if (intentName == 'DistMethodSix') {
        handleChartRequestDistMethodSix(intent, session, callback);
        }
        else if (intentName == 'TopBrands') {
        handleChartRequestTopBrands(intent, session, callback);
        }
        else if (intentName == 'TopDistMethod') {
        handleChartRequestTopDistMethod(intent, session, callback);
        }
        else if (intentName == 'BrandNameSix') {
        handleChartRequestBrandNameSix(intent, session, callback);
        }
        else if (intentName == 'CouponTypeSix') {
        handleChartRequestCouponTypeSix(intent, session, callback);
        }
        else if (intentName == 'DistCountFour') {
        handleChartRequestDistCountFour(intent, session, callback);
        }
         else if (intentName == 'DistCountFive') {
        handleChartRequestDistCountFive(intent, session, callback);
        }
         else if (intentName == 'DistCountSix') {
        handleChartRequestDistCountSix(intent, session, callback);
        }
        else if (intentName == 'PromoType') {
        handleChartRequestPromoType(intent, session, callback);
        }
        else if (intentName == 'TopPromo') {
        handleChartRequestTopPromo(intent, session, callback);
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

            callbackCouponType({"speech":result.items[0].message + ". Would you like to know what was the most common Coupon Type used in 2016?" });
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


// UNDEFINED RESPONSE ERROR
function handleChartRequestDistMethodSix(intent, session, callbackDistMethodSix) {

         callAPEXDistMethodSix(function (result, error) {

            if (error) {
                console.log('error')
            } else {
                console.log("Final result is"+JSON.stringify(result))
                callbackDistMethodSix(null,buildSpeechletResponseWithoutCard(result.speech,"sample re-prompt",true))
            }
        });
}





var callAPEXDistMethodSix = function (callbackDistMethodSix) {

    var url = "https://apex.oracle.com/pls/apex/kelloggwmu/kellogg.cnhl4iqabzv5.us-east-1.rds.amazonaws.comDistMethod2016/";

    var req = https.get(url, (res) => {
        var body = "";

        res.on("data", (chunk) => {
            body += chunk;
        });

        res.on("end",  () => {
            var result = JSON.parse(body);

            callbackDistMethodSix({"speech":result.items[0].message + ". Would you like to know what was the most common distribution method in 2016?" });

            //callback('test');
        });
    }).on("error", (error) => {
        //callback(err);
        console.log('error');
    });
};

function handleChartRequestTopBrands(intent, session, callbackTopBrands) {

         callAPEXTopBrands(function (result, error) {

            if (error) {
                console.log('error')
            } else {
                console.log("Final result is"+JSON.stringify(result))
                callbackTopBrands(null,buildSpeechletResponseWithoutCard(result.speech,"sample re-prompt",true))
            }
        });
}

var callAPEXTopBrands = function (callbackTopBrands) {

    var url = "https://apex.oracle.com/pls/apex/kelloggwmu/kellogg.cnhl4iqabzv5.us-east-1.rds.amazonaws.comTop10PaidOff/";

    var req = https.get(url, (res) => {
        var body = "";

        res.on("data", (chunk) => {
            body += chunk;
        });

        res.on("end",  () => {
            var result = JSON.parse(body);

            callbackTopBrands({"speech": "The top 10 paid off brands are.  " + result.items[0].message + ".  " + result.items[1].message
        + ".  " + result.items[2].message + ".  " + result.items[3].message + ".  " + result.items[4].message + ".  " + result.items[5].message
        + ".  " + result.items[6].message + ".  " + result.items[7].message + ".  " + result.items[8].message + ".  " + result.items[9].message

           + ". Would you like to know what are the top 10 coupon distribution methods?" });
            //callback('test');
        });
    }).on("error", (error) => {
        //callback(err);
        console.log('error');
    });
};

function handleChartRequestTopDistMethod(intent, session, callbackTopDistMethod) {

         callAPEXTopDistMethod(function (result, error) {

            if (error) {
                console.log('error')
            } else {
                console.log("Final result is"+JSON.stringify(result))
                callbackTopDistMethod(null,buildSpeechletResponseWithoutCard(result.speech,"sample re-prompt",true))
            }
        });
}

var callAPEXTopDistMethod = function (callbackTopDistMethod) {

    var url = "https://apex.oracle.com/pls/apex/kelloggwmu/kellogg.cnhl4iqabzv5.us-east-1.rds.amazonaws.comTop10DistMethod/";

    var req = https.get(url, (res) => {
        var body = "";

        res.on("data", (chunk) => {
            body += chunk;
        });

        res.on("end",  () => {
            var result = JSON.parse(body);

            callbackTopDistMethod({"speech": "The top 10 distribution methods are.  " + result.items[0].message + ".  " + result.items[1].message
        + ".  " + result.items[2].message + ".  " + result.items[3].message + ".  " + result.items[4].message + ".  " + result.items[5].message
        + ".  " + result.items[6].message + ".  " + result.items[7].message + ".  " + result.items[8].message + ".  " + result.items[9].message

           + ". Would you like to know what are the top 10 paid off brands?" });
            //callback('test');
        });
    }).on("error", (error) => {
        //callback(err);
        console.log('error');
    });
};

// UNDEFINED RESPONSE ERROR
function handleChartRequestBrandNameSix(intent, session, callbackBrandNameSix) {

         callAPEXBrandNameSix(function (result, error) {

            if (error) {
                console.log('error')
            } else {
                console.log("Final result is"+JSON.stringify(result))
                callbackBrandNameSix(null,buildSpeechletResponseWithoutCard(result.speech,"sample re-prompt",true))
            }
        });
}


var callAPEXBrandNameSix = function (callbackBrandNameSix) {

    var url = "https://apex.oracle.com/pls/apex/kelloggwmu/kellogg.cnhl4iqabzv5.us-east-1.rds.amazonaws.comBrandName2016/";

    var req = https.get(url, (res) => {
        var body = "";

        res.on("data", (chunk) => {
            body += chunk;
        });

        res.on("end",  () => {
            var result = JSON.parse(body);

            callbackBrandNameSix({"speech": result.items[0].message + ". Would you like to know what was the most common brand in 2016?" });
            //callback('test');
        });
    }).on("error", (error) => {
        //callback(err);
        console.log('error');
    });
};

function handleChartRequestCouponTypeSix(intent, session, callbackCouponTypeSix) {

         callAPEXCouponTypeSix(function (result, error) {

            if (error) {
                console.log('error')
            } else {
                console.log("Final result is"+JSON.stringify(result))
                callbackCouponTypeSix(null,buildSpeechletResponseWithoutCard(result.speech,"sample re-prompt",true))
            }
        });
}

// UNDEFINED RESPONSE ERROR
var callAPEXCouponTypeSix = function (callbackCouponTypeSix) {

    var url = "https://apex.oracle.com/pls/apex/kelloggwmu/kellogg.cnhl4iqabzv5.us-east-1.rds.amazonaws.comCouponType2016/";

    var req = https.get(url, (res) => {
        var body = "";

        res.on("data", (chunk) => {
            body += chunk;
        });

        res.on("end",  () => {
            var result = JSON.parse(body);

            callbackCouponTypeSix({"speech": "The most common coupon type used in 2016 was" + result.items[0].message
            + ". Would you like to know what was the most common brand in 2016?" });
            //callback('test');
        });
    }).on("error", (error) => {
        //callback(err);
        console.log('error');
    });
};

function handleChartRequestDistCountFour(intent, session, callbackDistCountFour) {

         callAPEXDistCountFour(function (result, error) {

            if (error) {
                console.log('error')
            } else {
                console.log("Final result is"+JSON.stringify(result))
                callbackDistCountFour(null,buildSpeechletResponseWithoutCard(result.speech,"sample re-prompt",true))
            }
        });
}

var callAPEXDistCountFour = function (callbackDistCountFour) {

    var url = "https://apex.oracle.com/pls/apex/kelloggwmu/kellogg.cnhl4iqabzv5.us-east-1.rds.amazonaws.comDistCount2014";

    var req = https.get(url, (res) => {
        var body = "";

        res.on("data", (chunk) => {
            body += chunk;
        });

        res.on("end",  () => {
            var result = JSON.parse(body);

            callbackDistCountFour({"speech": result.items[0].message
            + ". Would you like to know what was the most common brand in 2016?" });
            //callback('test');
        });
    }).on("error", (error) => {
        //callback(err);
        console.log('error');
    });
};

function handleChartRequestDistCountFive(intent, session, callbackDistCountFive) {

         callAPEXDistCountFive(function (result, error) {

            if (error) {
                console.log('error')
            } else {
                console.log("Final result is"+JSON.stringify(result))
                callbackDistCountFive(null,buildSpeechletResponseWithoutCard(result.speech,"sample re-prompt",true))
            }
        });
}


var callAPEXDistCountFive = function (callbackDistCountFive) {

    var url = "https://apex.oracle.com/pls/apex/kelloggwmu/kellogg.cnhl4iqabzv5.us-east-1.rds.amazonaws.comDistCount2015/";

    var req = https.get(url, (res) => {
        var body = "";

        res.on("data", (chunk) => {
            body += chunk;
        });

        res.on("end",  () => {
            var result = JSON.parse(body);

            callbackDistCountFive({"speech": result.items[0].message
            + ". Would you like to know what was the most common brand in 2016?" });
            //callback('test');
        });
    }).on("error", (error) => {
        //callback(err);
        console.log('error');
    });
};

function handleChartRequestDistCountSix(intent, session, callbackDistCountSix) {

         callAPEXDistCountSix(function (result, error) {

            if (error) {
                console.log('error')
            } else {
                console.log("Final result is"+JSON.stringify(result))
                callbackDistCountSix(null,buildSpeechletResponseWithoutCard(result.speech,"sample re-prompt",true))
            }
        });
}

var callAPEXDistCountSix = function (callbackDistCountSix) {

    var url = "https://apex.oracle.com/pls/apex/kelloggwmu/kellogg.cnhl4iqabzv5.us-east-1.rds.amazonaws.comDistCount2016/";

    var req = https.get(url, (res) => {
        var body = "";

        res.on("data", (chunk) => {
            body += chunk;
        });

        res.on("end",  () => {
            var result = JSON.parse(body);

            callbackDistCountSix({"speech": result.items[0].message
            + ". Would you like to know what was the most common brand in 2016?" });
            //callback('test');
        });
    }).on("error", (error) => {
        //callback(err);
        console.log('error');
    });
};

function handleChartRequestPromoType(intent, session, callbackPromoType) {

         callAPEXPromoType(function (result, error) {

            if (error) {
                console.log('error')
            } else {
                console.log("Final result is"+JSON.stringify(result))
                callbackPromoType(null,buildSpeechletResponseWithoutCard(result.speech,"sample re-prompt",true))
            }
        });
}


var callAPEXPromoType = function (callbackPromoType) {

    var url = "https://apex.oracle.com/pls/apex/kelloggwmu/kellogg.cnhl4iqabzv5.us-east-1.rds.amazonaws.comPromoType";

    var req = https.get(url, (res) => {
        var body = "";

        res.on("data", (chunk) => {
            body += chunk;
        });

        res.on("end",  () => {
            var result = JSON.parse(body);

            callbackPromoType({"speech": result.items[0].message
            + ". Would you like to know what was the most common brand in 2016?" });
            //callback('test');
        });
    }).on("error", (error) => {
        //callback(err);
        console.log('error');
    });
};

function handleChartRequestTopPromo(intent, session, callbackTopPromo) {

         callAPEXTopPromo(function (result, error) {

            if (error) {
                console.log('error')
            } else {
                console.log("Final result is"+JSON.stringify(result))
                callbackTopPromo(null,buildSpeechletResponseWithoutCard(result.speech,"sample re-prompt",true))
            }
        });
}

// UNDEFINED RESPONSE ERROR
var callAPEXTopPromo = function (callbackTopPromo) {

    var url = "https://apex.oracle.com/pls/apex/kelloggwmu/kellogg.cnhl4iqabzv5.us-east-1.rds.amazonaws.comTop10PromoType";

    var req = https.get(url, (res) => {
        var body = "";

        res.on("data", (chunk) => {
            body += chunk;
        });

        res.on("end",  () => {
            var result = JSON.parse(body);

            callbackTopPromo({"speech": "The top 10 promotion types are. " + result.items[0].message + ".  "
            + result.items[1].message + ".  " + result.items[2].message + ".  " + result.items[3].message + ".  "
             + result.items[4].message + ".  " + result.items[5].message + ".  " + result.items[6].message + ".  "
              + result.items[7].message + ".  " + result.items[8].message + ".  " + result.items[9].message + ".  "
            + ". Would you like to know the top 10 paid off brands?" });
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
