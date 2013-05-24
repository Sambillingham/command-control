    var allInputTypes = ["rocker", "rocker", "toggle", "rotary", "slider" ],
        numOfInputs = 5,
        numOfRockers = 5,
        numOfToggles = 3,
        numOfSliders = 3,
        numOfRotarys = 3;
        numOfUltrasounds = 2;

    var app = require("./app"),
        names = require("./names");

    var onWord = ["Engage the" , "Turn on the" , " Activate the"],
        offWord = ["Shut down the", "Disengage the", " turn off the", "deactivate the" ],
        increaseWord = ["Turn up the", " raise the", "increase the" , "boost the" , " Overload the"],
        decreaseWord= [ "Decrease the", "Pull down the", "Lower the ", "Reduce the ", "bring down the"];
   

function pickbutton () {

    var ranNum = 0;
        type = 0;
        buttonNum = 0;

    ranNum = Math.floor(Math.random() * (numOfInputs) );

    type = allInputTypes[ranNum];

    switch ( type ) {
        case "rocker" :
            buttonNum = Math.floor(Math.random() * (numOfRockers) + 0);
        break;
        case "toggle" :
            buttonNum = Math.floor(Math.random() * (numOfToggles) + 0 );
        break;
        case "slider" :
            buttonNum = Math.floor(Math.random() * (numOfSliders) + 0);
        break;
        case "rotary" :
            buttonNum = Math.floor(Math.random() * (numOfRotarys) + 0);
        break;
        // case "ultrasound" :
        //     buttonNum = Math.floor(Math.random() * (numOfUltrasounds) + 0);
        // break;
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

    if ( type == "rocker" || type == "toggle") {

        messageType = "bin";

    } else {

        messageType = "dec";
    }

    return [ messageType , button[0], button[1] ];
}

function currentName ( inputName ) {

    return names.buttonNames[inputName];

}

function newState ( buttonType , state) {

    var random = 0;

    if ( buttonType == "toggle" || buttonType == "rocker" ) {

        if ( state == 0 || state == "0" ){

            return 1;

        } else if ( state == 1 || state == "1") {

            return 0;
        }

    } else if ( buttonType == "slider" ) {

        random = Math.floor(Math.random() * (3) + 1 );

        while ( random == state ){

            random = Math.floor(Math.random() * (3) + 1 );
        }

        return random;

    } else if ( buttonType == "rotary" ) {

        random = Math.floor(Math.random() * (7) + 1 );

        while ( random == state ){

            random = Math.floor(Math.random() * (7) + 1 );
        }

        return random;

    } else {

        return 0;
    }

    // else if ( buttonType == "ultrasound") {

    //     random = Math.floor(Math.random() * (5) + 1 );

    //     while ( random == state ){

    //         random = Math.floor(Math.random() * (5) + 1 );
    //     }

    //     return random;
    // }
}

function prepareMessage( messageType , buttonType, buttonNumber , state , newState , realName) {

    var messageToSend = "";

    console.log("messageType: ", messageType, "  buttonType: ", buttonType, " buttonNumber: ", buttonNumber, " state: ", state, " newState: ", newState , " realName: ", realName);

    if ( messageType == "bin" ) {

        if ( state === 0 || state == "0" ){

            messageToSend = onWord[Math.floor(Math.random() * (3) )] + " " + realName;

        } else if ( state == 1 ){

            messageToSend = offWord[Math.floor(Math.random() * (4) )] + " " + realName;
        }

    } else if ( messageType == "dec") {

        if ( newState > state ) {

            messageToSend = increaseWord[Math.floor(Math.random() * (5) )] + " " + realName + " to " + newState;

        } else if ( newState < state ){

            messageToSend = decreaseWord[Math.floor(Math.random() * (5) )] + " " + realName + " to " + newState;

        }
    } else {

        messageToSend = "Error!! creating message "
    }

        return messageToSend;

}

function newInstruction (){

    var button = findButtonState(pickbutton()); // 0: type 1:Number 2:current state
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