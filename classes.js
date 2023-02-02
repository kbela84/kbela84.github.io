import { monsterPos } from "./pumper.js";
import { wallPos } from "./pumper.js";
import { maplevel } from "./pumper.js";
import { heroin } from "./heromaker.js";
import { mapready } from "./pumper.js";
import { grassFields } from "./pumper.js";
import { xline } from "./pumper.js";
import { yline } from "./pumper.js";
import { clearwalls } from "./pumper.js";
import { finishLevel } from "./pumper.js";
import { statusBar } from "./pumper.js";
import { reMap } from "./pumper.js";
import { gigachadwallfunction } from "./pumper.js";
import { drwMonst } from "./pumper.js";
import { mapBackgrnd } from "./pumper.js";
import { heroPower, hpPerc } from "./cssmod.js";
import { mapstyle } from "./pumper.js";


export const canvas = document.querySelector('canvas');
export const ctx = canvas.getContext('2d');


var r = document.querySelector(':root');

function visible() {
    r.style
    .setProperty('--mobdisp', 'initial')
    if(mapstyle == 1){
        r.style
        .setProperty('--minopict', 'initial')
        r.style
        .setProperty('--skellypict', 'none')
        r.style
        .setProperty('--piratepict', 'none')
    }
    if(mapstyle == 2){
        r.style
        .setProperty('--piratepict', 'initial')
        r.style
        .setProperty('--skellypict', 'none')
        r.style
        .setProperty('--minopict', 'none')
       
    }
    if(mapstyle == 3){
        r.style
        .setProperty('--skellypict', 'initial')
        r.style
        .setProperty('--minopict', 'none')
        r.style
        .setProperty('--piratepict', 'none')
    }
   
}

function invisible() {
    r.style
        .setProperty('--mobdisp', 'none')
}

function bossvisible() {
    r.style
        .setProperty('--bossdisp', 'initial')
        if(mapstyle == 1){
            r.style
            .setProperty('--nagabig', 'initial')
            r.style
            .setProperty('--bosspict', 'none')
            r.style
            .setProperty('--skellbosspict', 'none')
        }
        if(mapstyle == 2){
            r.style
            .setProperty('--bosspict', 'initial')
            r.style
            .setProperty('--nagabig', 'none')
            r.style
            .setProperty('--skellbosspict', 'none')
        }
        if(mapstyle == 3){
            r.style
            .setProperty('--skellbosspict', 'initial')
            r.style
            .setProperty('--bosspict', 'none')
            r.style
            .setProperty('--nagabig', 'none')
        }
}

function bossinvisible() {
    r.style
        .setProperty('--bossdisp', 'none')
}



export let deadX = 0;
export let deadY = 0;
export let deadOnBoard = 0;

//----------------------------------------------------------------------------------------THE HERO---------------------------------------------------------------------------

class Hero {

    level = 1;
    posX = 0;
    posY = 0;
    charged = false;
    rev = false;
    health = Math.floor(Math.random() * 6 + 1) * 5 + 20;
    maxhealth = 0;
    DP = Math.floor(Math.random() * 6 + 1) * 2;
    SP = Math.floor(Math.random() * 6 + 1) + 5;
    damdone = 0;
    damtaken = 0;
    killcount = 0;
    ulti = 0;
    gotkey = "not yet";
    bossKill = false;
    oppId = null;
    stepcount = 0;

    constructor(name) {
        this.name = name;

    }


    levelUp() {
        this.level += 1;
        this.maxhealth += Math.floor(Math.random() * 6 + 1) * 6
        this.DP += Math.floor(Math.random() * 6 + 1) + 2
        this.SP += Math.floor(Math.random() * 6 + 1) + 1

        let calcx = Math.floor(Math.random() * 9 + 1)

        if (calcx > 0 && calcx < 5) {
            this.health += Math.round(this.maxhealth / 3)
        }
        if (calcx > 4 && calcx < 10) {
            this.health += Math.round(this.maxhealth / 10)
        }
        if (calcx == 10) {
            this.health += (this.maxhealth - this.health)
        }
        if (this.health > this.maxhealth) {
            this.health -= (this.health - this.maxhealth)
        }
    }

    clearDead() {
        if (deadOnBoard == 1 || deadOnBoard == 2) {
            deadX = -140;
            deadY = -140;
            reMap()
            deadOnBoard = 0;
        }
    }



    heroDead() {
        this.health = 0;
        statusBar()
        clearHero()
        hpPerc()
        ctx.drawImage(herodead, this.posX, this.posY, 80, 80)
        
        if (confirm("Game Over!  Press 'Ok' to Restart, and Cancel to exit")) {
            window.location.reload();
        } else {
            window.location = 'index.html'
        }
    }

