'use strict';

import { Hero } from './classes.js';
import { createMob } from './classes.js';
import { Skeletons } from './classes.js';
import { createWall } from './classes.js';
import { Wallx } from './classes.js';
import { mvMonsters } from './classes.js';
import { Boss } from './classes.js';
import { createBoss } from './classes.js';
import { Grasser } from './classes.js';
import { drawGrass } from './classes.js';
import { heroin } from './heromaker.js';
import { deadX } from './classes.js';
import { deadY } from './classes.js';
import { deadOnBoard } from './classes.js';
import { atkRight } from './classes.js';
import { atkLeft } from './classes.js';
import { heroDraw } from './classes.js';
import { clearCtx } from './classes.js';
import { hpPerc } from './cssmod.js';
import { makePotion } from './classes.js';
import { poti } from './classes.js';
import { Potion } from './classes.js';
import { drawPotion } from './classes.js';
import { axeThrow } from './classes.js';


export let maplevel = 1;
export let mapstyle = 1;

export let wallPos = [];
export let monsterPos = [];

export const canvas = document.querySelector('canvas');
export const ctx = canvas.getContext('2d');


export function statusBar() {
    document.getElementById('herolevel').innerHTML = " Level " + heroin.level + " Hero";
    document.getElementById('herohealth').innerHTML = " Health Points: " + heroin.health + "/" + heroin.maxhealth;
    document.getElementById('heroname').innerHTML = heroin.name;
    document.getElementById('attackrating').innerHTML = " Attack rating: " + heroin.SP;
    document.getElementById('defenserating').innerHTML = " Defense rating: " + heroin.DP;
    document.getElementById('damagedone').innerHTML = " Total damage done: " + heroin.damdone;
    document.getElementById('damagetaken').innerHTML = " Total damage taken: " + heroin.damtaken;
    document.getElementById('killcount').innerHTML = " Creatures killed: " + heroin.killcount;
    document.getElementById('haskey').innerHTML = " Key looted: " + heroin.gotkey;

}

setInterval(statusBar, 1000);

//-----------------------------------------------------GENERATING MAP WHRE X-0, Y-0  AND X-720 AND Y-720 COORDS ARE CONNECTED----------------------------------------------

export function wallmaker() {
    for (let k = 0; k < 800; k += 80) {
        for (let i = 0; i < 800; i += 80) {
            createWall(k, i)
        }
    }
}
setTimeout(wallmaker, 500)




export let grassFields = [];
export let xline = 0;
export let yline = 0;
export let mapready = false;

function drawTiles() {
    drawGrass(0, 0)
    while (mapready == false) {


        let testarray = []
        if (xline == 720 && yline == 720) {
            mapready = true;
            return
        }
        let selector = Math.floor(Math.random() * 4)

        if (selector == 0 && xline >= 80) {
            testarray = []
            xline -= 80
            drawGrass(xline, yline)
            return
        }
        if (selector == 1 && xline < 720) {
            testarray = []
            xline += 80
            drawGrass(xline, yline)
            return
        }
        if (selector == 2 && yline >= 80) {
            testarray = []
            yline -= 80
            drawGrass(xline, yline)
            return
        }
        if (selector == 3 && yline < 720) {
            testarray = []
            yline += 80
            drawGrass(xline, yline)
            return
        }
    }
}


function delaydrw() {
    function callFunction(number) {
        for (let i = 0; i < number && mapready == false; i++) {
            drawTiles(i);
        }
    }

    callFunction(8000);

}

setTimeout(delaydrw, 501)


export function clearwalls() {
    for (let i = 0; i < wallPos.length; i++) {
        for (let z = 0; z < grassFields.length; z++) {
            if (wallPos[i].posX == grassFields[z].posX && wallPos[i].posY == grassFields[z].posY) {
                wallPos.splice(i, 1)
            }
        }
    }
}

function clearWallsNotWalls() {
    function superfunc(number) {
        for (let i = 0; i < number; i++) {
            clearwalls(i);
        }
    }

    superfunc(500);

}

setTimeout(clearWallsNotWalls, 503)
setTimeout(clearWallsNotWalls, 504)
setTimeout(clearWallsNotWalls, 505)
setTimeout(clearWallsNotWalls, 506)
setTimeout(clearWallsNotWalls, 507)
setTimeout(clearWallsNotWalls, 508)
setTimeout(clearWallsNotWalls, 509)




//------------------------------------------------------------------------------------GENERATE MONSTERS--------------------------------------------

let mobname = 'noname';
let bossname = 'noname';



