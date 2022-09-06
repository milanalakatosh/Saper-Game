// import { putMines, findNeighbors, putNumber, findEmpty, lostGame, processTimer, openButtonsIfCorrectFlags, waveAlgorithm } from "../functions/func";
const gameContainer = document.querySelector('.game-container');
const chooseLevelForm = document.querySelector('.choose-level');
const arrButtons = [];
let timer;
let mineAmount;

let timerOn = false;

chooseLevelForm.addEventListener('click', async (event) => {
	event.preventDefault();

	if (event.target.id) {

		const response = await fetch('/getWidth', {
			method: 'POST',
			headers: {
				'Content-type': 'application/json',
			},
			body: JSON.stringify({ level: event.target.id }),

		});
		const data = await response.json();

		// playGame(data.width, data.height);

		gameContainer.innerHTML = `
		<div class="head">
			<div class="mine-counter">
				<span class="mine-100">0</span>
				<span class="mine-10">0</span>
				<span class="mine-1">0</span>
			</div>
			<img class="icon" src="images/face_unpressed.svg" />
			<div class="time-counter">
				<span class="timer-100">0</span>
				<span class="timer-10">0</span>
				<span class="timer-1">0</span>
			</div>
		</div>
		<div class="field"><div>`;
		const field = document.querySelector('.field');

		for (let i = 0; i < data.height; i++) {
			const div = document.createElement('div');
			field.append(div);
			const buttonsRow = [];
			for (let j = 0; j < data.width; j++) {
				const button = document.createElement('button');
				button.classList.add('button');
				div.append(button);
				buttonsRow.push(button);
			}
			arrButtons.push(buttonsRow);
		}

		const buttons = document.querySelectorAll('.button');
		mineAmount = putMines(buttons, data.width);
		console.log("let mineAmount;", mineAmount)
		putNumber(arrButtons, data.width, data.height);
		findEmpty(buttons);

		for (let i = 0; i < arrButtons.length; ++i) {
			console.log("buttons!!!!", arrButtons);
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
					if (buttonsRow[j].classList.contains("empty") && buttonsRow[j].classList.contains("opened")) waveAlgorithm(arrButtons, i, j, data.width, data.height);
					if (buttonsRow[j].classList.contains("number") && !buttonsRow[j].classList.contains("flag"))
						openButtonsIfCorrectFlags(arrButtons, i, j);
				});
			}
		}

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

});

// function playGame(width, height) {
// 	gameContainer.innerHTML = `
// 		// <div class="head">
// 		// 	<div class="mine-counter">
// 		// 		<span class="mine-100">0</span>
// 		// 		<span class="mine-10">0</span>
// 		// 		<span class="mine-1">0</span>
// 		// 	</div>
// 		// 	<img class="icon" src="images/face_unpressed.svg" />
// 		// 	<div class="time-counter">
// 		// 		<span class="timer-100">0</span>
// 		// 		<span class="timer-10">0</span>
// 		// 		<span class="timer-1">0</span>
// 		// 	</div>
// 		// </div>
// 		// <div class="field"><div>`;
// 	const field = document.querySelector('.field');

// 	for (let i = 0; i < height; i++) {
// 		const div = document.createElement('div');
// 		field.append(div);
// 		const buttonsRow = [];
// 		for (let j = 0; j < width; j++) {
// 			const button = document.createElement('button');
// 			button.classList.add('button');
// 			div.append(button);
// 			buttonsRow.push(button);
// 		}
// 		arrButtons.push(buttonsRow);
// 	}

// 	const buttons = document.querySelectorAll('.button');
// 	mineAmount = putMines(buttons, width);
// 	console.log("let mineAmount;", mineAmount)
// 	putNumber(arrButtons, width, height);
// 	findEmpty(buttons);
// }

function putFlag(button) {
	button.classList.add("flag");
}

function removeFlag(button) {
	button.classList.remove("flag");
}

const buttons = document.querySelectorAll('.button');


function putMines(buttons, width) {
	const mine1 = document.querySelector(".mine-1");
	const mine10 = document.querySelector(".mine-10");
	let mineAmount;
	if (width === 9) mineAmount = 10;
	else if (width === 16) mineAmount = 40;
	else mineAmount = 99;
	mine10.textContent = String(mineAmount)[0];
	mine1.textContent = String(mineAmount)[1];
	let mineNumber = 0;
	while (mineNumber < mineAmount) {
		const random = Math.floor(Math.random() * buttons.length);
		if (!buttons[random].classList.contains('mined')) {
			buttons[random].classList.add('mined');
			mineNumber += 1;
		}
	}
	return mineAmount;
}

