import math
import os

scriptDir = os.path.dirname(os.path.realpath(__file__))

def calcAngle(seconds):
	secondsPerDay = 23*60*60 + 56*60 + 4
	degreesPerSecond = 360 / secondsPerDay
	return degreesPerSecond * seconds

def calcMM(angle):
	cosVal = math.cos(math.radians(angle))
	lSquareTimesL = l*l*2
	return math.sqrt(lSquareTimesL - lSquareTimesL*cosVal)

# ==================================================
# = START ==========================================
# ==================================================

l = int(input("Länge der beiden Seiten in mm: "))
lMax = int(input("Länge der Gewindestange: "))
steps = 60

mmCurrent = 0
seconds = 0
lookupTable = ''
while mmCurrent < lMax:
	mmCurrent = calcMM(calcAngle(seconds))
	lookupTable += '	{:.6f}f,\n'.format(mmCurrent)
	seconds += steps

f = open(os.path.join(scriptDir, '../src', 'lookup.h'), 'w')
f.truncate()
f.write('#include <avr/pgmspace.h>\n\n')
f.write('// l = {} mm, max = {} mm\n'.format(l, lMax, steps))
f.write('const int lookup_steps = {};\n'.format(steps))
f.write('const int lookup_length = {};\n'.format(int(seconds / 60)))
f.write('const PROGMEM float lookup_table[] = {\n')
f.write(lookupTable)
f.write('};\n')