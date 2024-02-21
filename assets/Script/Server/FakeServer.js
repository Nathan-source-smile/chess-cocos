// import { MESSAGE_TYPE } from "../Common/Messages";
var MESSAGE_TYPE = require('../Common/Messages');
import { ClientCommService } from "../ClientCommService";
import { TIME_LIMIT, ALARM_LIMIT, PLAYERS, TOTAL_TIME, TOTAL_ROUND } from "../Common/Constants";
var gameVars = require("GameVars");

//--------Defining global variables----------

//--------Defining global variables----------

function copyObject(object) {
    if (!object) {
        trace("undefined object in copyObject:", object);
        return object;
    }
    return JSON.parse(JSON.stringify(object));
}

if (!trace) {
    var trace = function () {
        // console.trace(JSON.stringify(arguments));
    };
}

function checkBlack(n, values) {
    var target = values[n];
    var scopes = [];
    var x = n;

    if (target === "o") {
        x -= 8;
        if ("prnbkq".indexOf(values[x - 1]) >= 0 && x % 8 != 0) {
            scopes.push(x - 1);
        }
        if ("prnbkq".indexOf(values[x + 1]) >= 0 && x % 8 != 7) {
            scopes.push(x + 1);
        }
        if (x >= 0 && values[x] === 0) {
            scopes.push(x);
            if (x >= 40) {
                if (x - 8 >= 0 && values[x - 8] === 0) {
                    scopes.push(x - 8);
                }
            }
        }
        if (gameVars.en1 !== -1) {
            if (n % 8 !== 7 && (n + 1) === gameVars.en1) {
                scopes.push(gameVars.en1 - 8);
            }
            if (n % 8 !== 0 && (n - 1) === gameVars.en1) {
                scopes.push(gameVars.en1 - 8);
            }
        }
    }

    else if (target === "t") {
        x = n;
        x -= 8;
        while (x >= 0) {
            if (values[x] === 0) {
                scopes.push(x);
            }
            else if ("prnbqk".indexOf(values[x]) >= 0) {
                scopes.push(x);
                break;
            }
            else {
                break;
            }
            x -= 8;
        }
        x = n;
        x += 8;
        while (x < 64) {
            if (values[x] === 0) {
                scopes.push(x);
            }
            else if ("prnbqk".indexOf(values[x]) >= 0) {
                scopes.push(x);
                break;
            }
            else {
                break;
            }
            x += 8;
        }
        x = n;
        x++;
        while (x % 8 != 0) {
            if (values[x] === 0) {
                scopes.push(x);
            }
            else if ("prnbqk".indexOf(values[x]) >= 0) {
                scopes.push(x);
                break;
            }
            else {
                break;
            }
            x++;
        }
        x = n;
        x--;
        while (x % 8 != 7) {
            if (values[x] === 0) {
                scopes.push(x);
            }
            else if ("prnbqk".indexOf(values[x]) >= 0) {
                scopes.push(x);
                break;
            }
            else {
                break;
            }
            x--;
        }
    }

    else if (target === "m") {
        x = n;
        if (x % 8 > 1 && x % 8 < 6) {
            x -= 17;
            if (("prnbqk".indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                scopes.push(x);
            }
            x = n;
            x -= 15;
            if (("prnbqk".indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                scopes.push(x);
            }

            x = n;
            x -= 10;
            if (("prnbqk".indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                scopes.push(x);
            }
            x = n;
            x -= 6;
            if (("prnbqk".indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                scopes.push(x);
            }
            x = n;
            x += 6;
            if (("prnbqk".indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                scopes.push(x);
            }
            x = n;
            x += 10;
            if (("prnbqk".indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                scopes.push(x);
            }
            x = n;
            x += 15;
            if (("prnbqk".indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                scopes.push(x);
            }
            x = n;
            x += 17;
            if (("prnbqk".indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                scopes.push(x);
            }
        }
        else {
            x = n;
            if (x % 8 <= 1) {
                x = n;
                x -= 15;
                if (("prnbqk".indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                    scopes.push(x);
                }
                x = n;
                x -= 6;
                if (("prnbqk".indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                    scopes.push(x);
                }
                x = n;
                x += 10;
                if (("prnbqk".indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                    scopes.push(x);
                }
                x = n;
                x += 17;
                if (("prnbqk".indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                    scopes.push(x);
                }
            }
            x = n;
            if (x % 8 === 1) {
                x -= 17;
                if (("prnbqk".indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                    scopes.push(x);
                }
                x = n;
                x += 15;
                if (("prnbqk".indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                    scopes.push(x);
                }
            }
            if (x % 8 >= 6) {
                x = n;
                x -= 17;
                if (("prnbqk".indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                    scopes.push(x);
                }
                x = n;
                x -= 10;
                if (("prnbqk".indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                    scopes.push(x);
                }
                x = n;
                x += 6;
                if (("prnbqk".indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                    scopes.push(x);
                }
                x = n;
                x += 15;
                if (("prnbqk".indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                    scopes.push(x);
                }
            }
            x = n;
            if (x % 8 === 6) {
                x = n;
                x -= 15;
                if (("prnbqk".indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                    scopes.push(x);
                }
                x = n;
                x += 17;
                if (("prnbqk".indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                    scopes.push(x);
                }
            }
        }
    }

    else if (target === "v") {
        x = n;
        x -= 9;
        while (x >= 0 && x % 8 !== 7) {
            if (values[x] === 0) {
                scopes.push(x);
            }
            else if ("prnbqk".indexOf(values[x]) >= 0) {
                scopes.push(x);
                break;
            }
            else {
                break;
            }
            x -= 9;
        }
        x = n;
        x += 7;
        while (x < 64 && x % 8 !== 7) {
            if (values[x] === 0) {
                scopes.push(x);
            }
            else if ("prnbqk".indexOf(values[x]) >= 0) {
                scopes.push(x);
                break;
            }
            else {
                break;
            }
            x += 7;
        }
        x = n;
        x += 9;
        while (x % 8 != 0 && x % 8 !== 0) {
            if (values[x] === 0) {
                scopes.push(x);
            }
            else if ("prnbqk".indexOf(values[x]) >= 0) {
                scopes.push(x);
                break;
            }
            else {
                break;
            }
            x += 9;
        }
        x = n;
        x -= 7;
        while (x % 8 != 0) {
            if (values[x] === 0) {
                scopes.push(x);
            }
            else if ("prnbqk".indexOf(values[x]) >= 0) {
                scopes.push(x);
                break;
            }
            else {
                break;
            }
            x -= 7;
        }
    }

    else if (target === "w") {
        x = n;
        x -= 8;
        while (x >= 0) {
            if (values[x] === 0) {
                scopes.push(x);
            }
            else if ("prnbqk".indexOf(values[x]) >= 0) {
                scopes.push(x);
                break;
            }
            else {
                break;
            }
            x -= 8;
        }
        x = n;
        x += 8;
        while (x < 64) {
            if (values[x] === 0) {
                scopes.push(x);
            }
            else if ("prnbqk".indexOf(values[x]) >= 0) {
                scopes.push(x);
                break;
            }
            else {
                break;
            }
            x += 8;
        }
        x = n;
        x++;
        while (x % 8 != 0) {
            if (values[x] === 0) {
                scopes.push(x);
            }
            else if ("prnbqk".indexOf(values[x]) >= 0) {
                scopes.push(x);
                break;
            }
            else {
                break;
            }
            x++;
        }
        x = n;
        x--;
        while (x % 8 != 7) {
            if (values[x] === 0) {
                scopes.push(x);
            }
            else if ("prnbqk".indexOf(values[x]) >= 0) {
                scopes.push(x);
                break;
            }
            else {
                break;
            }
            x--;
        }
        x = n;
        x -= 9;
        while (x >= 0 && x % 8 !== 7) {
            if (values[x] === 0) {
                scopes.push(x);
            }
            else if ("prnbqk".indexOf(values[x]) >= 0) {
                scopes.push(x);
                break;
            }
            else {
                break;
            }
            x -= 9;
        }
        x = n;
        x += 7;
        while (x < 64 && x % 8 !== 7) {
            if (values[x] === 0) {
                scopes.push(x);
            }
            else if ("prnbqk".indexOf(values[x]) >= 0) {
                scopes.push(x);
                break;
            }
            else {
                break;
            }
            x += 7;
        }
        x = n;
        x += 9;
        while (x % 8 != 0 && x % 8 !== 0) {
            if (values[x] === 0) {
                scopes.push(x);
            }
            else if ("prnbqk".indexOf(values[x]) >= 0) {
                scopes.push(x);
                break;
            }
            else {
                break;
            }
            x += 9;
        }
        x = n;
        x -= 7;
        while (x % 8 != 0) {
            if (values[x] === 0) {
                scopes.push(x);
            }
            else if ("prnbqk".indexOf(values[x]) >= 0) {
                scopes.push(x);
                break;
            }
            else {
                break;
            }
            x -= 7;
        }
    }

    else if (target === "l") {
        x = n;
        x += 8;
        if (("prnbqk".indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
            scopes.push(x);
        }
        x = n;
        x -= 8;
        if (("prnbqk".indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
            scopes.push(x);
        }
        x = n;
        if (x % 8 > 0) {
            x = n;
            x -= 1;
            if (("prnbqk".indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                scopes.push(x);
            }
            x = n;
            x -= 9;
            if (("prnbqk".indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                scopes.push(x);
            }

            x = n;
            x += 7;
            if (("prnbqk".indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                scopes.push(x);
            }
        }
        x = n;
        if (x % 8 < 7) {
            x = n;
            x += 1;
            if (("prnbqk".indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                scopes.push(x);
            }
            x = n;
            x += 9;
            if (("prnbqk".indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                scopes.push(x);
            }
            x = n;
            x -= 7;
            if (("prnbqk".indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                scopes.push(x);
            }
        }
        x = n;
        if (!gameVars.ck) {
            gameVars.cl = false;
            if (!gameVars.cr2) {
                if (values[n + 1] === 0 && values[n + 2] === 0 && values[n + 3] === "t") {
                    scopes.push(x + 2);
                    gameVars.cl = true;
                }
            }
            if (!gameVars.cr1) {
                if (values[n - 1] === 0 && values[n - 2] === 0 && values[n - 3] === 0 && values[n - 4] === "t") {
                    scopes.push(x - 2);
                    gameVars.cl = true;
                }
            }
        }
        // for (var y = 0; y < 64; y++) {
        //     if ("prnbkq".indexOf(values[y]) >= 0) {
        //         var checkScp = checkWhite(y, values) || [];
        //         for (var z = 0; z < checkScp.length; z++) {
        //             if (values[checkScp[z]] === 'l') {
        //                 if (scopes.indexOf(checkScp[z]) > -1)
        //                     scopes.splice(scopes.indexOf(checkScp[z]), 1);
        //             }
        //         }
        //     }
        // }
    }
    if (scopes.length) return scopes;
}

function checkWhite(n, values) {
    var target = values[n];
    var scopes = [];
    var x = n;
    if (target === "p") {
        x += 8;
        if ("otmvlw".indexOf(values[x - 1]) >= 0 && x % 8 != 0) {
            scopes.push(x - 1);
        }
        if ("otmvlw".indexOf(values[x + 1]) >= 0 && x % 8 != 7) {
            scopes.push(x + 1);
        }
        if (x < 64 && values[x] === 0) {
            scopes.push(x);
            if (x <= 23) {
                if (x + 8 >= 0 && values[x + 8] === 0) {
                    scopes.push(x + 8);
                }
            }
        }
        if (gameVars.en2 !== -1) {
            if (n % 8 !== 7 && (n + 1) === gameVars.en2) {
                scopes.push(gameVars.en2 + 8);
            }
            if (n % 8 !== 0 && (n - 1) === gameVars.en2) {
                scopes.push(gameVars.en2 + 8);
            }
        }
    }

    else if (target === "r") {
        x = n;
        x -= 8;
        while (x >= 0) {
            if (values[x] === 0) {
                scopes.push(x);
            }
            else if ("otmvlw".indexOf(values[x]) >= 0) {
                scopes.push(x);
                break;
            }
            else {
                break;
            }
            x -= 8;
        }
        x = n;
        x += 8;
        while (x < 64) {
            if (values[x] === 0) {
                scopes.push(x);
            }
            else if ("otmvlw".indexOf(values[x]) >= 0) {
                scopes.push(x);
                break;
            }
            else {
                break;
            }
            x += 8;
        }
        x = n;
        x++;
        while (x % 8 != 0) {
            if (values[x] === 0) {
                scopes.push(x);
            }
            else if ("otmvlw".indexOf(values[x]) >= 0) {
                scopes.push(x);
                break;
            }
            else {
                break;
            }
            x++;
        }
        x = n;
        x--;
        while (x % 8 != 7) {
            if (values[x] === 0) {
                scopes.push(x);
            }
            else if ("otmvlw".indexOf(values[x]) >= 0) {
                scopes.push(x);
                break;
            }
            else {
                break;
            }
            x--;
        }
    }

    else if (target === "n") {
        x = n;
        if (x % 8 > 1 && x % 8 < 6) {
            x -= 17;
            if (("otmvlw".indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                scopes.push(x);
            }
            x = n;
            x -= 15;
            if (("otmvlw".indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                scopes.push(x);
            }

            x = n;
            x -= 10;
            if (("otmvlw".indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                scopes.push(x);
            }
            x = n;
            x -= 6;
            if (("otmvlw".indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                scopes.push(x);
            }
            x = n;
            x += 6;
            if (("otmvlw".indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                scopes.push(x);
            }
            x = n;
            x += 10;
            if (("otmvlw".indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                scopes.push(x);
            }
            x = n;
            x += 15;
            if (("otmvlw".indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                scopes.push(x);
            }
            x = n;
            x += 17;
            if (("otmvlw".indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                scopes.push(x);
            }
        }
        else {
            x = n;
            if (x % 8 <= 1) {
                x = n;
                x -= 15;
                if (("otmvlw".indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                    scopes.push(x);
                }
                x = n;
                x -= 6;
                if (("otmvlw".indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                    scopes.push(x);
                }
                x = n;
                x += 10;
                if (("otmvlw".indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                    scopes.push(x);
                }
                x = n;
                x += 17;
                if (("otmvlw".indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                    scopes.push(x);
                }
            }
            x = n;
            if (x % 8 === 1) {
                x -= 17;
                if (("otmvlw".indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                    scopes.push(x);
                }
                x = n;
                x += 15;
                if (("otmvlw".indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                    scopes.push(x);
                }
            }
            if (x % 8 >= 6) {
                x = n;
                x -= 17;
                if (("otmvlw".indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                    scopes.push(x);
                }
                x = n;
                x -= 10;
                if (("otmvlw".indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                    scopes.push(x);
                }
                x = n;
                x += 6;
                if (("otmvlw".indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                    scopes.push(x);
                }
                x = n;
                x += 15;
                if (("otmvlw".indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                    scopes.push(x);
                }
            }
            x = n;
            if (x % 8 === 6) {
                x = n;
                x -= 15;
                if (("otmvlw".indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                    scopes.push(x);
                }
                x = n;
                x += 17;
                if (("otmvlw".indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                    scopes.push(x);
                }
            }
        }
    }

    else if (target === "b") {
        x = n;
        x -= 9;
        while (x >= 0 && x % 8 !== 7) {
            if (values[x] === 0) {
                scopes.push(x);
            }
            else if ("otmvlw".indexOf(values[x]) >= 0) {
                scopes.push(x);
                break;
            }
            else {
                break;
            }
            x -= 9;
        }
        x = n;
        x += 7;
        while (x < 64 && x % 8 !== 7) {
            if (values[x] === 0) {
                scopes.push(x);
            }
            else if ("otmvlw".indexOf(values[x]) >= 0) {
                scopes.push(x);
                break;
            }
            else {
                break;
            }
            x += 7;
        }
        x = n;
        x += 9;
        while (x % 8 != 0 && x % 8 !== 0) {
            if (values[x] === 0) {
                scopes.push(x);
            }
            else if ("otmvlw".indexOf(values[x]) >= 0) {
                scopes.push(x);
                break;
            }
            else {
                break;
            }
            x += 9;
        }
        x = n;
        x -= 7;
        while (x % 8 != 0) {
            if (values[x] === 0) {
                scopes.push(x);
            }
            else if ("otmvlw".indexOf(values[x]) >= 0) {
                scopes.push(x);
                break;
            }
            else {
                break;
            }
            x -= 7;
        }
    }

    else if (target === "q") {
        x = n;
        x -= 8;
        while (x >= 0) {
            if (values[x] === 0) {
                scopes.push(x);
            }
            else if ("otmvlw".indexOf(values[x]) >= 0) {
                scopes.push(x);
                break;
            }
            else {
                break;
            }
            x -= 8;
        }
        x = n;
        x += 8;
        while (x < 64) {
            if (values[x] === 0) {
                scopes.push(x);
            }
            else if ("otmvlw".indexOf(values[x]) >= 0) {
                scopes.push(x);
                break;
            }
            else {
                break;
            }
            x += 8;
        }
        x = n;
        x++;
        while (x % 8 != 0) {
            if (values[x] === 0) {
                scopes.push(x);
            }
            else if ("otmvlw".indexOf(values[x]) >= 0) {
                scopes.push(x);
                break;
            }
            else {
                break;
            }
            x++;
        }
        x = n;
        x--;
        while (x % 8 != 7) {
            if (values[x] === 0) {
                scopes.push(x);
            }
            else if ("otmvlw".indexOf(values[x]) >= 0) {
                scopes.push(x);
                break;
            }
            else {
                break;
            }
            x--;
        }
        x = n;
        x -= 9;
        while (x >= 0 && x % 8 !== 7) {
            if (values[x] === 0) {
                scopes.push(x);
            }
            else if ("otmvlw".indexOf(values[x]) >= 0) {
                scopes.push(x);
                break;
            }
            else {
                break;
            }
            x -= 9;
        }
        x = n;
        x += 7;
        while (x < 64 && x % 8 !== 7) {
            if (values[x] === 0) {
                scopes.push(x);
            }
            else if ("otmvlw".indexOf(values[x]) >= 0) {
                scopes.push(x);
                break;
            }
            else {
                break;
            }
            x += 7;
        }
        x = n;
        x += 9;
        while (x % 8 != 0 && x % 8 !== 0) {
            if (values[x] === 0) {
                scopes.push(x);
            }
            else if ("otmvlw".indexOf(values[x]) >= 0) {
                scopes.push(x);
                break;
            }
            else {
                break;
            }
            x += 9;
        }
        x = n;
        x -= 7;
        while (x % 8 != 0) {
            if (values[x] === 0) {
                scopes.push(x);
            }
            else if ("otmvlw".indexOf(values[x]) >= 0) {
                scopes.push(x);
                break;
            }
            else {
                break;
            }
            x -= 7;
        }
    }

    else if (target === "k") {
        x = n;
        x += 8;
        if (("otmvlw".indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
            scopes.push(x);
        }
        x = n;
        x -= 8;
        if (("otmvlw".indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
            scopes.push(x);
        }
        x = n;
        if (x % 8 > 0) {
            x = n;
            x -= 1;
            if (("otmvlw".indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                scopes.push(x);
            }
            x = n;
            x -= 9;
            if (("otmvlw".indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                scopes.push(x);
            }

            x = n;
            x += 7;
            if (("otmvlw".indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                scopes.push(x);
            }
        }
        x = n;
        if (x % 8 < 7) {
            x = n;
            x += 1;
            if (("otmvlw".indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                scopes.push(x);
            }
            x = n;
            x += 9;
            if (("otmvlw".indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                scopes.push(x);
            }
            x = n;
            x -= 7;
            if (("otmvlw".indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                scopes.push(x);
            }
        }
        x = n;
        if (!gameVars.cke) {
            gameVars.cle = false;
            if (!gameVars.cr2e) {
                if (values[n + 1] === 0 && values[n + 2] === 0 && values[n + 3] === "r") {
                    scopes.push(x + 2);
                    gameVars.cle = true;
                }
            }
            if (!gameVars.cr1e) {
                if (values[n - 1] === 0 && values[n - 2] === 0 && values[n - 3] === 0 && values[n - 4] === "r") {
                    scopes.push(x - 2);
                    gameVars.cle = true;
                }
            }
        }
        // for (var y = 0; y < 64; y++) {
        //     if ("otmvwl".indexOf(values[y]) >= 0) {
        //         var checkScp = checkBlack(y, values) || [];
        //         for (var z = 0; z < checkScp.length; z++) {
        //             if (values[checkScp[z]] === 'k') {
        //                 if (scopes.indexOf(checkScp[z]) > -1)
        //                     scopes.splice(scopes.indexOf(checkScp[z]), 1);
        //             }
        //         }
        //     }
        // }
    }
    if (scopes.length) return scopes;
}

function checkWinner() {
    if (gameVars.myTurn) {
        var effects = [];
        for (var n = 0; n < 64; n++) {
            if ("prnbqk".indexOf(gameVars.values[n]) >= 0) {
                var scopes = checkWhite(n, gameVars.values) || [];
                for (var x = 0; x < scopes.length; x++) {
                    var tmp = [];
                    for (var xx = 0; xx < 64; xx++) {
                        tmp[xx] = gameVars.values[xx]
                    }
                    var effect = 0;
                    //Effect value
                    tmp[scopes[x]] = tmp[n];
                    tmp[n] = 0;
                    for (var y = 0; y < 64; y++) {
                        if ("otmvlw".indexOf(gameVars.values[y]) >= 0) {
                            var tmpScp = checkBlack(y, tmp) || [];
                            for (var z = 0; z < tmpScp.length; z++) {
                                var effectValue = tmp[tmpScp[z]];
                                if (effectValue == "k") {
                                    if (effect < 100) {
                                        effect = 100;
                                    }
                                }
                                else if (effectValue == "q") {
                                    if (effect < 50) {
                                        effect = 50;
                                    }
                                }
                                else if (effectValue == "b") {
                                    if (effect < 30) {
                                        effect = 30;
                                    }
                                }
                                else if (effectValue == "n") {
                                    if (effect < 30) {
                                        effect = 30;
                                    }
                                }
                                else if (effectValue == "r") {
                                    if (effect < 30) {
                                        effect = 30;
                                    }
                                }
                                else if (effectValue == "p") {
                                    if (effect < 15) {
                                        effect = 15;
                                    }
                                }
                            }
                        }
                    }
                    effects.push(effect);
                }
            }
        }

        var bestEffect = Math.min.apply(null, effects);

        var saveKingTemp = false;
        for (var y = 0; y < 64; y++) {
            if ("otmvwl".indexOf(gameVars.values[y]) >= 0) {
                var checkScp = checkBlack(y, gameVars.values) || [];
                for (var z = 0; z < checkScp.length; z++) {
                    if (gameVars.values[checkScp[z]] === 'k') {
                        if (!saveKingTemp) {
                            // alert('Save Enemy King');
                            saveKingTemp = true;
                        }
                    }
                }
            }
        }
        if (bestEffect >= 100 && saveKingTemp) {
            // alert("You Win");
            gameVars.winner = 0;
            gameVars.checkMate = true;
        }
    } else {
        var effects = [];
        for (var n = 0; n < 64; n++) {
            if ("otmvwl".indexOf(gameVars.values[n]) >= 0) {
                var scopes = checkBlack(n, gameVars.values) || [];
                for (var x = 0; x < scopes.length; x++) {
                    var tmp = [];
                    for (var xx = 0; xx < 64; xx++) {
                        tmp[xx] = gameVars.values[xx]
                    }
                    var effect = 0;
                    //Effect value
                    tmp[scopes[x]] = tmp[n];
                    tmp[n] = 0;
                    for (var y = 0; y < 64; y++) {
                        if ("prnbqk".indexOf(gameVars.values[y]) >= 0) {
                            var tmpScp = checkWhite(y, tmp) || [];
                            for (var z = 0; z < tmpScp.length; z++) {
                                var effectValue = tmp[tmpScp[z]];
                                if (effectValue == "l") {
                                    if (effect < 100) {
                                        effect = 100;
                                    }
                                }
                                else if (effectValue == "w") {
                                    if (effect < 50) {
                                        effect = 50;
                                    }
                                }
                                else if (effectValue == "v") {
                                    if (effect < 30) {
                                        effect = 30;
                                    }
                                }
                                else if (effectValue == "m") {
                                    if (effect < 30) {
                                        effect = 30;
                                    }
                                }
                                else if (effectValue == "t") {
                                    if (effect < 30) {
                                        effect = 30;
                                    }
                                }
                                else if (effectValue == "o") {
                                    if (effect < 15) {
                                        effect = 15;
                                    }
                                }
                            }
                        }
                    }
                    effects.push(effect);
                }
            }
        }

        var bestEffect = Math.min.apply(null, effects);

        var saveKingTemp = false;
        for (var y = 0; y < 64; y++) {
            if ("prnbkq".indexOf(gameVars.values[y]) >= 0) {
                var checkScp = checkWhite(y, gameVars.values) || [];
                for (var z = 0; z < checkScp.length; z++) {
                    if (gameVars.values[checkScp[z]] === 'l') {
                        if (!saveKingTemp) {
                            // alert('Save Your King');
                            saveKingTemp = true;
                        }
                    }
                }
            }
        }
        if (bestEffect >= 100 && saveKingTemp) {
            // alert("Enemy Win");
            gameVars.winner = 1;
            gameVars.checkMate = true;
        }
    }
}

function initHandlers() {
    ServerCommService.addRequestHandler(MESSAGE_TYPE.CS_RESTART_GAME, onStartGame);
    ServerCommService.addRequestHandler(MESSAGE_TYPE.CS_CLAIM_PASS, onPass);
    ServerCommService.addRequestHandler(MESSAGE_TYPE.CS_SELECT_TILE, onSelectTile);
    ServerCommService.addRequestHandler(MESSAGE_TYPE.CS_CLAIM_MOVE, onMoveTile);
}

function onStartGame() {
    startGame();
}

function onAskPlayer(params, room) {
    askPlayer(params, room);
}

function onPass(params, room) {
    pass(params, room);
}

function onSelectTile(params, room) {
    selectTile(params, room);
}

function onMoveTile(params, room) {
    moveTile(params, room);
}

function onInit() {
    init();
}

function init() {
    gameVars.player1_score = 0;
    gameVars.player2_score = 0;
    startGame();
}

function startGame() {
    // if (gameVars.player1_score === TOTAL_ROUND || gameVars.player2_score === TOTAL_ROUND) {
    gameVars.player1_score = 0;
    gameVars.player2_score = 0;
    // }
    gameVars.values = [
        'r', 'n', 'b', 'q', 'k', 'b', 'n', 'r',
        'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p',
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o',
        't', 'm', 'v', 'w', 'l', 'v', 'm', 't'];
    // gameVars.values = [
    //     'k', 0, 0, 0, 0, 0, 0, 0,
    //     0, 0, 0, 0, 0, 0, 'w', 0,
    //     0, 0, 0, 0, 0, 0, 0, 0,
    //     0, 0, 0, 0, 0, 0, 0, 0,
    //     0, 0, 0, 0, 0, 0, 0, 0,
    //     0, 0, 'l', 0, 0, 0, 0, 0,
    //     0, 0, 0, 0, 0, 0, 0, 0,
    //     0, 0, 0, 0, 0, 0, 0, 0,];
    gameVars.ck = false;
    gameVars.cr1 = false;
    gameVars.cr2 = false;
    gameVars.cl = false;
    gameVars.cke = false;
    gameVars.cr1e = false;
    gameVars.cr2e = false;
    gameVars.cle = false;
    gameVars.myTurn = true;
    gameVars.moveable = false;
    gameVars.moveTarget = "";
    gameVars.moveScopes = [];
    gameVars.player1_remainTime = TOTAL_TIME;
    gameVars.player2_remainTime = TOTAL_TIME;
    gameVars.currentTime = new Date();
    gameVars.winner = -1;
    gameVars.checkMate = false;
    gameVars.endGame = false;
    gameVars.p1_50 = 0;
    gameVars.p2_50 = 0;
    gameVars.en1 = -1;
    gameVars.en2 = -1;
    gameVars.history = [];

    ServerCommService.send(
        MESSAGE_TYPE.SC_START_GAME,
        {
            p1Score: gameVars.player1_score,
            p2Score: gameVars.player2_score,
        },
        [0, 1]
    );

    ServerCommService.send(
        MESSAGE_TYPE.SC_DRAW_BOARD,
        {
            board: gameVars.values,
        },
        [0, 1]
    );

    askPlayer();
}

// finish the game or mission
function gameOver() {
}

function askPlayer() {
    trace("askPlayer:", gameVars.myTurn);
    TimeoutManager.clearNextTimeout();

    TimeoutManager.setNextTimeout(function () {
        gameVars.endGame = true;
        // if (gameVars.winner === 0) {
        //     gameVars.player1_score += 1;
        // } else if (gameVars.winner === 1) {
        //     gameVars.player2_score += 1;
        // }
        ServerCommService.send(
            MESSAGE_TYPE.SC_END_GAME,
            {
                winner: gameVars.winner,
                checkMate: gameVars.checkMate,
                p1Score: gameVars.player1_score,
                p2Score: gameVars.player2_score,
                time: true,
            },
            [0, 1]
        );
    }, gameVars.myTurn ? gameVars.player1_remainTime : gameVars.player2_remainTime);

    // 50-move rule
    if (gameVars.p1_50 === 50 && gameVars.p2_50 === 50) {
        gameVars.endGame = true;
        ServerCommService.send(
            MESSAGE_TYPE.SC_END_GAME,
            {
                winner: gameVars.winner,
                checkMate: gameVars.checkMate,
                p1Score: gameVars.player1_score,
                p2Score: gameVars.player2_score,
            },
            [0, 1]
        );
        return;
    }

    // Threefold Repetition
    if (gameVars.history.length > 8) {
        var len = gameVars.history.length;
        if (JSON.stringify(gameVars.history[len - 1]) === JSON.stringify(gameVars.history[len - 5]) && JSON.stringify(gameVars.history[len - 9]) === JSON.stringify(gameVars.history[len - 5])) {
            gameVars.endGame = true;
            ServerCommService.send(
                MESSAGE_TYPE.SC_END_GAME,
                {
                    winner: gameVars.winner,
                    checkMate: gameVars.checkMate,
                    p1Score: gameVars.player1_score,
                    p2Score: gameVars.player2_score,
                },
                [0, 1]
            );
            return;
        }
    }

    // Stalemate
    if (gameVars.myTurn) {
        var sss = [];
        for (var q = 0; q < 64; q++) {
            if ('otmvwl'.indexOf(gameVars.values[q]) > -1) {
                var scopes = [];
                scopes = checkBlack(q, gameVars.values) || [];
                var exp = [];
                for (var i = 0; i < scopes.length; i++) {
                    var checkArr = [];
                    var saveKing = false;
                    for (var z = 0; z < 64; z++) {
                        checkArr[z] = gameVars.values[z];
                    }

                    checkArr[scopes[i]] = checkArr[q];
                    checkArr[q] = 0;

                    for (var y = 0; y < 64; y++) {
                        if ("prnbkq".indexOf(checkArr[y]) >= 0) {
                            var checkScp = checkWhite(y, checkArr) || [];
                            for (var z = 0; z < checkScp.length; z++) {
                                if (checkArr[checkScp[z]] === 'l') {
                                    if (!saveKing) {
                                        exp.push(i);
                                        saveKing = true;
                                    }
                                }
                            }
                        }
                    }
                }
                var result = scopes.filter(function (value, index) {
                    return exp.indexOf(index) === -1;
                });
                scopes = copyObject(result);
                for (var r = 0; r < scopes.length; r++) {
                    sss.push(scopes[r]);
                }
            }
        }
        if (sss.length === 0) {
            gameVars.endGame = true;
            ServerCommService.send(
                MESSAGE_TYPE.SC_END_GAME,
                {
                    winner: gameVars.winner,
                    checkMate: gameVars.checkMate,
                    p1Score: gameVars.player1_score,
                    p2Score: gameVars.player2_score,
                },
                [0, 1]
            );
            return;
        }
    } else {
        var sss = [];
        for (var q = 0; q < 64; q++) {
            if ('prnbqk'.indexOf(gameVars.values[q]) > -1) {
                var scopes = [];
                scopes = checkWhite(q, gameVars.values) || [];
                var exp = [];
                for (var i = 0; i < scopes.length; i++) {
                    var checkArr = [];
                    var saveKing = false;
                    for (var z = 0; z < 64; z++) {
                        checkArr[z] = gameVars.values[z];
                    }

                    checkArr[scopes[i]] = checkArr[q];
                    checkArr[q] = 0;

                    for (var y = 0; y < 64; y++) {
                        if ("tmvwlo".indexOf(checkArr[y]) >= 0) {
                            var checkScp = checkBlack(y, checkArr) || [];
                            for (var z = 0; z < checkScp.length; z++) {
                                if (checkArr[checkScp[z]] === 'k') {
                                    if (!saveKing) {
                                        exp.push(i);
                                        saveKing = true;
                                    }
                                }
                            }
                        }
                    }
                }
                var result = scopes.filter(function (value, index) {
                    return exp.indexOf(index) === -1;
                });
                scopes = copyObject(result);
                for (var r = 0; r < scopes.length; r++) {
                    sss.push(scopes[r]);
                }
            }
        }
        if (sss.length === 0) {
            gameVars.endGame = true;
            ServerCommService.send(
                MESSAGE_TYPE.SC_END_GAME,
                {
                    winner: gameVars.winner,
                    checkMate: gameVars.checkMate,
                    p1Score: gameVars.player1_score,
                    p2Score: gameVars.player2_score,
                },
                [0, 1]
            );
            return;
        }
    }

    // Dead Position
    if (gameVars.p1Score > 13 && gameVars.p2Score > 13) {
        var ttt = JSON.stringify(gameVars.values);
        if (ttt.indexOf('p') === -1 && ttt.indexOf('o') === -1 && ttt.indexOf('w') === -1 && ttt.indexOf('q') === -1 && ttt.indexOf('n') === -1 && ttt.indexOf('m') === -1) {
            gameVars.endGame = true;
            ServerCommService.send(
                MESSAGE_TYPE.SC_END_GAME,
                {
                    winner: gameVars.winner,
                    checkMate: gameVars.checkMate,
                    p1Score: gameVars.player1_score,
                    p2Score: gameVars.player2_score,
                },
                [0, 1]
            );
            return;
        }
    }

    var cuTime = new Date();
    var deltaTime = Math.floor((cuTime.getTime() - gameVars.currentTime.getTime()) / 1000);
    if (gameVars.myTurn) {
        gameVars.player2_remainTime -= deltaTime;
    } else {
        gameVars.player1_remainTime -= deltaTime;
    }
    // console.warn(deltaTime, cuTime.getTime(), gameVars.currentTime.getTime());
    gameVars.currentTime = cuTime;

    ServerCommService.send(
        MESSAGE_TYPE.SC_ASK_PLAYER,
        {
            currentPlayer: gameVars.myTurn ? 0 : 1,
            remainTime: gameVars.myTurn ? gameVars.player1_remainTime : gameVars.player2_remainTime,
        },
        [0, 1]
    );
    // TimeoutManager.setNextTimeout(function () {
    //     gameVars.myTurn = !gameVars.myTurn;
    //     askPlayer();
    // });
}

function selectTile(params, room) {
    var n = params.pos;

    var scopes;

    // var checkArr = [];
    // for (var z = 0; z < 64; z++) {
    //     checkArr[z] = gameVars.values[z];
    // }

    // checkArr[n] = checkArr[gameVars.moveTarget];
    // checkArr[gameVars.moveTarget] = 0;

    if (gameVars.myTurn) {
        scopes = checkBlack(n, gameVars.values) || [];
        // var exp = [];
        // for (var i = 0; i < scopes.length; i++) {
        //     var checkArr = [];
        //     var saveKing = false;
        //     for (var z = 0; z < 64; z++) {
        //         checkArr[z] = gameVars.values[z];
        //     }

        //     checkArr[scopes[i]] = checkArr[n];
        //     checkArr[n] = 0;

        //     for (var y = 0; y < 64; y++) {
        //         if ("prnbkq".indexOf(checkArr[y]) >= 0) {
        //             var checkScp = checkWhite(y, checkArr) || [];
        //             for (var z = 0; z < checkScp.length; z++) {
        //                 if (checkArr[checkScp[z]] === 'l') {
        //                     if (!saveKing) {
        //                         exp.push(i);
        //                         saveKing = true;
        //                     }
        //                 }
        //             }
        //         }
        //     }
        // }
        // var result = scopes.filter(function (value, index) {
        //     return exp.indexOf(index) === -1;
        // });
        // scopes = copyObject(result);
    }
    else {
        scopes = checkWhite(n, gameVars.values) || [];
        // var exp = [];
        // for (var i = 0; i < scopes.length; i++) {
        //     var checkArr = [];
        //     var saveKing = false;
        //     for (var z = 0; z < 64; z++) {
        //         checkArr[z] = gameVars.values[z];
        //     }

        //     checkArr[scopes[i]] = checkArr[n];
        //     checkArr[n] = 0;

        //     for (var y = 0; y < 64; y++) {
        //         if ("tmvwlo".indexOf(checkArr[y]) >= 0) {
        //             var checkScp = checkBlack(y, checkArr) || [];
        //             for (var z = 0; z < checkScp.length; z++) {
        //                 if (checkArr[checkScp[z]] === 'k') {
        //                     if (!saveKing) {
        //                         exp.push(i);
        //                         saveKing = true;
        //                     }
        //                 }
        //             }
        //         }
        //     }
        // }
        // var result = scopes.filter(function (value, index) {
        //     return exp.indexOf(index) === -1;
        // });
        // scopes = copyObject(result);
    }

    if (scopes.length > 0) {
        gameVars.moveable = true;
        gameVars.moveTarget = n;
        gameVars.moveScopes = scopes.join(",").split(",");
    }
    else {
    }

    ServerCommService.send(
        MESSAGE_TYPE.SC_AVAIL_CELLS,
        {
            scopes: scopes,
        },
        [0, 1]
    );
}

function moveTile(params, room) {
    console.log(params.selectPos, params.targetPos);
    var n = params.targetPos;
    if (gameVars.moveable) {
        if (gameVars.moveScopes.indexOf(String(n)) >= 0) {

            var checkArr = [];
            var saveKing = false;
            for (var z = 0; z < 64; z++) {
                checkArr[z] = gameVars.values[z];
            }

            if (gameVars.myTurn) {
                if (gameVars.en1 !== -1 && (gameVars.en1 - 8) === n && gameVars.values[gameVars.moveTarget] === 'o') {
                    checkArr[n] = checkArr[gameVars.moveTarget];
                    checkArr[gameVars.moveTarget] = 0;
                    checkArr[gameVars.en1] = 0;
                } else {
                    checkArr[n] = checkArr[gameVars.moveTarget];
                    checkArr[gameVars.moveTarget] = 0;
                }
            } else {
                if (gameVars.en2 !== -1 && (gameVars.en2 + 8) === n && gameVars.values[gameVars.moveTarget] === 'p') {
                    checkArr[n] = checkArr[gameVars.moveTarget];
                    checkArr[gameVars.moveTarget] = 0;
                    checkArr[gameVars.en2] = 0;
                } else {
                    checkArr[n] = checkArr[gameVars.moveTarget];
                    checkArr[gameVars.moveTarget] = 0;
                }
            }

            if (gameVars.myTurn) {
                for (var y = 0; y < 64; y++) {
                    if ("prnbkq".indexOf(checkArr[y]) >= 0) {
                        var checkScp = checkWhite(y, checkArr) || [];
                        for (var z = 0; z < checkScp.length; z++) {
                            if (checkArr[checkScp[z]] === 'l') {
                                if (!saveKing) {
                                    // alert('Save Your King');
                                    ServerCommService.send(
                                        MESSAGE_TYPE.SC_ALERT,
                                        {
                                            kingP: checkScp[z],
                                            attackP: y,
                                        },
                                        [0, 1]
                                    );
                                    gameVars.winner = 1;
                                    saveKing = true;
                                }
                            }
                        }
                    }
                }
            } else {
                for (var y = 0; y < 64; y++) {
                    if ("otmvwl".indexOf(checkArr[y]) >= 0) {
                        var checkScp = checkBlack(y, checkArr) || [];
                        for (var z = 0; z < checkScp.length; z++) {
                            if (checkArr[checkScp[z]] === 'k') {
                                if (!saveKing) {
                                    // alert('Save Enemy King');
                                    ServerCommService.send(
                                        MESSAGE_TYPE.SC_ALERT,
                                        {
                                            kingP: checkScp[z],
                                            attackP: y,
                                        },
                                        [0, 1]
                                    );
                                    gameVars.winner = 0;
                                    saveKing = true;
                                }
                            }
                        }
                    }
                }
            }

            if (!saveKing) {

                gameVars.winner = -1;

                // TimeoutManager.clearNextTimeout();
                if ('prnbq'.indexOf(gameVars.values[n]) >= 0) {
                    gameVars.player1_score += 1;
                    gameVars.p1_50 = 0;
                } else if ('otmvw'.indexOf(gameVars.values[n]) >= 0) {
                    gameVars.player2_score += 1;
                    gameVars.p2_50 = 0;
                }

                // for 50-move rule
                if (gameVars.myTurn) {
                    // for 50-move rule
                    gameVars.p1_50 += 1;
                    if (gameVars.values[gameVars.moveTarget] === 'o') {
                        gameVars.p1_50 = 0;
                    }
                    if (gameVars.en1 !== -1 && (gameVars.en1 - 8) === n && gameVars.values[gameVars.moveTarget] === 'o') {
                        gameVars.values[n] = gameVars.values[gameVars.moveTarget];
                        gameVars.values[gameVars.moveTarget] = 0;
                        gameVars.values[gameVars.en1] = 0;
                        gameVars.player1_score += 1;
                    } else {
                        gameVars.values[n] = gameVars.values[gameVars.moveTarget];
                        gameVars.values[gameVars.moveTarget] = 0;
                    }
                } else {
                    // for 50-move rule
                    gameVars.p2_50 += 1;
                    if (gameVars.values[gameVars.moveTarget] === 'p') {
                        gameVars.p2_50 = 0;
                    }
                    if (gameVars.en2 !== -1 && (gameVars.en2 + 8) === n && gameVars.values[gameVars.moveTarget] === 'p') {
                        gameVars.values[n] = gameVars.values[gameVars.moveTarget];
                        gameVars.values[gameVars.moveTarget] = 0;
                        gameVars.values[gameVars.en2] = 0;
                        gameVars.player2_score += 1;
                    } else {
                        gameVars.values[n] = gameVars.values[gameVars.moveTarget];
                        gameVars.values[gameVars.moveTarget] = 0;
                    }
                }
                // gameVars.values[n] = gameVars.values[gameVars.moveTarget];
                // gameVars.values[gameVars.moveTarget] = 0;
                if (gameVars.myTurn) {
                    // switch the king and rook
                    if (gameVars.cl) {
                        if (n === 62 && gameVars.moveTarget === 60) {
                            gameVars.values[63] = 0;
                            gameVars.values[61] = "t";
                        }
                        else if (n === 58 && gameVars.moveTarget === 60) {
                            gameVars.values[59] = "t";
                            gameVars.values[56] = 0;
                        }
                    }
                    // check that selected tile is kong
                    if (gameVars.moveTarget === 60) {
                        gameVars.ck = true;
                    }
                    // check that selected tile is right rook
                    else if (gameVars.moveTarget === 63) {
                        gameVars.cr2 = true;
                    }
                    // check that selected tile is left rook
                    else if (gameVars.moveTarget === 56) {
                        gameVars.cr1 = true;
                    }
                    // check that the pawn is at the top of the board
                    if (gameVars.values[n] === "o" && n < 8) {
                        gameVars.values[n] = "w";
                    }
                } else {
                    // switch the king and rook
                    if (gameVars.cle) {
                        if (n === 6 && gameVars.moveTarget === 4) {
                            gameVars.values[7] = 0;
                            gameVars.values[5] = "r";
                        }
                        else if (n === 2 && gameVars.moveTarget === 4) {
                            gameVars.values[3] = "r";
                            gameVars.values[0] = 0;
                        }
                    }
                    // check that selected tile is kong
                    if (gameVars.moveTarget === 4) {
                        gameVars.cke = true;
                    }
                    // check that selected tile is right rook
                    else if (gameVars.moveTarget === 7) {
                        gameVars.cr2e = true;
                    }
                    // check that selected tile is left rook
                    else if (gameVars.moveTarget === 0) {
                        gameVars.cr1e = true;
                    }
                    // check that the pawn is at the bottom of the board
                    if (gameVars.values[n] === "p" && n < 64 && n > 55) {
                        gameVars.values[n] = "q";
                    }
                }

                // for en passant move
                if (gameVars.myTurn) {
                    if ((gameVars.moveTarget - n) === 16)
                        gameVars.en2 = n;
                    else gameVars.en2 = -1;
                } else {
                    if ((n - gameVars.moveTarget) === 16)
                        gameVars.en1 = n;
                    else gameVars.en1 = -1;
                }

                gameVars.moveable = false;

                // push to the history
                gameVars.history.push(copyObject(gameVars.values));
                console.log(gameVars.history);

                ServerCommService.send(
                    MESSAGE_TYPE.SC_DRAW_BOARD,
                    {
                        board: gameVars.values,
                        target: n,
                    },
                    [0, 1]
                );
                ServerCommService.send(
                    MESSAGE_TYPE.SC_CONFIRM_MOVE,
                    {
                        currentPlayer: gameVars.myTurn ? 0 : 1,
                        p1Score: gameVars.player1_score,
                        p2Score: gameVars.player2_score,
                    },
                    [0, 1]
                );

                checkWinner();

                if (gameVars.checkMate) {
                    TimeoutManager.clearNextTimeout();
                    gameVars.endGame = true;
                    // if (gameVars.winner === 0) {
                    //     gameVars.player1_score += 1;
                    // } else if (gameVars.winner === 1) {
                    //     gameVars.player2_score += 1;
                    // }
                    ServerCommService.send(
                        MESSAGE_TYPE.SC_END_GAME,
                        {
                            winner: gameVars.winner,
                            checkMate: gameVars.checkMate,
                            p1Score: gameVars.player1_score,
                            p2Score: gameVars.player2_score,
                        },
                        [0, 1]
                    );
                } else {
                    // check the check
                    var saveKingTemp = false;
                    if (!gameVars.myTurn) {
                        for (var y = 0; y < 64; y++) {
                            if ("prnbkq".indexOf(gameVars.values[y]) >= 0) {
                                var checkScp = checkWhite(y, gameVars.values) || [];
                                for (var z = 0; z < checkScp.length; z++) {
                                    if (gameVars.values[checkScp[z]] === 'l') {
                                        if (!saveKingTemp) {
                                            // alert('Save Your King');
                                            saveKingTemp = true;
                                            ServerCommService.send(
                                                MESSAGE_TYPE.SC_CHECK,
                                                {
                                                },
                                                [0, 1],
                                            );
                                        }
                                    }
                                }
                            }
                        }
                    } else {
                        for (var y = 0; y < 64; y++) {
                            if ("otmvwl".indexOf(gameVars.values[y]) >= 0) {
                                var checkScp = checkBlack(y, gameVars.values) || [];
                                for (var z = 0; z < checkScp.length; z++) {
                                    if (gameVars.values[checkScp[z]] === 'k') {
                                        if (!saveKingTemp) {
                                            // alert('Save Enemy King');
                                            saveKingTemp = true;
                                            ServerCommService.send(
                                                MESSAGE_TYPE.SC_CHECK,
                                                {
                                                },
                                                [0, 1],
                                            );
                                        }
                                    }
                                }
                            }
                        }
                    }

                    gameVars.myTurn = !gameVars.myTurn;
                    askPlayer();
                }
            }
        }
    }
}

export const ServerCommService = {
    callbackMap: {},
    init() {
        this.callbackMap = {};
    },
    addRequestHandler(messageType, callback) {
        this.callbackMap[messageType] = callback;
    },
    send(messageType, data, users) {
        // TODO: Make fake code here to send message to client side
        // Added timeout bc there are times that UI are not updated properly if we send next message immediately
        // If we move to backend, we can remove this timeout
        setTimeout(function () {
            ClientCommService.onExtensionResponse({
                cmd: messageType,
                params: data,
                users: users,
            });
        }, 100);
    },
    onReceiveMessage(messageType, data, room) {
        const callback = this.callbackMap[messageType];
        trace("S - onReceiveMessage", messageType, data, room);
        if (callback) {
            callback(data, room);
        }
    },
};
ServerCommService.init();

const TimeoutManager = {
    timeoutHandler: null,
    nextAction: null,

    setNextTimeout(callback, timeLimit) {
        this.timeoutHandler = setTimeout(
            function () {
                return callback();
            },
            timeLimit ? timeLimit * 1000 : (TIME_LIMIT + ALARM_LIMIT) * 1000
        );
    },

    clearNextTimeout() {
        if (this.timeoutHandler) {
            clearTimeout(this.timeoutHandler);
            this.timeoutHandler = null;
        }
    },
};

export const FakeServer = {
    initHandlers() {
        initHandlers();
    },
    init() {
        init();
    },
    startGame() {
        startGame();
    },
};
