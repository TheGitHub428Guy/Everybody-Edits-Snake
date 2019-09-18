// Slow Snake bot - please be gentle
// Recently I added Gamepad control - i can now make the bot move around and change smileys. great
//
// ~by 428
// ~template by SirJosh3917/ninjasupeatsninja

var BH;
var movesQueue = [[0], [1], [2], [3]];
var players = {};
var ratelimit = 5000;
var framerate = 1500; // ms between each frames
var tillNextMove = 2; // frames until next move

var tiles = {blank: Array(3).fill("¯¯¯")}; // blank tile, solid white

/*tiles.fruit = [[ 87, 1074,   87],
              [1074, 1074, 1074], // fruit
               [ 87, 1074,   87]];*/
tiles.fruit = ["¯,¯",
               ",,,",
               "¯,¯"];
               
// old fruit tile:
// wђw
// ђђђ
// wђw

tiles.oob = ["gAg",
             "AgA", // out of bounds
             "gAg"];

tiles.snakeBody = [Array(3).fill("..."), // snake body, solid green
                   Array(3).fill("jjj")]; // snake body, charged, solid yellow

tiles.snakeHeadX = [[".A.",
                     "...", // moving left/right
                     ".A."],
                     
                    ["jAj",
                     "jjj", // moving left/right, charged
                     "jAj"]];



tiles.snakeHeadY = [["...",
                     "A.A", // moving up/down
                     "..."],
                     
                    ["jjj",
                     "AjA", // moving up/down, charged
                     "jjj"]];

tiles.numbers = [["¯¯¯",
                  "¯ ¯", //0
                  "¯¯¯"],
                  
                 ["SS ",
                  " S ", //1
                  "SSS"],
                  
                 ["ZZ ",
                  " Z ", //2
                  " ZZ"],
                  
                 ["YYY",
                  " YY", //3
                  "YYY"],
                  
                 ["k k",
                  "kkk", //4
                  "  k"],
                  
                 [" XX",
                  " X ", //5
                  "XX "],
                  
                 ["W  ",
                  "WWW", //6
                  "WWW"],
                  
                 ["VVV",
                  "  V", //7
                  "  V"],
                  
                 [" UU",
                  "UUU", //8
                  "UUU"],
                  
                 ["TTT",
                  "TTT", //9
                  "  T"],
                  
                 ["   ",
                  "   ", //none
                  "   "]];
var snake;
var gamepads;

var funthing = (m) => {players[m.getInt(0)] = [m.getString(2), m.getString(1), Array(5).fill(false), (([66, 106, 146, 186, 226, 266, 306, 346].includes(m.getDouble(4)/16)) && ([16, 45].includes(m.getDouble(5)/16)))];};