function gene() {
    
    if (mapstyle == 1) {
        mobname = 'Minotaur'
        bossname = 'Naga'
    }
    if (mapstyle == 2) {
        mobname = 'Pirate'
        bossname = 'Hooktusk'
    }
    if (mapstyle == 3) {
        mobname = 'Skelly'
        bossname = 'Lichking'
    }

    let xco = 0;
    let yco = 0;
    let count = 0;

    let mobnmb = Math.floor(Math.random() * 2 + 3);
    while (count < mobnmb) {
        xco = Math.floor(Math.random() * 7 + 2) * 80
        yco = Math.floor(Math.random() * 7 + 2) * 80
        for (let i = 0; i < grassFields.length; i++) {
            if (grassFields[i].posX == xco && grassFields[i].posY == yco) {
                createMob(xco, yco, mobname)
                xco = Math.floor(Math.random() * 7 + 2) * 80
                yco = Math.floor(Math.random() * 7 + 2) * 80
                if (monsterPos.length == mobnmb) {
                    return;
                }
            }
        }

    }


}

setTimeout(gene, 600)

function keyAndBoss() {
    let rnd = Math.floor(Math.random() * monsterPos.length)
    monsterPos[rnd].gotkey = true;
    monsterPos.push(new Boss(720, 720, bossname))
}

setTimeout(keyAndBoss, 610)

export function drwMonst() {
    for (let i = 0; i < monsterPos.length; i++) {
        let xcoord = monsterPos[i].posX;
        let ycoord = monsterPos[i].posY


        if (mapstyle == 3) {
            if (monsterPos[i].boss == true && monsterPos[i].alive == true) {
                ctx.drawImage(skellking, xcoord, ycoord, 80, 80)
            }
            if (monsterPos[i].boss == true && monsterPos[i].alive == false) {
                ctx.drawImage(skellbossdead, xcoord, ycoord, 80, 80)
            }
            if (monsterPos[i].boss !== true && monsterPos[i].rev == false) {
                ctx.drawImage(skelly, xcoord, ycoord, 80, 80)
            }
            if (monsterPos[i].boss !== true && monsterPos[i].rev == true) {
                ctx.drawImage(skellyrev, xcoord, ycoord, 80, 80)
            }

        }
        if (mapstyle == 2) {
            if (monsterPos[i].boss == true && monsterPos[i].alive == true) {
                ctx.drawImage(boss, xcoord, ycoord, 80, 80)
            }
            if (monsterPos[i].boss == true && monsterPos[i].alive == false) {
                ctx.drawImage(bossdead, xcoord, ycoord, 80, 80)
            }
            if (monsterPos[i].boss !== true && monsterPos[i].rev == false) {
                ctx.drawImage(piratex, xcoord, ycoord, 80, 80)
            }
            if (monsterPos[i].boss !== true && monsterPos[i].rev == true) {
                ctx.drawImage(piraterev, xcoord, ycoord, 80, 80)
            }

        }
        if (mapstyle == 1) {
            if (monsterPos[i].boss == true && monsterPos[i].alive == true) {
                ctx.drawImage(naga, xcoord, ycoord, 80, 80)
            }
            if (monsterPos[i].boss == true && monsterPos[i].alive == false) {
                ctx.drawImage(nagadead, xcoord, ycoord, 80, 80)
            }
            if (monsterPos[i].boss !== true && monsterPos[i].rev == false) {
                ctx.drawImage(minotaur, xcoord, ycoord, 80, 80)
            }
            if (monsterPos[i].boss !== true && monsterPos[i].rev == true) {
                ctx.drawImage(minotaurx, xcoord, ycoord, 80, 80)
            }

        }

    }
}


//-----------------------------------------------------------KEYBIND EVENTS----------------------------------------------------------






export function onKeyPress(event) {

    switch (event.keyCode) {
        case 37:

            if (heroin.bossKill == true && heroin.gotkey == "done") {
                heroin.posX = 0;
                heroin.posY = 0;
                reMap()
                finishLevel()
                break;
            }
            heroin.moveLeft()
            break;

        case 38:
            if (heroin.bossKill == true && heroin.gotkey == "done") {
                heroin.posX = 0;
                heroin.posY = 0;
                reMap()
                finishLevel()
                break;
            }

            heroin.moveUp()
            break;


        case 39:
            if (heroin.bossKill == true && heroin.gotkey == "done") {
                heroin.posX = 0;
                heroin.posY = 0;
                reMap()
                finishLevel()
                break;
            }
            heroin.moveRight()
            break;


        case 40:


            if (heroin.bossKill == true && heroin.gotkey == "done") {
                heroin.posX = 0;
                heroin.posY = 0;
                reMap()
                finishLevel()
                break;
            }
            heroin.moveDown()
            break;


        case 32:
            if (heroin.bossKill == true && heroin.gotkey == "done") {
                heroin.posX = 0;
                heroin.posY = 0;
                reMap()
                finishLevel()
                break
            }

            if (heroin.rev == false) {
                atkRight()
            }
            if (heroin.rev == true) {
                atkLeft()
            }
            heroin.clearDead()
            if (heroin.oppId !== null) {
                heroin.attack(monsterPos[heroin.oppId])
            }

            break;


        case 67:
            if (heroin.bossKill == true && heroin.gotkey == "done") {
                heroin.posX = 0;
                heroin.posY = 0;
                reMap()
                finishLevel()
                break
            }
            axeThrow()


            break;







    }
}

