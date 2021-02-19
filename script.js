/* defaults */
var cycleTime = 1; /* change to 1 and make game speed independent */

var boardSize = 13;
var boardFill = parseInt(0);
var gameSpeed = 100;
var gameDeltaTime = 0;
var loadTime = 2000;

var pHead = "0";
var pBody = "o";
var pApple = "@";
var pBackground = "-";

var currentLine = "";

/* game vars */
var gameOn = false;
var spawnApple = true;
var mapWrap = true;
var minSize = 3;
var snakeLen = 2;
var curPos;
var startTime;

/* console commands */
var commands = {snake: "snake", clear: "clear", help: "help"};
var helpMsg = "Available commands: " + Object.values(commands);

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

/* disable backspace */
window.onkeydown = function (event) { if (event.which == 8) { event.preventDefault(); } };

/* generate board */
var preBoard;
var board;

function genBoard() {
	preBoard = [];

	for (let i = 0; i < boardSize; i++) {
		let tempArray = [];
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
}

genBoard();

function initLine() {
	currentLine = "";
	consoleContent.innerHTML = "Macrohard Doors v1.1 (0.1.02)<br>(c) 2020 Person Inc. Some rights reserved.<br><br>Wimdons Console /root> ";
}

function resetGameVars() {
	lastInput = "right";
	boardSize = 13;
	gameSpeed = 100;
	spawnApple = true;
	mapWrap = true;
	snakeLen = 2;
}

/*setup things that require the html part to be loaded */
function setup() {
	document.addEventListener("keydown", keyInput, false);
	consoleContent = document.getElementById("consoleContent");

	setInterval(cycle, cycleTime);

	if (!gameOn) {
		initLine();
	}
}

/* print board function */
function printBoard() {
	consoleContent.innerHTML = "Time: " + new Date(new Date().getTime() - startTime).getSeconds() + "<br>";
	consoleContent.innerHTML += "Score: " + snakeLen + "<br>";

	/* actual board*/
	/* debug printout
	board.forEach(i => {
		consoleContent.innerHTML += i + "<br>";
	});
	*/
	board.forEach(i => {
		i.forEach(e => {
			let pval = " ";
			if (e == snakeLen) {
				pval = pHead;
			} else if (e < 0) {
				pval = pApple;
			} else if (e > 0) {
				pval = pBody;
			} else {
				pval = pBackground;
			}
			consoleContent.innerHTML += ` ${pval} `;
		});
		consoleContent.innerHTML += "<br>"
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
				exitGame();
				return;
			} else {
				break;
			}

		default:
			break;
	}

	lastCode = event.keyCode;

	if (!gameOn) {
		if (event.keyCode == 13) {
			executeCommand(currentLine.split(" "));
		} else if (event.keyCode == 8) {
			if (currentLine.length > 0) {
				currentLine = currentLine.slice(0, -1);
				consoleContent.innerHTML = consoleContent.innerHTML.slice(0, -1);
			}
		} else {
			currentLine += event.key;
			consoleContent.innerHTML += event.key;
		}
	}
}

/* command execution */
function executeCommand(command) {
	consoleContent.innerHTML += "<br>";
	switch (command[0]) {
		case commands.snake:
			resetGameVars();
			if (!isNaN(parseInt(command[1]))) {
				if (command[1] == 1) {
					loadTime = 2000;
				} else if (command[1] == 0) {
					loadTime = 0;
				} else {
					consoleContent.innerHTML += "Invalid argument[0]";
					break;
				}
			}

			if (!isNaN(parseInt(command[2]))) {
				if (command[2] >= minSize) {
					boardSize = command[2];
				} else {
					consoleContent.innerHTML += "Board too small";
					break;
				}
			} else if (command[2] != null) {
				consoleContent.innerHTML += "Invalid argument[1]";
				break;
			}

			if (!isNaN(parseInt(command[3]))) {
				gameSpeed = command[3];
			} else if (command[3] != null) {
				consoleContent.innerHTML += "Invalid argument[2]";
				break;
			}

			/* start game */
			setTimeout(() => {
				genBoard();
				gameOn = true;
			}, loadTime);
			if (loadTime > 0) {
				consoleContent.innerHTML = "Controls: <br>movement: [w/s/a/d/arrows] <br>change controls: [ '\\' ] <br> exit game: [ ']' ] <br><br>Starting snek...";
			}
			startTime = new Date().getTime();
			return;
	
		case commands.clear:
			initLine();
			return;
		
		case commands.help:
			if (command[1] != null) {
				switch (command[1]) {
					case commands.snake:
						consoleContent.innerHTML += `Starts snake inside this windows <br> ${commands.snake} [enableDelay:bool] [boardSize:int] [gameSpeed:int]`;
						break;
				
					case commands.clear:
						consoleContent.innerHTML += `Clears text <br> ${commands.clear} {noArg}`;
						break;

					case commands.help:
						consoleContent.innerHTML += `Lists available commands <br> ${commands.help} [command:string]`;
						break;

					default:
						consoleContent.innerHTML += `Invalid command: ${command[1]}`;
						break;
				}
			} else {
				consoleContent.innerHTML += helpMsg;
			}
			break;

		default:
			consoleContent.innerHTML += "Invalid command";
			break;
	}
	consoleContent.innerHTML += "<br><br>";
	currentLine = "";
	consoleContent.innerHTML += "Wimdons Console /root> ";
}

/* logic repeated in the interval */
function cycle() {
	/* check if game is on */
	if (gameOn) {
		/* progress time */
		gameDeltaTime += cycleTime;
		if (gameDeltaTime >= gameSpeed) {
			/* spawn apple */
			while (spawnApple) {
				let x = Math.round(Math.random()*boardSize);
				let y = Math.round(Math.random()*boardSize);

				if (board[x][y] == 0) {
					board[x][y] = -1;
					spawnApple = false;
				}

			}

			/* move snake */
			move();

			/* do visual stuff */
			if (gameOn) {
				printBoard();
			}

			gameDeltaTime = 0;
		}
	}

	updateTime();
}

/* game functions */
function move() {
	switch (lastInput) {
		case "right":
			curPos.x += 1;
			if (curPos.x > boardSize-1) {
				if (mapWrap) {
					curPos.x = 0;
					checkPos();
					board[curPos.y][curPos.x] = snakeLen;
				} else {
					loose();
				}
				
			} else {
				checkPos();
				board[curPos.y][curPos.x] = snakeLen;
			}
			break;

		case "left":
			curPos.x -= 1;
			if (curPos.x < 0) {
				if (mapWrap) {
					curPos.x = boardSize-1;
					checkPos();
					board[curPos.y][curPos.x] = snakeLen;
				} else {
					loose();
				}
			} else {
				checkPos();
				board[curPos.y][curPos.x] = snakeLen;
			}
			break;

		case "up":
			curPos.y -= 1;
			if (curPos.y < 0) {
				if (mapWrap) {
					curPos.y = boardSize-1;
					checkPos();
					board[curPos.y][curPos.x] = snakeLen;
				} else {
					loose();
				}
			} else {
				checkPos();
				board[curPos.y][curPos.x] = snakeLen;
			}
			break;

		case "down":
			curPos.y += 1;
			if (curPos.y > boardSize-1) {
				if (mapWrap) {
					curPos.y = 0;
					checkPos();
					board[curPos.y][curPos.x] = snakeLen;
				} else {
					loose();
				}
			} else {
				checkPos();
				board[curPos.y][curPos.x] = snakeLen;
			}
			break;

		default:
			break;
	}
}

function checkPos() {
	if (board[curPos.y][curPos.x] < 0) {
		snakeLen -= board[curPos.y][curPos.x];
		spawnApple = true;
	} else if (board[curPos.y][curPos.x] > 0) {
		loose();
	}
	lowerBoard();
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

function exitGame() {
	gameOn = false;
	consoleContent.innerHTML += "<br><br>";
	currentLine = "";
	consoleContent.innerHTML += "Wimdons Console /root> ";
	return;
}

function loose() {
	consoleContent.innerHTML += "<br>You lost!";
	exitGame();
}

/* custom function for testing && || fun */
function custom() {
	consoleContent.style.color = `hsl(${Math.floor(Math.random()*360)}, 100%, 45%)`;
}

function updateTime() {
	let date = new Date();
	document.getElementById("clock").innerHTML = date.getHours() + ":" + ("0" + date.getMinutes()).slice(-2);
}