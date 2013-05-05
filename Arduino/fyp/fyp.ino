 //wifly
  #include <SPI.h>
  #include <WiFly.h>
  #include <PubSubClient.h>
  #include <stdlib.h>
  #include "wifi_credentials.h"

  char* onSignal = "1";
  char* offSignal = "0";

  char* sliderSignalLow = "1";
  char* sliderSignalMed = "2";
  char* sliderSignalHigh = "3";

  byte currentPayload;
  byte testByteA = 9;

  int SwitchPin2 = 2;
  int SwitchPin3 = 3;    
  int SwitchPin4 = 4;
  int SwitchPin5 = 5;
  int SwitchPin6 = 6;

  int potPin = A5;
  int slider1 = 0;
  int slider1Setting = 0;
  int previousSlider1Setting = 1;

  int buttons[] = {0,0,0,0,0,0,0};
  int previousButtons[] = {0,0,0,0,0,0,0};

  //wifly
  byte ip[] = { 192, 168, 0, 20 };
  WiFlyClient fypClient;
  PubSubClient cl(ip, 8085, callback, fypClient);
  
    //LED check for wifly 
    int LedCheckPin = 13;
    int state = LOW;
    void toggleLED()
    {
        state = !state;
        digitalWrite(LedCheckPin, state);  
    }

    //Topics to subscribe to
    char* testTopic = "1/test";
    char* nodeTopic = "5/node";

    char* sliderTopic = "1/slider1";

    char* buttonTopics[] = { "1/button0", "1/button1", "1/button2", "1/button3", "1/button4", "1/button5", "1/button6"};

    char* low = "5/low";
    char* med = "5/med";
    char* meda = "5/meda";
    char* high = "5/high";
    
void callback(char* topic, byte* payload, unsigned int length) {

    if(String(topic) == nodeTopic){

        Serial.println("MQTT Recived");

        Serial.println("Node TOPIC RECIVED");
    }

    
    if(String(topic) == low){

      myservo.write(0);
       

    }
    if(String(topic) == med){

      myservo.write(75);
       

    }

    if(String(topic) == meda){

      myservo.write(140);
       
    }
    if(String(topic) == high){

      myservo.write(179);
      

    }
}
//Arduino setup
void setup()
{
    Serial.begin(4800);
     
    pinMode(SwitchPin2, INPUT);
    digitalWrite(SwitchPin2, HIGH); // turn on pullup resistor for switch 
    pinMode(SwitchPin3, INPUT);
    digitalWrite(SwitchPin3, HIGH); // turn on pullup resistor for switch 
    pinMode(SwitchPin4, INPUT);
    digitalWrite(SwitchPin4, HIGH); // turn on pullup resistor for switch   
    pinMode(SwitchPin5, INPUT);
    digitalWrite(SwitchPin5, HIGH); // turn on pullup resistor for switch 
    pinMode(SwitchPin6, INPUT);
    digitalWrite(SwitchPin6, HIGH); // turn on pullup resistor for switch 
    pinMode(7, OUTPUT); 
    pinMode(8, OUTPUT);
    pinMode(9, OUTPUT);

    myservo.attach(9);
    
    wifiConnect();
    mqttSubscribe();
  
}

void loop()
{
    cl.loop();
    
    buttons[2] = digitalRead(SwitchPin2);
    buttons[3] = digitalRead(SwitchPin3);
    buttons[4] = digitalRead(SwitchPin4);
    buttons[5] = digitalRead(SwitchPin5);
    buttons[6] = digitalRead(SwitchPin6);

    slider1 = analogRead(potPin);

    if ( slider1 >= 823 ){

        slider1Setting = 3;

    } else if ( slider1 < 611 && slider1 >= 411){

      slider1Setting = 2;

    } else if ( slider1 < 200) {

      slider1Setting = 1;

    } else {

      slider1Setting = 0;
    }

    if ( slider1Setting != previousSlider1Setting) {

      previousSlider1Setting = slider1Setting;
      Serial.println(slider1Setting);

      if ( slider1Setting == 3 ){

          cl.publish(sliderTopic, sliderSignalHigh );

      } else if ( slider1Setting == 2 ){

          cl.publish(sliderTopic, sliderSignalMed );

      } else if ( slider1Setting == 1) {

          cl.publish(sliderTopic, sliderSignalLow );
          
      } else {

      }
      


    }

    for (int i = 0; i < 8; i++) {

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


    //TODO make this work
    if(cl.connected()==false){
      Serial.println("Disconnected from MQTT broker.");
      Serial.println("Retrying connection...");
      mqttSubscribe();
    }
    
    if(fypClient.connected()==false){
      Serial.println("Disconnected from WiFi.");
      Serial.println("Retrying connection...");
      wifiConnect();
    }

}
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
    cl.subscribe(nodeTopic);
    Serial.println("MQTT subscribed.");
  }
  
  else {
    Serial.println("MQTT subscription failed.");
  }
}


