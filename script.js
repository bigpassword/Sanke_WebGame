var boardSize = 7;
var boardFill = 1;

var board = [];

for (let i = 0; i < boardSize; i++) {
	var tempArray = [];
	for (let e = 0; e < boardSize; e++) {
		tempArray.push(boardFill);
	}
	board.push(tempArray);
}

function setup() {
	alert('setup starting');
	
	alert('setup finished successfully');
}

function printBoard() {
	document.getElementById('content').innerHTML = '';

	for (let i = 0; i < board.length; i++) {
		document.getElementById('content').innerHTML += board[i] + '<br>';
	}
}

function input() {

}
