    #include <SPI.h>
    #include <WiFly.h>
    #include <PubSubClient.h>
    #include "wifi_credentials.h"

    char* onSignal = "1";
    char* offSignal = "0";

    char* signal1 = "1";
    char* signal2 = "2";
    char* signal3 = "3";
    char* signal4 = "4";
    char* signal5 = "5";
    char* signal6 = "6";
    char* signal7 = "7";

    char* ultrasoundOff = "0";
    char* ultrasound1 = "1";
    char* ultrasound2 = "2";
    char* ultrasound3 = "3";
    char* ultrasound4 = "4";
    char* ultrasound5 = "5";


    byte currentPayload;

    //PLAYER 3 CONTROLS
    int redRockerP3 = 22;
    int redRocker2P3 = 23;
    int toggleSwitchP3 = 24;
    int redRockerS1P3 = 25;
    int redRockerS2P3 = 26;
    int slidePotP3 = A0;
    int rotPotP3 = A8;

    //PLAYER 2 CONTROLS
    int slidePot1P2 = A1;
    int slidePot2P2 = A2;
    int rotPot1P2 = A9;
    int rotPot2P2 = A10;
    int toggleSwitch1P2 = 27;
    int toggleSwitch2P2 = 28;
    int redRockerRoundP2 = 29;

    //PLAYER 1 CONTROLS
    int redRocker1P1 = 30;
    int redRocker2P1 = 31;
    int toggleSwitch1P1 = 32;
    int toggleSwitch2P1 = 33;
    int redRockerS1P1 = 34;
    int slidePotP1 = A3;
    int rotPotP1 = A11;

    //Extra Controls
    const int ultraPin1 = 6;
    const int ultraPin2 = 7;
    int redButton = 35;
    int missileSwitch = 36;
    int keySwitch = 37;

    //End Contros

    int keepAliveTimer = 0;

    long connectionCheck = 0;
    int connectionTimeout = 30000; //miliiseconds

    int buttons[] = {0,0,0,0,0,0,0,0};
    int previousButtons[] = {0,0,0,0,0,0,0,0};

    int slidePots[] = {0,0,0};
    int currentSlidePotReading[] = {0,0,0};
    int previousSlidePots[] = {0,0,0};
    
    int rotPots[] = {0,0,0};
    int currentRotPotReading[] = {0,0,0};
    int previousRotPots[] = {0,0,0};

    //wifly
    byte ip[] = { 192, 168, 0, 20 };
    WiFlyClient fypClient;
    PubSubClient cl(ip, 8085, subscriptions, fypClient);

    //Topics to subscribe to
    char* nodeTopic = "5/node";

    //Publish Topics set as Char Arrays
    char* connectedCheck = "1/connected1";
    char* keepAliveTopic ="1/keepAlive";

    char* slider[] = { "1/slider0", "1/slider1", "1/slider2", "1/slider3" };
    char* rotary[] = { "1/rotary0", "1/rotary1", "1/rotary2", "1/rotary3" };
    char* buttonTopics[] = { "1/rocker0", "1/rocker1", "1/toggle0", "1/rocker2", "1/rocker3", "1/toggle1", "1/toggle2", "1/rocker4", "1/rocker5", "1/rocker6", "1/toggle3", "1/toggle4", "1/rocker7" };
    char* ultrasoundTopics[] = { "1/ultrasound0" };
    char* extraTopics[] = { "1/keySwitch0", "1/redButton0", "1/missileSwitch0"}; 

    int ultra1ArraySize = 9;
    int ultra2ArraySize = 9;

    int ultra1Values[] = { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0};
    int ultra2Values[] = { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0};

    int ultrasoundValue1 = 0;
    int ultrasoundValue2 = 0;

    int previousUltrasoundValue[] = { 0, 0, 0};

    long pulse1;
    long pulse2;

    int ultrasonicSensor1 = 0;
    int ultrasonicSensor2 = 0;

    long previousPulseMillis = 0;
    long previousPulseMillis2 = 0;
    long pulseInterval = 10;
    long ultraSoundMillis = 0; 
    long ultraSoundMillis2 = 0; 
    long UltraSoundInterval = 345;
    long UltraSoundInterval2 = 345;  

    long rotaryCheckTimeOut[] = { 0, 0, 0 };
    int rotarySendDelay = 400;

    long sliderCheckTimeOut[] = { 0, 0, 0 };
    int sliderSendDelay = 400;


    void subscriptions (char* topic, byte* payload, unsigned int length) {

    if(String(topic) == keepAliveTopic){

        keepAliveTimer++;

        Serial.print("Keep Alive: ");
        Serial.println(keepAliveTimer);
    }
}
//Arduino setup
void setup()
{
    Serial.begin(9600);

    pinMode(redRockerP3, INPUT_PULLUP);
    pinMode(redRocker2P3, INPUT_PULLUP);
    pinMode(toggleSwitchP3, INPUT_PULLUP);
    pinMode(redRockerS1P3, INPUT_PULLUP);
    pinMode(redRockerS2P3, INPUT_PULLUP);
    pinMode(toggleSwitch1P2, INPUT_PULLUP);
    pinMode(toggleSwitch2P2, INPUT_PULLUP);
    pinMode(redRockerRoundP2, INPUT_PULLUP);

    // pinMode(redRocker1P1, INPUT_PULLUP);
    // pinMode(redRocker2P1, INPUT_PULLUP);
    // pinMode(toggleSwitch1P1, INPUT_PULLUP);
    // pinMode(toggleSwitch2P2, INPUT_PULLUP);
    // pinMode(redRockerS1P1, INPUT_PULLUP);


    
    wifiConnect();
    mqttSubscribe();
  
}

