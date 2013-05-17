var app = require("./app"),
	messageController = require("./messagecontroller");

var resetInstruction = { "message" : "" , "timer" : "" , "reset" : true };


function checkPlayerAndRemove ( input ) {

    var waitingTopicPos = messageController.waitingFor.indexOf(input),
        whichClient = "client" + messageController.whichcClientWanted[input].toString();

        clearTimeout(messageController.timeOutIds[input]);

        app.io.sockets.socket(app.clients[messageController.whichcClientWanted[input]]).emit('instruction', resetInstruction );

        app.activeClients[whichClient] = false;

        messageController.waitingFor.splice(waitingTopicPos, 1);
        
        messageController.waitingForValue[input] = 99;
        messageController.whichcClientWanted[input] = 99;
}

exports.checkPlayerAndRemove = checkPlayerAndRemove;