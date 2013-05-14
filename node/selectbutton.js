    var allInputTypes = ["button", "button", "button", "slider", "ultrasound" ],
        numOfInputs = 5,
        numOfButtons = 3,
        numOfSliders = 1,
        numOfUltrasounds = 2;

    var app = require("./app");

    var onWord = ["Engage the", "boost the" , "Turn on the" , " Activate the"],
        offWord = ["Shut down the", "Disengage the", " turn off the", "deactivate the", " power down the"],
        increaseWord = ["Turn the", " raise the", "increase the" , "boost the" , "hammer the", " Overload the", "Artificially accelerate the"],
        decreaseWord= [ "decrease the", " pull down the", " lower the ", " Quickly reduce the ", "dump the ", " release the ", "bring down the"];
   

function pickbutton () {

    var ranNum = 0;
        type = 0;
        buttonNum = 0;

    ranNum = Math.floor(Math.random() * (numOfInputs) );

    type = allInputTypes[ranNum];

    switch ( type ) {
        case "button" :
            buttonNum = Math.floor(Math.random() * (numOfButtons) + 3);
        break;
        case "slider" :
            buttonNum = Math.floor(Math.random() * (numOfSliders) + 1);
        break;
        case "ultrasound" :
            buttonNum = Math.floor(Math.random() * (numOfUltrasounds) + 1);
        break;
    }

    return [type , buttonNum];

}


function findButtonState ( button ) {

    var whichButton = "";
    var currentState = 0;
    var buttonAtt = button;

    whichButton = "" + button[0] + button[1];

    currentState = app.buttonMap[whichButton];

     return [ buttonAtt[0], buttonAtt[1], currentState ];


}

function pickMessageType ( button , state ) {

    var type = button[0];
    var messageType = "";

    if ( type == "button" ) {

        messageType = "bin";

    } else {

        messageType = "dec";
    }

    return [ messageType , button[0], button[1] , state ];
}

function currentName ( inputName ) {

    return app.buttonNames[inputName];

}

function newState ( buttonType , state) {

    var random = 0;

    if ( buttonType == "button") {

        if ( state === 0 ){

            return 1;

        } else if ( state == 1 ) {

            return 0;
        }

    } else if ( buttonType == "slider" ) {

        random = Math.floor(Math.random() * (3) + 1 );

        while ( random == state ){

            random = Math.floor(Math.random() * (3) + 1 );
        }

        return random;

    } else if ( buttonType == "ultrasound") {

        random = Math.floor(Math.random() * (5) + 1 );

        while ( random == state ){

            random = Math.floor(Math.random() * (5) + 1 );
        }

        return random;
    }
}

function prepareMessage( messageType , buttonType, buttonNumber , state , newState , realName) {

    var messageToSend = "";

    if ( messageType == "bin" ) {

        if ( state === 0 ){

            messageToSend = onWord[Math.floor(Math.random() * (4) )] + " " + realName;

        } else if ( state == 1 ){

            messageToSend = offWord[Math.floor(Math.random() * (4) )] + " " + realName;
        }

    } else if ( messageType == "dec") {

        if ( newState > state ) {

            messageToSend = increaseWord[Math.floor(Math.random() * (7) )] + " " + realName + " to " + newState;

        } else if ( newState < state ){

            messageToSend = decreaseWord[Math.floor(Math.random() * (7) )] + " " + realName + " to " + newState;

        }
    }

        return messageToSend;

}

function newInstruction (){

    var button = findButtonState(pickbutton());
    //console.log(button);
    var messageType = pickMessageType( button, button[2]);
    //console.log(messageType);
    var name = currentName( (button[0] + "" + button[1]) );
    //console.log(name);
    var nState = newState( button[0], button[2]);
    //console.log(nState);
    var message = prepareMessage(messageType[0], button[0], button[1], button[2], nState, name);

    return [message, button[0] + "" + button[1], button[0], nState ];

}

exports.newInstruction = newInstruction;