document.body.addEventListener('keydown', onKeyPress);


//----------------------------------------------------MAP COMPLETE -- PREPARATION NEW MAP----------------------------------------------------------------------



export function repositionhero() {
    heroin.posX = 0;
    heroin.posY = 0;
}


export function finishLevel() {
    
    heroin.clearDead()
    maplevel++;
    repositionhero()
    heroin.gotkey = "not yet";
    heroin.bossKill = false;
    mapready = false;
    clearCtx()
    reMap()
    wallPos = [];
    monsterPos = [];
    grassFields = [];
    xline = 0;
    yline = 0;
    wallmaker()
    delaydrw()
    gene()
    keyAndBoss()
    setTimeout(clearWallsNotWalls, 13)
    setTimeout(clearWallsNotWalls, 14)
    setTimeout(clearWallsNotWalls, 15)
    setTimeout(clearWallsNotWalls, 16)
    setTimeout(clearWallsNotWalls, 17)
    setTimeout(clearWallsNotWalls, 18)
    setTimeout(makeMaze, 25)
    setTimeout(moreWallz, 30)
    setTimeout(makePotion, 32)
    setTimeout(reMap, 35)
    setTimeout(heroDraw, 40)

    if(maplevel == 30){
        if (confirm("You have completed all maps! Press OK for new game, Cancel for leave ")) {
            window.location.reload();
        } else {
            window.location = 'index.html'
        }
    }

}

//------------------------------------------------------------MAP CRAPHICS FUNCTIONS-------------------



export function reMap() {
    mapBackgrnd()
    gigachadwallfunction()
    hpPerc()
    drawPotion()
    drwMonst()
    drawDead()
  
    
}

setTimeout(reMap, 620)

function drawDead(){
    if (deadOnBoard == 1 && mapstyle == 1) {
        ctx.drawImage(minotaurdead, deadX, deadY, 80, 80)
    }
    if (deadOnBoard == 1 && mapstyle == 2) {
        ctx.drawImage(piratedead, deadX, deadY, 80, 80)
    }
    if (deadOnBoard == 1 && mapstyle == 3) {
        ctx.drawImage(dead, deadX, deadY, 80, 80)
    }
    if (deadOnBoard == 2 && mapstyle == 1) {
        ctx.drawImage(nagadead, deadX, deadY, 80, 80)
    }
    if (deadOnBoard == 2 && mapstyle == 2) {
        ctx.drawImage(bossdead, deadX, deadY, 80, 80)
    }
    if (deadOnBoard == 2 && mapstyle == 3) {
        ctx.drawImage(skellbossdead, deadX, deadY, 80, 80)
    }
}



function setHero() {
    ctx.drawImage(herox, 0, 0, 80, 80)

}
setTimeout(setHero, 625)


export function mapBackgrnd() {
    if (maplevel > 9 && maplevel < 20) {
        ctx.drawImage(pirmap, 0, 0, 800, 800)
        mapstyle = 2;
    }
    if (maplevel < 10) {
        ctx.drawImage(greenmap, 0, 0, 800, 800)
        mapstyle = 1;
    }
    if (maplevel > 19) {
        ctx.drawImage(othermap, 0, 0, 800, 800)
        mapstyle = 3;
    }
}



//calculating what pattern should pick for wall textures from a lot of avalaible wall patterns