// add a callback handler
connection.addMessageCallback("*", function(m) {
    
	switch(m.type) {
			
		// on "init"
		case "init": {
			width = m.getInt(18);
			height = m.getInt(19);
			id = m.getInt(5);
			smiley = m.getInt(6);
			
			playerX = m.getDouble(10) / 16;
			playerY = m.getDouble(11) / 16;
			// send "init2"
			connection.send("init2");
			BH = new BlockHandler(connection, id, width, height);
			BH.deserialise(m);
		} break;
			
		// on "init2"
		case "init2": {
			log("we on");
			connection.send("god", true);
			playerx = 17;
			playery = 17;
			Move(playerx, playery);
			connection.send("smiley", 64);
			//connection.send("say", "hi guys im here");
		} break;
			
		case "add": {
		    //setTimeout(() => {connection.send("say", "/givegod " + m.getString(1) + "");}, 1000);
		    funthing(m);
		} break;
		
		case "say": {
			if (!(/^[.!?]/.test(m.getString(1)))) break; // you can easily add more supported prefixes by changing the regex
			
			command = m.getString(1).slice(1).toLowerCase().split(" ");
			switch (command[0]) {
				case "help": { // .help
                    connection.send("pm", m.getInt(0), "i cannot help you"); // i thought this was funny
                } break;
				/*case "game": {
				    switch (command[1]){
				        case "start": {
				            snake = new SnakeGame([[3, 0], [2, 0], [1, 0], [0, 0]], 10, 10, 170, 70, 3, false);
				            setTimeout(doCommand, ratelimit);
				            movesQueue = [[0], [1], [2], [3]];
				        } break;
				        case "end": {
				            snake.end();
				        } break;
				        case "refresh": {
				            snake.rScreen();
				        } break;
				        default: {
				            connection.send("pm", m.getInt(0), "invalid \"game\" command usage. type .help, !help or ?help for commands");
				        }
				    }
				} break;*/ // now automated
				default: {
				    connection.send("pm", m.getInt(0), "unknown command. help is the only command rn lol");
				}
			}
		} break;
		
		
		
		case "m": {
		    if (([66, 106, 146, 186, 226, 266, 306, 346].includes(m.getDouble(1)/16)) && ([16, 45].includes(m.getDouble(2)/16))) {
		        let dir = false;
		        let vote = (v) => {
		            if (!(movesQueue[v].slice(1).includes(players[m.getInt(0)][0]))) {
		                try {
		                    if (!(snake.dead)) {
                                movesQueue[v] = movesQueue[v].concat([players[m.getInt(0)][0]]);
		                    }
		                } catch(err) {console.log(err)}
                    } else {
                        movesQueue[v].splice(movesQueue[v].indexOf(players[m.getInt(0)][0]), 1);
                    }
		        };
                if (m.getInt(7)) {
                    vote((m.getInt(7)+1)/2);
                    dir = true;
                }
                if (m.getInt(8)) {
                    vote((m.getInt(8)+5)/2);
                    dir = true;
                }
                let teleX = (movesQueue[0].includes(players[m.getInt(0)][0]) * 40) +
                            (movesQueue[1].includes(players[m.getInt(0)][0]) * 80) +
                            (movesQueue[2].includes(players[m.getInt(0)][0]) * 160) + 66;
                let teleY = (movesQueue[3].includes(players[m.getInt(0)][0]) * 29) + 16;

		        if (m.getBoolean(10) || m.getBoolean(9) || players[m.getInt(0)][2][4]) {
		            connection.send("say", "/tp "+players[m.getInt(0)][1]+" 17 24");
		            players[m.getInt(0)][3] = false;
		        } else {
		            connection.send("say", "/tp "+[players[m.getInt(0)][1], teleX, teleY].join(" "));
		            players[m.getInt(0)][3] = true;
		        }
		        //console.log(movesQueue);
            } else if ([(m.getDouble(1)/16), (m.getDouble(2)/16)].join(" ") == "20 24") {
                let teleX = (movesQueue[0].includes(players[m.getInt(0)][0]) * 40) +
                            (movesQueue[1].includes(players[m.getInt(0)][0]) * 80) +
                            (movesQueue[2].includes(players[m.getInt(0)][0]) * 160) + 66;
                let teleY = (movesQueue[3].includes(players[m.getInt(0)][0]) * 29) + 16;
		        connection.send("say", "/tp "+[players[m.getInt(0)][1], teleX, teleY].join(" "));
		        players[m.getInt(0)][3] = true;
            }
            players[m.getInt(0)][2] = [(m.getInt(7) == -1), (m.getInt(7) == 1), (m.getInt(8) == -1), (m.getInt(8) == 1), (m.getBoolean(10) || m.getBoolean(9))];
		} break;
		
		case "left": {
	        delete players[m.getInt(0)];
		} break;
		
		case 'reset': {
			BH.clearQueue();
			BH.deserialise(m);
		} break;
		case 'clear': {
			BH.clearQueue();
			BH.clear(m.getUInt(2), m.getUInt(3));
		} break;
		
		// Let BlockHandler know that blocks were placed
		case "b": {
		        BH.block(m, 0);
		} break;
		case 'br': {
			BH.block(m, 4);
		} break;
		case 'bc': case 'bn': case 'bs': case 'lb': case 'pt': case 'ts': case 'wp': {
			BH.block(m);
		} break;
	}
});

