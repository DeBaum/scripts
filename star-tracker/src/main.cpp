#include <Arduino.h>
#include <math.h>
#include <Stepper.h>

int l = 400; // länge der 2 Bretter
float mmPerRev = 1.1; // Winkelsteigung der Gewindestange
float stepsPerRev = 4096.0; // Steps pro kompletter Umdrehung des Stepper-Motors
float gearRatio = 5.0; // gearRatio : 1 vom Stepper-Motor -> Gewindestange

long seconds = 0;
long currentSteps = 0;

Stepper stepperMotor(stepsPerRev, 4, 5, 6, 7);

float toRadians(float degrees) {
  return (degrees / 180) * M_PI;
}

float calcAngle(long seconds) {
  // Erdrotation: 23 Stunden, 56 Minuten, 4 Sekunden
  float secondsPerDay = (23.0 * 60.0 * 60.0) + (56.0 * 60.0) + 4;
  return seconds * (360.0 / secondsPerDay); // = 0.004178079f
}

float calcMM(float angle) {
  float cosVal = cos(toRadians(angle));
	float lSquareTimes2 = l*l*2;
  return cbrt(lSquareTimes2 - lSquareTimes2 * cosVal);
}

int mmToSteps(float mm) {
  return floor((stepsPerRev / mmPerRev) * mm) * gearRatio;
}

void setup() {
  float mm = calcMM(calcAngle(1));
  long stepsPerSecond = ceil(mmToSteps(mm));
  stepperMotor.setSpeed(ceil((stepsPerSecond * 60.0) / stepsPerRev) + 2); // müsste bei 400mm Seitenlänge ungefähr 10 ergeben

  cli(); // clear all interrupts

  TCCR1A = 0;// set entire TCCR1A register to 0
  TCCR1B = 0;// same for TCCR1B
  TCCR1B |= (1 << WGM12); // ctc mode

  TCCR1B |= (1 << CS12) | (1 << CS10); // prescaler = 1024
  OCR1A = 16000000 / 1024; // count to 15.652 -> 1s

  sei(); // enable all interrupts
}

void loop() { }

ISR(TIMER1_COMPA_vect) {
  seconds++;

  float mm = calcMM(calcAngle(seconds));
  long newSteps = ceil(mmToSteps(mm));

  stepperMotor.step(newSteps - currentSteps);

  currentSteps = newSteps;
}