export function gigachadwallfunction() {
    for (let i = 0; i < wallPos.length; i++) {
        let left = false;
        let right = false;
        let top = false;
        let bottom = false;

        let x = wallPos[i].posX;
        let y = wallPos[i].posY;


        for (let k = 0; k < wallPos.length; k++) {
            let a = wallPos[k].posX
            let b = wallPos[k].posY

            if (x + 80 == a && y == b || x == 720) {
                right = true
            }
            if (x - 80 == a && y == b || x == 0) {
                left = true
            }
            if (y + 80 == b && x == a || y == 720) {
                bottom = true
            }
            if (y - 80 == b && x == a || y == 0) {
                top = true
            }
        }

        //fulltexture     
        if (left == true && right == true && top == true && bottom == true) {
            ctx.drawImage(wall, x, y, 80, 80)
        }


        //round2


        if (left == true && right == false && top == false && bottom == false) {
            ctx.drawImage(around, x, y, 80, 80)

        }
        if (left == false && right == true && top == false && bottom == false) {
            ctx.drawImage(roar, x, y, 80, 80)

        }
        if (left == false && right == false && top == false && bottom == true) {
            ctx.drawImage(upster, x, y, 80, 80)

        }
        if (left == false && right == false && top == true && bottom == false) {
            ctx.drawImage(mokks, x, y, 80, 80)

        }
        //round1


        if (left == true && right == false && top == true && bottom == false) {
            ctx.drawImage(btrightc, x, y, 80, 80)

        }

        if (left == false && right == true && top == true && bottom == false) {
            ctx.drawImage(pomp, x, y, 80, 80)

        }
        //round3

        if (left == true && right == true && top == true && bottom == false) {
            ctx.drawImage(tops, x, y, 80, 80)

        }
        if (left == true && right == false && top == true && bottom == true) {
            ctx.drawImage(frico, x, y, 80, 80)

        }
        if (left == true && right == true && top == false && bottom == true) {
            ctx.drawImage(bottoms, x, y, 80, 80)

        }
        if (left == false && right == true && top == true && bottom == true) {
            ctx.drawImage(rights, x, y, 80, 80)

        }


        if (left == true && right == true && top == false && bottom == false) {
            ctx.drawImage(wlnope, x, y, 80, 80)

        }

        if (left == false && right == false && top == true && bottom == true) {
            ctx.drawImage(wlmore, x, y, 80, 80)

        }


        if (left == false && right == true && top == false && bottom == true) {
            ctx.drawImage(many, x, y, 80, 80)

        }
        if (left == true && right == false && top == false && bottom == true) {
            ctx.drawImage(fricks, x, y, 80, 80)

        }

        if (left == false && right == false && top == false && bottom == false) {
            ctx.drawImage(allcut, x, y, 80, 80)

        }






    }
}




//----------------------------------------------CREATE MAZE IF THE GENERATED MAP TOO LOW ON WALLS AND MAKING NEW MONSTERS FOR IT-----------------------------------

export function makeMaze() {
    let chck = false;
    for (let i = 0; i < wallPos.length; i++) {
        if (wallPos[i].posX > 0 && wallPos[i].posX < 720 && wallPos[i].posY > 0 && wallPos[i].posY < 720) {
            chck = true;
        }
    }

    if (chck == false) {
        createWall(160, 160)
        createWall(240, 160)
        createWall(320, 160)
        createWall(480, 160)
        createWall(560, 160)
        createWall(160, 240)
        createWall(560, 240)
        createWall(160, 320)
        createWall(320, 320)
        createWall(480, 320)
        createWall(560, 320)
        createWall(160, 560)
        createWall(240, 560)
        createWall(320, 560)
        createWall(400, 560)
        createWall(480, 560)
        createWall(480, 480)
        createWall(560, 480)
        createWall(240, 320)
        createWall(320, 400)
        createWall(480, 80)

        monsterPos = [];
        createMob(480, 640, mobname)
        createMob(240, 240, mobname)
        createMob(480, 240, mobname)
        createMob(320, 480, mobname)
        keyAndBoss()

    }
}

//----------------------------------------IF COULD NOT CREATE MAZE, DUE MID POSITIONED FEW RANDOM WALLS, MAKING SOME WALLS ON EDGES

function moreWallz() {
    if (wallPos.length < 7) {
        createWall(480, 480)
        createWall(560, 480)
        createWall(240, 320)
        createWall(320, 400)
        createWall(480, 80)

        
        createWall(0, 320)
        createWall(0, 400)
        createWall(0, 480)
        createWall(0, 560)
        createWall(0, 640)
        createWall(0, 720)
        createWall(80, 640)
        createWall(80, 720)
        createWall(160, 720)
        createWall(240, 720)
        createWall(240, 0)
        createWall(320, 0)
        createWall(400, 0)
        createWall(480, 0)
        createWall(560, 0)
        createWall(640, 0)
        createWall(720, 0)
        createWall(640, 80)
        createWall(720, 80)
        createWall(720, 160)





    }


}

function beginGame() {
    setInterval(mvMonsters, 3000)
    setInterval(heroDraw,3000)
}


setTimeout(moreWallz, 618)

setTimeout(heroDraw, 640)

setTimeout(makePotion, 700)

setTimeout(drawPotion, 800)

setTimeout(beginGame, 999)