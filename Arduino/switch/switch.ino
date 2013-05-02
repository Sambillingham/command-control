 int ledPin = 13;                     // LED connected to digital pin 13
 int SwitchPin2 = 2;                 // Switch connected to digital pin 2
 int val = 0;                          // variable to store the read value

void setup()
{
  Serial.begin(9600);
  pinMode(ledPin, OUTPUT);      // sets the digital pin 13 as output
  pinMode(SwitchPin2, INPUT);    // sets the digital pin 2 as input
  digitalWrite(SwitchPin2, HIGH); // turn on pullup resistor for switch
}

void loop()
{
  
  val = digitalRead(SwitchPin2);   // read the input pin
  digitalWrite(ledPin, val); // sets the LED to the switch's value
  Serial.print(val);

}