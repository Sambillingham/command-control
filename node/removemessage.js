var app = require("./app"),
	messageController = require("./messagecontroller");

var resetInstruction = { "message" : "" , "timer" : "" , "reset" : true };


function checkPlayerAndRemove ( input ) {

    var waitingTopicPos = messageController.waitingFor.indexOf(input);

        clearTimeout(messageController.timeOutIds[input]);

        app.io.sockets.socket(messageController.whichClientWanted[input]).emit('instruction', resetInstruction );
        
        app.clients.push(messageController.whichClientWanted[input]);

        messageController.waitingFor.splice(waitingTopicPos, 1);
        
        messageController.waitingForValue[input] = 99;
        messageController.whichClientWanted[input] = 99;
}

exports.checkPlayerAndRemove = checkPlayerAndRemove;