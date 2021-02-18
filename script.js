/* defaults */
var boardSize = 23;
var boardFill = parseInt(0);
var gameSpeed = 200;

var currentLine = "";

/* game vars */
var gameOn = false;
var spawnApple = true;
var mapWrap = true;
var snakeLen = 2;
var curPos;

/* console commands */
var commands = {startGame: "python3 snake.py", clear: "clear"};

/*

w == 87
s == 83
a == 65
d == 68

left == 37
up == 38
right == 39
down == 40

pipe == 220
] == 221
[ -- 219

*/

/* input dictionary */
const defControls = {left: 37, up: 38, right: 39, down: 40};
const altControls = {left: 65, up: 87, right: 68, down: 83};
var controls = defControls;
var swapKey = 220;
var consoleKey = 221;

function addContorls() {
	controls.swap = swapKey;
	controls.console = consoleKey;
}

addContorls();

var consoleContent;
var lastInput = "right";
var lastCode;

/* generate board */
var preBoard = [];
var board;


for (let i = 0; i < boardSize; i++) {
	var tempArray = [];
	for (let e = 0; e < boardSize; e++) {
		tempArray.push(boardFill);
	}
	preBoard.push(tempArray);
}

/* spawn player*/
var mid = Math.floor(boardSize/2);
preBoard[mid][mid] = snakeLen;
curPos = {x: mid, y: mid};

/* load board */
board = preBoard;

function initLine() {
	currentLine = "";
	consoleContent.innerHTML = "Macrohard Doors v1.1<br>(c) 2020 Person Inc. Some rights reserved.<br><br>Wimdons Console /root> "
}

/*setup things that require the html part to be loaded */
function setup() {
	alert("setup starting");

	document.addEventListener("keydown", keyInput, false);
	consoleContent = document.getElementById("consoleContent");

	if (!gameOn) {
		initLine();
	}

	alert("setup finished successfully");
}

/* print board function */
function printBoard() {
	consoleContent.innerHTML = new Date().toTimeString() + "<br>";
	consoleContent.innerHTML += new Date().getSeconds() + "<br>";

	board.forEach(i => {
		consoleContent.innerHTML += i + "<br>";
	});
}

/* handle input */
function keyInput(event) {
	switch (event.keyCode) {
		case controls.left:
			lastInput = "left";
			break;

		case controls.up:
			lastInput = "up";
			break;

		case controls.right:
			lastInput = "right";
			break;

		case controls.down:
			lastInput = "down";
			break;

		case controls.swap:
			if (controls != defControls) {
				controls = defControls;
				
			} else {
				controls = altControls;
			}
			addContorls();
			break;

		case controls.console:
			if (gameOn) {
				gameOn = false;
				initLine();
				return;
			}
			break;

		default:
			lastCode = event.keyCode;
			break;
	}

	if (!gameOn) {
		if (event.keyCode == 13) {
			executeCommand(currentLine);
		} else {
			currentLine += event.key;
			consoleContent.innerHTML += event.key;
		}
	}
}

/* command execution */
function executeCommand(command) {
	consoleContent.innerHTML += "<br>"
	switch (command) {
		case commands.startGame:
			gameOn = true;
			break;
	
		case commands.clear:
			initLine();
			return;
		
		default:
			consoleContent.innerHTML += "Invalid command"
			break;
	}
	consoleContent.innerHTML += "<br>"
	currentLine = "";
	consoleContent.innerHTML += "Wimdons Console /root> "
}

/* game logic */
function advanceGame() {
	/* return if game is off */
	if (!gameOn) {
		return;
	}

	/* spawn apple */
	while (spawnApple) {
		let x = Math.round(Math.random()*boardSize);
		let y = Math.round(Math.random()*boardSize);

		if (board[x][y] == 0) {
			board[x][y] = -1;
			spawnApple = false;
		}

	}
	
	/* lower board */
	lowerBoard();
	
	/* move snake */
	move();

	/* position conditions */
	checkPos();

	/* do visual stuff */
	printBoard();
}

/* game functions */
function move() {
	switch (lastInput) {
		case "right":
			curPos.x += 1;
			if (curPos.x > boardSize-1) {
				if (mapWrap) {
					curPos.x = 0;
					board[curPos.y][curPos.x] = snakeLen;
				} else {
					loose();
				}
				
			} else {
				board[curPos.y][curPos.x] = snakeLen;
			}
			break;

		case "left":
			curPos.x -= 1;
			if (curPos.x < 0) {
				if (mapWrap) {
					curPos.x = boardSize-1;
					board[curPos.y][curPos.x] = snakeLen;
				} else {
					loose();
				}
			} else {
				board[curPos.y][curPos.x] = snakeLen;
			}
			break;

		case "up":
			curPos.y -= 1;
			if (curPos.y < 0) {
				if (mapWrap) {
					curPos.y = boardSize-1;
					board[curPos.y][curPos.x] = snakeLen;
				} else {
					loose();
				}
			} else {
				board[curPos.y][curPos.x] = snakeLen;
			}
			break;

		case "down":
			curPos.y += 1;
			if (curPos.y > boardSize-1) {
				if (mapWrap) {
					curPos.y = 0;
					board[curPos.y][curPos.x] = snakeLen;
				} else {
					loose();
				}
			} else {
				board[curPos.y][curPos.x] = snakeLen;
			}
			break;

		default:
			break;
	}
}

function checkPos() {
	if (board[curPos.y][curPos.x]) {

	}
}

function lowerBoard() {
	for (let y = 0; y < board.length; y++) {
		for (let x = 0; x < board.length; x++) {
			if (board[y][x] > 0) {
				board[y][x] -= 1;
			}
		}
		
	}
}

function loose() {
	alert("lost");
}

/* custom function for testing && || fun */
function custom() {
	consoleContent.style.color = `hsl(${Math.floor(Math.random()*360)}, 100%, 45%)`;
}

/* setup timed events */
setInterval(advanceGame, gameSpeed);