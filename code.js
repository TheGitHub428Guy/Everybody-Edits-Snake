try {// Remade Snakebot Code - help me
//
// ~by 428
// ~IDE by SirJosh3917/ninjasupeatsninja

// colors:
// black: 0
// dark gray: 1
// light grey: 2
// white: 3
// dark green: 4
// light green: 5
// red: 6

// to anyone offended by me using mathematical operations (+, -, *) with booleans and being an idiot with strings and regexes, don't look at this code
var menu = document.getElementsByClassName("menu")[0].childNodes[1];
if (document.getElementById("sprscreen") !== null) {
    document.getElementById("sprscreen").parentNode.remove();
}
menu.appendChild(document.createElement("tr")).innerHTML = "<td id=\"sprscreen\"></td>";
//menu.innerHTML = menu.innerHTML.replace(/(<tr><td id=\"sprscreen\".*\/tr>)?$/, "<tr><td id=\"sprscreen\"></td></tr>");
var sprscreen = document.getElementById("sprscreen");
sprscreen.style.color = "white";
sprscreen.style.fontFamily = "Courier New";
sprscreen.style.fontSize = "8px";
sprscreen.style.lineHeight = "7px";

palette = {
    [ " HTML"]: "<div class='snaketile' style='background-color: #000000; width: 4px !important; height: 4px; display: inline-block !important'></div>",
    [ "!HTML"]: "<div class='snaketile' style='background-color: #808080; width: 4px !important; height: 4px; display: inline-block !important'></div>",
    ["\"HTML"]: "<div class='snaketile' style='background-color: #C0C0C0; width: 4px !important; height: 4px; display: inline-block !important'></div>",
    [ "#HTML"]: "<div class='snaketile' style='background-color: #FFFFFF; width: 4px !important; height: 4px; display: inline-block !important'></div>",
    [ "$HTML"]: "<div class='snaketile' style='background-color: #00A000; width: 4px !important; height: 4px; display: inline-block !important'></div>",
    [ "%HTML"]: "<div class='snaketile' style='background-color: #00FF00; width: 4px !important; height: 4px; display: inline-block !important'></div>",
    [ "&HTML"]: "<div class='snaketile' style='background-color: #C00000; width: 4px !important; height: 4px; display: inline-block !important'></div>",
    [ "'HTML"]: "<div class='snaketile' style='background-color: #FF0000; width: 4px !important; height: 4px; display: inline-block !important'></div>",
    ["\nHTML"]: "<br>",
    
    [ " EE"]: 0,    //no            block
    [ "!EE"]: 1022, //graey  brick  block
    ["\"EE"]: 1088, //white  basic  brick
    [ "#EE"]: 143,  //white  cloud  block
    [ "$EE"]: 14,   //green  basic  block
    [ "%EE"]: 74,   //green mineral block
    [ "&EE"]: 12,   //red   basic   block
    [ "'EE"]: 70,   //red  mineral  block
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
                        // cx, cy: position for center of rotation      (optional)
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
                        "#### ##    # ##### # ## ## #     #######",
                        "#### ##### #       # ##### # ###########",
                        "##### ### ## ##### # ##### # ###########",
                        "######   ### ##### # ##### #       #####",
                        "########################################",
                        "######   ### ##### #       #      ######",
                        "##### ### ## ##### # ####### ##### #####",
                        "#### ##### ## ### ## ####### ##### #####",
                        "#### ##### ## ### ##     ###      ######",
                        "#### ##### ### # ### ####### ##### #####",
                        "##### ### #### # ### ####### ##### #####",
                        "######   ###### ####       # ##### #####",
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
                        "########################################",
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
                if (dir[0] && dir[1]) {
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
                    if ((snakeNew[2][0] == snakeNew[0][0]) && (snakeNew[2][1] == snakeNew[0][1])) {
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
                    snkscr = SprOverlap(snkscr, spr.fruit, this.fruit[0] * 4, this.fruit[1] * 4); // oh yeah it's big brain time
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


nextFrame = (x, y)=>{
    if (typeof snake == "undefined") {
        snake = new SnakeGame("dead");
    }
    if (snake.dead) {
        snake.restart([[1, 0], [0, 0]], 10, 10);
    } else {
        if (x || y) {
            snake.move([x, y]);
        } else {
            snake.move(snake.dir);
        }
        snake.addTime(1);
    }
    document.getElementById("sprscreen").innerHTML = Gooble(snake.getScreen()).join("\n").replace(/(.|\s)/g, (a)=>{return palette[a + "HTML"]});
    // game position = 130,130
    let sprscrn = snake.getScreen();
    BH.clearQueue();
    for (i = [0,0]; i[1] < sprscrn.length; i[1]++) {
        for (i[0] = 0; i[0] < sprscrn[0].length; i[0]++) {
            BH.place(Math.random(), 0, 130 + i[0], 130 + i[1], palette[Gooble(sprscrn)[i[1]][i[0]] + "EE"]);
        }
    }
};
//snake = new SnakeGame("dead");

if (document.getElementById("controls") !== null) {
    document.getElementById("controls").remove();
}
controls = document.getElementsByClassName("menu")[0].childNodes[1].appendChild(document.createElement("tr")).appendChild(document.createElement("td")).appendChild(document.createElement("table")); // what a mess
var idctrls = document.createAttribute("id");
idctrls.value = "controls";
controls.attributes.setNamedItem(idctrls);

cArrows = [["\u2196", "\u2191", "\u2197"],
           ["\u2190", "\u25CB", "\u2192"],
           ["\u2199", "\u2193", "\u2198"]];
cRows    = Array(3);
cCells   = Array(3).fill(Array(3));
cButtons = Array(3).fill(Array(3).fill(Array(2))); // this is the array staircase. don't trip on the 3rd step!

function buttonClicked (event) {
    nextFrame(...event.target.id.slice(1).split("y").map((x)=>{return (+x)-1;})); // x1y2 -> [0, 1]
};

for (i = [0, 0]; i[1] < 3; i[1]++) {
    controls.appendChild(cRows[i[1]] = document.createElement("tr"));
    for (i[0] = 0; i[0] < 3; i[0]++) {
        cRows[i[1]].appendChild(cCells[i[1]][i[0]] = document.createElement("td"));
        cCells[i[1]][i[0]].appendChild(cButtons[i[1]][i[0]][0] = document.createElement("button"));
        cButtons[i[1]][i[0]][1] = document.createAttribute("id");
        cButtons[i[1]][i[0]][1].value = "x" + (i.join("y"));
        cButtons[i[1]][i[0]][0].attributes.setNamedItem(cButtons[i[1]][i[0]][1]);
        cButtons[i[1]][i[0]][0].style.width = "32px";
        cButtons[i[1]][i[0]][0].style.height = "32px";
        cCells[i[1]][i[0]].addEventListener('click', buttonClicked);
        cButtons[i[1]][i[0]][0].appendChild(document.createTextNode(cArrows[i[1]][i[0]]));
    }
};


players = {};

connection.addMessageCallback("*", function(m) {
	switch(m.type) {
			
		case "init": {
		    log("we goin on");
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
			
		case "init2": {
			log("we on");
			connection.send("god", true);
			Move(playerX, playerY);
			nextFrame(0, 0);
		} break;
		
		case "add": {
		    players[m.getInt(0)] = [m.getString(2), m.getString(1), Array(5).fill(false), (([66, 106, 146, 186, 226, 266, 306, 346].includes(m.getDouble(4)/16)) && ([16, 45].includes(m.getDouble(5)/16)))];
		} break;
		case "left": {
		    delete players[m.getInt(0)];
		} break;
		
		
		// Let BH know that things have happened
		// I only understand half of this code
		case 'reset': {
			BH.clearQueue();
			BH.deserialise(m);
		} break;
		case 'clear': {
			BH.clearQueue();
			BH.clear(m.getUInt(2), m.getUInt(3));
		} break;
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

velocity = [0, 0];
bPressed = [false, false];

window.addEventListener("gamepadconnected", function(e) {
    gamepads = navigator.getGamepads();
  console.log("gamer time.");
});

window.addEventListener("gamepaddisconnected", function(e) {
    gamepads = navigator.getGamepads();
  console.log("no more gamer time.");
});

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
            velocity = [(gamepads[0].axes[2]) / 10, (gamepads[0].axes[3]) / 10];
        }
        if (gamepads[0].buttons[3].pressed) {
            velocity = [(gamepads[0].axes[2]) / 2, (gamepads[0].axes[3]) / 2];
        }
        playerX = Math.max(0, Math.min((playerX + velocity[0] + (gamepads[0].axes[0] / 3)), width));
        playerY = Math.max(0, Math.min((playerY + velocity[1] + (gamepads[0].axes[1] / 3)), height));
        if (playerX == 0 || playerX == width) {
            velocity[0] *= -1;
            smiley = Math.floor(Math.random() * 4);
        }
        if (playerY == 0 || playerY == height) {
            velocity[1] *= -1;
            smiley = Math.floor(Math.random() * 4);
        }
        if (gamepads[0].buttons[4].pressed && !(bPressed[0])) {
            smiley = mod((smiley - 1), 4);
        }
        if (gamepads[0].buttons[5].pressed && !(bPressed[1])) {
            smiley = mod((smiley + 1), 4);
        }
        bPressed = [gamepads[0].buttons[4].pressed, gamepads[0].buttons[5].pressed];
        Move(playerX, playerY);
        if (gamepads[0].buttons[0].pressed) {
            // do something when a is pressed?
        }
        if (gamepads[0].buttons[1].pressed) {
            // do something when b is pressed?
        }
        connection.send("smiley", smiley);
    } catch(err) {
    }
}

function Move(x, y) { // in blocks, only changes X and Y
    connection.send("m", Math.max(0, Math.min(x, width))*16, Math.max(0, Math.min(y, height))*16, 0, 0, 0, 0, 0, 0, 0, false, false, 0);
}

function startUp() {
    setInterval(()=>{readGamepad()}, 20)
}

log("we gon go on");
connection.send("init");
} catch(err) {
    console.log(err);
}