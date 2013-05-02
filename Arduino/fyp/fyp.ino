 //wifly
  #include <SPI.h>
  #include <WiFly.h>
  #include <PubSubClient.h>
  #include <stdlib.h>
  #include "wifi_credentials.h"

  
  //timer
  #include <SimpleTimer.h>
  #include <Servo.h>

  int testingInt;
  char* charMe = "B";
  char* onSignal = "1";
  char* offSignal = "0";

  byte currentPayload;
  byte testByteA = 9;

  int SwitchPin2 = 2;    
  int SwitchPin4 = 4;

  int button2 = 0;
  int button4 = 0;   

  Servo myservo;

  SimpleTimer timer;
  
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
    char*  testTopic = "1/test";
    char* nodeTopic = "5/node";
    char* button2Topic = "1/button2";
    char* button4Topic = "1/button4";


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
    pinMode(3, OUTPUT);
    pinMode(SwitchPin4, INPUT);
    digitalWrite(SwitchPin4, HIGH); // turn on pullup resistor for switch   
    pinMode(5, OUTPUT); 
    pinMode(6, OUTPUT); 
    pinMode(7, OUTPUT); 
    pinMode(8, OUTPUT);
    pinMode(9, OUTPUT);

    myservo.attach(9);
    
    wifiConnect();
    timer.setInterval(600, testTimer);
    mqttSubscribe();
  
}

void loop()
{
    cl.loop();
    timer.run();
    
    
    button2 = digitalRead(SwitchPin2);
    button4 = digitalRead(SwitchPin4);



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

void testTimer(){

  Serial.println("TESTING THIS @>% SEC thing");
  cl.publish(testTopic, charMe );


  if (button2 == 1){
      cl.publish(button2Topic, onSignal );
  } else if ( button2 == 0 ) {
      cl.publish(button2Topic, offSignal );
 }
 if (button4 == 1){
      cl.publish(button4Topic, onSignal );
  } else if ( button4 == 0 ) {
      cl.publish(button4Topic, offSignal );
 }
  

  Serial.print("button number 2 is");
  Serial.println(button2);
    Serial.println("---- > testing these buttons");
    Serial.print("button number 4 is");
    Serial.println(button4);

}


