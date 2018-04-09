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




// For Instruction: https://github.com/skilltemplates/basic-starter-alexa
//  For Video :https://www.youtube.com/watch?v=ukR0Aw5P3W8&index=2&list=PLR2Q1A4ici5-o6zUxjs3W9LmvYV0P54ZF
