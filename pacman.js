var world = [
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    [2, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 2],
    [2, 1, 2, 2, 2, 2, 1, 2, 2, 2, 2, 1, 2],
    [2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2],
    [2, 1, 2, 1, 2, 2, 1, 2, 2, 1, 2, 1, 2],
    [2, 1, 2, 1, 2, 1, 1, 1, 2, 1, 2, 1, 2],
    [2, 3, 1, 1, 1, 1, 3, 1, 1, 1, 1, 3, 2],
    [2, 1, 2, 1, 2, 1, 1, 1, 2, 1, 2, 1, 2],
    [2, 1, 2, 1, 2, 2, 1, 2, 2, 1, 2, 1, 2],
    [2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2],
    [2, 1, 2, 2, 2, 2, 1, 2, 2, 2, 2, 1, 2],
    [2, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 2],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
];
var original = JSON.parse(JSON.stringify(world));
var pacman = {
    x: 1,
    y: 1
}
var ghost = {
    x: rand_num(),
    y: rand_num()
}
var ghost_Movement = null;
var score = 0;

function rand_num() {
    var num = Math.trunc(Math.random() * world.length - 1);
    return num;
}

function displayWorld() {
    var output = "";
    for (i = 0; i < world.length; i++) {
        output += "\n<div class='row'>\n";
        for (j = 0; j < world[i].length; j++) {
            if (world[i][j] == 3) {
                output += "<div class='cherry'></div>";
            }
            if (world[i][j] == 2) {
                output += "<div class='brick'></div>";
            }
            else if (world[i][j] == 1) {
                output += "<div class='coin'></div>";
            }
            else if (world[i][j] == 0) {
                output += "<div class='empty'></div>";
            }
        }
        output += "\n</div>";

    }
    document.getElementById("world").innerHTML = output;
}

function displayPacman() {
    document.getElementById("pacman").style.left = pacman.x * 20 + "px";
    document.getElementById("pacman").style.top = pacman.y * 20 + "px";
}

function displayGhost() {
    document.getElementById("ghost").style.left = ghost.x * 20 + "px";
    document.getElementById("ghost").style.top = ghost.y * 20 + "px";
}

function displayScore() {
    document.getElementById("score").innerHTML = "Score: " + score;
}

//give ghost random x and y that is not on block
function placeGhost() {
    if (world[ghost.y][ghost.x] != 2) {
        displayGhost();
    } else {
        ghost = {
            x: rand_num(),
            y: rand_num()
        };
        placeGhost();
    }
}

function ghostMove() {
    var direction = Math.trunc(Math.random() * 4);
    if (direction == 0 && world[ghost.y][ghost.x - 1] != 2) { //left
        ghost.x--;
    } else if (direction == 1 && world[ghost.y][ghost.x + 1] != 2) { //right
        ghost.x++;
    } else if (direction == 2 && world[ghost.y - 1][ghost.x] != 2) {  //up
        ghost.y--;
    } else if (direction == 3 && world[ghost.y + 1][ghost.x] != 2) {  //down
        ghost.y++;
    } else {
        ghostMove();
    }
    displayGhost();
    won_lost();
}

function start_game() {
    placeGhost();
    placeGhost();
    displayWorld();
    displayPacman();
    //handle initial position of pacman
    if (world[pacman.y][pacman.x] == 1) {
        world[pacman.y][pacman.x] = 0;
        displayWorld();
    }
    displayScore();
    move();
    ghost_Movement = setInterval(function () {
        ghostMove();
    }, 500);;
}

function won_lost() {
    if (score == 1000) {
        end_game();
        document.getElementById("win_lose").innerHTML = "You've won.";
        document.getElementById("ghost").style.display = "none";
    } else if (pacman.x == ghost.x && pacman.y == ghost.y) {
        end_game();
        document.getElementById("win_lose").innerHTML = "You've lost.";
        document.getElementById("pacman").style.display = "none";
    }
}
function end_game() {
    document.onkeydown = function (e) {
        e.preventDefault();
    }
    clearInterval(ghost_Movement);
    document.getElementById("restart").style.display = "block";
}

function move() {
    document.onkeydown = function (e) {
        //left
        if (e.keyCode == 37 && world[pacman.y][pacman.x - 1] != 2) {
            document.getElementById("pacman").style.transform = "scaleX(-1)";
            pacman.x--;
        }
        //right
        if (e.keyCode == 39 && world[pacman.y][pacman.x + 1] != 2) {
            document.getElementById("pacman").style.transform = "rotate(0deg)";
            pacman.x++;
        }
        //down
        if (e.keyCode == 40 && world[pacman.y + 1][pacman.x] != 2) {
            document.getElementById("pacman").style.transform = "rotate(90deg)";
            pacman.y++;
        }
        //up
        if (e.keyCode == 38 && world[pacman.y - 1][pacman.x] != 2) {
            document.getElementById("pacman").style.transform = "rotate(270deg)";
            pacman.y--;
        }
        //eat coin then update score +10
        if (world[pacman.y][pacman.x] == 1) {
            world[pacman.y][pacman.x] = 0;
            score += 10;
            displayScore();
        }
        //eat cherry then update score +50
        if (world[pacman.y][pacman.x] == 3) {
            world[pacman.y][pacman.x] = 0;
            score += 50;
            displayScore();
        }
        displayWorld();
        displayPacman();
        won_lost();
    }
}

document.getElementById("restart").onclick = function () {
    pacman.x = 1;
    pacman.y = 1;
    ghost.x = rand_num();
    ghost.y = rand_num();
    score = 0;
    document.getElementById("pacman").style.display = "block";
    document.getElementById("pacman").style.transform = "rotate(0deg)";
    document.getElementById("ghost").style.display = "block";
    document.getElementById("restart").style.display = "none";
    document.getElementById("win_lose").innerHTML = "Playing..";
    world = JSON.parse(JSON.stringify(original));
    start_game();
}

start_game();