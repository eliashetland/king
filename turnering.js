let p = [];
let matches = {};
const container = document.querySelector(".container");
const playerNames = document.querySelector(".playerNames");
const numPlayers = document.querySelector(".numPlayers");
const score = document.querySelector(".score");
let menu;
let numberOfMatches;
let buttons = document.querySelector(".buttons");
let prevBtn;

const createNav = (numberOfPlayers) => {
	switch (numberOfPlayers) {
		case "4":
			numberOfMatches = 3;
			break;
		case "5":
			numberOfMatches = 5;
			break;
		default:
			numberOfMatches = 5;
			break;
	}
	buttons.innerHTML = "";
	for (let i = 0; i < numberOfMatches; i++) {
		buttons.innerHTML += `<button class="menu">m${i + 1}</button>`;
	}
	buttons.innerHTML += '<button class="menu">score</button>';
	menu = document.querySelectorAll(".menu");
	prevBtn = menu[0];
	for (let i = 0; i < menu.length; i++) {
		menu[i].addEventListener("click", (e) => {
			if (prevBtn) {
				prevBtn.style.backgroundColor = "#040D12";
			}
			e.target.style.backgroundColor = "#5C8374";

			save(prevBtn.innerHTML[1] - 1);

			prevBtn = e.target;
			if (i < menu.length - 1) {
				matches[i].startMatch();
				score.style.display = "none";
			} else {
				showScoreBoard();
			}
		});
	}
};

const choosePlayers = () => {
	playerNames.innerHTML = "";
	for (let i = 0; i < numPlayers.value; i++) {
		playerNames.innerHTML += "<input type='text'><br>";
	}
	createNav(numPlayers.value);
};
choosePlayers();
numPlayers.addEventListener("change", choosePlayers);

const giSpillerNavn = () => {
	document.querySelectorAll("input").forEach((input) => {
		p.push(input.value);
	});

	switch (numPlayers.value) {
		case "4":
			matches = [
				new Match(p[0], p[1], p[2], p[3], 1),
				new Match(p[0], p[2], p[1], p[3], 2),
				new Match(p[0], p[3], p[1], p[2], 3),
			];
			break;
		case "5":
			matches = [
				new Match(p[1], p[4], p[2], p[3], 1),
				new Match(p[2], p[0], p[3], p[4], 2),
				new Match(p[3], p[1], p[4], p[0], 3),
				new Match(p[4], p[2], p[0], p[1], 4),
				new Match(p[0], p[3], p[1], p[2], 5),
			];
			break;
		default:
			break;
	}

	matches[0].startMatch();
	buttons.style.display = "block";

	menu[0].style.backgroundColor = "#5C8374";
};

document.querySelector("#start").addEventListener("click", giSpillerNavn);

const save = (e) => {
	if (e || e == 0) {
		let inps = document.querySelectorAll("input[type='number']");

		matches[e].t1Points = inps[0].value;
		matches[e].t2Points = inps[1].value;
	}
};

const showScoreBoard = () => {
	score.innerHTML = "";
	let winnerList = [];
	matches.forEach((e) => {
		score.innerHTML += `<div class='scoreboard'>${e.team1}: <strong>${e.t1Points} - ${e.t2Points}</strong> :${e.team2}</div> `;

		winnerList.push(...e.winners());
	});

	let counts = Object.fromEntries(p.map((k) => [k, 0]));

	winnerList.forEach((x) => {
		counts[x] = (counts[x] || 0) + 1;
	});

	score.innerHTML += `<div class='scoreboard'><h2>Wins<h2></div> `;

	for (let i in counts) {
		score.innerHTML += `<div class='scoreboard'>${i}: <strong>${counts[i]}</strong></div> `;
	}

	score.style.display = "block";
};

class Match {
	constructor(p1, p2, p3, p4, r) {
		this.r = r;
		this.p1 = p1;
		this.p2 = p2;
		this.p3 = p3;
		this.p4 = p4;

		this.team1 = `${p1} & ${p2}`;
		this.team2 = `${p3} & ${p4}`;
		this.t1Points = 0;
		this.t2Points = 0;
	}

	startMatch() {
		container.innerHTML = `<h1>Match ${this.r}</h1>`;
		container.innerHTML += `<div class='team1'>${this.team1}</div> `;
		container.innerHTML += `<div class='vs'>up against</div> `;
		container.innerHTML += `<div class='team2'>${this.team2}</div> `;
		container.innerHTML += `<div class='numInp'><input type="number" min="0" value="${this.t1Points}" id="team1Num"><span> - </span><input type="number" min="0" value="${this.t2Points}" id="team2Num"></div>`;
	}

	winners() {
		if (parseInt(this.t1Points) > parseInt(this.t2Points)) {
			return [this.p1, this.p2];
		} else if (parseInt(this.t1Points) < parseInt(this.t2Points)) {
			return [this.p3, this.p4];
		} else {
			return [];
		}
	}
}
