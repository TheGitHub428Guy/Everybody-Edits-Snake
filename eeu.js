// Remade Snakebot Code - help me
//
// ~by 428
// ~EEU by not 428

// colors:
//   black
// ! dark gray
// " light grey
// # white
// $ dark green
// % light green
// & red
// ' bright red

// this code is not for the faint of heart, it is prone to giving you a migraine

const EEUniverse = require("eeuniverse");
const colors = require('colors');
const readline = require('readline');

M = Math; // this is for my convenience
var votes = [];

rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

players = [];

    /////////////////////////////
   /***************************/
  /*IT'S TIME FOR COPIED CODE*/
 /***************************/
/////////////////////////////

palette = {
	 [` CNSL`]: `  `,
	 [`!CNSL`]: `\u2588\u2588`.gray,
	 [`"CNSL`]: `\u2588\u2588`,
	 [`#CNSL`]: `\u2588\u2588`.brightWhite,
	 [`$CNSL`]: `\u2588\u2588`.green,
	 [`%CNSL`]: `\u2588\u2588`.brightGreen,
	 [`&CNSL`]: `\u2588\u2588`.red,
	 [`'CNSL`]: `\u2588\u2588`.brightRed,
	[`\nCNSL`]: `\n`,
	
	 [` HTML`]: "<div class='snaketile' style='background-color: #000000; width: 4px !important; height: 4px; display: inline-block !important'></div>",
	 [`!HTML`]: "<div class='snaketile' style='background-color: #808080; width: 4px !important; height: 4px; display: inline-block !important'></div>",
	 [`"HTML`]: "<div class='snaketile' style='background-color: #C0C0C0; width: 4px !important; height: 4px; display: inline-block !important'></div>",
	 [`#HTML`]: "<div class='snaketile' style='background-color: #FFFFFF; width: 4px !important; height: 4px; display: inline-block !important'></div>",
	 [`$HTML`]: "<div class='snaketile' style='background-color: #00A000; width: 4px !important; height: 4px; display: inline-block !important'></div>",
	 [`%HTML`]: "<div class='snaketile' style='background-color: #00FF00; width: 4px !important; height: 4px; display: inline-block !important'></div>",
	 [`&HTML`]: "<div class='snaketile' style='background-color: #C00000; width: 4px !important; height: 4px; display: inline-block !important'></div>",
	 [`'HTML`]: "<div class='snaketile' style='background-color: #FF0000; width: 4px !important; height: 4px; display: inline-block !important'></div>",
	[`\nHTML`]: "<br>",
	
	[` EEU`]: 0,  //no block
	[`!EEU`]: 19, //graey stone
	[`"EEU`]: 38, //white metal
	[`#EEU`]: 45, //white glass
	[`$EEU`]: 24, //green stone
	[`%EEU`]: 7,  //green basic
	[`&EEU`]: 4,  //red basic
	[`'EEU`]: 47, //red glass
};

SprMap = (s, f) => s.map((r, y, a) => r.map((p, x) => f(p, x, y, a)));
// SprMap - i should've made this earlier
// works like map, but instead of f's arguments being (item, index, array) it's (pixel, x, y, sprite)
mod = (a,b)=>{return (a < 0) ? (b + (a%b)) % b : a%b};
// i hate the javascript modulo so uhhhhhhhhhhhhhhhhhhhh

