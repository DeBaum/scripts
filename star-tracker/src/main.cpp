#include <Arduino.h>
#include <math.h>
#include <Stepper.h>

#include "lookup.h"

float mmPerRev = 1.1f; // Winkelsteigung der Gewindestange
float stepsPerRev = 2048.0f; // Steps pro kompletter Umdrehung des Stepper-Motors
float gearRatio = 5.0f; // gearRatio : 1 vom Stepper-Motor -> Gewindestange

unsigned long seconds = 1; // sekunde 0 = 0 steps -> erst mit sekunde 1 starten
long currentSteps = 0;

Stepper stepperMotor(stepsPerRev, 2, 4, 3, 5);

bool canStep(int seconds) {
	int arrIndex = seconds / lookup_steps;
	return arrIndex + 1 < lookup_length;
}

float getMM(int seconds) {
	int arrIndex = seconds / lookup_steps;

	float progress = seconds % lookup_steps;
	progress = progress / (float)lookup_steps;

	float diff = pgm_read_float(&lookup_table[arrIndex + 1]);
	diff -= pgm_read_float(&lookup_table[arrIndex]);

	return pgm_read_float(&lookup_table[arrIndex]) + (progress * diff);
}

int mmToSteps(float mm) {
	return floor((stepsPerRev / mmPerRev) * mm * gearRatio);
}

void setup() {
	float mmFirstMinute = getMM(lookup_steps) - getMM(0);
	float maxStepsPerMinute = mmToSteps(mmFirstMinute);
	stepperMotor.setSpeed(ceil((float)maxStepsPerMinute / stepsPerRev)); // sollte immer in < 1 Sekunde drehen
}

void loop() {
	if (seconds * 1000 > millis()) {
		return; // warten auf nächste Sekunde
	}

	if (!canStep(seconds)) {
		return; // stoppen, um Gewindestange nicht raus zu drehen
	}

	int newSteps = mmToSteps(getMM(seconds));
	stepperMotor.step(currentSteps - newSteps); // negativ, da gegen den Uhrzeigersinn drehen

	currentSteps = newSteps;
	seconds++;
}