void loop() {

    connectionChecker();    //Checks to see if connection has dropped and trys to re-connect

    cl.loop();      //MQTT Client loop function. Pub & Sub

    readInputs();       //Read Inputs and assign to array varibles

    runSliders();       //calculates & asigns slider potentioneter values and publishs to MQTT
    runRotary();        //calculates & asigns rotary potentiometers values and publishs to MQTT
    runSwitches();      //Read states of switche and publish to MQTT
    //runUltrasound();    //Read values of ultrasound, publish to MQTT

}// End Loop

//BEGIN FUNCTIONS

void wifiConnect() {
  
  WiFly.begin();
  Serial.println("WiFly Connecting...");
  delay(5000);
         
    if (!WiFly.join(ssid, passphrase)) {
    
      Serial.println("Connection failed.");
    
      while (1) {

        Serial.println("hanging...");
      // Hang on failure.
      } 
  }
  
  Serial.println("Connected to WiFi!");
  delay(5000);

}

void mqttSubscribe(){
  
    if (cl.connect("Arduino Mega")) {

        //List Topics to subscribe to ->
        cl.publish(connectedCheck, onSignal);
        cl.subscribe(keepAliveTopic);

        Serial.println("MQTT subscribed.");

    } else {

        Serial.println(" NOT Connected : MQTT subscription failed");
    }


}

int checkRotValue ( int rotary ) {

    int rotarySetting = 0;

    if ( rotary >= 903 ){

        rotarySetting = 7;

    } else if ( rotary < 873 && rotary >= 773){

        rotarySetting = 6;

    } else if ( rotary < 723 && rotary >= 623) {

        rotarySetting = 5;

    } else if ( rotary < 573 && rotary >= 473){

        rotarySetting = 4;

    } else if ( rotary < 423 && rotary >= 323) {

        rotarySetting = 3;

    } else if ( rotary < 273 && rotary >= 173){

        rotarySetting = 2;

    } else if ( rotary < 223 ) {

        rotarySetting = 1;
 
    }else {

        rotarySetting = 0;
    }

    return rotarySetting;

    

}

int checkSliderValue ( int slider ) {

    int sliderSetting = 0;

    if ( slider >= 823 ){

        sliderSetting = 3;

    } else if ( slider < 611 && slider >= 411){

        sliderSetting = 2;

    } else if ( slider < 200) {

        sliderSetting = 1;

    } else {

        sliderSetting = 0;
    }

    return sliderSetting;
}

