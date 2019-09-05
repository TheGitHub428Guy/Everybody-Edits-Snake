// My bot - please be gentle
// ~by 428
// ~template by SirJosh3917/ninjasupeatsninja

var BH;
var movesQueue = [[0], [1], [2], [3]];
var players = {};
var ratelimit = 5000;
try {
clearTimeout(doCommand);
} catch(err) {}
// add a callback handler
connection.addMessageCallback("*", function(m) { // to do: make block handler sense things
    
	switch(m.type) {
			
		// on "init"
		case "init": {
			width = m.getInt(18);
			height = m.getInt(19);
			id = m.getInt(5);
			// send "init2"
			connection.send("init2");
			BH = new BlockHandler(connection, id, width, height, 50);
			BH.deserialise(m);
		} break;
			
		// on "init2"
		case "init2": {
			log("init2 recieved!");
			connection.send("god", true);
			playerx = 17;
			playery = 17;
			Move(playerx, playery);
			snake = new SnakeGame("dead");
			connection.send("smiley", 140);
			//connection.send("say", "hi guys im here");
		} break;
			
		case "m": {
		    x = m.getDouble(1);
		    y = m.getDouble(2);
		} break;
		
		case "say": {
			if (!(/^[.!?]/.test(m.getString(1)))) break; // you can easily add more supported prefixes by changing the regex
			
			command = m.getString(1).slice(1).toLowerCase().split(" "); //remove first character and split into words list
			switch (command[0]) {
				case "help": { // .help [something]
					switch (command[1]) {
                        default: { // .help
                            connection.send("pm", m.getInt(0), "i use prefixes . ! and ?; for this example i wont show prefixes");
                            setTimeout(() => {connection.send("pm", m.getInt(0), "help (command/Mechanic?) - help with command or mechanic, if none included show default help");}, 750);
                            setTimeout(() => {connection.send("pm", m.getInt(0), "game start/end - start/end a game");}, 1500);
                        } break;
                        case "help": { // .help help
                            connection.send("pm", m.getInt(0), "help (command/Mechanic?) - help with command or mechanic, if none included show default help");
                            setTimeout(() => {connection.send("pm", m.getInt(0), "wow this meta");}, 1500);
                        } break;
                        case "moving": { // .help move
                            connection.send("pm", m.getInt(0), "vote where to move by turning a switch on");
                            setTimeout(() => {connection.send("pm", m.getInt(0), "the switch on the left is to move left, the switch on the right is to move right, etc.");}, 1500);
                            setTimeout(() => {connection.send("pm", m.getInt(0), "you can vote for 2 moves, but you can't vote for the same move twice at once");}, 2500);
                        } break;
                        case "game": { // .help game
                            connection.send("pm", m.getInt(0), "game end - end the current game");
                            setTimeout(() => {connection.send("pm", m.getInt(0), "game start - start a new game");}, 750);
                            setTimeout(() => {connection.send("pm", m.getInt(0), "see also: Moving, Fruit");}, 1500);
                        }
                    }
                } break;
				/*case "move": {
				    var directions = ["left", "right", "up", "down", "l", "r", "u", "d", "<", ">", "^", "v"];
					dir = directions.findIndex((c) => {return c == command[1].toLowerCase();}) % 4;
                    log("Someone requested to move " + directions[dir] + "!");
		            movesQueue = movesQueue.concat([dir]);
				} break;*/
				case "game": {
				    switch (command[1]){
				        case "start": {
				            snake = new SnakeGame([[3, 0], [2, 0], [1, 0], [0, 0]], 5, 0, 15, 15, 10, 10);
				            setTimeout(doCommand, ratelimit);
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
				} break;
				default: {
				    connection.send("pm", m.getInt(0), "unknown command. type .help, !help or ?help for commands");
				}
			}
		} break;
		
		case "add": {
		    //setTimeout(() => {connection.send("say", "/givegod " + m.getString(1) + "");}, 1000);
		    players[m.getInt(0)] = m.getString(2);
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
		
		case 'ps': {
		    dir = m.getInt(2);
		    if (dir == -1) {break;}
		    if (!(m.getBoolean(3))) {break;}
		    //console.log(movesQueue[dir].find((a) => {return(a == m.getInt(0));}));
		    if (snake.dead) {break;}
		    if (movesQueue[dir].slice(1).every((a) => {return(a != players[m.getInt(0)]);})) {
		        movesQueue[dir] = movesQueue[dir].concat([players[m.getInt(0)]]);
		        BH.place(1, 0, 8, 17, 385, 
                "Votes:\\nLeft: " + (movesQueue[0].length - 1)
                + "\\nRight: " + (movesQueue[1].length - 1)
                + "\\nUp: " + (movesQueue[2].length - 1)
                + "\\nDown: " + (movesQueue[3].length - 1), 
                0);
		    } else {
		    }
		    console.log(movesQueue);
		} break;
	}
});

log("Sending init!");
// send "init"
connection.send("init");

function Move(x, y) {
    connection.send("m", Math.max(0, Math.min(x, width))*16, Math.max(0, Math.min(y, height))*16, 0, 0, 0, 0, 0, 0, 0, false, false, 0);
}

class SnakeGame {
    constructor(snake, fx, fy, width, height, gx, gy) {
        this.width = width;
        this.height = height;
        this.snake = snake;
        this.initLength = snake.length;
        this.fruit = [fx, fy];
        this.score = 0;
        this.gx = gx;
        this.gy = gy;
        this.dead = (snake == "dead");
        this.rScreen = function () {
            var i;
            var f = (a) => {return (a[0] == i[0]) && (a[1] == i[1]);};
            if (!this.dead) {
                for (i = [0, 0]; i[1] < height; i[1]++) {
                    for (i[0] = 0; i[0] < width; i[0]++) {
                        let place = [this.fruit].concat(this.snake).findIndex(f);
                        let smiley;
                        switch(place){
                            case -1:{
                                place = 1088;
                                smiley = 141;
                            } break;
                            case 0: {
                                place = 12;
                                smiley = 110;
                            } break;
                            case 1: {
                                place = 19;
                                smiley = 143;
                            } break;
                            default: {
                                place = 14;
                                smiley = 176;
                            }
                        }
                        BH.place(0 - (Math.pow(i[0]-this.snake[0][0], 2) + Math.pow(i[1]-this.snake[0][1], 2)), 0, i[0]+this.gx, i[1]+this.gy, place);
                        if ((i[0] == 7) && (i[1] == 7)) {
                            connection.send("smiley", smiley);
                        }
                    }
                }
            }
        };
        this.rScreen();
        this.fun = function (a) {return (a[0] == this.fruit[0]) && (a[1] == this.fruit[1]);};
        this.passFrame = function (dir) {
            if (!this.dead) {
                let snakeNew = this.snake.slice(0);
                let isTouching = false;
                snakeNew.unshift([snakeNew[0][0] + ((dir == 1) - (dir === 0)), snakeNew[0][1] + ((dir == 3) - (dir == 2))]);
                let deleteThis;
                if ((snakeNew[0][0] == this.fruit[0]) && (snakeNew[0][1] == this.fruit[1]) && (snakeNew[2].toString() != snakeNew[0].toString())) {
                    this.score += 1;
                    do {
                        this.fruit = [Math.floor(Math.random()*this.width), Math.floor(Math.random()*this.height)];
                        for (var i = 0;i < snakeNew;i++) {
                            if ((snakeNew[i][0] == this.fruit[0]) && (snakeNew[i][1] == this.fruit[1])) {
                                isTouching = true;
                            }
                        }
                    } while (isTouching);
                }
                deleteThis = snakeNew.slice(this.initLength + this.score);
                /*for (var i = 0; i < deleteThis.length; i++) {
                    BH.place(0, 0, deleteThis[i][0]+this.gx, deleteThis[i][1]+this.gy, 1088);
                }
                BH.place(0, 0, snakeNew[0][0]+this.gx, snakeNew[0][1]+this.gy, 19);
                BH.place(0, 0, snakeNew[1][0]+this.gx, snakeNew[1][1]+this.gy, 14);*/
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
                            this.score += 1;
                            while (snakeNew.some(this.fun)) {
                                this.fruit = [Math.floor(Math.random()*this.width), Math.floor(Math.random()*this.height)];
                            }
                        }
                    } else {
                        log("ran into self");
                        this.end();
                    }
                }
                this.snake = snakeNew.slice(0);
                this.rScreen();
                return deleteThis;
            } else {
                this.end();
                //probably redudant, unless something extraordinarily stupid happens
            }
        };
        this.end = function () {
            this.dead = true;
            for (var i = [0, 0]; i[1] < height; i[1]++) {
                for (i[0] = 0; i[0] < width; i[0]++) {
                    BH.place((Math.pow(i[0]-this.snake[0][0], 2) + Math.pow(i[1]-this.snake[0][1], 2)), 0, i[0]+this.gx, i[1]+this.gy, 0);
                }
            }
        };
    }
}

doCommand = function () {
    try {
        okay: {
        asdf = movesQueue.slice(0).map((a) => {return [a[0], a.length];});
        asdf.sort((a,b)=>{return (b[1]-a[1]);});
        if (asdf[0][1] == asdf[1][1]) {setTimeout(doCommand, ratelimit / 2); break okay;}
        snake.passFrame(asdf[0][0]);
        movesQueue = [[0], [1], [2], [3]];
        setTimeout(doCommand, ratelimit);
        BH.place(1, 0, 8, 17, 385, 
        "Votes:\\nLeft: " + (movesQueue[0].length - 1)
        + "\\nRight: " + (movesQueue[1].length - 1)
        + "\\nUp: " + (movesQueue[2].length - 1)
        + "\\nDown: " + (movesQueue[3].length - 1), 
        0);
        }
    } catch(err) {
        console.log(err)
    }
};


