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
}

/**
 * Called when the user invokes the skill without specifying what they want.
 * This response should give the user some information about how to use the skill.
 */
function onLaunch(launchRequest, session, callback) {
    console.log("onLaunch requestId=" + launchRequest.requestId
        + ", sessionId=" + session.sessionId);
    var cardTitle = "Kellogg Coupons"
    var speechOutput = "You can ask Kellogg about their coupons. Try saying, Alexa, ask Kellogg What is the most common distribution method for coupons."
    callback(session.attributes,
        buildSpeechletResponse(cardTitle, speechOutput, "", true));
}

/**
 * Called when the user specifies an intent for this skill.
 * Note how every intent has its own handleChartRequest name.
 * This will allow our intents to call the API and get the responses that we want.
 * We will use these handleChartRequests later in the code.
 */
function onIntent(intentRequest, session, callback) {
    console.log("onIntent requestId=" + intentRequest.requestId
        + ", sessionId=" + session.sessionId);

    var intent = intentRequest.intent,
        intentName = intentRequest.intent.name;

        /******************************************************************************
        * Dispatch custom intents to handlers here. We use if else staments to be able
        * to ask multiple questions. Every single time we add new 	questions, we
        * have to enter a new "else if" statement to our current code.
        ******************************************************************************/
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
        else if (intentName == 'MinDistMethod') {
        handleChartRequestMinDistMethod(intent, session, callback);
        }
        else if (intentName == 'TopBrands') {
        handleChartRequestTopBrands(intent, session, callback);
        }
        else if (intentName == 'TopDistMethod') {
        handleChartRequestTopDistMethod(intent, session, callback);
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
}
const https = require('https');

/******************************************************************************
BEGIN CODING TO ASK THE QUESTIONS. EACH BLOCK OF QUESTIONS MUST BE AROUND 25
LINES OF CODE. GRAB THE CODE FROM A PREVIOUS QUESTION AND REMPLACE THE KEYS.

handleChartRuquestDistMethod is linked to DistMethod intent, as shown when we defined the intent above.
We created a callAPEXSitMethod function and told it return result as JSON.
We'll use callAPEXDistMethod when we call out our API as shown after this section of code
******************************************************************************/


/******************************************************************************
QUESTION 1
FROM LINES 108 - 132 (LINES COULD CHANGE) IS ONLY ONE QUESTION
NOTE, THIS QUESTION IS TRYING TO MAKE ALEXA ASK THE USER FOR A QUESTION.
******************************************************************************/
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
/******************************************************************************
Here we're using callAPEXDistMethod to call our API.
All other intents follow the same process but they just have different URL
(to get a different result) and different names.
******************************************************************************/
var callAPEXDistMethod = function (callbackDistMethod) {
   // Calling out the API
    var url = "https://apex.oracle.com/pls/apex/kelloggwmu/kellogg.cnhl4iqabzv5.us-east-1.rds.amazonaws.comDistMethod/";
    var req = https.get(url, (res) => {
        var body = "";
        res.on("data", (chunk) => {
            body += chunk;
        });
        res.on("end",  () => {
            var result = JSON.parse(body);
            /*******************************************************************
            We mentioned in the previous code section that callbackDistMethod
            will return result as JSON, so that Lambda can understand it.
            Here we are returning the first (and only) item from the API.
            And we've added a following up quesion. The following up question
            will call another intent that will give the response to that question.
            *******************************************************************/
            callbackDistMethod({"speech":result.items[0].message
            + ". Would you like to know what is the least common distribution method? " + ". Try saying, Alexa, ask kellogg what is the least common distribution method for coupons"
            });
        });
    }).on("error", (error) => {
        console.log('error');
    });
};

/******************************************************************************
QUESTION 2
handleChartRuquestDistMethod is linked to DistMethod intent, as shown when we
defined the intent above We created a callAPEXSitMethod function and told it
return result as JSON. We'll use callAPEXDistMethod when we call out our API as
shown after this section of code
******************************************************************************/
function handleChartRequestMinDistMethod(intent, session, callbackMinDistMethod) {
         callAPEXMinDistMethod(function (result, error) {
            if (error) {
                console.log('error')
            } else {
                console.log("Final result is"+JSON.stringify(result))
                callbackMinDistMethod(null,buildSpeechletResponseWithoutCard(result.speech,"sample re-prompt",true))
            }
        });
}
var callAPEXMinDistMethod = function (callbackMinDistMethod) {
   // Calling out the API
    var url = "https://apex.oracle.com/pls/apex/kelloggwmu/kellogg.cnhl4iqabzv5.us-east-1.rds.amazonaws.comMinDistMethod/"

    var req = https.get(url, (res) => {
        var body = "";
        res.on("data", (chunk) => {
            body += chunk;
        });
        res.on("end",  () => {
            var result = JSON.parse(body);
            /*******************************************************************
            We mentioned in the previous code section that callbackDistMethod
            will return result as JSON, so that Lambda can understand it. Here we
            are returning the first (and only) item from the API. And we've
            added a following up quesion.
            *******************************************************************/
            callbackMinDistMethod({"speech":result.items[0].message
            + ". What else would you like to know about Kellogg coupons?"
            });
        });
    }).on("error", (error) => {
        console.log('error');
    });
};
/******************************************************************************
QUESTION 3
Same process as above, but we're doing it with NumberOfRecords intent this time
Note: this is not a coupon related question, this is the first intent (demo)
that we've managed to make it connect to the API It gives us the number of
records in the NCH database.
******************************************************************************/
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
        });
    }).on("error", (error) => {
        console.log('error');
    });
};