log("Sending init!");
// send "init"
connection.send("init");

window.addEventListener("gamepadconnected", function(e) {
    gamepads = navigator.getGamepads();
  console.log("gamer time.");
});

window.addEventListener("gamepaddisconnected", function(e) {
    gamepads = navigator.getGamepads();
  console.log("no more gamer time.");
});

function Move(x, y) {
    connection.send("m", Math.max(0, Math.min(x, width))*16, Math.max(0, Math.min(y, height))*16, 0, 0, 0, 0, 0, 0, 0, false, false, 0);
}

class SnakeGame {
    constructor(snake, width, height, gx, gy, scale, movingAxis) {
        this.width = width;
        this.height = height;
        this.snake = snake;
        this.initLength = snake.length;
        this.fruit = [0, 0];
        this.score = 0;
        this.gx = gx;
        this.time = 0;
        this.gy = gy;
        this.dead = (snake == "dead");
        this.energy = 2;
        if (!this.dead) {
            //connection.send("say", "a new game has been start");
        }
        this.scale = (typeof scale == 'undefined') ? 1 : scale;
        this.movingAxis = movingAxis;
        this.lastVotes = [0, 0, 0, 0];
        var isTouching = false;
        do {
            this.fruit = [Math.floor(Math.random()*this.width), Math.floor(Math.random()*this.height)];
            for (var i = 0;i < this.snake.length;i++) {
                if ((snake[i][0] == this.fruit[0]) && (snake[i][1] == this.fruit[1])) {
                    isTouching = true;
                }
            }
        } while (isTouching);
        this.rScreen = function () {
            BH.clearQueue();
            var i;
            var cam;
            var f = (a) => {return (a[0] == cam[0]) && (a[1] == cam[1]);};
            var o = () => {return ((cam[1] < 0) || (cam[1] >= this.height)) || ((cam[0] < 0) || (cam[0] >= this.width));};
            if (!this.dead) {
                for (i = [0, 0]; i[1] < height * this.scale; i[1] += (1)) {
                    for (i[0] = 0; i[0] < width * this.scale; i[0] += (1)) {
                        cam = [Math.floor((i[0] / this.scale) + this.snake[0][0] - 5), Math.floor((i[1] / this.scale) + this.snake[0][1] - 5)];
                        let place = [this.fruit].concat(this.snake).findIndex(f);
                        //let eyes = [[0, 1], [2, 1]];
                        let h = (this.snake[1][0] == this.snake[0][0]);
                        let tile = [((o()) ? tiles.oob : tiles.blank), tiles.fruit, ((h) ? tiles.snakeHeadY[0+(this.energy > 0)] : tiles.snakeHeadX[0+(this.energy > 0)]), ...Array((this.energy > 1) ? Math.floor(this.energy - 1) : 0).fill(tiles.snakeBody[1])][place + 1];
                        if (typeof tile == "undefined") {
                            tile = tiles.snakeBody[0];
                        }
                        try {
                        BH.place(0 - (Math.pow(i[0]-this.snake[0][0]*this.scale, 2) + Math.pow(i[1]-this.snake[0][1]*this.scale, 2)), 0, i[0]+this.gx, i[1]+this.gy, tile[i[1] % this.scale].codePointAt(i[0] % this.scale) - 32);
                        } catch(err) {
                                console.log(err);
                        }
                    }
                }
                for (i = [0, 0, 0]; i[0] < 4; i[0]++) {
                    for (i[1] = 0; i[1] < 60; i[1]++) {
                        for (i[2] = 0; i[2] < 3; i[2]++) {
                            try {
                            BH.place(Math.random(), 0, 156 + i[1], 114 + (i[0] * 6) + i[2], ((Math.floor(i[1] / 3) < this.lastVotes[i[0]]) ? 143 : 0));
                            } catch(err) {
                                console.log(err);
                            }
                        }
                    }
                }
                for (i[0] = 0;i[0] < 2;i[0]++) {
                    for (i[1] = 0; i[1] < 4; i[1]++) {
                        for (i[2] = 0; i[2] < 3; i[2]++) {
                            for (i[3] = 0;i[3] < 3;i[3]++) {
                                try {
                                BH.place(Math.random(), 0, 190 + i[3] + (i[1] * 4), 104 + i[2] + (i[0] * 4), tiles.numbers[(((i[0]) ? (this.score) : (this.time))+"    ")[i[1]].replace(/ /, "10")-[]][i[2]].codePointAt(i[3]) - 32);
                                } catch(err) {
                                console.log(err);
                                }
                            }
                        }
                    }
                }
            }
        };
        this.rScreen();
        this.eat = function () {
            this.score += 1;
            this.energy = Math.min(this.energy + 2, this.initLength + this.score);
        };
        this.passFrame = function (dir, lastVotes) {
            if (!this.dead) {
                let snakeNew = this.snake.slice(0);
                this.lastVotes = lastVotes;
                isTouching = false;
                snakeNew.unshift([snakeNew[0][0] + ((dir == 1) - (dir === 0)), snakeNew[0][1] + ((dir == 3) - (dir == 2))]);
                let deleteThis;
                if (this.energy > 0) {
                    this.energy -= 0.1;
                } else {
                    this.end();
                }
                if ((snakeNew[0][0] == this.fruit[0]) && (snakeNew[0][1] == this.fruit[1]) && (snakeNew[2].toString() != snakeNew[0].toString())) {
                    this.eat();
                }
                deleteThis = snakeNew.slice(this.initLength + this.score);
                snakeNew = snakeNew.slice(0, this.initLength + this.score);
                if ((snakeNew[0][0] < 0) || (snakeNew[0][0] >= this.width)) {
                    log("ran into vert wall");
                    this.end();
                } else if (snakeNew[0][1] < 0 || (snakeNew[0][1] >= this.height)) {
                    log("ran into horiz. wall");
                    this.end();
                } else if (snakeNew.slice(1).some(function (a) {return (a[0] == snakeNew[0][0]) && (a[1] == snakeNew[0][1]);})) {
                    if ((snakeNew[2][0] == snakeNew[0][0]) && (snakeNew[2][1] == snakeNew[0][1])) {
                        snakeNew = this.snake.slice(0);
                        snakeNew.reverse();
                        if ((snakeNew[0][0] == this.fruit[0]) && (snakeNew[0][1] == this.fruit[1])) {
                            this.eat();
                        }
                    } else {
                        log("ran into self");
                        this.end();
                    }
                }
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
                this.snake = snakeNew.slice(0);
                this.movingAxis = (dir > 1);
                this.time += 1;
                this.rScreen();
                return deleteThis;
            } else {
                this.end();
                //probably redudant, unless something extraordinarily stupid happens
            }
        };
        this.end = function () {
            this.dead = true;
            tillNextMove = 2;
            for (var i = [0, 0]; i[1] < (this.height * this.scale); i[1]++) {
                for (i[0] = 0; i[0] < (this.width * this.scale); i[0]++) {
                    BH.place((Math.pow(i[0]-(this.snake[0][0]*this.scale), 2) + Math.pow(i[1]-(this.snake[0][1]*this.scale), 2)), 0, i[0]+this.gx, i[1]+this.gy, tiles.blank[1].charCodeAt(0) - 32);
                }
            }
        };
    }
}

