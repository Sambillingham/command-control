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

int ultrasonicSensor1 = 0;
int ultrasonicSensor2 = 0;

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

        ultrasonicSensor1 = ultrasoundValue( arrayAverage , 1 );

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

        ultrasonicSensor2 = ultrasoundValue( array2Average , 2 );
    }
}

int findAverage ( int *values, int size) {

            int currentArrayVal = 0;
            int preArrayVal = 0;
            int maxArrayVal = 0;
            int minArrayVal = 235;
            int totalVal = 0;
            int average = 0;

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

void printArray (int *a, int n) {

  for (int i = 0; i < n; i++) {

    Serial.print(a[i], DEC);
    Serial.print(' ');

  }

  Serial.println();

}

int ultrasoundValue ( int pulseArray , int ultrasoundNumber ) {

    int pulseValue = 0;

    if ( pulseArray >= 10 && pulseArray <= 22 ){

        pulseValue = 1;

    } else if ( pulseArray > 22 && pulseArray <= 32 ){

        pulseValue = 2;

    } else if ( pulseArray > 32 && pulseArray <= 42 ){

        pulseValue = 3;

    } else if ( pulseArray > 42 && pulseArray <= 52 ){

        pulseValue = 4;
    }
    else if ( pulseArray > 52 && pulseArray <= 70 ){

        pulseValue = 5;

    } else {

        pulseValue = 0;
    }
        return pulseValue;

        Serial.print("Ultrasound ");
        Serial.print(ultrasoundNumber);
        Serial.print(": ");
        Serial.println(pulseValue);

}