/******************************************************************************
QUESTION 4
Same process as above, but this time for CouponType intent
******************************************************************************/
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
            callbackCouponType({"speech":result.items[0].message + ". What else would you like to know about kellogg coupons?" });
        });
    }).on("error", (error) => {
        console.log('error');
    });
};

/******************************************************************************
QUESTION 5
This time for BrandName intent
******************************************************************************/
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
            callbackBrandName({"speech":result.items[0].message + ". What else would you like to know about kellogg coupons?" });
        });
    }).on("error", (error) => {
        console.log('error');
    });
};

/******************************************************************************
QUESTION 6
This time for TopBrands intent.
******************************************************************************/
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
    var url = "https://apex.oracle.com/pls/apex/kelloggwmu/kellogg.cnhl4iqabzv5.us-east-1.rds.amazonaws.comTop5PaidOff/";
    var req = https.get(url, (res) => {
        var body = "";
        res.on("data", (chunk) => {
            body += chunk;
        });
        res.on("end",  () => {
            var result = JSON.parse(body);
            /*******************************************************************
            Note that this time we are returning 5 items. The reason is the
            question is asking for top 5 paid off brands.
            *******************************************************************/
            callbackTopBrands({"speech": "The top five paid off brands are.  " + result.items[0].message + ".  " + result.items[1].message
        + ".  " + result.items[2].message + ".  " + result.items[3].message + ".  " + result.items[4].message
           + ". Would you like to know what are the top five coupon distribution methods? Try saying, Alexa, ask kellogg what are the top five coupon distribution methods" });
        });
    }).on("error", (error) => {
        console.log('error');
    });
};

/******************************************************************************
QUESTION 7
Same process but for TopDistMethod intent
******************************************************************************/
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
    var url = "https://apex.oracle.com/pls/apex/kelloggwmu/kellogg.cnhl4iqabzv5.us-east-1.rds.amazonaws.comTop5DistMethod/";
    var req = https.get(url, (res) => {
        var body = "";
        res.on("data", (chunk) => {
            body += chunk;
        });
        res.on("end",  () => {
            var result = JSON.parse(body);
            callbackTopDistMethod({"speech": "The top five distribution methods are.  " + result.items[0].message + ".  " + result.items[1].message
        + ".  " + result.items[2].message + ".  " + result.items[3].message + ".  " + result.items[4].message
           + ". Would you like to know the top five promotion types? Try saying, Alexa, ask kellogg what are the top five PROMOTION TYPES" });
        });
    }).on("error", (error) => {
        console.log('error');
    });
};

/******************************************************************************
QUESTION 8
Same process but for DistCountFour intent
******************************************************************************/
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
            + ". Would you like to know how many coupons were distributed in two thousand and fifteen? Try saying, Alexa, how many coupons were distributed in two thousand and fifteen" });
        });
    }).on("error", (error) => {
        console.log('error');
    });
};

/******************************************************************************
QUESTION 9
Same process but for DistCountFive intent
******************************************************************************/
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
            + ". Would you like to know how many coupons were distributed in two thousand and sixteen? Try saying, Alexa, ask kellogg how many coupons were distributed in two thousand and sixteen" });
        });
    }).on("error", (error) => {
        console.log('error');
    });
};

/******************************************************************************
QUESTION 10
Same process but for DistCountSix intent
******************************************************************************/
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
            + ". What else would you like to know about kellogg coupons?" });
        });
    }).on("error", (error) => {
        console.log('error');
    });
};

/******************************************************************************
QUESTION 11
Same process but from PromoType intent
******************************************************************************/
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
            + ". What else would you like to know about kellogg coupons?" });
        });
    }).on("error", (error) => {
        console.log('error');
    });
};

/******************************************************************************
QUESTION 12
Same process but for TopPromo intent
******************************************************************************/
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
// Same process but with TopPromo intent
var callAPEXTopPromo = function (callbackTopPromo) {
    var url = "https://apex.oracle.com/pls/apex/kelloggwmu/kellogg.cnhl4iqabzv5.us-east-1.rds.amazonaws.comTop5PromoType";
    var req = https.get(url, (res) => {
        var body = "";
        res.on("data", (chunk) => {
            body += chunk;
        });
        res.on("end",  () => {
            var result = JSON.parse(body);
            callbackTopPromo({"speech": "The top five promotion types are. " + result.items[0].message + ".  "
            + result.items[1].message + ".  " + result.items[2].message + ".  " + result.items[3].message + ".  "
             + result.items[4].message
            + ". What else would you like to know about kellogg coupons?"
            });
        });
    }).on("error", (error) => {
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