    attack(opponent) {
        while (this.health > 0 && opponent.health > 0) {
            let SV = Math.floor(Math.random() * 6 + 1) * 2 + this.SP
            if (SV > opponent.DP) {
                let dmg = SV - opponent.DP
                opponent.health = opponent.health - dmg;
                this.damdone += Math.round(dmg)
            }
            if (opponent.health > 0) {
                let OV = Math.floor(Math.random() * 6 + 1) * 2 + opponent.SP
                if (OV > this.DP) {
                    let damtkn = OV - this.DP
                    this.health = this.health - damtkn;
                    this.damtaken += Math.round(damtkn);
                }
            }
            if (this.health < 1) {
                this.heroDead()
            }
            if (monsterPos[this.oppId].health < 1) {
                if (monsterPos[this.oppId].gotkey == true) {
                    this.gotkey = "done";
                }
                monsterPos[this.oppId].health = 0;
                if (monsterPos[this.oppId].boss == true) {
                    boStatus(monsterPos[this.oppId])
                    monsterPos[this.oppId].alive = false;
                    this.bossKill = true;
                    this.levelUp();
                }
                else {
                    mobStatus(monsterPos[this.oppId])
                }
                monsterPos[this.oppId].death()
                monsterPos.splice(this.oppId, 1);
                reMap()
                heroDraw()
                this.killcount += 1;
                heroin.ulti ++;
                heroPower();

                if(this.ulti == 7){
                    this.charged = true;
                }
                this.oppId = null;

            }
        }
    }
    //-------MOVEMENT----IF RISK STAYS 0 AFTER CALCULATIONS, THEN THE HERO WILL TAKE THE STEP, IF RISK IS 1 BY ANY REASON, IT CANNOT STEP.
    moveRight() {
        reMap()
        this.rev = false;
        heroDraw()
        let risk = 0;
        for (let i = 0; i < wallPos.length; i++) {
            if (this.posX + 80 == wallPos[i].posX && this.posY == wallPos[i].posY) {
                risk = 1;
            }
        }

        for (let i = 0; i < monsterPos.length; i++) {
            if (this.posX + 80 == monsterPos[i].posX && this.posY == monsterPos[i].posY) {
                if (monsterPos[i].boss == true) {
                    invisible()
                    boStatus(monsterPos[i])
                    bossvisible()
                }
                else {
                    bossinvisible()
                    mobStatus(monsterPos[i])
                    visible()
                }
                risk = 1;
                heroDraw()
                this.oppId = i;
            }
        }
        if (poti.length > 1 && this.posX + 80 == poti[1].posX && this.posY == poti[1].posY && risk == 0) {

            drink()
        }


        if (this.posX < 720 && risk == 0) {
            bossinvisible()
            invisible()
            this.rev = false;
            this.posX += 80;
            this.oppId = null;
            clearHero()
            heroDrawRight()
            heroin.clearDead()
            this.stepcount++
            if (this.stepcount % 2 == 0) {
                mvMonsters()
            }
        }

    }



    moveLeft() {
        reMap()
        this.rev = true;
        heroDraw()
        let risk = 0;
        for (let i = 0; i < wallPos.length; i++) {
            if (this.posX - 80 == wallPos[i].posX && this.posY == wallPos[i].posY) {
                risk = 1;
            }
        }
        for (let i = 0; i < monsterPos.length; i++) {
            if (this.posX - 80 == monsterPos[i].posX && this.posY == monsterPos[i].posY) {
                if (monsterPos[i].boss == true) {
                    invisible()
                    boStatus(monsterPos[i])
                    bossvisible()
                }
                else {
                    bossinvisible()
                    mobStatus(monsterPos[i])
                    visible()
                }
                risk = 1;
                heroDraw()
                this.oppId = i;
            }
        }
        if (poti.length > 1 && this.posX - 80 == poti[1].posX && this.posY == poti[1].posY && risk == 0) {

            drink()
        }

        if (this.posX > 0 && risk == 0) {
            bossinvisible()
            invisible()
            this.rev = true;
            this.oppId = null;
            this.posX -= 80;
            clearHero()
            heroDrawLeft()
            heroin.clearDead()
            this.stepcount++
            if (this.stepcount % 2 == 0) {
                mvMonsters()
            }
        }
    }


    moveDown() {
        reMap()
        heroDraw()
        let risk = 0;
        for (let i = 0; i < wallPos.length; i++) {
            if (this.posY + 80 == wallPos[i].posY && this.posX == wallPos[i].posX) {
                risk = 1;
            }
        }
        for (let i = 0; i < monsterPos.length; i++) {
            if (this.posY + 80 == monsterPos[i].posY && this.posX == monsterPos[i].posX) {
                if (monsterPos[i].boss == true) {
                    invisible()
                    boStatus(monsterPos[i])
                    bossvisible()
                }
                else {
                    bossinvisible()
                    mobStatus(monsterPos[i])
                    visible()
                }
                risk = 1;
                reMap()
                heroDraw()
                this.oppId = i;
            }
        }
        if (poti.length > 1 && this.posX == poti[1].posX && this.posY + 80 == poti[1].posY && risk == 0) {

            drink()
        }


        if (this.posY < 720 && risk == 0) {
            bossinvisible()
            invisible()
            this.oppId = null;
            this.posY += 80;
            heroin.clearDead()
            clearHero()
            heroDrawDown()
            this.stepcount++
            if (this.stepcount % 2 == 0) {
                mvMonsters()
            }

        }
    }


    moveUp() {
        reMap()
        heroDraw()
        let risk = 0;
        for (let i = 0; i < wallPos.length; i++) {
            if (this.posY - 80 == wallPos[i].posY && this.posX == wallPos[i].posX) {
                risk = 1;
            }
        }
        for (let i = 0; i < monsterPos.length; i++) {
            if (this.posY - 80 == monsterPos[i].posY && this.posX == monsterPos[i].posX) {
                if (monsterPos[i].boss == true) {
                    invisible()
                    boStatus(monsterPos[i])
                    bossvisible()
                }
                else {
                    bossinvisible()
                    mobStatus(monsterPos[i])
                    visible()
                }
                risk = 1;
                reMap()
                heroDraw()
                this.oppId = i;
            }
        }
        if (poti.length > 1 && this.posX == poti[1].posX && this.posY - 80 == poti[1].posY && risk == 0) {

            drink()
        }

        if (this.posY > 0 && risk == 0) {

            bossinvisible()
            invisible()
            this.oppId = null;
            this.posY -= 80;
            heroin.clearDead()
            clearHero()
            heroDrawUp()
            this.stepcount++
            if (this.stepcount % 2 == 0) {
                mvMonsters()
            }


        }
    }
}

export { Hero };


//-------------------------------------------------------------------------------MONSTERS----------------------------------------------------------------




class Skeletons {
    level = maplevel;
    rev = false;
    gotkey = false;
    boss = false;
    direction = null;
    health = Math.floor(Math.random() * 6 + 1) * 3 * this.level;
    maxhealth = this.health;
    DP = Math.floor(Math.random() * 6 + 1) * (this.level) / 2
    SP = Math.floor(Math.random() * 6 + 1) * this.level
    steps = [];



    constructor(posX, posY, name) {
        this.posX = posX;
        this.posY = posY;
        this.name = name;
    }