int checkSliderLargeValue ( int slider ) {

    int sliderSetting = 0;

    if ( slider >= 803 ){

        sliderSetting = 4;

    } else if ( slider < 773 && slider >= 560){

        sliderSetting = 3;

    } else if ( slider < 510 && slider >= 300){

        sliderSetting = 2;

    } else if ( slider < 250) {

        sliderSetting = 1;

    } else {

        sliderSetting = 0;
    }

    return sliderSetting;

}
void publishUltrasound ( int ultrasonic , int previousUltrasonic , int ultrasonicNum ) {

    
    if ( ultrasonic != previousUltrasonic) {

        previousUltrasoundValue[ultrasonicNum] = ultrasonic;
        Serial.println(ultrasonic);

        switch ( ultrasonic ) {

        case 0 :
        cl.publish(ultrasoundTopics[ultrasonicNum], ultrasoundOff );
            break;
        case 1 :
        cl.publish(ultrasoundTopics[ultrasonicNum], ultrasound1 );
            break;
        case 2 :
        cl.publish(ultrasoundTopics[ultrasonicNum], ultrasound2 );
            break;
        case 3 :
        cl.publish(ultrasoundTopics[ultrasonicNum], ultrasound3 );
            break;
        case 4 :
        cl.publish(ultrasoundTopics[ultrasonicNum], ultrasound4 );
            break;
        case 5 :
        cl.publish(ultrasoundTopics[ultrasonicNum], ultrasound5 );
            break;
        }

    }

}
int findAverage ( int *values, int size , int ultrasoundNumber) {

            int currentArrayVal = 0;
            int preArrayVal = 0;
            int maxArrayVal = 0;
            int minArrayVal = 235;
            int totalVal = 0;
            int average = 0;
            int pulseValue = 0;

        for ( int i = 1; i < size; i++ ) {

            totalVal = totalVal + values[i-1];
            currentArrayVal = values[i];
            preArrayVal = values[i-1];

            if ( preArrayVal >= currentArrayVal && preArrayVal >= maxArrayVal) {

                maxArrayVal = preArrayVal;
            }

            if ( preArrayVal <= currentArrayVal && preArrayVal <= minArrayVal) {

                minArrayVal = preArrayVal;
            }

        }

        totalVal = totalVal + currentArrayVal;

        average = ( totalVal - ( minArrayVal + maxArrayVal ))/ 7;

         if ( average >= 10 && average <= 22 ){

            pulseValue = 1;

        } else if ( average > 22 && average <= 32 ){

            pulseValue = 2;

        } else if ( average > 32 && average <= 42 ){

            pulseValue = 3;

        } else if ( average > 42 && average <= 52 ){

            pulseValue = 4;
        }
        else if ( average > 52 && average <= 70 ){

            pulseValue = 5;

        } else {

            pulseValue = 0;
        }
        return pulseValue;
}


void runSliders() {

    for ( int i = 0; i < 3; i++){

        if ( i == 0 ) {

            currentSlidePotReading[i] = checkSliderLargeValue(slidePots[i]);

        } else if ( i > 0 ) {

            currentSlidePotReading[i] = checkSliderValue(slidePots[i]);

        }

        unsigned long currentTimer = millis();

        if(currentTimer - sliderCheckTimeOut[i] > sliderSendDelay) { 

            sliderCheckTimeOut[i] = currentTimer; 

            if ( currentSlidePotReading[i] != previousSlidePots[i] ){

                previousSlidePots[i] = currentSlidePotReading[i];

                    switch (currentSlidePotReading[i]) {

                        case 4 :
                            cl.publish(slider[i], signal4 );
                        break;
                        case 3 :
                            cl.publish(slider[i], signal3 );
                        break;
                        case 2 :
                            cl.publish(slider[i], signal2 );
                        break;
                        case 1 :
                            cl.publish(slider[i], signal1 );
                        break;
                    }
                
            } else { // if same reading
                // do nothing
            }
        }
    }
}

void runRotary() {

    for (int i = 0; i < 3; i++){

        currentRotPotReading[i] = checkRotValue(rotPots[i]);

        unsigned long currentTimer = millis();

        if(currentTimer - rotaryCheckTimeOut[i] > rotarySendDelay) { 

            rotaryCheckTimeOut[i] = currentTimer; 

            if ( currentRotPotReading[i] != previousRotPots[i] ) {

                previousRotPots[i] = currentRotPotReading[i];

                    switch( currentRotPotReading[i] ) {

                    case 7 :
                        cl.publish(rotary[i], signal7 );
                    break;
                    case 6 :
                        cl.publish(rotary[i], signal6 );
                    break;
                    case 5 :
                        cl.publish(rotary[i], signal5 );
                    break;
                    case 4 :
                        cl.publish(rotary[i], signal4 );
                    break;
                    case 3 :
                        cl.publish(rotary[i], signal3 );
                    break;
                    case 2 :
                        cl.publish(rotary[i], signal2 );
                    break;
                    case 1 :
                        cl.publish(rotary[i], signal1 );
                    break;

                    }
            }

        } else {
            // do nothing
        }
    }
}

