var app = require("./app"),
    helper = require("./helper"),
    levelSystem = require("./levelsystem");

var buttonNames = { "rocker0" : "0" , "rocker1" : "0", "rocker2" : "0", "rocker3" : "0", "rocker4" : "0", "rocker5" : "0", "rocker6" : "0",
                    "rocker7" : "0", "toggle0" : "0", "toggle1" : "0", "toggle2" : "0", "toggle3" : "0", "toggle4" : "0", "slider0" : "0",
                    "slider1" : "0", "slider2" : "0", "slider3" : "0", "rotary0" : "0", "rotary1" : "0", "rotary2" : "0", "rotary3" : "0" },
    buttonOptions = [ "battery archive", "Vertical modulator", "gigahitser cannon", "radiator", "spracks", "tertiary screens", "primary core", "Anti wormhole sys", " loop socket", "Fourth dimension", 
                    "star analytics", " driver", "vacuum cleaner", "inner screens", "ionosphere protection", " reactive vortex", 
                    "vortex brackets", "hydropnic windows", "9th chevron", "magnification amps", "Evasive Maneuvers",
                    " unstable flutter tube", " hollspectrum", " gyroscopic simulators", "port locators", "volatile shock fields",
                    "warpler injectors", "megatronic blasters", "temporal structers", "timecaster", "avoidance frameworks", "sub sonics",
                    "entanglement filter", "ancient rig", "nove clouds", "omega handle", "J-zipper", " tele leaver", " info wobbler",
                    "toxic gases", "quantum components", "nanite control systems", "dry pumps", "orbital control panel", "drift destabalizers",
                    "iota panels", "elle funnel", "atomic shields", " resistance amplification node", "tactical overlay", "survey rays,",
                    "3d level stabalizers", "gas catalyst", "epsilon window", "beta Signal", "k-mill ", "z-starp", "Star Unit", "bio keeper",
                    "beeping canal", "polymill", " zero ray control ", "inertia dampeners", "Overdrives", "magnet enhancers", "cobalt injecter",
                    "antimatter converter", "Flux Control Systems" , "Missile Targeting Array", "Hyperdrive Engines", "reactor Core",
                    "shield hardeners", "armour plating", "capasitor relay system", "stasis defences", "auxilary boosters", "XJKL5",
                    "sensor array angle", "USB drives", "vulpt controller" ],
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
    

        for ( i = 0 ; i < 13; i++) {

            randomButtonNum = helper.findRandom(0,buttonOptions.length);
            randomButtonName = buttonOptions[randomButtonNum];
            removeFromOptions = buttonOptions.indexOf(randomButtonName);
            switches[i] = buttonOptions[randomButtonNum];
            buttonOptions.splice(removeFromOptions, 1);
            
        }

        for ( i = 0 ; i < 4; i++) {

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

        for ( i = 0 ; i < 4; i++) {

            randomButtonNum = helper.findRandom(0,buttonOptions.length);
            randomButtonName = buttonOptions[randomButtonNum];
            removeFromOptions = buttonOptions.indexOf(randomButtonName);
            sliders[i] = buttonOptions[randomButtonNum];
            buttonOptions.splice(removeFromOptions, 1);
            
            
        }

        buttonNames.rocker0 = switches[0];
        buttonNames.rocker1 = switches[1];
        buttonNames.toggle0 = switches[2];
        buttonNames.rocker2 = switches[3];
        buttonNames.rocker3 = switches[4];
        buttonNames.toggle1 = switches[5];
        buttonNames.toggle2 = switches[6];
        buttonNames.rocker4 = switches[7];

        buttonNames.rocker5 = switches[8];
        buttonNames.rocker6 = switches[9];
        buttonNames.toggle3 = switches[10];
        buttonNames.toggle4 = switches[11];
        buttonNames.rocker7 = switches[12];

        buttonNames.slider0 = rotarys[0];
        buttonNames.slider1 = rotarys[1];
        buttonNames.slider2 = rotarys[2];
        buttonNames.slider3 = rotarys[3];

        buttonNames.rotary0 = sliders[0];
        buttonNames.rotary1 = sliders[1];
        buttonNames.rotary2 = sliders[2];
        buttonNames.rotary3 = sliders[3];

        app.io.sockets.emit('names', buttonNames);
}

function resetNames () {

        buttonOptions.push(buttonNames.rocker0, buttonNames.rocker1, buttonNames.rocker2, buttonNames.rocker3, buttonNames.rocker4,
                        buttonNames.rocker5, buttonNames.rocker6, buttonNames.rocker7, buttonNames.toggle0, buttonNames.toggle2,
                        buttonNames.toggle3, buttonNames.toggle4, buttonNames.slider0, buttonNames.slider1, buttonNames.slider2,
                        buttonNames.slider3, buttonNames.rotary0, buttonNames.rotary1, buttonNames.rotary2, buttonNames.rotary3);
    
}

exports.buttonNames = buttonNames;
exports.setButtonNames = setButtonNames;
exports.resetNames = resetNames;