    atxHero() {
        let mposID = 0;
        for (let i = 0; i < monsterPos.length; i++) {
            if (this.posX == monsterPos[i].posX && this.posY == monsterPos[i].posY) {
                mposID = i;
            }
        }

        while (this.health > 0 && heroin.health > 0) {
            let SV = Math.floor(Math.random() * 6 + 1) * 2 + this.SP
            if (SV > heroin.DP) {
                let dmg = SV - heroin.DP
                heroin.health = heroin.health - dmg;
                heroin.damtaken += Math.round(dmg)
            }
            if (heroin.health > 0) {
                let OV = Math.floor(Math.random() * 6 + 1) * 2 + heroin.SP
                if (OV > this.DP) {
                    let damtkn = OV - this.DP
                    this.health = this.health - damtkn;
                    heroin.damdone += Math.floor(damtkn)
                }
            }
            if (heroin.health < 1) {
                heroin.heroDead()
            }
            if (this.health < 1) {
                this.health = 0;
                if (this.gotkey == true) {
                    heroin.gotkey = "done";
                }
                bossinvisible()
                mobStatus(monsterPos[mposID])
                visible()
                monsterPos[mposID].death()
                monsterPos.splice(mposID, 1);
                reMap()
                heroin.killcount += 1;
                heroin.ulti ++;
                heroPower()
                if(heroin.ulti == 7){
                    heroin.charged = true;
                }
                heroin.oppId = null;
                if (heroin.bossKill == true && heroin.gotkey == "done") {
                    invisible()
                }
            }
        }
    }