function Gooble(a) { // turns a 2d array of numbers to an array of strings
					 // to turn a 1d array of numbers into a string, do Gooble([a])[0]
					 // to turn a number into a character, do Gooble([[a]])[0]
					 
					 // to turn a 2d array of numbers into a single string, do Gooble(a).join("\n")
					 
					 //i know this is just 1 line but this is for my convenience
	return a.map((b)=>{return String.fromCodePoint(...b.map((c)=>{return c+32;}))});
}
function deGooble(a) { // reverses that thing up there
					  // uhhh sample text
	return a.map((b)=>{return b.split("").map((c)=>{return c.codePointAt(0) - 32});});
}
function SprSize(s, w, h, f) { // changes the size of the sprite without stretching the actual image
							// image stays at top left
							// s: the sprite
							// w: new width
							// h: new height
							// f: value to fill the empty spaces with
							
							// basically, imagine dragging to resize an image in ms paint
	return s.map((r)=>{return r.concat(Array(w).fill(f)).slice(0, w)}).concat(Array(h).fill(Array(w).fill(f))).slice(0, h);
}
function Warp(s, f=(x,y)=>{return [x,y]}) {
					// s is the sprite
					// f is the function that returns a list of 2 numbers [x, y] given two arguments
					// examples:
						// does nothing
						// Warp(sprite, (x, y)=>{return [x, y]})
	return SprMap(s, (p, x, y, a)=>{try {
			return a[Math.floor(f(x,y)[1])][Math.floor(f(x,y)[0])];
		} catch(err) {
			return undefined;
		}});
}
SprTile = (s, w, h)=>Warp(SprSize(s, w, h, undefined), (x, y)=>[x%s[0].length, y%s.length]);
function RotateBasic(s, r, cx, cy) {
						// s: the sprite
						// r: how many quarter turns clockwise to rotate the sprite
						// cx, cy: position for center of rotation	  (optional)
						// will not resize, so rectangular sprites will be cropped
						// could fix this but i dont need to
	if ((typeof cx) != "number") {
		cx = (s[0].length / 2) - 0.5;
	}
	if ((typeof cy) != "number") {
		cy = (s.length / 2) - 0.5;
	}
	switch (mod(r, 4)) {
		case 0: {
			return s;
		} break;
		case 1: {
			return Warp(s, (x, y)=>{return [(y - cy) + cx, -(x - cx) + cy];});
		} break;
		case 2: {
			return Warp(s, (x, y)=>{return [-x + 2*cx, -y + 2*cy];});
		} break;
		case 3: {
			return Warp(s, (x, y)=>{return [-(y - cy) + cx, (x - cx) + cy];});
		} break;
		default: {
			throw new RangeError("Decimal amounts not supported yet :(");
		}
	}
}
function SprOverlap(s1, s2, sx, sy) {
					//s1: the old sprite
					//s2: new sprite to be put in front of the old one
					//sx, sy: position of where the top-left corner of s2 should be placed
					//undefined is used as a transparent color
	return SprMap(s1, (p, x, y, s)=>{return (((typeof (s2[y - sy]) == "undefined") || (typeof (s2[y - sy][x - sx]) == "undefined")) ? p: s2[y - sy][x - sx]);});
}


u = undefined; // to make the fruit sprite look better in the code (fig. 1)

sBody = {[false]: [[4, 4, 4],
				   [4, 4, 4],
				   [4, 4, 4]],
		 
		 [true]:  [[5, 5, 5],
				   [5, 5, 5],
				   [5, 5, 5]]}; // objects with boolean keys? heck yeah

sUp = [[u, u, u],
	   [0, u, 0],
	   [u, u, u]];

sUL = [[u, 0, u],
	   [0, u, u],
	   [u, u, u]];

spr = {
	oob: [[1]],
	board: [[3, 3, 3, 2],
			[3, 3, 3, 2],
			[3, 3, 3, 2],
			[2, 2, 2, 2]],
	fruit: [[u, 6, u],
			[6, 6, 6], // fig. 1
			[u, 6, u]],
			
	numbers: [[[3,3,3],
			   [3,u,3], // 0
			   [3,3,3]],
			  
			  [[3,3,u],
			   [u,3,u], // 1
			   [3,3,3]],
			  
			  [[3,3,u],
			   [u,3,u], // 2
			   [u,3,3]],
			  
			  [[3,3,3],
			   [u,3,3], // 3
			   [3,3,3]],
			  
			  [[3,u,3],
			   [3,3,3], // 4
			   [u,u,3]],
			  
			  [[u,3,3],
			   [u,3,u], // 5
			   [3,3,u]],
			  
			  [[3,u,u],
			   [3,3,3], // 6
			   [3,3,3]],
			  
			  [[3,3,3],
			   [u,u,3], // 7
			   [u,u,3]],
			  
			  [[u,3,3],
			   [3,3,3], // 8
			   [3,3,3]],
			  
			  [[3,3,3],
			   [3,3,3], // 9
			   [u,u,3]],],
	gameOver: deGooble(["########################################",
						"########################################",
						"########################################",
						"########################################",
						"########################################",
						"########################################",
						"########################################",
						"########################################",
						"########################################",
						"########################################",
						"########################################",
						"########################################",
						"######   ###### #### ##### #       #####",
						"##### ### #### # ###  ###  # ###########",
						"#### ######## ### ## # # # # ###########",
						"#### ##    # ##### # ## ## #    ########",
						"#### ##### #       # ##### # ###########",
						"##### ### ## ##### # ##### # ###########",
						"######   ### ##### # ##### #       #####",
						"########################################",
						"######   ### ##### #       #      ######",
						"##### ### ## ##### # ####### ##### #####",
						"#### ##### ## ### ## ####### ##### #####",
						"#### ##### ## ### ##    ####      ######",
						"#### ##### ### # ### ####### ##### #####",
						"##### ### #### # ### ####### ##### #####",
						"######   ###### ####       # ##### #####",
						"########################################",
						"########################################",
						"########################################",
						"########################################",
						"########################################",
						"########   ## ##   #####   #   #########",
						"######### ##   #   ###### ## # #########",
						"######### ## # # ######## ##   #########",
						"########################################",
						"######   #   ##  #   ## ##   #   #######",
						"###### ###  ### ### ##   # #### ########",
						"###### ###   #  ### ## # # #### ########",
						"########################################"]),
	
	scoretxt: deGooble(["    ### ### ### ###  # ",
						"     #   #  ### ##     ",
						"     #  ### # # ###  # ",
						"                       ",
						" ## ### ### ### ###  # ",
						" #  #   # # #   ##     ",
						"##  ### ### #   ###  # "])
};

