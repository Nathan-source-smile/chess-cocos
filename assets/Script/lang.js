var global = require("global");
var lang = {
    unavailableTranslations:[],

    isUppercase (label, uppercaseLabels){
        if (uppercaseLabels){
            if (uppercaseLabels.indexOf(label)>=0){
                return true;
            }
        }
        return false;
    },

    translateLabels: function (node, uppercaseLabels){
        for(let i = 0; i < node.children.length; i++) {
            let label = node.children[i].getComponent("cc.Label");
            if (label){
                label.string = this.translateText(label.string,node.children[i].name);
                if (this.isUppercase(node.children[i].name,uppercaseLabels)){
                    label.string = label.string.toUpperCase();
                }
            }
            var res = this.translateLabels(node.children[i],uppercaseLabels);
        }
    },

    translateText (initialText, translationLabel){
        let translation = initialText;
        if (global.gameTranslations){
            if (global.gameTranslations[translationLabel]){
                translation = global.gameTranslations[translationLabel];
            }
            else {
                if (initialText != "" && translationLabel !== ""){
                    let unavailableTranslation = {"label":translationLabel,"text": initialText};
                    if (!this.unavailableTranslations.find(x=>x.label == unavailableTranslation.label)){
                        this.unavailableTranslations.push(unavailableTranslation);
                    }    
                }
            }
        }
        return translation;
    },

    getUnavailableTranslations(){
        let unavailableTranslationsString = "";
        for (let j = 0; j < this.unavailableTranslations.length; j++){
            let unavailableTranslationString = this.unavailableTranslations[j].label + ";" + this.unavailableTranslations[j].text + "\n";
            unavailableTranslationsString += unavailableTranslationString;
        }
        navigator.clipboard.writeText(unavailableTranslationsString).then(function() {
            console.log ("Translations available in clipboard");
          }, function() {
            console.log ("Error copying translations to clipboard");
            console.log (unavailableTranslationsString);
          });
    },

    translateTextUpperCase (initialText, translationLabel){
        let translation = initialText;
        if (global.gameTranslations){
            if (global.gameTranslations[translationLabel]){
                translation = global.gameTranslations[translationLabel];
            }    
        }
        return translation.toUpperCase();
    },

    translateScene: function (node, uppercaseLabels){
        if (global.gameTranslations == null){
            this.loadTranslations()
                .then((translations)=>{
                    global.gameTranslations = translations;
                    if (global.gameTranslations != null){
                        this.translateLabels(node,uppercaseLabels);
                    }
                })
                .catch ((err) => {
                    //console.log(err)
                    console.log("Scene translation error")
                });
            return;
        }
        this.translateLabels(node,uppercaseLabels);
    },

    replaceStringVariables: function(string, variables){
        let replacedString = string;
        variables.forEach(element=>{
            replacedString = replacedString.replace("%" + element.name + "%", element.value);
        });
        return replacedString;
    },

    replaceStringExample: function (){
        var testString = "%AMOUNT% birds with %COLOR% legs have %SCORE% feathers";
        var replaceVariables = [];
        replaceVariables.push ({"name":"AMOUNT", "value":"123"});
        replaceVariables.push ({"name":"SCORE", "value": "10000"});
        replaceVariables.push ({"name":"COLOR", "value": "black"});
        console.log ("Replaced:" + this.replaceStringVariables (testString,replaceVariables));
    },

    loadTranslations: function (game_id, domain) {
        return new Promise ((resolve, reject) => {
            const lang = global.lang;
            const url = "https://www." + global.domain + "/translations/getJSON.php";
            const param = "game_id=" + global.game_id + "&lang=" + lang;
            //console.log (url + "?" + param);
            const req = new XMLHttpRequest();
            req.open("GET", url + "?" + param);
            req.send();
            req.onreadystatechange = function () {
                var err;
                if (req.readyState == 4) {
                    if (req.status >= 200 && req.status <= 207) {
                        err = false;
                    } else {
                        err = true;
                    }
                    const response = req.responseText;
                    if (!err) {
                        const res = JSON.parse(response);
                        if (res.result == "ok") {
                            //console.log ("Translations ready");
                            const strings = res.translations;
                            window.localStorage.setItem(
                                "translations",
                                JSON.stringify(strings)
                            );
                            const gameTranslationsUnfiltered = JSON.parse (window.localStorage.translations);
                            var translations = {};
                            gameTranslationsUnfiltered.forEach(element => {
                                translations[element.key] = element.translation;
                            });;
                            resolve (translations);
                            return;
                            /*var translateLabels = function(node) {
                                for(let i = 0; i < node.children.length; i++) {
                                    let label = node.children[i].getComponent("cc.Label");
                                    if (label){
                                        let translation = label.string;
                                        if (global.gameTranslations[node.children[i].name]){
                                            translation = global.gameTranslations[node.children[i].name];
                                        }
                                        label.string = translation;
                                    }
                                    var res = translateLabels(node.children[i]);
                                    if(res) return res;
                                }
                            }
                            translateLabels (cc.director.getScene());*/
                        }
                        else {
                            reject(new Error("Result was not ok loading translations: " + res.result ));            
                        }
                    }
                    else {
                        reject(new Error("Wrong http request status loading translations: " + req.status) );        
                    }
                }
            }
        });
    },
        

}
module.exports = lang;