    death() {
        reMap()
        ctx.drawImage(dead, this.posX, this.posY, 80, 80)
        heroDraw()
        deadX = this.posX;
        deadY = this.posY;
        deadOnBoard = 1;
    }


//--------------------------------------MONSTER MOVEMENT FUNCTION BASED ON MAIN AND ALTERNATIVE POSSIBLE DIRECTIONS---------------------
    stepByStep() {
        let upx = 0;
        let downx = 0;
        let leftx = 0;
        let rightx = 0;

        let upalt = 0;
        let downalt = 0;
        let leftalt = 0;
        let rightalt = 0;


        //LEFT TO MOVE
        let risk = 0;

        if (this.posX - 80 < 0) {
            risk = 1;
        }
        for (let i = 0; i < wallPos.length; i++) {
            if (this.posX - 80 == wallPos[i].posX && this.posY == wallPos[i].posY) {
                risk = 1;
            }

        }
        for (let i = 0; i < monsterPos.length; i++) {
            if (this.posX - 80 == monsterPos[i].posX && this.posY == monsterPos[i].posY) {
                risk = 1;
            }
        }

        if (this.posX - 80 == heroin.posX && this.posY == heroin.posY) {
            risk = 1;
        }
        if (this.posX - 80 == this.steps[0] && this.posY == this.steps[1] && risk == 0 || this.posX - 80 == this.steps[2] && this.posY == this.steps[3] && risk == 0 ||
            this.posX - 80 == this.steps[4] && this.posY == this.steps[5] && risk == 0 || this.posX - 80 == this.steps[6] && this.posY == this.steps[7] && risk == 0) {
            risk = 1;
            leftalt = 1;
        }

        if (risk == 0) {
            leftx = true;
        }

        //RIGHT TO MOVE
        risk = 0;

        if (this.posX + 80 > 720) {
            risk = 1;
        }
        for (let i = 0; i < wallPos.length; i++) {
            if (this.posX + 80 == wallPos[i].posX && this.posY == wallPos[i].posY) {
                risk = 1;
            }

        }
        for (let i = 0; i < monsterPos.length; i++) {
            if (this.posX + 80 == monsterPos[i].posX && this.posY == monsterPos[i].posY) {
                risk = 1;
            }
        }
        if (this.posX + 80 == heroin.posX && this.posY == heroin.posY) {
            risk = 1;
        }
        if (this.posX + 80 == this.steps[0] && this.posY == this.steps[1] && risk == 0 || this.posX + 80 == this.steps[2] && this.posY == this.steps[3] && risk == 0 ||
            this.posX + 80 == this.steps[4] && this.posY == this.steps[5] && risk == 0 || this.posX + 80 == this.steps[6] && this.posY == this.steps[7] && risk == 0) {
            risk = 1;
            rightalt = 1;
        }
        if (risk == 0) {
            rightx = true;
        }

        //DOWN TO MOVE
        risk = 0;

        if (this.posY + 80 > 720) {
            risk = 1;
        }
        for (let i = 0; i < wallPos.length; i++) {
            if (this.posY + 80 == wallPos[i].posY && this.posX == wallPos[i].posX) {
                risk = 1;
            }

        }
        for (let i = 0; i < monsterPos.length; i++) {
            if (this.posY + 80 == monsterPos[i].posY && this.posX == monsterPos[i].posX) {
                risk = 1;
            }

        }

        if (this.posY + 80 == heroin.posY && this.posX == heroin.posX) {
            risk = 1;
        }
        if (this.posY + 80 == this.steps[1] && this.posX == this.steps[0] && risk == 0 || this.posY + 80 == this.steps[3] && this.posX == this.steps[2] && risk == 0 ||
            this.posY + 80 == this.steps[5] && this.posX == this.steps[4] && risk == 0 || this.posY + 80 == this.steps[7] && this.posX == this.steps[6] && risk == 0) {
            risk = 1;
            downalt = 1;
        }

        if (risk == 0) {
            downx = true;
        }


        //UP TO MOVE
        risk = 0;

        if (this.posY - 80 < 0) {
            risk = 1;
        }
        for (let i = 0; i < wallPos.length; i++) {
            if (this.posY - 80 == wallPos[i].posY && this.posX == wallPos[i].posX) {
                risk = 1;
            }

        }
        for (let i = 0; i < monsterPos.length; i++) {
            if (this.posY - 80 == monsterPos[i].posY && this.posX == monsterPos[i].posX) {
                risk = 1;
            }
        }
        if (this.posY - 80 == heroin.posY && this.posX == heroin.posX) {
            risk = 1;
        }
        if (this.posY - 80 == this.steps[1] && this.posX == this.steps[0] && risk == 0 || this.posY - 80 == this.steps[3] && this.posX == this.steps[2] && risk == 0 ||
            this.posY - 80 == this.steps[5] && this.posX == this.steps[4] && risk == 0 || this.posY - 80 == this.steps[7] && this.posX == this.steps[6] && risk == 0) {
            risk = 1;
            upalt = 1;
        }

        if (risk == 0) {
            upx = true;
        }
        //CALCULATING DIRECTION TOWARDS THE HERO AND MAKE THE STEP, BY TRYING TO AVOID MOVEMENT LOOPS TO LOWER THE CHANCE OF STRUCK BY USING ALT(ALTERNATIVE PATH), AND INCREASE THE CHANCE OF CATCHING HERO
        let found = 0;
        if (this.posX >= heroin.posX && leftx == true && found == 0 && this.posY >= heroin.posY && upx == true) {
            let choose = Math.floor(Math.random() * 2)
            if (choose == 0) {
                reMap()
                if (this.steps.length > 6) {
                    this.steps.splice(0,2)
                }
                this.steps.push(this.posX)
                this.steps.push(this.posY)
                this.posX -= 80;
                this.rev = false;
                reMap()
                found = 1;

            }
            if (choose == 1) {
                reMap()
                if (this.steps.length > 6) {
                    this.steps.splice(0,2)
                }
                this.steps.push(this.posX)
                this.steps.push(this.posY)
                this.posY -= 80;
                reMap()
                found = 1;
            }
        }
        if (this.posX >= heroin.posX && leftx == true && found == 0 && this.posY >= heroin.posY && rightx == true) {
            let choose = Math.floor(Math.random() * 4)
            if (choose == 1) {
                reMap()
                if (this.steps.length > 6) {
                    this.steps.splice(0,2)
                }
                this.steps.push(this.posX)
                this.steps.push(this.posY)
                this.posX += 80;
                this.rev = true;
                reMap()
                found = 1;
            }
            else {
                reMap()
                if (this.steps.length > 6) {
                    this.steps.splice(0,2)
                }
                this.steps.push(this.posX)
                this.steps.push(this.posY)
                this.posX -= 80;
                this.rev = false;
                reMap()
                found = 1;

            }

        }



        if (this.posX > heroin.posX && leftx == true && found == 0) {
            reMap()
            if (this.steps.length > 6) {
                this.steps.splice(0,2)
            }
            this.steps.push(this.posX)
            this.steps.push(this.posY)
            this.posX -= 80;
            this.rev = false;
            reMap()
            found = 1;
        }
        if (this.posY > heroin.posY && upx == true && found == 0) {
            reMap()
            if (this.steps.length > 6) {
                this.steps.splice(0,2)
            }
            this.steps.push(this.posX)
            this.steps.push(this.posY)
            this.posY -= 80;
            reMap()
            found = 1;
        }
        if (this.posX < heroin.posX && rightx == true && found == 0) {
            reMap()
            if (this.steps.length > 6) {
                this.steps.splice(0,2)
            }
            this.steps.push(this.posX)
            this.steps.push(this.posY)
            this.posX += 80;
            this.rev = true;
            reMap()
            found = 1;
        }

        if (this.posY < heroin.posY && downx == true && found == 0) {
            reMap()
            if (this.steps.length > 6) {
                this.steps.splice(0,2)
            }
            this.steps.push(this.posX)
            this.steps.push(this.posY)
            this.posY += 80;
            reMap()
            found = 1;
        }
        if (this.posX == heroin.posX && leftx == true && found == 0) {
            reMap()
            if (this.steps.length > 6) {
                this.steps.splice(0,2)
            }
            this.steps.push(this.posX)
            this.steps.push(this.posY)
            this.posX -= 80;
            this.rev = false;
            reMap()
            found = 1;
        }
        if (this.posX == heroin.posX && rightx == true && found == 0) {
            reMap()
            if (this.steps.length > 6) {
                this.steps.splice(0,2)
            }
            this.steps.push(this.posX)
            this.steps.push(this.posY)
            this.posX += 80;
            this.rev = true;
            reMap()
            found = 1;
        }
        if (upx == true && found == 0) {
            reMap()
            if (this.steps.length > 6) {
                this.steps.splice(0,2)
            }
            this.steps.push(this.posX)
            this.steps.push(this.posY)
            this.posY -= 80;
            reMap()
            found = 1;
        }
        if (this.posX >= heroin.posX && rightx == true && found == 0 && downx == true) {
            let choose = Math.floor(Math.random() * 2)
            if (choose == 0) {
                reMap()
                if (this.steps.length > 6) {
                    this.steps.splice(0,2)
                }
                this.steps.push(this.posX)
                this.steps.push(this.posY)
                this.posX += 80;
                this.rev = true;
                reMap()
                found = 1;

            }
            if (choose == 1) {
                reMap()
                if (this.steps.length > 6) {
                    this.steps.splice(0,2)
                }
                this.steps.push(this.posX)
                this.steps.push(this.posY)
                this.posY += 80;
                reMap()
                found = 1;
            }
        }
        if (downx == true && found == 0) {
            reMap()
            if (this.steps.length > 6) {
                this.steps.splice(0,2)
            }
            this.steps.push(this.posX)
            this.steps.push(this.posY)
            this.posY += 80;
            reMap()
            found = 1;
        }
        if (rightx == true && found == 0) {
            reMap()
            if (this.steps.length > 6) {
                this.steps.splice(0,2)
            }
            this.steps.push(this.posX)
            this.steps.push(this.posY)
            this.posX += 80;
            this.rev = true;
            reMap()
            found = 1;
        }
        if (leftx == true && found == 0) {
            reMap()
            if (this.steps.length > 6) {
                this.steps.splice(0,2)
            }
            this.steps.push(this.posX)
            this.steps.push(this.posY)
            this.posX -= 80;
            this.rev = false;
            reMap()
            found = 1;
        }
        if (rightalt == 1 && found == 0) {
            reMap()
            if (this.steps.length > 6) {
                this.steps.splice(0,2)
            }
            this.steps.push(this.posX)
            this.steps.push(this.posY)
            this.posX += 80;
            this.rev = true;
            reMap()
            found = 1;
        }
        if (leftalt == 1 && found == 0) {
            reMap()
            if (this.steps.length > 6) {
                this.steps.splice(0,2)
            }
            this.steps.push(this.posX)
            this.steps.push(this.posY)
            this.posX -= 80;
            this.rev = false;
            reMap()
            found = 1;
        }
        if (upalt == 1 && found == 0) {
            reMap()
            if (this.steps.length > 6) {
                this.steps.splice(0,2)
            }
            this.steps.push(this.posX)
            this.steps.push(this.posY)
            this.posY -= 80;
            reMap()
            found = 1;
        }
        if (downalt == 1 && found == 0) {
            reMap()
            if (this.steps.length > 6) {
                this.steps.splice(0,2)
            }

            this.steps.push(this.posX)
            this.steps.push(this.posY)
            this.posY += 80;
            reMap()
            found = 1;
        }
    }

}

