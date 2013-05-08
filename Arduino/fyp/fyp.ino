    #include <SPI.h>
    #include <WiFly.h>
    #include <PubSubClient.h>
    #include "wifi_credentials.h"

    char* onSignal = "1";
    char* offSignal = "0";

    char* sliderSignalLow = "1";
    char* sliderSignalMed = "2";
    char* sliderSignalHigh = "3";

    char* ultrasoundOff = "0";
    char* ultrasound1 = "1";
    char* ultrasound2 = "2";
    char* ultrasound3 = "3";
    char* ultrasound4 = "4";
    char* ultrasound5 = "5";

    byte currentPayload;

    int SwitchPin2 = 2;
    int SwitchPin3 = 3;    
    int SwitchPin4 = 4;
    int SwitchPin5 = 5;
    int SwitchPin6 = 6;

    long connectionCheck = 0;
    int connectionTimeout = 20000; //miliiseconds

    int potPin = A5;
    int slider1 = 0;
    int slider1Setting = 0;
    int previousSlider1Setting = 1;

    int buttons[] = {0,0,0,0,0,0,0};
    int previousButtons[] = {0,0,0,0,0,0,0};
  
    //wifly
    byte ip[] = { 192, 168, 0, 20 };
    WiFlyClient fypClient;
    PubSubClient cl(ip, 8085, subscriptions, fypClient);

    //Topics to subscribe to
    char* nodeTopic = "5/node";

    //Publish Topics set as Char Arrays
    char* sliderTopic = "1/slider1";
    char* buttonTopics[] = { "1/button0", "1/button1", "1/button2", "1/button3", "1/button4", "1/button5", "1/button6"};
    char* ultrasoundTopics[] = { "1/ultrasound0", "1/ultrasound1", "1/ultrasound2" };

    const int ultraPin1 = 6;
    const int ultraPin2 = 9;

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


    void subscriptions (char* topic, byte* payload, unsigned int length) {

    if(String(topic) == nodeTopic){

        Serial.println("MQTT Recived");
    }
}
//Arduino setup
void setup()
{
    Serial.begin(4800);

    pinMode(SwitchPin3, INPUT);
    digitalWrite(SwitchPin3, HIGH); // turn on pullup resistor for switch 
    pinMode(SwitchPin4, INPUT);
    digitalWrite(SwitchPin4, HIGH); // turn on pullup resistor for switch   
    pinMode(SwitchPin5, INPUT);
    digitalWrite(SwitchPin5, HIGH); // turn on pullup resistor for switch 

    pinMode(7, OUTPUT); 
    pinMode(8, OUTPUT);
    
    wifiConnect();
    mqttSubscribe();
  
}

void loop()
{   

    pinMode(ultraPin1, INPUT);
    pinMode(ultraPin2, INPUT);

    cl.loop();
    
    buttons[3] = digitalRead(SwitchPin3);
    buttons[4] = digitalRead(SwitchPin4);
    buttons[5] = digitalRead(SwitchPin5);

    slider1 = analogRead(potPin);

    slider1Setting = checkSliderValue(slider1);

    if ( slider1Setting != previousSlider1Setting) {

      previousSlider1Setting = slider1Setting;
      //Serial.println(slider1Setting);

      if ( slider1Setting == 3 ){

          cl.publish(sliderTopic, sliderSignalHigh );

      } else if ( slider1Setting == 2 ){

          cl.publish(sliderTopic, sliderSignalMed );

      } else if ( slider1Setting == 1) {

          cl.publish(sliderTopic, sliderSignalLow );
          
      } else {

      }

    }

    for (int i = 3; i < 6; i++) {

        if ( buttons[i] != previousButtons[i]){

            previousButtons[i] = buttons[i];

            Serial.print("button : ");
            Serial.print(i);
            Serial.print(" is set to :");
            Serial.println(buttons[i]);

            if (buttons[i] == 1){

              cl.publish(buttonTopics[i], onSignal );

            } else if ( buttons[i] == 0 ) {

                  cl.publish(buttonTopics[i], offSignal );

            }

          
        } else if ( buttons[i] == previousButtons[i]){

        }

    }

    /*---------- ULTRA -----------*/

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

        /*------------------2-----------------------*/

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

    /*--------------------*/

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

}// End Loop
/*--------------------------------*/

void wifiConnect() {
  
  WiFly.begin();
    
    Serial.println("WiFly Connecting...");
         
    if (!WiFly.join(ssid, passphrase)) {
    
      Serial.println("Connection failed.");
    
      while (1) {
      // Hang on failure.
      } 
  }
  
  Serial.println("Connected to WiFi!");

}

void mqttSubscribe(){
  
    if(cl.connect("Arduino")){

        //List Topics to subscribe to ->
        cl.subscribe(nodeTopic);

        Serial.println("MQTT subscribed.");

    }
  
    else {

        Serial.println("MQTT subscription failed.");
    }

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
