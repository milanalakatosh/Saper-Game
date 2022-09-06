const field = document.querySelector(".field");

let buttons;

const fldHeight = findFieldHeight();
let mineAmount;
const arrButtons = [];


// function findFieldHeight() {
// 	if (n === 9 || n === 16) return n;
// 	else return 16;
// }

let n = 9;
function createButtonsOnField() {
	for (let i = 0; i < n; i++) {
			const div = document.createElement("div"); //как по-другому тут сделать /n
			field.append(div);
			const buttonsRow = [];
			for (let j = 0; j < fldHeight; j++) {
					const button = document.createElement("button");
					button.classList.add('button');
					div.append(button);
					buttonsRow.push(button);
			}
			arrButtons.push(buttonsRow);
	}
	buttons = field.querySelectorAll(".button");
	buttons.forEach(button =>
			button.addEventListener('contextmenu', button => button.preventDefault()) // что это???

	);
}
const buttons = document.querySelectorAll('.button');
function putMines() {
	if (n === 9) mineAmount = 10;
	else if (n === 16) mineAmount = 40;
	else mineAmount = 99;
	// mine10.textContent = String(mineAmount)[0]; таблица подсчета мин
	// mine1.textContent = String(mineAmount)[1];
	let mineNumber = 0;
	while (mineNumber < mineAmount) {
			const random = Math.floor(Math.random() * buttons.length);
			if (!buttons[random].classList.contains("mined")) {
					buttons[random].classList.add("mined");
					mineNumber += 1;
			}
	}
}



function putNumber() {
	for (let i = 0; i < arrButtons.length; ++i) {
			for (let j = 0; j < arrButtons[i].length; ++j) {
					if (!arrButtons[i][j].classList.contains("mined")) {
							const arrNeighbors = findNeighbors(arrButtons, i, j);
							let number = 0;
							for (let k = 0; k < arrNeighbors.length; k++) {
									if (arrNeighbors[k].button.classList.contains("mined")) number += 1; //я тут запуталас
							}
							if (number !== 0) {
									arrButtons[i][j].classList.add("number");
									arrButtons[i][j].classList.add("nr-" + number.toString());
							}
					}
			}
	}
}






function findEmpty() {
	for (const button of buttons) {
			if (!button.classList.contains("number") && !button.classList.contains("mined")) button.classList.add("empty");
	}
}

function handleLeftClick() {
	for (let i = 0; i < arrButtons.length; ++i) {
			const buttonsRow = arrButtons[i];
			for (let j = 0; j < buttonsRow.length; ++j) {
					buttonsRow[j].addEventListener("click", () => {
							if (!timerOn) {
									timer = setInterval(processTimer, 1000);
									timerOn = true;
							}
							if (!buttonsRow[j].classList.contains("flag")) buttonsRow[j].classList.add("opened");
							if (buttonsRow[j].classList.contains("flag")) return;
							if (buttonsRow[j].classList.contains("mined")) lostGame();
							if (buttonsRow[j].classList.contains("empty") && buttonsRow[j].classList.contains("opened")) waveAlgorithm(arrButtons, i, j);
							if (buttonsRow[j].classList.contains("number") && !buttonsRow[j].classList.contains("flag"))
									openButtonsIfCorrectFlags(arrButtons, i, j);
					});
			}
	}
}

function handleRightClick() {
	for (const button of buttons) {
			button.addEventListener("contextmenu", () => {
					if (!button.classList.contains("flag") && !button.classList.contains("opened")) {
							putFlag(button);
							if (button.classList.contains("mined")) decreaseMineCounter();
					} else if (button.classList.contains("flag")) {
							removeFlag(button);
							if (button.classList.contains("mined")) increaseMineCounter();
					}
			});
	}
}

function putFlag(button) {
	button.classList.add("flag");
}

function removeFlag(button) {
	button.classList.remove("flag");
}

function openButtonsIfCorrectFlags(button, x, y) {
	let bombs = 0;
	const arrBombs = [];
	let arrFlags = 0;
	for (const neighbor of findNeighbors(button, x, y)) {
			if (neighbor.button.classList.contains('mined')) {
					bombs += 1;
					arrBombs.push(neighbor.button);
			}
			if (neighbor.button.classList.contains('flag')) {
					arrFlags += 1;
			}
	}
	if (bombs !== arrFlags) {
			return false;
	} else {
			for (const bomb of arrBombs) {
					if (!bomb.classList.contains("flag")) return lostGame();
			}
	}
	return openNeighborButtons(button, x, y);
}

