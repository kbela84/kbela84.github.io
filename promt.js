import { heroin } from "./heromaker.js";

function mfc() {
    let person = prompt("Please enter your name:", "Jozsi");
    if (person == null || person == "") {
        heroin.name = "mike"
    } else {
        heroin.name = person


    }
}
mfc()