doCommand = function () {
    try {
        if (!snake.dead) {
        okay: {
        asdf = movesQueue.slice(0).map((a) => {return [a[0], a.length-1];});
        fdsa = [asdf[0][1], asdf[1][1], asdf[2][1], asdf[3][1]];
        asdf.sort((a,b)=>{return (b[1]-a[1]);});
        if ((asdf[0][1] == asdf[1][1]) || (BH.nextTick !== null && BH.flusher !== null)) {tillNextMove = 1; break okay;}
        snake.passFrame(asdf[0][0], fdsa);
        movesQueue = [[0], [1], [2], [3]];
        for (const [key, val] of Object.entries(players)) {
            if (val[3]) {
                connection.send("say", "/tp "+val[1]+" 66 16");
            }
        }
        }
        } else {
            snake = new SnakeGame([[5, 5], [4, 5]], 10, 10, 170, 70, 3, false);
            movesQueue = [[0], [1], [2], [3]];
        }
        tillNextMove = 2;
    } catch(err) {
        console.log(err);
    }
};
frame = ()=>{
    if (tillNextMove > 0) {
        tillNextMove -= 1;
    } else {
        doCommand();
    };
};
/*start = ()=>{try {
    snake = new SnakeGame([[5, 5], [4, 5]], 10, 10, 170, 70, 3, false);
    movesQueue = [[0], [1], [2], [3]];
} catch(err) {
    console.log(err)
}};*/
velocity = [0, 0];
bPressed = [false, false];

