var global = {

    DEV_MODE : [],
    
    MAX_USERS: [],
    NUM_ROWS : [],
    NUM_COLUMNS : [],
    
    sfs: [],
    user : [],
    userId : [],
    connected : [],

    selectedLevel : [],
    selectedSize : [],
    isSelectedPrivate : [],
    nickName : [],

    timeLimit : [],
    playerCnt : [],
    myOrder : [],

    cookie_userName : [],
    cookie_userID : [],
    cookie_credits : [],
    cookie_avatar : [],
    cookie_lang : [],

    load: function () {
        // ...

        this.SfsDisconnectReasons = cc.Enum({
            unknown: 0,
            userRequestRoomScene: 1,
            userRequestWaitingScene: 2,
            userRequestGameScene: 3,
            gameFinished: 4,
            disconnectReceived: 5,
            surrender: 6,
            lowCredit: 7,
            error: 8,
          }),
    
        this.DEV_MODE = false;

        this.MAX_USERS = 4;
        this.MIN_USERS = 4;
        this.sfs = null;
        this.user = null;
        this.userId = null;
        this.connected = false;
        this.game_id = 1211;
        this.SfsZone = "Mus";
        this.SfsExtension = "Mus";
        this.subdomain = "play2";
        this.domain = "torofun.com";
        this.gameTranslations = null;
        this.privateUserNickName = "";
        this.SfsKeepAliveHandler = 0;
        this.autoStartGameScene = false;
        this.SfsRoomLeaveReason = 0;
        this.SfsDisconnectReason = 0;
        this.SfsCurrentRoom = null;
        this.loadingScene = false;
    	this.torofunUrl = "https://" + this.domain + "/en/";
	    this.gameHomeUrl = "https://" + this.domain + "/en/mus/";

        //variables initialized in roomScene getting values from smartfox
        this.timeLimit = 0;
        this.playerCnt = 0;
        this.roomPoints = 0;
        this.scenes = [];
        this.startSceneAnimationPosition = cc.v2(1.908,-155);
        this.startSceneTitlePosition = cc.v2(0,180);

        this.useSmartFox = true;
        this.credits = 0; //initialized in gameScene when game starts

        this.skin = "";
        this.skinPrefix = "%SKIN%_";
        this.alternateLangsArray = ["de","el","es","fr","it","pl","pt","ru","tr"];
        this.gameSpriteSheet = "Images/Sprites";
        this.themeSpriteSheet = "Images/Themes/%%SKIN%%/themeSprites";
        this.langSpriteSheet = "Images/Lang/%%LANG%%/langSprites";
        this.gameSceneBackgroundFile = "GameBackground";
        this.roomSceneBackgroundFile = "RoomBackground";
        this.privateRoomSceneBackgroundFile = "PrivateRoomBackground";
        this.startSceneBackgroundFile = "StartBackground";
        this.waitingSceneBackgroundFile = "WaitingBackground";
        this.avatarUrl = "https://cdn.torofun.com/images/avatar/users/";
        this.cookie_userName = null;
        this.cookie_token = "";
        this.cookie_userID = "123ID";
        this.cookie_credits = 0;
        this.cookie_avatar = "default_boy_avatar";
        this.cookie_lang = "en";
        this.delayedLoadScene = false;
        this.sceneToLoad = null;
        this.codeToExecuteWhenLoaded = null;
        this.timeForScheduler = 0.5;

        if (window){
            if (window['getHoliday']){
                this.skin = window['getHoliday'] ();
            }    
        }
	this.configUrlVarsFromCurrentUrl();
    },

    getLanguageFromLanguageString (languageString){
        var languageStringUpperCase = languageString.toUpperCase();
        for (var i=0;i < this.alternateLangsArray.length;i++){
            var lang = this.alternateLangsArray[i];
            var langUpperCase = lang.toUpperCase();
            if (langUpperCase == languageStringUpperCase){
                return langUpperCase;
            }
        }
        //If format is xx-XX (example): es-ES, try to find xx lang
        if (languageString.search("-") > 0){
            var langArray = languageString.split ("-");
            return this.getLanguageFromLanguageString (langArray[0]);
        }
        return "";
    },

    getNavigatorLocale: function () {
        var langString = navigator.language;
        var lang = this.getLanguageFromLanguageString(langString);
        if (lang == ""){
            return "EN";
        }
        return lang;
    },

    getLangStringFromDomain (){
        var url = this.getLocationUrl ();
        console.log ("URL:",url);
        var firstDomainLetterPosition = url.search ("://");
        var urlWithoutProtocol = "";
        if (firstDomainLetterPosition != -1){
            urlWithoutProtocol = url.substring (firstDomainLetterPosition + 3);
        }
        else {
            urlWithoutProtocol = url;
        }
        var firstBarPosition = urlWithoutProtocol.search("/");
        var firstDotPosition = urlWithoutProtocol.search("\\.");
        if ((firstBarPosition >= 0 && (firstBarPosition < firstDotPosition)) || firstDotPosition == -1){
            return "";
        }
        return urlWithoutProtocol.substring(0,firstDotPosition);
    },

    getDomainLocale: function () {
        var langString = this.getLangStringFromDomain();
        if (langString == ""){
            return "EN";
        }
        var lang = this.getLanguageFromLanguageString (langString);
        if (lang == ""){
            return "EN";
        }
        return lang;
    },

    getUrlPathLocale: function () {
        var url = this.getLocationUrl ();
        var torofunIndexPosition = url.search ("torofun.");
        if (torofunIndexPosition == -1){
            return "EN";
        }
        //Make sure that torofun.xxx/ format is available
        if (url.length - torofunIndexPosition < 12){
            return "EN";
        }
        var urlPath = url.substring(torofunIndexPosition + 11);
        if (urlPath.substring (0,1) != "/"){
            return "EN";
        }
        var subDirectoriesArray = urlPath.split("/");
        var langSubDirectory = subDirectoriesArray[1];
        var lang = this.getLanguageFromLanguageString(langSubDirectory);
        if (lang == ""){
            return "EN";
        }
        return lang;
    },

    getDomainOrUrlPathLocale: function () {
        let url = window.location.href;
        var langString = this.getLangStringFromDomain();
        if (langString == ""){
            return this.getUrlPathLocale(url);
        }
        var lang = this.getLanguageFromLanguageString (langString);
        if (lang == ""){
            return this.getUrlPathLocale(url);
        }
        return lang;
    },

    getLocale: function (){
        if ( window.location !== window.parent.location ) {
            return this.getNavigatorLocale();
        }
        return this.getDomainOrUrlPathLocale();
    },

    getLocationUrl (){
        let url = window.location.href;
        if (url.search (".torofun.") == -1){
            return this.gameHomeUrl;
        }
        return url;
    },

    configUrlVarsFromCurrentUrl(){
        var domain =  window.location.hostname;
        if (domain == "localhost"){
            this.DEV_MODE = true;
        }
        else {
            this.domain = domain.substring(domain.lastIndexOf(".", domain.lastIndexOf(".") - 1) + 1);
        }
        if (typeof (language) != "undefined"){
            this.lang = language;
        }
        else {
            this.lang = this.getLocale();
        }
        console.log ("Lang lib language:", this.lang);
        var url = this.getLocationUrl(); 
        this.torofunUrl = url.slice (0,23);
        var urlPathArray = url.split ("/");
        var pathArrayNumItems = urlPathArray.length;
        if (pathArrayNumItems >= 5){
            this.gameHomeUrl = this.torofunUrl + urlPathArray[4] + "/";
        }
    },


    loadScene(sceneName, functionCode, delay = 0.5){
        if (sceneName == "gameScene"){            
            var isMobile = cc.sys.isMobile;
            if (isMobile){
                sceneName = "gameSceneMob"
            }
        }
        global.loadingScene = true;
        let sceneLoaded = false;
        if (global.scenes[sceneName]){
            if (global.scenes[sceneName] != null){
                sceneLoaded = true;
            }
        }
        if (!sceneLoaded){
            if (functionCode){
                console.log ("Loading scene", sceneName, "with extra code");
                cc.director.loadScene(sceneName, functionCode);
            }
            else {
                console.log ("Loading scene", sceneName);
                cc.director.loadScene(sceneName);
            }
        }
        else {
            if (functionCode){
                console.log ("Loading scene2", sceneName, "with extra code");
                cc.director.loadScene(sceneName, functionCode);
            }
            else {
                console.log ("Loading scene2", sceneName);
                cc.director.loadScene(sceneName);
            }
        }
    }
};
global.load();

module.exports = global;