export { Skeletons };

export function mvMonsters() {

    for (let i = 0; i < monsterPos.length; i++) {
        if (monsterPos[i].posX - 80 == heroin.posX && monsterPos[i].posY == heroin.posY || monsterPos[i].posX + 80 == heroin.posX && monsterPos[i].posY == heroin.posY ||
            monsterPos[i].posY - 80 == heroin.posY && monsterPos[i].posX == heroin.posX || monsterPos[i].posY + 80 == heroin.posY && monsterPos[i].posX == heroin.posX) {
            monsterPos[i].atxHero()
        }
        if (monsterPos[i].boss == false) {
            monsterPos[i].stepByStep()
        }


    }

}





class Boss {

    level = maplevel;
    rev = false;
    boss = true;
    alive = true;
    direction = null;
    health = Math.floor(Math.random() * 6 + 1) * 5 * this.level + Math.floor(Math.random() * 6 + 1)
    maxhealth = this.health;
    DP = Math.floor(Math.random() * 6 + 1) * (this.level / 2) + Math.floor(Math.random() * 6 + 1) / 2
    SP = Math.floor(Math.random() * 6 + 1) * this.level + this.level



    constructor(posX, posY, name) {
        this.posX = posX;
        this.posY = posY;
        this.name = name;
    }

    atxHero(){
        
    }

    death() {
        reMap()
        ctx.drawImage(bossdead, this.posX, this.posY, 80, 80)
        deadX = this.posX;
        deadY = this.posY;
        deadOnBoard = 2;
    }
}

export { Boss };

export function createMob(xcoord, ycoord, name) {
    monsterPos.push(new Skeletons(xcoord, ycoord, name))
}

export function createBoss(xcoord, ycoord, name) {
    ctx.drawImage(bosser, xcoord, ycoord, 80, 80)
    monsterPos.push(new Boss(xcoord, ycoord, name))
}

//--------------------------------------------------------------MAP ELEMENTS------------------------------------------------------------------------
class Grasser {
    constructor(posX, posY) {
        this.posX = posX;
        this.posY = posY;
    }
}

export { Grasser };

export function drawGrass(xcoord, ycoord) {

    grassFields.push(new Grasser(xcoord, ycoord))
}


class Wallx {
    constructor(posX, posY) {
        this.posX = posX;
        this.posY = posY;
    }
}

export function createWall(xcoord, ycoord) {
    wallPos.push(new Wallx(xcoord, ycoord))
}

export { Wallx };

export function clearCtx() {
    ctx.clearRect(0, 0, 800, 800);
}

//------------------------------------------------------HERO & MONSTER STATUSES ----------------------------------------------------


export function mobStatus(selected) {
    document.getElementById('moblevel').innerHTML = " Level " + selected.level + " Mob";
    document.getElementById('mobhealth').innerHTML = " Health Points: " + selected.health + "/" + selected.maxhealth;
    document.getElementById('mobname').innerHTML = selected.name;
    document.getElementById('mobattackrating').innerHTML = " Attack rating: " + selected.SP;
    document.getElementById('mobdefenserating').innerHTML = " Defense rating: " + selected.DP;
}

export function boStatus(selected) {
    document.getElementById('bosslevel').innerHTML = " Level " + selected.level + " Boss";
    document.getElementById('bosshealth').innerHTML = " Health Points: " + selected.health + "/" + selected.maxhealth;
    document.getElementById('bossname').innerHTML = selected.name;
    document.getElementById('bossattackrating').innerHTML = " Attack rating: " + selected.SP;
    document.getElementById('bossdefenserating').innerHTML = " Defense rating: " + selected.DP;
}


function herovisible() {
    r.style
        .setProperty('--herodisp', 'initial')
}

setTimeout(herovisible, 500)







//-------------------------------------------------------HERO ACTIONS--ANIMATIONS---GRAPHICS-------------------------------------------------

function heroDrawRight() {
    reMap() 
    setTimeout(heroShade, 5)
    setTimeout(reMap, 10)
    setTimeout(heroShade, 10)
    setTimeout(reMap, 20)
    setTimeout(heroShade, 20)
    setTimeout(reMap, 30)
    setTimeout(heroShade, 30)
    setTimeout(reMap, 40)
    setTimeout(heroShade, 40)
    setTimeout(reMap, 50)
    setTimeout(heroShade, 50)
    setTimeout(reMap, 60)
    setTimeout(heroShade, 60)
    setTimeout(reMap, 70)
    setTimeout(heroShade, 70)
    setTimeout(reMap, 80)
    setTimeout(heroShade, 80)
    setTimeout(reMap, 90)
    setTimeout(heroShade, 90)
    setTimeout(reMap, 100)
    setTimeout(heroDraw, 100)



}

