var app = require("./app"),
    helper = require("./helper"),
    levelSystem = require("./levelsystem");

var buttonNames = { "button0" : "0", "button1" : "0", "button2" : "0", "button3" : "0", "button4" : "0", "button5" : "0", "button6" : "0", "button7" : "0", "slider0" : "0", "slider1" : "0", "slider2" : "0", "rotary0" : "0", "rotary1" : "0", "rotary2" : "0", "ultrasound1" : "0", "ultrasound2" : "0" },
    buttonOptions = [ " battery archive", "tertiary screens", "primary core", "Anti wormwhole sys", " loop socket", "Fourth dimension", "star analytics", " driver", "vacuum cleaner", "inner screens", "ionosphere protection", " reactive vortex", "vortex brackets", "hydropnic windows", "9th chevron", "magnification amps", "Evasive Maneuvers", " unstable flutter tube", " hollspectrum", " gyroscopic simulators", "port locators", "volatile shock fields", "warpler injectors", "megatronic blasters", "temporal structers", "timecaster", "avoidance frameworks", "sub sonics", "entanglement filter", "ancient rig", "nove clouds", "omega handle", "J-zipper", " tele leaver", " info wobbler", "toxic gases", "quantum components", "nanite control systems", "dry pumps", "orbital control panel", "drift destabalizers", "iota panels", "ele funnel", "atomic shields", " resistance amplification node", "tactical overlay", "survey rays,", "3d level stabalizers", "gas catalyst", "epsilon window", "beta Signal", "k-mill ", "z-starp", "Star Unit", "bio keeper", "beeping canal", "polymill", " zero ray control ", "inertia dampeners", "Overdrives", "magnet enhancers", "cobalt injecter", "antimatter converter", "Flux Control Systems" , "Missile Targeting Array", "Hyperdrive Engines", "reactor Core", "shield hardeners", "armour plating", "capasitor relay system", "stasis defences", "auxilary boosters", "XJKL5", "sensor array angle"],
    switches = [],
    rotarys = [],
    sliders = [],
    removeFromOptions = 0,
    randomButtonName = "";
    randomButtonNum = 0,
    firstCheck = false,
    secondCheck = false,
    thirdCheck = false,
    primaryStorage = [],
    secondaryStorage = [];


function setButtonNames () {

    console.log(buttonOptions.length);
    if ( firstCheck !== false ) { // so default values will not be stored

        if ( secondCheck !== false ){ // empty values will not be moved into array

            if ( thirdCheck !== false ){

                for(i = 0 ; i <= secondaryStorage.length ; i++ ){

                    buttonOptions.push(secondaryStorage[i]);
                }

                secondaryStorage.splice(0, secondaryStorage.length);


            }

            for(i = 0 ; i <= primaryStorage.length ; i++ ){

                secondaryStorage.push(primaryStorage[i]);
            }

            primaryStorage.splice(0, primaryStorage.length);

            thirdCheck = true;

        }

        primaryStorage.push(buttonNames.button0, buttonNames.button1, buttonNames.button2, buttonNames.button3, buttonNames.button4
            , buttonNames.button5, buttonNames.button6, buttonNames.button7, buttonNames.rotary0 , buttonNames.rotary1
            , buttonNames.rotary2, buttonNames.slider0, buttonNames.slider1, buttonNames.slider2);

        secondCheck = true;
    }
    
    firstCheck = true;

        for ( i = 0 ; i < 8; i++) {

            randomButtonNum = helper.findRandom(0,buttonOptions.length);
            randomButtonName = buttonOptions[randomButtonNum];
            removeFromOptions = buttonOptions.indexOf(randomButtonName);
            switches[i] = buttonOptions[randomButtonNum];
            buttonOptions.splice(removeFromOptions, 1);
            
        }

        for ( i = 0 ; i < 3; i++) {

            randomButtonNum = helper.findRandom(0,buttonOptions.length);
            //console.log( "random number", randomButtonNum);
            randomButtonName = buttonOptions[randomButtonNum];
            //console.log(" random name ", randomButtonName);
            removeFromOptions = buttonOptions.indexOf(randomButtonName);
            //console.log(" index of item to remove", removeFromOptions);
            rotarys[i] = buttonOptions[randomButtonNum];
            //console.log(" name for new button", rotarys[i]);
            buttonOptions.splice(removeFromOptions, 1);
            //console.log(" array without item", buttonOptions);
            
            
        }

        for ( i = 0 ; i < 3; i++) {

            randomButtonNum = helper.findRandom(0,buttonOptions.length);
            randomButtonName = buttonOptions[randomButtonNum];
            removeFromOptions = buttonOptions.indexOf(randomButtonName);
            sliders[i] = buttonOptions[randomButtonNum];
            buttonOptions.splice(removeFromOptions, 1);
            
            
        }

        buttonNames.button0 = switches[0];
        buttonNames.button1 = switches[1];
        buttonNames.button2 = switches[2];
        buttonNames.button3 = switches[3];
        buttonNames.button4 = switches[4];
        buttonNames.button5 = switches[5];
        buttonNames.button6 = switches[6];
        buttonNames.button7 = switches[7];

        buttonNames.slider0 = rotarys[0];
        buttonNames.slider1 = rotarys[1];
        buttonNames.slider2 = rotarys[2];

        buttonNames.rotary0 = sliders[0];
        buttonNames.rotary1 = sliders[1];
        buttonNames.rotary2 = sliders[2];

        //app.buttonNames.ultrasound1 = u1;
        //app.buttonNames.ultrasound2 = u2;

        app.io.sockets.emit('names', buttonNames);
}

exports.buttonNames = buttonNames;
exports.setButtonNames = setButtonNames;