function readGamepad () {
    try {
        if (gamepads[0].buttons[12].pressed) {
            velocity[1] -= 0.05;
        }
        if (gamepads[0].buttons[13].pressed) {
            velocity[1] += 0.05;
        }
        if (gamepads[0].buttons[14].pressed) {
            velocity[0] -= 0.05;
        }
        if (gamepads[0].buttons[15].pressed) {
            velocity[0] += 0.05;
        };
        
        if (gamepads[0].buttons[2].pressed) {
            velocity = [((gamepads[0].axes[0]) + (gamepads[0].axes[2])) / 10, ((gamepads[0].axes[1]) + (gamepads[0].axes[3])) / 10];
        }
        if (gamepads[0].buttons[3].pressed) {
            velocity = [((gamepads[0].axes[0]) + (gamepads[0].axes[2])) / 2, ((gamepads[0].axes[1]) + (gamepads[0].axes[3])) / 2];
        }
        playerX = Math.max(0, Math.min((playerX + velocity[0]), width));
        playerY = Math.max(0, Math.min((playerY + velocity[1]), height));
        if (playerX == 0 || playerX == width) {
            velocity[0] *= -1;
            smiley = Math.floor(Math.random() * 4);
        }
        if (playerY == 0 || playerY == height) {
            velocity[1] *= -1;
            smiley = Math.floor(Math.random() * 4);
        }
        if (gamepads[0].buttons[4].pressed && !(bPressed[0])) {
            smiley = (smiley - 1) % 4;
        }
        if (gamepads[0].buttons[5].pressed && !(bPressed[1])) {
            smiley = (smiley + 1) % 4;
        }
        bPressed = [gamepads[0].buttons[4].pressed, gamepads[0].buttons[5].pressed];
        Move(playerX, playerY);
        if (gamepads[0].buttons[0].pressed) {
            BH.place(0, 0, Math.floor(playerX + 0.5), Math.floor(playerY + 0.5), [1088, 9, 182, 12, 1018, 13, 14, 15, 10, 11][Math.floor(Math.random() * 10)]);
        }
        if (gamepads[0].buttons[1].pressed) {
            BH.place(0, 0, Math.floor(playerX + 0.5), Math.floor(playerY + 0.5), 0);
        }
        connection.send("smiley", smiley);
    } catch(err) {
    }
}

function startUp () { // to start the bot, go into console and type "startUp()"
	setInterval(()=>{frame()}, framerate)
	setInterval(()=>{readGamepad()}, 20);
}
snake = new SnakeGame("dead")