function heroDrawLeft() {
    reMap() 
    setTimeout(heroShade, 5)
    setTimeout(reMap, 10)
    setTimeout(heroShade, 10)
    setTimeout(reMap, 20)
    setTimeout(heroShade, 20)
    setTimeout(reMap, 30)
    setTimeout(heroShade, 30)
    setTimeout(reMap, 40)
    setTimeout(heroShade, 40)
    setTimeout(reMap, 50)
    setTimeout(heroShade, 50)
    setTimeout(reMap, 60)
    setTimeout(heroShade, 60)
    setTimeout(reMap, 70)
    setTimeout(heroShade, 70)
    setTimeout(reMap, 80)
    setTimeout(heroShade, 80)
    setTimeout(reMap, 90)
    setTimeout(heroShade, 90)
    setTimeout(reMap, 100)
    setTimeout(heroDraw, 100)


}

function heroDrawUp() {
    reMap() 
    setTimeout(heroShadeUp, 5)
    setTimeout(reMap, 10)
    setTimeout(heroShadeUp, 10)
    setTimeout(reMap, 20)
    setTimeout(heroShadeUp, 20)
    setTimeout(reMap, 30)
    setTimeout(heroShadeUp, 30)
    setTimeout(reMap, 40)
    setTimeout(heroShadeUp, 40)
    setTimeout(reMap, 50)
    setTimeout(heroShadeUp, 50)
    setTimeout(reMap, 60)
    setTimeout(heroShadeUp, 60)
    setTimeout(reMap, 70)
    setTimeout(heroShadeUp, 70)
    setTimeout(reMap, 80)
    setTimeout(heroShadeUp, 80)
    setTimeout(reMap, 100)
    setTimeout(heroDraw, 100)


}

function heroDrawDown() {
    reMap() 
    setTimeout(heroShadeDown, 5)
    setTimeout(reMap, 10)
    setTimeout(heroShadeDown, 10)
    setTimeout(reMap, 20)
    setTimeout(heroShadeDown, 20)
    setTimeout(reMap, 30)
    setTimeout(heroShadeDown, 30)
    setTimeout(reMap, 40)
    setTimeout(heroShadeDown, 40)
    setTimeout(reMap, 50)
    setTimeout(heroShadeDown, 50)
    setTimeout(reMap, 60)
    setTimeout(heroShadeDown, 60)
    setTimeout(reMap, 70)
    setTimeout(heroShadeDown, 70)
    setTimeout(reMap, 80)
    setTimeout(heroShadeDown, 80)
    setTimeout(reMap, 100)
    setTimeout(heroDraw, 100)


}




let modif = 50;

function heroShade() {
    if (heroin.rev == false) {
        ctx.drawImage(herox, heroin.posX - modif, heroin.posY, 80, 80)
        modif -= 5;
        if (modif == 0) {
            modif = 50;
        }
    }
    else if (heroin.rev == true) {
        ctx.drawImage(herorev, heroin.posX + modif, heroin.posY, 80, 80)
        modif -= 5;
        if (modif == 0) {
            modif = 50;
        }
    }

}

let modYaxisUp = 45;

function heroShadeUp() {
    if (heroin.rev == false) {
        ctx.drawImage(herox, heroin.posX, heroin.posY + modYaxisUp, 80, 80)
        modYaxisUp -= 5;
        if (modYaxisUp == 0) {
            modYaxisUp = 45;
        }
    }
    else if (heroin.rev == true) {
        ctx.drawImage(herorev, heroin.posX, heroin.posY + modYaxisUp, 80, 80)
        modYaxisUp -= 5;
        if (modYaxisUp == 0) {
            modYaxisUp = 45;
        }
    }

}

let modYaxisDown = 45;

function heroShadeDown() {
    if (heroin.rev == false) {
        ctx.drawImage(herox, heroin.posX, heroin.posY - modYaxisDown, 80, 80)
        modYaxisDown -= 5;
        if (modYaxisDown == 0) {
            modYaxisDown = 45;
        }
    }
    else if (heroin.rev == true) {
        ctx.drawImage(herorev, heroin.posX, heroin.posY - modYaxisDown, 80, 80)
        modYaxisDown -= 5;
        if (modYaxisDown == 0) {
            modYaxisDown = 45;
        }
    }

}


function clearHero() {
    mapBackgrnd()
    gigachadwallfunction()
    drwMonst()
}

export function heroDraw() {
    if (heroin.rev == false) {
        ctx.drawImage(herox, heroin.posX, heroin.posY, 80, 80)
    }
    else if (heroin.rev == true) {
        ctx.drawImage(herorev, heroin.posX, heroin.posY, 80, 80)
    }
}



export function atkRight() {
    clearHero()
    reMap()
    setTimeout(atkRightNull, 0)
    setTimeout(reMap, 50)
    setTimeout(atkRightOne, 50)
    setTimeout(reMap, 90)
    setTimeout(atkRightTwo, 90)
    setTimeout(reMap, 130)
    setTimeout(atkRightThree, 130)
    setTimeout(reMap, 170)
    setTimeout(atkRightFour, 170)
    setTimeout(reMap, 224)
    setTimeout(atkRightFive, 225)
    setTimeout(reMap, 260)
    setTimeout(heroDraw, 265)
    setTimeout(meleeAttackRight, 275)



}

function atkRightNull() {
    ctx.drawImage(hitnull, heroin.posX, heroin.posY, 80, 80)
}

function atkRightOne() {
    ctx.drawImage(hitone, heroin.posX, heroin.posY, 80, 80)
}
function atkRightTwo() {
    ctx.drawImage(hittwo, heroin.posX, heroin.posY, 80, 80)

}
function atkRightThree() {
    ctx.drawImage(hitthree, heroin.posX, heroin.posY, 80, 80)

}

function atkRightFour() {
    ctx.drawImage(hitbugged, heroin.posX, heroin.posY, 80, 80)

}
function atkRightFive() {
    ctx.drawImage(hitfive, heroin.posX, heroin.posY, 80, 80)

}