void runSwitches(){

    for (int i = 0; i < 8; i++) {

        if ( buttons[i] != previousButtons[i]){

            previousButtons[i] = buttons[i];

            Serial.print("button : ");
            Serial.print(i);
            Serial.print(" is set to :");
            Serial.println(buttons[i]);


            if ( i <= 4 ){ // correct incorrect wiring for player 2 controls by fliping player 1s

                if (buttons[i] == 1){

                    cl.publish(buttonTopics[i], offSignal );

                } else if ( buttons[i] == 0 ) {

                    cl.publish(buttonTopics[i], onSignal );

                }


            } else {


                if (buttons[i] == 1){

                    cl.publish(buttonTopics[i], onSignal );

                } else if ( buttons[i] == 0 ) {

                    cl.publish(buttonTopics[i], offSignal );

                }
            }

          
        } else if ( buttons[i] == previousButtons[i]) {
            //do nothing

        }

    }
}

void runUltrasound() {

    unsigned long currentTimer = millis();

    if(currentTimer - ultraSoundMillis > UltraSoundInterval) { 

        ultraSoundMillis = currentTimer; 

        for(int i = 0; i < ultra1ArraySize; i++) {   

            unsigned long currentMillis = millis();
             
            if(currentMillis - previousPulseMillis > pulseInterval) { 

                previousPulseMillis = currentMillis; 

                pulse1 = pulseIn(ultraPin1, HIGH);
                ultra1Values[i] = pulse1/45;

            }
        }

        ultrasoundValue1 = findAverage(ultra1Values, ultra1ArraySize , 1);

        publishUltrasound ( ultrasoundValue1 , previousUltrasoundValue[1] , 1);


    }

    // 2

    unsigned long currentTimer2 = millis();
     
    if(currentTimer2 - ultraSoundMillis2 > UltraSoundInterval2) { 

        ultraSoundMillis2 = currentTimer2; 

        for(int i = 0; i < ultra1ArraySize; i++) {   

            unsigned long currentMillis = millis();
             
            if(currentMillis - previousPulseMillis2 > pulseInterval) { 

                previousPulseMillis2 = currentMillis; 

                pulse2 = pulseIn(ultraPin2, HIGH);
                ultra2Values[i] = pulse2/45;

            }
        }


        ultrasoundValue2 = findAverage(ultra2Values, ultra2ArraySize, 2);

        publishUltrasound ( ultrasoundValue2 , previousUltrasoundValue[2] , 2);
    
    }

}

void readInputs() {

    //Reads and asigns inputs. Used in main loop function

    // pinMode(ultraPin1, INPUT);
    // pinMode(ultraPin2, INPUT);

    //Player 3 buttons/switches
    buttons[0] = digitalRead(redRockerP3);
    buttons[1] = digitalRead(redRocker2P3);
    buttons[2] = digitalRead(toggleSwitchP3);
    buttons[3] = digitalRead(redRockerS1P3);
    buttons[4] = digitalRead(redRockerS2P3);
    //Player 2 buttons/switches
    buttons[5] = digitalRead(toggleSwitch1P2);
    buttons[6] = digitalRead(toggleSwitch2P2);
    buttons[7] = digitalRead(redRockerRoundP2);
    //Player 1 buttons/switches
    // buttons[8] = digitalRead(redRocker1P1);
    // buttons[9] = digitalRead(redRocker2P1);
    // buttons[10] = digitalRead(toggleSwitch1P1);
    // buttons[11] = digitalRead(toggleSwitch2P1);
    // buttons[12] = digitalRead(redRockerS1P1);

    //Player 3 Pots
    slidePots[0] = analogRead(slidePotP3);
    rotPots[0] = analogRead(rotPotP3);
    //Player 2 Pots
    slidePots[1] = analogRead(slidePot1P2);
    slidePots[2] = analogRead(slidePot2P2);
    rotPots[1] = analogRead(rotPot1P2);
    rotPots[2] = analogRead(rotPot2P2);
    //Player 1 Pots
    // slidePots[3] = analogRead(slidePotP1);
    // rotPots[3] = analogRead(rotPotP1);

}

void connectionChecker() {

    unsigned long currentTime = millis();

    if (currentTime - connectionCheck > connectionTimeout ) {

        connectionCheck = currentTime;

        if (cl.connected() == false ){

            Serial.println("Disconnected from MQTT broker.");
            Serial.println("Trying to re-connect..");

            mqttSubscribe();

        }
        
        if (fypClient.connected() == false ) {

            Serial.println("Disconnected from WiFi..");
            Serial.println("Trying to re-connect...");
            wifiConnect();

        }


    }
}