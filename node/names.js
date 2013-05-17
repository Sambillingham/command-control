var app = require("./app");

var buttonNames = { "button0" : "0", "button1" : "0", "button2" : "0", "button3" : "0", "button4" : "0", "button5" : "0", "button6" : "0", "button7" : "0", "slider0" : "0", "slider1" : "0", "slider2" : "0", "rotary0" : "0", "rotary1" : "0", "rotary2" : "0", "ultrasound1" : "0", "ultrasound2" : "0" };

function setButtonNames ( btn0, btn1, btn2, btn3 , btn4 , btn5, btn6, btn7, sp0, sp1, sp2, rp0, rp1, rp2, u1, u2 ) {

        buttonNames.button0 = btn0;
        buttonNames.button1 = btn1;
        buttonNames.button2 = btn2;
        buttonNames.button3 = btn3;
        buttonNames.button4 = btn4;
        buttonNames.button5 = btn5;
        buttonNames.button6 = btn6;
        buttonNames.button7 = btn7;

        buttonNames.slider0 = sp0;
        buttonNames.slider1 = sp1;
        buttonNames.slider2 = sp2;

        buttonNames.rotary0 = rp0;
        buttonNames.rotary1 = rp1;
        buttonNames.rotary2 = rp2;

        //app.buttonNames.ultrasound1 = u1;
        //app.buttonNames.ultrasound2 = u2;

        app.io.sockets.emit('names', buttonNames);
}

exports.buttonNames = buttonNames;
exports.setButtonNames = setButtonNames;