(UpdateSnake = function() {
	spr.snake = {
		[-1]: {
			[-1]: sUL,
			[0]: sUp,
			[1]: RotateBasic(sUL, 1)
			},
		[0]: {
			[-1]: RotateBasic(sUp, -1),
			[0]: sBody,
			[1]: RotateBasic(sUp, 1)
			},
		[1]: {
			[-1]: RotateBasic(sUL, -1),
			[0]: RotateBasic(sUp, 2),
			[1]: RotateBasic(sUL, 2)
			},
	};
})(); // make the function to update snake and then do that thing

class SnakeGame {
	constructor(snake, width, height) {
		this.width = width;
		this.height = height;
		this.snake = snake;
		this.initLength = snake.length;
		this.fruit = [0, 0];
		this.score = 0;
		this.time = 0;
		this.dead = (snake == "dead");
		this.energy = 2;
		this.dir = (this.initLength > 1) ? [this.snake[0][0] - this.snake[1][0], this.snake[0][1] - this.snake[1][1]] : [1, 0];
		var isTouching = false;
		do {
			this.fruit = [Math.floor(Math.random()*this.width), Math.floor(Math.random()*this.height)];
			for (var i = 0;i < this.snake.length;i++) {
				if ((snake[i][0] == this.fruit[0]) && (snake[i][1] == this.fruit[1])) {
					isTouching = true;
				}
			}
		} while (isTouching);
		this.restart = function (s, w, h) {
			this.width = w;
			this.height = h;
			this.snake = s;
			this.initLength = this.snake.length;
			this.score = 0;
			this.time = 0;
			this.dead = (this.snake == "dead");
			this.energy = 2;
			this.dir = (this.initLength > 1) ? [this.snake[0][0] - this.snake[1][0], this.snake[0][1] - this.snake[1][1]] : [1, 0];
			isTouching = false;
			do {
				this.fruit = [Math.floor(Math.random()*this.width), Math.floor(Math.random()*this.height)];
				for (i = 0;i < this.snake.length;i++) {
					if ((snake[i][0] == this.fruit[0]) && (snake[i][1] == this.fruit[1])) {
						isTouching = true;
					}
				}
			} while (isTouching);
		};
		this.eat = function () {
			this.score += 1;
			this.energy = Math.min(this.energy + 2, this.initLength + this.score);
		};
		this.move = function (dir) {
			if (!this.dead) {
				let snakeNew = this.snake.slice(0);
				isTouching = false;
				snakeNew.unshift([snakeNew[0][0] + dir[0], snakeNew[0][1] + dir[1]]);
				let deleteThis;
				let energyReduce = [0.1, 0.95]; //subtract 1st number and multiply by 2nd number
				if (dir[0] && dir[1]) { // if both axes are non-zero (diagonal)
					energyReduce = [0.15, 0.925];
				}
				if ((snakeNew[0][0] == this.fruit[0]) && (snakeNew[0][1] == this.fruit[1])) {
					this.eat();
				}
				deleteThis = snakeNew.slice(this.initLength + this.score);
				snakeNew = snakeNew.slice(0, this.initLength + this.score);
				if ((snakeNew[0][0] < 0) || (snakeNew[0][0] >= this.width)) {
					this.end();
				} else if (snakeNew[0][1] < 0 || (snakeNew[0][1] >= this.height)) {
					this.end();
				} else if (snakeNew.slice(1).some(function (a) {return (a[0] == snakeNew[0][0]) && (a[1] == snakeNew[0][1]);})) {
					if ((snakeNew[2][0] == snakeNew[0][0]) && (snakeNew[2][1] == snakeNew[0][1])) { // backflip check
						snakeNew = this.snake.slice(0);
						snakeNew.reverse();
						energyReduce = [0.5, 0.9];
					} else {
						this.end();
					}
				}
				this.energy -= energyReduce[0];
				this.energy *= energyReduce[1];
				if (this.energy <= 0) {
					this.end();
				}
				if ((this.initLength + this.score) < (this.width * this.height)) {
					for (var i = 0;i < snakeNew.length;i++) {
						if ((snakeNew[i].toString() == this.fruit.toString())) {
							isTouching = true;
						}
					}
					while (isTouching) {
						this.fruit = [Math.floor(Math.random()*this.width), Math.floor(Math.random()*this.height)];
						isTouching = false;
						for (i = 0;i < snakeNew.length;i++) {
							if ((snakeNew[i].toString() == this.fruit.toString())) {
								isTouching = true;
							}
						}
					}
				} else {
					this.fruit = ["gone", "gone"];
				}
				this.snake = snakeNew.slice(0);
				this.dir = [this.snake[0][0] - this.snake[1][0], this.snake[0][1] - this.snake[1][1]];
			} else {
				this.end();
				console.log("how");
				//probably redudant, unless something extraordinarily stupid happens
			}
		};
		this.addTime = (t)=>{this.time += t;};
		this.getScreen = function () {
			let snkscr = spr.gameOver; //snake screen, game over screen used if game not active
			let scrscr = SprSize(spr.scoretxt, snkscr[0].length, spr.scoretxt.length, 0); //score screen
			
			//snake screen code
			if (!this.dead) {
				snkscr = SprOverlap(snkscr, SprTile(spr.oob, snkscr[0].length, snkscr.length), 0, 0);
				snkscr = SprOverlap(snkscr, SprTile(spr.board, this.width * 4, this.height * 4), 0, 0);
				if (this.fruit[0] != "gone") {
					snkscr = SprOverlap(snkscr, spr.fruit, this.fruit[0] * 4, this.fruit[1] * 4);
				}
				for (i = this.snake.length - 1;i > 0;i--) {
					snkscr = SprOverlap(snkscr, spr.snake[0][0][this.energy > i], this.snake[i][0] * 4, this.snake[i][1] * 4);
					snkscr = SprOverlap(snkscr, spr.snake[0][0][this.energy > (i - 0.25)], (this.snake[i][0] * 3) + this.snake[i-1][0], (this.snake[i][1] * 3) + this.snake[i-1][1]);
					snkscr = SprOverlap(snkscr, spr.snake[0][0][this.energy > (i - 0.5)], (this.snake[i-1][0] + this.snake[i][0]) * 2, (this.snake[i-1][1] + this.snake[i][1]) * 2);
					snkscr = SprOverlap(snkscr, spr.snake[0][0][this.energy > (i - 0.75)], (this.snake[i-1][0] * 3) + this.snake[i][0], (this.snake[i-1][1] * 3) + this.snake[i][1]);
				}
				snkscr = SprOverlap(snkscr, spr.snake[0][0][this.energy > 0], this.snake[0][0] * 4, this.snake[0][1] * 4);
				snkscr = SprOverlap(snkscr, spr.snake[this.dir[1]][this.dir[0]], this.snake[0][0] * 4, this.snake[0][1] * 4);
			}
			
			//score screen code
			i = [this.time, 0];
			do {
				scrscr = SprOverlap(scrscr, spr.numbers[mod(i[0], 10)], scrscr[0].length - ((i[1] + 1) * 4), 0);
				i[1]++;
				i[0] = Math.floor(i[0] / 10);
			} while (i[0] >= 1);
			i = [this.score, 0];
			do {
				scrscr = SprOverlap(scrscr, spr.numbers[mod(i[0], 10)], scrscr[0].length - ((i[1] + 1) * 4), 4);
				i[1]++;
				i[0] = Math.floor(i[0] / 10);
			} while (i[0] >= 1);
			
			let sprscr = SprSize(snkscr, snkscr[0].length, snkscr.length + 4, 1);
				sprscr = SprSize(sprscr, sprscr[0].length, sprscr.length + scrscr.length + 1, 0);
				sprscr = SprOverlap(sprscr, scrscr, 0, 45);
			return sprscr;
		};
		this.end = function () {
			this.dead = true;
		};
	}
} // this should work but also at the same time probably shouldn't

    //////////////////////////////////
   /********************************/
  /*IT'S TIME FOR MORE COPIED CODE*/
 /********************************/