function waveAlgorithm(button, i, j) {
	const queue = [];
	queue.push({ x: i, y: j });
	do {
			const x = queue[0].x;
			const y = queue[0].y;

			const neighbors = [];

			if (y > 0) neighbors.push({ x: x, y: y - 1 });
			if (y < n - 1) neighbors.push({ x: x, y: y + 1 });
			if (x > 0) neighbors.push({ x: x - 1, y: y });
			if (x > 0 && y > 0) neighbors.push({ x: x - 1, y: y - 1 });
			if (x > 0 && y < n - 1) neighbors.push({ x: x - 1, y: y + 1 });
			if (x < n - 1) neighbors.push({ x: x + 1, y: y });
			if (x < n - 1 && y > 0) neighbors.push({ x: x + 1, y: y - 1 });
			if (x < n - 1 && y < n - 1) neighbors.push({ x: x + 1, y: y + 1 });

			for (const neighbor of neighbors) {
					if (button[neighbor.x][neighbor.y].classList.contains("empty") && !button[neighbor.x][neighbor.y].classList.contains("flag")) {
							if (!button[neighbor.x][neighbor.y].classList.contains("opened")) {
									button[neighbor.x][neighbor.y].classList.add("opened");
									queue.push(neighbor);
							}
					} else if (button[neighbor.x][neighbor.y].classList.contains("number") && !button[neighbor.x][neighbor.y].classList.contains("flag")) {
							button[neighbor.x][neighbor.y].classList.add("opened");
					}
			}
			queue.shift();
	} while (queue.length !== 0);
}

function findNeighbors(button, x, y) {
	const arr = [];
	if (y > 0) arr.push({ button: button[x][y - 1], x: x, y: y - 1 });
	if (y < n - 1) arr.push({ button: button[x][y + 1], x: x, y: y + 1 });
	if (x > 0) arr.push({ button: button[x - 1][y], x: x - 1, y: y });
	if (x > 0 && y > 0) arr.push({ button: button[x - 1][y - 1], x: x - 1, y: y - 1 });
	if (x > 0 && y < n - 1) arr.push({ button: button[x - 1][y + 1], x: x - 1, y: y + 1 });
	if (x < n - 1) arr.push({ button: button[x + 1][y], x: x + 1, y: y });
	if (x < n - 1 && y > 0) arr.push({ button: button[x + 1][y - 1], x: x + 1, y: y - 1 });
	if (x < n - 1 && y < n - 1) arr.push({ button: button[x + 1][y + 1], x: x + 1, y: y + 1 });
	return arr;
}

function openNeighborButtons(button, x, y) {
	const arrNeighbors = findNeighbors(button, x, y);
	for (const n of arrNeighbors) {
			if (!n.button.classList.contains("mined")) {
					n.button.classList.add("opened");
					n.button.classList.add("visible");
			}
	}
}

function lostGame() {
	iconSmile.src = "./face_lose.svg";
	gameContainer.classList.add("shake");
	const mines = field.querySelectorAll(".mined");
	for (const mine of mines) {
			mine.classList.add("opened");
	}
	for (let k = 0; k < buttons.length; ++k) {
			buttons[k].style.pointerEvents = 'none';
	}
	clearInterval(timer);
	timerOn = false;
}

let time = 0;

function processTimer() {
	time++;
	if (time < 1000) {
			if (time < 10) {
					sec1.innerHTML = time;
			} else if (time > 9 && time < 100) {
					sec10.textContent = String(time)[0];
					sec1.textContent = String(time)[1];
			} else {
					sec100.textContent = String(time)[0];
					sec10.textContent = String(time)[1];
					sec10.textContent = String(time)[2];
			}
	}
}
// let mine = mineAmount;

function decreaseMineCounter() {
	mineAmount--;
	if (mineAmount < 10) {
			mine10.textContent = "0";
			mine1.textContent = String(mineAmount)[0];
	} else {
			mine10.textContent = String(mineAmount)[0];
			mine1.textContent = String(mineAmount)[1];
	}
}

function increaseMineCounter() {
	mineAmount++;
	if (mineAmount < 10) {
			mine10.textContent = "0";
			mine1.textContent = String(mineAmount)[0];
	} else {
			mine10.textContent = String(mineAmount)[0];
			mine1.textContent = String(mineAmount)[1];
	}
}