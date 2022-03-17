#include <Arduino.h>
#include <math.h>

int l = 400; // länge der 2 Bretter
float mmPerRev = 1.1; // Winkelsteigung der Gewindestange
float stepsPerRev = 4096.0; // Steps pro kompletter Umdrehung des Stepper-Motors
int gearRatio = 5; // gearRatio : 1 vom Stepper-Motor -> Gewindestange

long seconds = 0;
long currentSteps = 0;

double toRadians(double degrees) {
  return (degrees / 180) * M_PI;
}

double calcAngle(long seconds) {
  return seconds * (360.0 / 24.0 / 60.0 / 60.0); // = 0.004166666f
}

double calcMM(double angle) {
  double cosVal = cos(toRadians(angle));
	double lSquareTimes2 = l*l*2;
  return cbrt(lSquareTimes2 - lSquareTimes2 * cosVal);
}

int mmToSteps(double mm) {
  return floor((stepsPerRev / mmPerRev) * mm) * gearRatio;
}

void setup() {
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
  double angle = calcAngle(seconds);
  double mm = calcMM(angle);
  long newSteps = ceil(mmToSteps(mm));

  // TODO stepper um `newSteps-currentSteps` drehen

  currentSteps = newSteps;
}