export function atkLeft() {
    clearHero()
    reMap() 
    setTimeout(atkLeftNull, 0)
    setTimeout(reMap, 50)
    setTimeout(atkLeftOne, 50)
    setTimeout(reMap, 90)
    setTimeout(atkLeftTwo, 90)
    setTimeout(reMap, 130)
    setTimeout(atkLeftThree, 130)
    setTimeout(reMap, 170)
    setTimeout(atkLeftFour, 170)
    setTimeout(reMap, 224)
    setTimeout(atkLeftFive, 225)
    setTimeout(reMap, 260)
    setTimeout(heroDraw, 265)
    setTimeout(meleeAttackLeft, 275)


}

function atkLeftNull() {
    ctx.drawImage(punchnull, heroin.posX, heroin.posY, 80, 80)
}

function atkLeftOne() {
    ctx.drawImage(punchone, heroin.posX, heroin.posY, 80, 80)
}
function atkLeftTwo() {
    ctx.drawImage(punchtwo, heroin.posX, heroin.posY, 80, 80)

}
function atkLeftThree() {
    ctx.drawImage(punchthree, heroin.posX, heroin.posY, 80, 80)

}

function atkLeftFour() {
    ctx.drawImage(punchfour, heroin.posX, heroin.posY, 80, 80)

}
function atkLeftFive() {
    ctx.drawImage(punchfive, heroin.posX, heroin.posY, 80, 80)

}






export function axeThrow() {
    let risk = 0;
    
   
    for (let i = 0; i < wallPos.length; i++) {
        if (heroin.posX + 80 == wallPos[i].posX && heroin.posY == wallPos[i].posY) {
            risk = 1;
        }
    }


    if (heroin.charged == true && heroin.rev == false && risk == 0) {
        heroin.charged = false;
        heroin.ulti = 0;
        heroPower()
        clearHero()
        reMap()
        twAxeNull()
        setTimeout(twAxeOne, 40)
        setTimeout(reMap, 69)
        setTimeout(twAxeTwo, 70)
        setTimeout(twAxeThree, 100)
        setTimeout(twAxeFour, 130)
        setTimeout(twAxeFive, 160)
        setTimeout(twAxeSix, 190)
        setTimeout(reMap, 190)
        setTimeout(heroDraw, 190)
        setTimeout(twAxeSeven, 220)
        setTimeout(twAxeEight, 250)
        setTimeout(twAxeNine, 280)
        setTimeout(twAxeTen, 310)
        setTimeout(reMap, 315)
        setTimeout(heroDraw, 315)
        setTimeout(twAxeEleven, 320)
        setTimeout(twAxeTwelve, 350)
        setTimeout(twAxeThirteen, 380)
        setTimeout(twAxeFourTeen, 410)
        setTimeout(reMap, 420)
        setTimeout(heroDraw, 420)
        setTimeout(killOpponent, 430)
        setTimeout(reMap, 450)
        setTimeout(heroDraw, 450)


    }
    if (heroin.charged == true && heroin.rev == true && risk == 0) {
        heroin.charged = false;
        heroin.ulti = 0;
        heroPower()
        clearHero()
        reMap()
        tAxeNull()
        setTimeout(tAxeOne, 40)
        setTimeout(reMap, 69)
        setTimeout(tAxeTwo, 70)
        setTimeout(tAxeThree, 100)
        setTimeout(tAxeFour, 130)
        setTimeout(tAxeFive, 160)
        setTimeout(tAxeSix, 190)
        setTimeout(reMap, 190)
        setTimeout(heroDraw, 190)
        setTimeout(tAxeSeven, 220)
        setTimeout(tAxeEight, 250)
        setTimeout(tAxeNine, 280)
        setTimeout(tAxeTen, 310)
        setTimeout(reMap, 315)
        setTimeout(heroDraw, 315)
        setTimeout(tAxeEleven, 320)
        setTimeout(tAxeTwelve, 350)
        setTimeout(tAxeThirteen, 380)
        setTimeout(tAxeFourTeen, 410)
        setTimeout(reMap, 420)
        setTimeout(heroDraw, 420)
        setTimeout(killOpponent, 430)
        setTimeout(reMap, 450)
        setTimeout(heroDraw, 450)


    }
}

function killOpponent() {
    
    for (let i = 0; i < monsterPos.length; i++) {
        if (heroin.posX + 80 == monsterPos[i].posX && heroin.posY == monsterPos[i].posY || heroin.posX + 160 == monsterPos[i].posX && heroin.posY == monsterPos[i].posY && heroin.rev == false) {
            monsterPos[i].health = 0;
            if (monsterPos[i].gotkey == true) {
                heroin.gotkey = "done";
            }
            if (monsterPos[i].boss == true) {
                heroin.boss = "true";
            }
            if (monsterPos[i].boss == true) {
                bossvisible()
                boStatus(monsterPos[i])
                monsterPos[i].alive = false;
                heroin.bossKill = true;
                heroin.levelUp();
            }
            else {
                visible()
                mobStatus(monsterPos[i])
            }
            monsterPos[i].death()
            monsterPos.splice(i, 1)
            heroin.killcount ++; 
            heroin.ulti ++;
            heroPower()
            if(heroin.ulti == 7){
                heroin.charged = true;
            }
        }
        if (heroin.posX - 80 == monsterPos[i].posX && heroin.posY == monsterPos[i].posY || heroin.posX - 160 == monsterPos[i].posX && heroin.posY == monsterPos[i].posY && heroin.rev == true) {
            monsterPos[i].health = 0;
            if (monsterPos[i].gotkey == true) {
                heroin.gotkey = "done";
            }
            if (monsterPos[i].boss == true) {
                heroin.boss = "true";
            }
            if (monsterPos[i].boss == true) {
                bossvisible()
                boStatus(monsterPos[i])
                monsterPos[i].alive = false;
                heroin.bossKill = true;
                heroin.levelUp();
            }
            else {
                visible()
                mobStatus(monsterPos[i])
            }
            monsterPos[i].death()
            monsterPos.splice(i, 1)
            heroin.killcount ++; 
            heroin.ulti ++;
            heroPower()
            if(heroin.ulti == 7){
                heroin.charged = true;
            }
        }
    }
    
}

