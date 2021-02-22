/* defaults */
var cycleTime = 1;
var networkIcons = ["none", "up", "down", "both"];
var network;
var networkPeriod = 100;
var networkDeltaTime = 0;
var consoleContent;
var consoleWindow;
var consoleTab;
var cmdExe;
var windowSizeB;
var windowActive = true;
var maxWindow = false;
var maxScrollDistance = 40;

var defBoardSize = 13;
var defGameSpeed = 50;

var boardFill = parseInt(0);
var gameDeltaTime = 0;
var loadTime = 2000;
var defInput = "right";

var pHead = "0";
var pBody = "o";
var pApple = "@";
var pBackground = "-";

var currentLine = "";

var rainbowText = false;

/* game vars */
var defApple = true;
var defMapWrap = true;
var defSnakeLen = 3;

var gameOn = false;
var boardSize = 13;
var minSize = 3;
var snakeLen = 3;
var curPos;
var startTime;

/* console commands */
var commands = {snake: "snake", clear: "clear", help: "help", epilepsy: "epilepsy"};
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
	lastInput = defInput;
	boardSize = defBoardSize;
	gameSpeed = defGameSpeed;
	spawnApple = defApple;
	mapWrap = defMapWrap;
	snakeLen = defSnakeLen;
}

/*setup things that require the html part to be loaded */
function setup() {
	document.addEventListener("keydown", keyInput, false);
	consoleContent = document.getElementById("consoleContent");
	consoleWindow = document.getElementById("console");
	consoleTab = document.getElementById("commandPromptTab");
	windowSizeB = document.getElementById("sizeIcon");
	network = document.getElementById("network");
	cmdExe = document.getElementById("cmdExe");

	setInterval(cycle, cycleTime);

	if (!gameOn) {
		initLine();
	}
}

/* print board function */
function printBoard() {
	consoleContent.innerHTML = "Time: " + new Date(new Date().getTime() - startTime).getSeconds() + "<br>";
	consoleContent.innerHTML += "Score: " + (snakeLen - defSnakeLen) + "<br>";

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
		consoleContent.innerHTML += "<br>";
	});
}