//////////////////////////////////

async function connect(token) {
		console.log(`thank you`);
		con = await EEUniverse.connect(token);
		con.joinRoom("mLCC6yiGlzFv");
		con.send(EEUniverse.MessageType.Init, 0);
		con.onMessage(msg => {
			if (msg.scope === EEUniverse.ConnectionScope.World) {
				switch(msg.type) {
					case EEUniverse.MessageType.Init: {
						con.send(EEUniverse.MessageType.Chat, "Successfuly Connected!");
						nextFrame(0, 0);
					} break;
					/*case EEUniverse.MessageType.PlaceBlock: {
						if (msg.get(2) > 0) {
							dir = [msg.get(0) - 96, msg.get(1) - 96]
							if (((Math.abs(dir[0]) + Math.abs(dir[1])) < 3)) {
								nextFrame(...dir);
								con.send(EEUniverse.MessageType.PlaceBlock, msg.get(0), msg.get(1), 0);
							};
						}
					} break;*/
					case EEUniverse.MessageType.PlayerMove: {
						if ((msg.get(28)) && (!(msg.get(30)))) {
							let dir = [msg.get(5) - 95, msg.get(6) - 84];
							if (((Math.abs(dir[0]) + Math.abs(dir[1])) <= 2)) {
								votes = votes.filter((v)=>{return(v[0] != msg.get(0));});
								votes = votes.concat([[msg.get(0), dir]]);
							}
						};
					} break;
					case EEUniverse.MessageType.Chat: {
						if (msg.get(1) == "!help") {
							con.send(EEUniverse.MessageType.ChatPMTo, msg.get(0), "i cant help you");
						};
					} break;
					case EEUniverse.MessageType.PlayerAdd: {
						players[msg.get(0)] = msg.get(1);
					} break;
					case EEUniverse.MessageType.PlayerJoin: {
						players[msg.get(0)] = msg.get(1);
					} break;
					case EEUniverse.MessageType.PlayerExit: {
						players[msg.get(0)] = undefined;
					} break;
				}
			}
		});
}

