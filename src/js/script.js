let interval = 1000;

let board = []; //Array zum Speichern des BoardState
let boardRows = 50;
let boardCols = 50;
let isRunning = false;

let generation = 1;


const aliveClass = 'alive';








/** Berechnet den BoardState für die nächste Generation, erhöht den 
 *  Generationszähler um eins und zeichnet das Board neu.
 */
function nextGeneration() {

	let nextGenerationBoard = deepCloneArray(board);
		
	for (let row = 0; row < boardRows; row++) {
		for (let col = 0; col < boardCols; col++) {
			
			let neighbors = countNeighbors(row, col);
			
			if (neighbors == 3) {
				nextGenerationBoard[row][col] = true;								
			}
			else if (neighbors != 2) {
				nextGenerationBoard[row][col] = false;
			}
		}
	}
		
  board = deepCloneArray(nextGenerationBoard);
  generation++;
  drawBoard();	
}


/** Aktualisiert die Anzeige der Kontrollelemente auf der Seite (u.a. welche
 *  Buttons verfügbar sind).
 */
function drawControls()	{
	let buttonText = (isRunning ? "Stoppen" : "Starten"); 
	document.getElementById("runbutton").innerText = buttonText;	
	document.getElementById("clearbutton").disabled = isRunning;
	document.getElementById("nextbutton").disabled = isRunning;
}


/** Aktualisiert die Darstellung des Boards mit Hilfe des aktuellen BoardStates.
 */
function drawBoard() {
	
	// Anzeige der Zellen
	for (let row = 0; row < boardRows; row++) {
		for (let col = 0; col < boardCols; col++) {
			let boardTileId = getBoardTileId(row, col);
			let boardTile = document.getElementById(boardTileId);
			let isAlive = board[row][col];
			if(isAlive && !hasClass(boardTile, aliveClass)) {
			boardTile.classList.add(aliveClass);
		} else if (!isAlive && hasClass(boardTile, aliveClass)) {
				boardTile.classList.remove(aliveClass);
			}
		}
	}	
	//Anzeige der Labels
	document.getElementById('generation-label').innerText = generation + '. Generation';

}


/** Prüft, ob ein Element einer bestimmten Klasse angehört.
 *  @param element - HTML-Element
 *  @param className - string des Klassennamens, nach welchem gesucht werden soll
 *  @return boolean 
 */
function hasClass(element, className) {
    return (' ' + element.className + ' ').indexOf(' ' + className+ ' ') > -1;
}


/** Setzt alle Zellen auf dem Board auf Tot.
 */
function clearBoard()	{
	if (!isRunning) {
		generation = 1;
		for (row = 0; row < boardRows; row++) {
			for (col = 0; col < boardCols; col++) {
				board[row][col] = false;
			}
		}		
		drawBoard(true);		
	}
}


function onCellClicked(y,x)	{
	return function() {
		if (!isRunning) {
			board[y][x] = !board[y][x];
			drawBoard(true);
		}
	}
}


function toogleRunning() {
	isRunning = !isRunning;
	drawControls();
}


function getBoardTileId(row, col) {
	return 'r' + row + 'c' + col;
}


/** Wird einmalig beim Start der Webseite aufgerufen und erstellt das
 *  Spielfeld.
 */
function init() {
	
	//let xBoardCenter = Math.round(boardCols/2);
	//let yBoardCenter = Math.round(boardRows/2);

	tbody = document.getElementById("gameboard");

	for (let row = 0; row < boardRows; row++) {
		let currentRow = tbody.appendChild(document.createElement("tr"));
		board[row] = [];
		
		for (let col = 0; col < boardCols; col++) {
			let boardTile = document.createElement("td");
			boardTile.id = getBoardTileId(row, col);
			boardTile.addEventListener('click', onCellClicked(row, col));
			currentRow.appendChild(boardTile);
			board[row][col] = false;
		}	
	}
	
	drawControls();
	drawBoard();
}
init();

setInterval(function() { 
	if (isRunning) {
		nextGeneration();
	}   
}, 1000);


/* Zählt die Anzahl der lebenden Nachbarzellen einer Zelle.
*  @return int (0-8)
*/
function countNeighbors(row, col) {	
	let neighbors = 0;	
	for (let y = row-1; y <= row + 1; y++) {
		for (let x = col-1; x <= col + 1; x++) {
			if (x === col && y === row) {
				continue; //eigene Zellkoordinaten überspringen
			}
			if (board[y] && board[y][x] && board[y][x] === true) {
				neighbors++;
			}
		}
	}	
	return neighbors;
}


/** Erstellt eine vollständige Kopie eines Arrays. Dabei werden 
 *  auch evtl. vorhandene Referenztypen von mehrdimensionalen Arrays
 *  kopiert. Die Standardfunktionen von JS erzeugen leider nur eine
 *  Shallow-Copy 
 *  @see: https://medium.com/@ziyoshams/deep-copying-javascript-arrays-4d5fc45a6e3e
 */
 function deepCloneArray(inputArray) {
	return JSON.parse(JSON.stringify(inputArray))
}