function findNeighbors(button, x, y, width, height) {  //отдебажить!!

	const arr = [];
	if (y > 0) arr.push({ button: button[x][y - 1], x: x, y: y - 1 });
	if (y < height - 2) arr.push({ button: button[x][y + 1], x: x, y: y + 1 });
	if (x > 0) arr.push({ button: button[x - 1][y], x: x - 1, y: y });
	if (x > 0 && y > 0) arr.push({ button: button[x - 1][y - 1], x: x - 1, y: y - 1 });
	if (x > 0 && y < height - 2) arr.push({ button: button[x - 1][y + 1], x: x - 1, y: y + 1 });
	if (x < width - 2) arr.push({ button: button[x + 1][y], x: x + 1, y: y });
	if (x < width - 2 && y > 0) arr.push({ button: button[x + 1][y - 1], x: x + 1, y: y - 1 });
	if (x < width - 2 && y < height - 2) {
		arr.push({ button: button[x + 1][y + 1], x: x + 1, y: y + 1 });
	}
	return arr;
}

function putNumber(arrButtons, width, height) {
	for (let i = 0; i < arrButtons.length; ++i) {
		for (let j = 0; j < arrButtons[i].length; ++j) {
			if (!arrButtons[i][j].classList.contains('mined')) {
				const arrNeighbors = findNeighbors(arrButtons, i, j, width, height);
				let number = 0;
				for (let k = 0; k < arrNeighbors.length; k++) {
					if (arrNeighbors[k].button.classList.contains('mined')) number += 1; //я тут запуталас
				}
				if (number !== 0) {
					arrButtons[i][j].classList.add('number');
					arrButtons[i][j].classList.add('nr-' + number.toString());
				}
			}
		}
	}
}

function findEmpty(buttons) {
	for (const button of buttons) {
		if (!button.classList.contains("number") && !button.classList.contains("mined")) button.classList.add("empty");
	}
}

function lostGame() {
	const iconSmile = document.querySelector(".icon");
	iconSmile.src = "images/face_lose.svg";
	gameContainer.classList.add("shake");
	const mines = document.querySelectorAll(".mined");
	for (const mine of mines) {
		mine.classList.add("opened");
	}
	const buttons = document.querySelectorAll('.button');
	for (let k = 0; k < buttons.length; ++k) {
		buttons[k].style.pointerEvents = 'none';
	}
	clearInterval(timer);
	timerOn = false;
}
let time = 0;
function processTimer() {
	const sec1 = document.querySelector(".timer-1");
	const sec10 = document.querySelector(".timer-10");
	const sec100 = document.querySelector(".timer-100");
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

function openNeighborButtons(button, x, y) {
	const arrNeighbors = findNeighbors(button, x, y);
	for (const n of arrNeighbors) {
		if (!n.button.classList.contains("mined")) {
			n.button.classList.add("opened");
			n.button.classList.add("visible");
		}
	}
}

function waveAlgorithm(button, i, j, width, height) {
	const queue = [];
	queue.push({ x: i, y: j });
	do {
		const x = queue[0].x;
		const y = queue[0].y;
		// console.log("queue")//будет очередь , где первого забираю.. рекурсия

		const neighbors = [];

		if (y > 0) neighbors.push({ x: x, y: y - 1 });
		if (y < height - 1) neighbors.push({ x: x, y: y + 1 });
		if (x > 0) neighbors.push({ x: x - 1, y: y });
		if (x > 0 && y > 0) neighbors.push({ x: x - 1, y: y - 1 });
		if (x > 0 && y < height - 1) neighbors.push({ x: x - 1, y: y + 1 });
		if (x < width - 1) neighbors.push({ x: x + 1, y: y });
		if (x < width - 1 && y > 0) neighbors.push({ x: x + 1, y: y - 1 });
		if (x < width - 1 && y < height - 1) neighbors.push({ x: x + 1, y: y + 1 });

		for (const neighbor of neighbors) {
			if (button[neighbor.x][neighbor.y].classList.contains("empty") && !button[neighbor.x][neighbor.y].classList.contains("flag")) {
				if (!button[neighbor.x][neighbor.y].classList.contains("opened")) {
					button[neighbor.x][neighbor.y].classList.add("opened");
					queue.push(neighbor);
				}
			} else if (button[neighbor.x][neighbor.y].classList.contains("number") && !button[neighbor.x][neighbor.y].classList.contains("flag")) {
				button[neighbor.x][neighbor.y].classList.add("opened");//и не пушим..
			}
		}
		queue.shift();
	} while (queue.length !== 0);
}

function decreaseMineCounter() {
	const mine1 = document.querySelector(".mine-1");
	const mine10 = document.querySelector(".mine-10");
	console.log('jffjenfjwejdfnjwndcjnjdnjw', mineAmount);
	mineAmount = mineAmount - 1;
	if (mineAmount < 10) {
		mine10.textContent = "0";
		mine1.textContent = String(mineAmount)[0];
	} else {
		mine10.textContent = String(mineAmount)[0];
		mine1.textContent = String(mineAmount)[1];
	}
}

function increaseMineCounter() {
	const mine1 = document.querySelector(".mine-1");
	const mine10 = document.querySelector(".mine-10");
	mineAmount = mineAmount;
	if (mineAmount < 10) {
		mine10.textContent = "0";
		mine1.textContent = String(mineAmount)[0];
	} else {
		mine10.textContent = String(mineAmount)[0];
		mine1.textContent = String(mineAmount)[1];
	}
}



