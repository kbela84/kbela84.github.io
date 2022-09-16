import { heroin } from "./heromaker.js";

var r = document.querySelector(':root');


export function hpPerc(){
    let calchealth = heroin.health/heroin.maxhealth *100
    let percentage = Math.round(calchealth)
    if(calchealth < 30)
    {
        r.style
        .setProperty('--healthcolor', 'red')
    }
    if(calchealth >= 30 && calchealth < 70)
    {
        r.style
        .setProperty('--healthcolor', 'yellow')
    }
    if(calchealth >= 70)
    {
        r.style
        .setProperty('--healthcolor', 'green')
    }

if(percentage < 100){
    document.getElementById('healthbar').innerHTML = "&nbsp" + percentage + "%"
    document.getElementById('healthtxt').innerHTML = "HP"
}
else{
    document.getElementById('healthbar').innerHTML = percentage + "%"
    document.getElementById('healthtxt').innerHTML = "HP"
}
    
}


export function heroPower(){
  
    if(heroin.ulti == 0){
        r.style
        .setProperty('--ultibarx', '5%')
        r.style
        .setProperty('--bardisp', '0') 
        r.style
        .setProperty('--txtdisp', 'none')

    }
    if(heroin.ulti == 1){
        r.style
        .setProperty('--ultibarx', '15%')
    }
    if(heroin.ulti == 2){
        r.style
        .setProperty('--ultibarx', '30%')
    }
    if(heroin.ulti == 3){
        r.style
        .setProperty('--ultibarx', '45%')
    }
    if(heroin.ulti == 4){
        r.style
        .setProperty('--ultibarx', '60%')
    }
    if(heroin.ulti == 5){
        r.style
        .setProperty('--ultibarx', '75%')
    }
    if(heroin.ulti == 6){
        r.style
        .setProperty('--ultibarx', '85%')
    }
    if(heroin.ulti == 7){
        r.style
        .setProperty('--ultibarx', '98%')
        r.style
        .setProperty('--bardisp', '60%')
        r.style
        .setProperty('--txtdisp', 'initial')
    }
}