function meleeAttackRight(){
    for (let i = 0; i < monsterPos.length; i++) {
        if (heroin.posX + 80 == monsterPos[i].posX && heroin.posY == monsterPos[i].posY){
            heroin.oppId = i;
            heroin.attack(monsterPos[i])
        }
}
}
function meleeAttackLeft(){
    for (let i = 0; i < monsterPos.length; i++) {
        if (heroin.posX - 80 == monsterPos[i].posX && heroin.posY == monsterPos[i].posY){
            heroin.oppId = i;
            heroin.attack(monsterPos[i])
        }
}
}

function twAxeNull() {
    ctx.drawImage(thrownull, heroin.posX, heroin.posY, 80, 80)

}
function twAxeOne() {
    ctx.drawImage(throwone, heroin.posX, heroin.posY, 80, 80)

}
function twAxeTwo() {
    ctx.drawImage(throwtwo, heroin.posX, heroin.posY, 80, 80)

}
function twAxeThree() {
    ctx.drawImage(throwthree, heroin.posX, heroin.posY, 80, 80)

}
function twAxeFour() {
    ctx.drawImage(throwfour, heroin.posX + 30, heroin.posY, 80, 80)

}
function twAxeFive() {
    ctx.drawImage(throwfive, heroin.posX + 40, heroin.posY, 80, 80)

}
function twAxeSix() {
    ctx.drawImage(throwsix, heroin.posX + 50, heroin.posY, 80, 80)

}
function twAxeSeven() {
    ctx.drawImage(throwseven, heroin.posX + 70, heroin.posY, 80, 80)

}
function twAxeEight() {
    ctx.drawImage(throweight, heroin.posX + 90, heroin.posY, 80, 80)

}
function twAxeNine() {
    ctx.drawImage(thrownine, heroin.posX + 110, heroin.posY, 80, 80)

}
function twAxeTen() {
    ctx.drawImage(throwten, heroin.posX + 120, heroin.posY, 80, 80)

}
function twAxeEleven() {
    ctx.drawImage(throwsix, heroin.posX + 130, heroin.posY, 80, 80)

}
function twAxeTwelve() {
    ctx.drawImage(throweight, heroin.posX + 140, heroin.posY, 80, 80)

}
function twAxeThirteen() {
    ctx.drawImage(throwseven, heroin.posX + 150, heroin.posY, 80, 80)

}
function twAxeFourTeen() {
    ctx.drawImage(throwseven, heroin.posX + 160, heroin.posY, 80, 80)

}




function tAxeNull() {
    ctx.drawImage(tnull, heroin.posX, heroin.posY, 80, 80)

}
function tAxeOne() {
    ctx.drawImage(tone, heroin.posX, heroin.posY, 80, 80)

}
function tAxeTwo() {
    ctx.drawImage(ttwo, heroin.posX, heroin.posY, 80, 80)

}
function tAxeThree() {
    ctx.drawImage(tthree, heroin.posX, heroin.posY, 80, 80)

}
function tAxeFour() {
    ctx.drawImage(tfour, heroin.posX - 30, heroin.posY, 80, 80)

}
function tAxeFive() {
    ctx.drawImage(tfive, heroin.posX - 40, heroin.posY, 80, 80)

}
function tAxeSix() {
    ctx.drawImage(tsix, heroin.posX - 50, heroin.posY, 80, 80)

}
function tAxeSeven() {
    ctx.drawImage(tseven, heroin.posX - 70, heroin.posY, 80, 80)

}
function tAxeEight() {
    ctx.drawImage(teight, heroin.posX - 90, heroin.posY, 80, 80)

}
function tAxeNine() {
    ctx.drawImage(tnine, heroin.posX - 110, heroin.posY, 80, 80)

}
function tAxeTen() {
    ctx.drawImage(tten, heroin.posX - 120, heroin.posY, 80, 80)

}
function tAxeEleven() {
    ctx.drawImage(tsix, heroin.posX - 130, heroin.posY, 80, 80)

}
function tAxeTwelve() {
    ctx.drawImage(tweight, heroin.posX - 140, heroin.posY, 80, 80)

}
function tAxeThirteen() {
    ctx.drawImage(tseven, heroin.posX - 150, heroin.posY, 80, 80)

}
function tAxeFourTeen() {
    ctx.drawImage(tseven, heroin.posX - 160, heroin.posY, 80, 80)

}







//-------------------------------------------ITEMS-------------------------------------------------------------------------

class Potion {
    constructor(posX, posY) {
        this.posX = posX;
        this.posY = posY;
    }
}

export { Potion }

export let poti = [];

export function makePotion() {
    let potioncreated = 0
    poti = [];
    poti.push(new Potion(960, 960))
    while (potioncreated == 0) {
        let risk = 0;
        let xcoord = Math.floor(Math.random() * 6 + 2) * 80;
        let ycoord = Math.floor(Math.random() * 6 + 2) * 80;
        for (let i = 0; i < wallPos.length; i++) {
            if (wallPos[i].posX == xcoord && wallPos[i].posY == ycoord) {
                risk = 1;
            }

        }
        for (let i = 0; i < monsterPos.length; i++) {
            if (monsterPos[i].posX == xcoord && monsterPos[i].posY == ycoord) {
                risk = 1;
            }

        }
        if (risk == 0) {
            poti.push(new Potion(xcoord, ycoord))
            potioncreated = 1;
        }

    }


}

export function drawPotion() {
    if (poti.length > 1) {
        ctx.drawImage(potion, poti[1].posX, poti[1].posY, 80, 80)
    }

}

function drink() {

    poti.splice(1, 1)
    heroin.health += Math.round(heroin.maxhealth / 4)
    if (heroin.health > heroin.maxhealth) {
        heroin.health -= heroin.health - heroin.maxhealth
    }


}




