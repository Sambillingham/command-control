const int ultraPin1 = 6;
const int ultraPin2 = 9;

int ultra1ArraySize = 5;
int ultra2ArraySize = 5;

int ultra1Values[] = { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0};
int ultra2Values[] = { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0};

int arrayAverage = 0;
int array2Average = 0;

long pulse1;
long pulse2;

boolean ultraLowest = false;
boolean ultraLow = false;
boolean ultraMid = false;
boolean ultraHigh = false;
boolean ultraHighest = false;

boolean ultraLowest2 = false;
boolean ultraLow2 = false;
boolean ultraMid2 = false;
boolean ultraHigh2 = false;
boolean ultraHighest2 = false;

long previousPulseMillis = 0;
long previousPulseMillis2 = 0;
long pulseInterval = 5;
long ultraSoundMillis = 0; 
long ultraSoundMillis2 = 0; 
long UltraSoundInterval = 45;
long UltraSoundInterval2 = 45;  

void setup() {

  Serial.begin(4800);

}

void loop() {

  pinMode(ultraPin1, INPUT);
  pinMode(ultraPin2, INPUT);



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

            //printArray(ultra1Values, ultra1ArraySize);
            arrayAverage = findAverage(ultra1Values, ultra1ArraySize);
            //Serial.println(arrayAverage);

            if ( arrayAverage >= 10 && arrayAverage <= 22 ){

                if ( ultraLowest == true ) {

                    Serial.print("Ultrasound 1: ");
                    Serial.println(1);

                    // ultraLowest = false;
                }

                ultraLowest = true;
                ultraLow = false;
                ultraMid = false;
                ultraHigh = false;
                ultraHighest = false;

            } else if ( arrayAverage > 22 && arrayAverage <= 32 ){

                if ( ultraLow == true ) {

                    Serial.print("Ultrasound 1: ");
                    Serial.println(2);

                    // ultraLow = false;
                }

                ultraLowest = false;
                ultraLow = true;
                ultraMid = false;
                ultraHigh = false;
                ultraHighest = false;

            } else if ( arrayAverage > 32 && arrayAverage <= 42 ){

                if ( ultraMid == true ) {

                    Serial.print("Ultrasound 1: ");
                    Serial.println(3);

                    // ultraMid = false;
                }

                ultraLowest = false;
                ultraLow = false;
                ultraMid = true;
                ultraHigh = false;
                ultraHighest = false;

            } else if ( arrayAverage > 42 && arrayAverage <= 52 ){

                if ( ultraHigh == true ) {

                    Serial.print("Ultrasound 1: ");
                    Serial.println(4);

                    // ultraHigh = false;
                }

                ultraLowest = false;
                ultraLow = false;
                ultraMid = false;
                ultraHigh = true;
                ultraHighest = false;

            }
            else if ( arrayAverage > 52 && arrayAverage <= 70 ){

                if ( ultraHighest == true ) {

                    Serial.print("Ultrasound 1: ");
                    Serial.println(5);

                    // ultraHighest = false;
                }

                ultraLowest = false;
                ultraLow = false;
                ultraMid = false;
                ultraHigh = false;
                ultraHighest = true;

            }
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

            //printArray(ultra2Values, ultra2ArraySize);
            array2Average = findAverage(ultra2Values, ultra2ArraySize);
            //Serial.println(array2Average);

            if ( array2Average >= 10 && array2Average <= 22 ){

                if ( ultraLowest2 == true ) {

                    Serial.print("Ultrasound 2: ");
                    Serial.println(1);

                    // ultraLowest = false;
                }

                ultraLowest2 = true;
                ultraLow2 = false;
                ultraMid2 = false;
                ultraHigh2 = false;
                ultraHighest2 = false;

            } else if ( array2Average > 22 && array2Average <= 32 ){

                if ( ultraLow2 == true ) {

                    Serial.print("Ultrasound 2: ");
                    Serial.println(2);

                    // ultraLow = false;
                }

                ultraLowest2 = false;
                ultraLow2 = true;
                ultraMid2 = false;
                ultraHigh2 = false;
                ultraHighest2 = false;

            } else if ( array2Average > 32 && array2Average <= 42 ){

                if ( ultraMid2 == true ) {

                    Serial.print("Ultrasound 2: ");
                    Serial.println(3);

                    // ultraMid = false;
                }

                ultraLowest2 = false;
                ultraLow2 = false;
                ultraMid2 = true;
                ultraHigh2 = false;
                ultraHighest2 = false;

            } else if ( array2Average > 42 && array2Average <= 52 ){

                if ( ultraHigh2 == true ) {

                    Serial.print("Ultrasound 2: ");
                    Serial.println(4);

                    // ultraHigh = false;
                }

                ultraLowest2 = false;
                ultraLow2 = false;
                ultraMid2 = false;
                ultraHigh2 = true;
                ultraHighest2 = false;

            }
            else if ( array2Average > 52 && array2Average <= 70 ){

                if ( ultraHighest2 == true ) {

                    Serial.print("Ultrasound 2: ");
                    Serial.println(5);

                    // ultraHighest = false;
                }

                ultraLowest2 = false;
                ultraLow2 = false;
                ultraMid2 = false;
                ultraHigh2 = false;
                ultraHighest2 = true;

            }
        }
}

int findAverage ( int *values, int size) {

            int currentArrayVal = 0;
            int preArrayVal = 0;
            int maxArrayVal = 0;
            int maxArrayVal2 = 0;
            int minArrayVal = 235;
            int minArrayVal2 = 235;
            int totalVal = 0;
            int average = 0;
            int secondArray[] = {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 };
            boolean maxFound = false;
            boolean minFound = false;

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

        average = ( totalVal - ( minArrayVal + maxArrayVal ))/ 3;

        return average;
}

void printArray(int *a, int n) {
  for (int i = 0; i < n; i++)
  {
    Serial.print(a[i], DEC);
    Serial.print(' ');
  }
  Serial.println();
}