/* handle input */
function keyInput(event) {
	if (!windowActive) {
		return;
	}
	switch (event.keyCode) {
		case controls.left:
			if (lastInput != "right") {
				lastInput = "left";
			}
			break;

		case controls.up:
			if (lastInput != "down") {
				lastInput = "up";
			}
			break;

		case controls.right:
			if (lastInput != "left") {
				lastInput = "right";
			}
			break;

		case controls.down:
			if (lastInput != "up") {
				lastInput = "down";
			}
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
			}
			break;

		default:
			break;
	}
	
	network.src = "graphics/network_down.png";

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
			if (command[1] != null) {
				if (command[1] == "true") {
					loadTime = 2000;
				} else if (command[1] == "false") {
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

			if (command[4] != null) {
				if (command[4] == "true") {
					mapWrap = true;
				} else if (command[4] == "false") {
					mapWrap = false;
				} else {
					consoleContent.innerHTML += "Invalid argument[0]";
					break;
				}
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
		
		case commands.epilepsy:
			consoleContent.innerHTML += "Toggling epilepsy mode..."
			rainbowText = !rainbowText;
			if (!rainbowText) {
				consoleContent.style.color = "white";
			}
			break;

		case commands.help:
			if (command[1] != null) {
				switch (command[1]) {
					case commands.snake:
						consoleContent.innerHTML += `Starts snake inside this windows <br> ${commands.snake} [enableDelay:bool] [boardSize:int] [gameSpeed:int] [mapWrap:bool]`;
						break;
				
					case commands.clear:
						consoleContent.innerHTML += `Clears text <br> ${commands.clear} {noArg}`;
						break;

					case commands.epilepsy:
						consoleContent.innerHTML += `Toggles rainbow text (warning, may trigger epilepsy) <br> ${commands.epilepsy} {noArg}`;
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

	scrollBottom();
}

/* logic repeated in the interval */
function cycle() {
	/* check if game is on */
	if (gameOn) {
		/* check if won by clearing board */
		let winCondition = true;
		board.forEach(el => {
			el.forEach(il => {
				if (il == 0) {
					winCondition = false;
				}
			});
		});
		if (winCondition) {
			winGame();
		}

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

	/* epilepsy mode */
	if (rainbowText) {
		custom();
	}

	updateTabs();
	updateNetwork();
	updateTime();
	updateScroll();
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

function winGame() {
	consoleContent.innerHTML += "<br>You win!";
	exitGame();
}

/* custom function for testing && || fun */
function custom() {
	consoleContent.style.color = `hsl(${Math.floor(Math.random()*360)}, 100%, 50%)`;
}

function scrollBottom() {
	consoleContent.scrollTop = consoleContent.scrollHeight - consoleContent.clientHeight;
}

function updateScroll() {
	let distanceToBottom = (consoleContent.scrollTop + consoleContent.clientHeight - consoleContent.scrollHeight)*-1;
	
	if (distanceToBottom <= maxScrollDistance) {
		scrollBottom();
	}
}

function updateTime() {
	let date = new Date();
	document.getElementById("clock").innerHTML = date.getHours() + ":" + ("0" + date.getMinutes()).slice(-2);
}

function updateNetwork() {
	let up = Math.round(Math.random());
	let down = Math.round(Math.random());
	let status;

	if (gameOn) {
		up = 1;
	}

	if (networkDeltaTime > networkPeriod) {
		status = `${down}${up}`;
		networkDeltaTime = 0;
	}

	switch (status) {
		case "00":
			network.src = "graphics/network_none.png";
			break;
			
		case "01":
			network.src = "graphics/network_up.png";
			break;
			
		case "10":
			network.src = "graphics/network_down.png";
			break;
			
		case "11":
			network.src = "graphics/network_both.png";
			break;
	
		default:
			break;
	}

	networkDeltaTime += cycleTime;
}

function updateTabs() {
	/* update tab to be minimalized if brower window smaller that allowed; refer to the .css file for further context */
	if (window.innerWidth <= 746) {
		consoleTab.style.borderStyle = "outset";
	} else if (windowActive) {
		consoleTab.style.borderStyle = "";
	}

	if (consoleTab.style.borderStyle == "outset") {
		consoleTab.style.backgroundColor = "";
	} else if (consoleTab.style.borderStyle == "") {
		consoleTab.style.backgroundColor = "rgb(224, 224, 224)";
	}
}

function runCmd() {
	/*
	if (consoleTab.style.display == "none") {
		if (window.innerWidth <= 746) {
			consoleTab.style.display = "";
			cmdExe.style.zIndex = "";

			return;
		}
		consoleWindow.style.display = "";

		windowActive = true;
	} else if (consoleTab.style.borderStyle == "outset") {
		toggleMiniWindow();
	}

	if (consoleTab.style.display == "none") {
		consoleWindow.style.display = "";
		cmdExe.style.zIndex = "";
	}

	consoleTab.style.display = "";
	*/
	consoleTab.style.display = "";
	consoleTab.style.borderStyle = "outset";

	if (window.innerWidth > 746 && consoleWindow.style.display == "none") {
		windowActive = false;
		toggleMiniWindow();
		cmdExe.style.zIndex = "";
	}
}

function closeWindow() {
	consoleWindow.style.display = "none";
	consoleTab.style.display = "none";
	cmdExe.style.zIndex = "0";
}

function toggleMiniWindow() {
	/* stop if brower window smaller that allowed; refer to the .css file for further context */
	if (window.innerWidth <= 746) {
		return;
	}
	windowActive = !windowActive;
	if (windowActive) {
		consoleWindow.style.display = "";
		consoleTab.style.borderStyle = "inset";
		cmdExe.style.zIndex = "";
	} else {
		consoleWindow.style.display = "none";
		consoleTab.style.borderStyle = "outset";
		cmdExe.style.zIndex = "0";
	}
}

function toggleMaxWindow() {
	maxWindow = !maxWindow;
	if (maxWindow) {
		consoleWindow.style.width = "100%";
		consoleWindow.style.height = "100%";
		consoleWindow.style.margin = "0px";
		consoleWindow.style.borderStyle = "none";
		windowSizeB.src = "graphics/winMin.png";
	} else {
		consoleWindow.style.width = "";
		consoleWindow.style.height = "";
		consoleWindow.style.margin = "";
		consoleWindow.style.borderStyle = "";
		windowSizeB.src = "graphics/winMax.png";
	}
}

function clearSelect() {
	cmdExe.style.backgroundColor = "";
}

function selectExe() {
	cmdExe.style.backgroundColor = "lightskyblue";
}