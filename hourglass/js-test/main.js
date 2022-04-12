var ctx = document.querySelector("canvas").getContext("2d");
var loopInterval = 50;


var millis = 0;
var timer = 0;
var totalGrains = 0;

var unten = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var oben = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var initialOben = [
	       // +x <== 0
	0b1111111111111111, // y = 0
	0b1111111111111111, // y = 1 etc.
	0b1111111111111111,
	0b1111111111111111,
	0b1111111111111111,
	0b1111111111111111,
	0b1111111111111111,
	0b1111111111111111,
	0b1111111111111111,
	0b1111111111111111,
	0b1111111111111111,
	0b1111111111111111,
	0b1111111111111111,
	0b1111111111111111,
	0b1111111111111111,
	0b1111111111111111,
];

setup();

function setup() {
	ctx.strokeStyle = "#888888";
	ctx.lineWidth = "1px";
	ctx.strokeRect(0, 0, 128, 128);
	ctx.strokeRect(128, 128, 128, 128);

	window.__interval = setInterval(loop, loopInterval);

	setTimeout(startTimer, 2000, 2*60*1000);
}

function startTimer(timerDuration) {
	timer = timerDuration;

	for (var o = 0; o < initialOben.length; o++) {
		oben[o] = initialOben[o];
	}
	for (var u = 0; u < unten.length; u++) {
		unten[u] = 0;
	}

	while (timer / countGrains(oben) < 1000) {
		removeNextGrain(15, 15);
	}

	millis = 0;
	totalGrains = countGrains(oben);
}

function loop() {
	millis += loopInterval;

	var removed = removeTopGrain();
	letGrainFall(removed);
	paintHourglass();
}

function removeTopGrain() {
	var currentGrains = countGrains(oben);
	if (currentGrains == 0) {
		return false;
	}

	var nextGrain = currentGrains / totalGrains;
	nextGrain = 1 - nextGrain;
	nextGrain = nextGrain * timer;

	if (millis < nextGrain) {
		return false;
	}

	return removeNextGrain(15, 15);
}

function removeNextGrain(x, y) {
	var spaceLeft = y > 0;
	var spaceLeft3 = y > 2 && x < 15;
	var spaceRight = x > 0;
	var spaceright3 = y < 15 && x > 2;
	var spaceCenter = spaceLeft && spaceRight;

	var left   = spaceLeft   && (oben[y-1] & (1 << x)) > 0;
	var left3  = spaceLeft   && (oben[y-3] & (1 << (x+1))) > 0;
	var right  = spaceRight  && (oben[y]   & (1 << (x-1))) > 0;
	var right3 = spaceRight  && (oben[y+1] & (1 << (x-3))) > 0;
	var center = spaceCenter && (oben[y-1] & (1 << (x-1))) > 0;

	if (left && right && center) {
		switch (rand(2)) {
			case 0: return removeNextGrain(x  , y-1); // left
			case 1: return removeNextGrain(x-1, y  ); // right
			case 2: return removeNextGrain(x-1, y-1); // center
		}
	} else if (left && right) {
		switch (rand(1)) {
			case 0: return removeNextGrain(x  , y-1); // left
			case 1: return removeNextGrain(x-1, y  ); // right
		}
	} else if (left && center) {
		if (spaceRight) {
			return removeNextGrain(x+1, y-1); // center
		} else {
			switch (rand(1)) {
				case 0: return removeNextGrain(x  , y-1); // left
				case 1: return removeNextGrain(x-1, y-1); // center
			}
		}
	} else if (right && center) {
		if (spaceLeft) {
			return removeNextGrain(x+1, y-1); // center
		} else {
			switch (rand(1)) {
				case 0: return removeNextGrain(x-1, y  ); // right
				case 1: return removeNextGrain(x-1, y-1); // center
			}
		}
	} else if (left) {
		if (left3 && rand(1) == 0) {
			return removeNextGrain(x+1, y-3); // left3
		} else {
			return removeNextGrain(x  , y-1); // left
		}
	} else if (right) {
		if (right3 && rand(1) == 0) {
			return removeNextGrain(x-3, y+1); // right3
		} else {
			return removeNextGrain(x-1, y  ); // right
		}
	} else if (center) {
		return removeNextGrain(x-1, y-1); // center
	} else {
		oben[y] ^= 1<<x;
		paintHourglass();
		return true;
	}
}