con = "lol";

nextFrame = (x, y)=>{ // this function has been changed and moved because hhhhhh
	if (typeof snake == "undefined") {
		snake = new SnakeGame("dead");
	}
	if (snake.dead) {
		snake.restart([[5, 5], [4, 5]], 10, 10);
	} else {
		if (x || y) {
			if ((Math.abs(x) | Math.abs(y)) > 1) { // way of checking if either X or Y is above 1 in absolute value (dash check)
				snake.move([x/2, y/2]);
				snake.move([x/2, y/2]);
				snake.energy -= 0.1;
				snake.energy *= 0.95;
			} else {
				snake.move([x, y]);
			}
		} else {
			snake.move(snake.dir);
		}
		snake.addTime(1);
	}
	let sprscrn = snake.getScreen();
	console.clear();
	console.log(Gooble(sprscrn).join("\n").replace(/(.|\s)/g, (a)=>{return palette[a + "CNSL"]}));
	for (i = [0,0]; i[1] < sprscrn.length; i[1]++) {
		for (i[0] = 0; i[0] < sprscrn[0].length; i[0]++) {
			con.send(EEUniverse.MessageType.PlaceBlock, 30 + i[0], 30 + i[1], palette[Gooble(sprscrn)[i[1]][i[0]] + "EEU"]);
		}
	}
};

fram = ()=>{
	if (votes.length) {
		let dir = [0, 0];
		for (i=0;i<votes.length;i++) {
			dir[0] += votes[i][1][0];
			dir[1] += votes[i][1][1];
		};
		dir[0] /= M.max(votes.length, 1); // probably the only case i have ever used this
		dir[1] /= M.max(votes.length, 1); // like ever
		if (dir.every(a=>(-M.round(a) == M.round(-a)))) {
			nextFrame(M.round(dir[0]), M.round(dir[1]))
		};
		votes = [];
	};
};

rl.question('give me the a >', (token) => {
	connect(token);
	setInterval(fram, 5000);
	rl.close();
});