var fallX = 99, fallY = 99, fallNextTick = 0;
function letGrainFall(start) {
	if (!start && fallX == 99 && fallY == 99) {
		return;
	}

	if (start) {
		unten[0] |= 1;
		fallX = 0;
		fallY = 0;
		fallNextTick = millis + 50;
	}

	if (millis < fallNextTick) {
		return;
	}

	var nextX = fallX + 1;
	var nextY = fallY + 1;

	var spaceLeft   = nextX < 16;
	var spaceRight  = nextY < 16;
	var spaceCenter = spaceLeft && spaceRight;

	var left   = spaceLeft   && (unten[fallY] & (1 << nextX)) == 0;
	var right  = spaceRight  && (unten[nextY] & (1 << fallX)) == 0;
	var center = spaceCenter && (unten[nextY] & (1 << nextX)) == 0;

	if (!left && !right && !center) {
		fallX = 99;
		fallY = 99;
		return;
	}

	unten[fallY] ^= (1 << fallX); // remove on current pos

	if (center) {
		unten[nextY] |= (1 << nextX); // add directly below
		fallX = nextX;
		fallY = nextY;
	} else {
		if (left && right) {
			switch (rand(1)) {
				case 0: left  = false; break;
				case 1: right = false; break;
			}
		}

		if (left) {
			unten[fallY] |= (1 << nextX); // add to the left
			fallX = nextX;
		}
		if (right) {
			unten[nextY] |= (1 << fallX); // add to the right
			fallY = nextY;
		}
	}

	fallNextTick += 50;
}

function paintHourglass() {
	var x, y;
	ctx.clearRect(1, 1, 126, 126);
	for (x = 0; x < 16; x++) {
		for (y = 0; y < 16; y++) {
			ctx.beginPath();
			ctx.arc(x*8 + 4, y*8 + 4, 3, 0, 2 * Math.PI);
			if (oben[y] & (1 << x)) {
				ctx.fill();
			}
			ctx.closePath();
			ctx.stroke();
		}
	}

	ctx.clearRect(129, 129, 126, 126);
	for (x = 0; x < 16; x++) {
		for (y = 0; y < 16; y++) {
			ctx.beginPath();
			ctx.arc(x*8 + 132, y*8 + 132, 3, 0, 2 * Math.PI);
			if (unten[y] & (1 << x)) {
				ctx.fill();
			}
			ctx.closePath();
			ctx.stroke();
		}
	}
}

function countGrains(matrix) {
	var count = 0;
	for (var i = 0; i < matrix.length; i++) {
		var row = matrix[i];
		while (row > 0) {
			if (row & 1) {
				count++;
			}
			row >>= 1;
		}
	}
	return count;
}

// returns 0..max (incl)
function rand(max) {
	return Math.floor(Math.random()*(max+1));
}


// PoC transform to Arduino LedControl usable Data
function transformMatrix(matrix) {
	var row;
	var blocks = [
		[0b11111111,0b11111111,0b11111111,0b11111111,0b11111111,0b11111111,0b11111111,0b11111111],
		[0b11111111,0b11111111,0b11111111,0b11111111,0b11111111,0b11111111,0b11111111,0b11111111],
		[0b11111111,0b11111111,0b11111111,0b11111111,0b11111111,0b11111111,0b11111111,0b11111111],
		[0b11111111,0b11111111,0b11111111,0b11111111,0b11111111,0b11111111,0b11111111,0b11111111],
	];

	for (row = 0; row < 8; row++) {
		blocks[0][row] = (matrix[row] >> 8) & 0b11111111;
	}
	for (row = 0; row < 8; row++) {
		blocks[1][row] = matrix[row] & 0b11111111;
	}
	for (row = 8; row < 16; row++) {
		blocks[2][row - 8] = (matrix[row] >> 8) & 0b11111111;
	}
	for (row = 8; row < 16; row++) {
		blocks[3][row - 8] = matrix[row] & 0b11111111;
	}

	return blocks;
}
