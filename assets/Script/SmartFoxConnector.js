var global = require("global");
var GameCommands = require("./GameCommands.js");
var lang = require ("./lang.js");

var RoomJoinStates = cc.Enum({
    Inactive: 0,
    searchingPendingPrivateGames: 1,
    searchingPendingPublicGames: 2,
    searchingPublicGames: 3,
    searchingPrivateGame: 4,
    reconnecting: 5,
    checkingCreditsForPublicGame:6,
    checkingCreditsForJoiningPrivate:7,
    checkingCreditsForCreatingPrivate:8,
    askingToJoinPrivate:9,
    searchingPrivateGame: 10,
    searchingUnfinishedActiveGame: 11,
    searchingAutoPlayGame: 12,
    connecting: 13,
  });
  var RoomLeaveReasons = cc.Enum({
    unknown: 0,
    lowCredit: 1,
    error: 2,
    userRequest: 3,
  });

export const SmartFoxConnector = {
    onExtensionResponse(evt) {
        var params = evt.params; // SFSObject
        var cmd = evt.cmd;
        var  checkers,playerOrder;
        var i;
        let cards;
        let ranking, points;
        let checkCommandsUsedInGameScene = false;
        console.log("> Received Extension Response: " + cmd, params, "time", new Date());

        switch (cmd) {
            case "ENABLE_BOTS":
                for (var i = 1; i < global.MIN_USERS;i++){
                    var data = new SFS2X.SFSObject();
                    global.sfs.send( new SFS2X.ExtensionRequest("ADD_BOT", data, global.sfs.lastJoinedRoom) )    
                }
                break;
            case "START_COUNTDOWN":
                    console.log("starting game in",params.getInt("count"),"seconds");
                break;
            case "CANCEL_COUNTDOWN":
                if (global.scenes['waitingScene'] && global.scenes['currentScene'] == global.scenes['waitingScene']) {
                    global.scenes['waitingScene'].hideTimer();
                    //global.scenes['waitingScene'].disableWaitBtn();
                }
                break;        
            case "GAME_STARTED":
                global.timeLimit = params.getInt("time");
                global.playerCnt = params.getInt("playerCnt");
                global.roomPoints = params.getInt("roomPoints");
                console.log ("starting game");
                break;
            case "USER_CREDITS":
                let credits = params.getInt("credits");
                console.log ("USER_CREDITS:", credits);
                global.credits = credits;
                global.scenes['gameScene'].setCredits(credits);
                //update credits in web page
                //global.scenes['roomScene'].updateBrowserCredits(credits);
                break;
            case "SERVER_LOG":
                var logString = params.getUtfString("text");
                console.log ("SERVER LOG:", logString);
                break;
            case "NOT_ENOUGHT_CREDIT":
                console.log ("NOT_ENOUGHT_CREDIT");
                global.SfsRoomLeaveReason = RoomLeaveReasons.lowCredit;
                global.sfs.send(new SFS2X.LeaveRoomRequest(global.currentRoom));            
                break;
            case "REFUND":
                console.log ("Refund");
                this.showRefundCreditMessage();
                break;
            case "SERVER_ERROR":
                //console.log ("server error");
                var errorText = params.getUtfString("text");
                var errorLabel =  params.getUtfString("errorLabel");
                var translatedErrorText = lang.translateText(errorText, errorLabel);
                console.log ("SERVER ERROR", errorText);
                global.roomLeaveReason = RoomLeaveReasons.error;    
                global.SfsDisconnectReason = global.SfsDisconnectReasons.error;
                global.scenes['roomScene'].closeSfsConnection();
                if (global.scenes['roomScene']){
                    if (global.scenes['currentScene'] != global.scenes['roomScene']) {
                        global.loadScene('roomScene', function() {
                            global.scenes['roomScene'].showError(translatedErrorText);
                        });
                    }
                    else {
                        this.showError(translatedErrorText);
                    }
                }
                break;
            default:
                checkCommandsUsedInGameScene = true;
                break;
        }
        if (checkCommandsUsedInGameScene && global.scenes['gameScene'] && global.scenes['currentScene'] == global.scenes['gameScene']){
            switch (cmd) {
                case "SURRENDERED":
                    global.scenes['gameScene'].onSurrender();
                    break;
                case "CHAT_MESSAGE":
                    var user = params.getUtfString("user");
                    var text =  params.getUtfString("text");
                    global.scenes['gameScene'].onChatMessage(user, text);
                    break;
                case "GET_READY":
                    //var timeOut = params.getInt("timeOut") / 1000;
                    //global.scenes['gameScene'].showGetReady(timeOut);
                    break;
                default:
                    GameCommands.handleCommand (cmd, params);
                    break;

            }    
        }
    },

    getCookie(cname) {
        var decodedCookies = decodeURIComponent(document.cookie);
        var decodedCookiesArray = decodedCookies.split(';');
        for(var i = 0; i <decodedCookiesArray.length; i++) {
          var cookieData = decodedCookiesArray[i];
          cookieData.trimStart();
          var cookieDataArray = cookieData.split('=');
          if (cookieDataArray[0].trim() == cname.trim()) {
            return cookieDataArray[1];
          }
        }
        return "";
    },


    enablePlayButton(){
        var playButtonNode = cc.director.getScene().getChildByName("Canvas").getChildByName("PlayButton");
        playButtonNode.getComponent (cc.Button).interactable = true;
    },

    loadSession(field){
        var fieldVal = this.getCookie(field);
        if( fieldVal != null && fieldVal != "" ){
            return fieldVal;
        }else if( window.sessionStorage.getItem(field) != null  ){
            return window.sessionStorage.getItem(field);
        }else if( window.localStorage.getItem(field) != null  ){
            return window.localStorage.getItem(field);
        }else{
            return null;
        }
    },

    loadGameConfiguration(){
        var gameConfiguration;
        //we always load default configuration in order to have something if remote config download fails
        this.loadDefaultGameConfiguration();
        this.loadRemoteGameConfiguration();
    },

    loadDefaultGameConfiguration(){
        global.subdomain = "play2";
    },

    loadRemoteGameConfiguration(){
        let confData=null;
        let self = this;
        var url = "https://www." + global.domain + "/gameApis/getGameConfigurationData.php?gameId=" + global.game_id;
        //var url = "https://www.torofun.net/gameApis/getUserAvatar.php?avatar=default_boy_avatar";
        //console.log(url);
        cc.loader.load( url, function( err, res)
        {
            //console.log ("Remote configuration: ", res);
            if (!err){
                if (res != ""){
                    confData = JSON.parse (res);
                    if (confData.domain){
                        if (confData.domain!=""){
                            global.domain = confData.domain;
                        }    
                    }
                    if (confData.subdomain){
                        if (confData.subdomain!=""){
                            global.subdomain = confData.subdomain;
                        }
                    }    
                }
            }
        });
    },

    getAutoPlayDataIfValid (){
        var autoPlayCookie = this.loadSession ("autoPlay");
        //var autoPlayCookie = '{"appId":1110,"roomName":"10_Public_silver","numPlayers":2,"bet":0,"expires":"Mon, 01 May 2023 06:39:24 GMT"}'
        if (autoPlayCookie){
            var autoPlayData = JSON.parse (atob (autoPlayCookie));
            if (autoPlayData.appId == global.game_id){
                if (autoPlayData.roomName != ""){
                    return autoPlayData;
                }    
            }
        }
        return null;
    },

    configureAndConnectSmartfox(){
        this.loadGameConfiguration();
        console.log ("DEV_MODE", global.DEV_MODE);
        if (global.DEV_MODE){
            //this.downloadTestGameCookie();
            //this.downloadTestTokenCookie();
            this.downloadTestCookies();
        }
        else {
            var tokenCookie = this.loadSession("token");
            if (tokenCookie){
                global.cookie_token = tokenCookie;
            }
            var nickCookie = this.loadSession("nick");
            if (nickCookie){
                global.cookie_userName = nickCookie;
            }
            else {
                console.log ("Invalid username");
            }
            var idCookie = this.loadSession("id");
            if (idCookie){
                global.cookie_userID = idCookie;
            }
            var creditsCookie = this.loadSession("coins");
            if (creditsCookie){
                global.cookie_credits = creditsCookie;
            }
            var avatarCookie = this.loadSession("avatar");
            if (avatarCookie){
                global.cookie_avatar = avatarCookie;
            }
            var autoPlayData = this.getAutoPlayDataIfValid();
            if (autoPlayData){
                if (!global.cookie_userName || global.cookie_userName == ""){
                    console.log ("Invalid user");
                    return;
                }        
                this.connectSfs();
            }
            else {
                this.connectSfs();
            }
        }

    },
    
    downloadTestCookies (){
        let server = global.domain.split(".")[1];
        let type = "all";
        let self = this;
        console.log ("loading test cookies");
        var url = "https://www.torofun.net/gameApis/getTestCookie.php?type=" + type + "&server=" + server;
        cc.loader.load( url, function( err, res)
        {
            if (err){
                console.log ("Error downloading test cookies", err);
                return;
            }
            else {
                console.log ("Test cookies downloaded", res);
            }
            var cookiesData = JSON.parse( res );
            if (cookiesData){
                if (cookiesData.status == "ok"){
                    global.cookie_userName = cookiesData.nickCookie;
                    global.cookie_userID = cookiesData.idCookie;
                    global.cookie_credits = parseInt(cookiesData.coinsCookie);
                    global.cookie_avatar = cookiesData.avatarCookie;
                    global.cookie_token = cookiesData.tokenCookie;
                }
                var autoPlayCookie = null;
                if (autoPlayCookie){
                    var autoPlayData = JSON.parse (autoPlayCookie);
                    console.log (autoPlayData.appId, global.game_id);
                    if (autoPlayData.appId == global.game_id){
                        if (!global.cookie_userName || global.cookie_userName == ""){
                            console.log ("Invalid user");
                            return;
                        }
                        self.connectSfs();
                    }                
                }
                else {
                    self.connectSfs();
                }
            }
        });
    },

    connectSfs(){
        console.log ("connecting sfs");
        global.roomLeaveReason = RoomLeaveReasons.unknown;
        var config = {};

        config.host = global.subdomain + "." + global.domain;
        config.port = 8443;
        config.useSSL = true;
        config.zone = global.SfsZone;
        config.debug = false;


        //Add ping method
        if(typeof SFS2X.SmartFox.prototype.keepAlive !== "function"){
            //console.log ("Global.sfs.keepAlive function created");
            SFS2X.SmartFox.prototype.keepAlive = function() {
                if (global.sfs.isConnected){
                    //console.log("Keep Alive called");                        
                    var data = new SFS2X.SFSObject();
                    data.putInt("keep_alive", 1);
                    global.sfs.send( new SFS2X.ExtensionRequest("KEEP_ALIVE", data));
                }
                else{
                    //console.log("Keep Alive cancelled");
                    clearInterval(global.SfsKeepAliveHandler);
                }
            };
        }
        // Create SmartFox client instance
        global.sfs = new SFS2X.SmartFox(config);
        //console.log ("Version:", global.sfs.version);
        global.sfs.addEventListener(SFS2X.SFSEvent.CONNECTION, this.onConnection, this);
        global.sfs.addEventListener(SFS2X.SFSEvent.CONNECTION_LOST, this.onConnectionLost, this);
        global.sfs.addEventListener(SFS2X.SFSEvent.LOGIN, this.onLogin, this);
        global.sfs.addEventListener(SFS2X.SFSEvent.LOGIN_ERROR, this.onLoginError, this);
        global.sfs.addEventListener(SFS2X.SFSEvent.ROOM_CREATION_ERROR, this.onRoomCreationError, this);
        global.sfs.addEventListener(SFS2X.SFSEvent.ROOM_JOIN_ERROR, this.onRoomJoinError, this);
        global.sfs.addEventListener(SFS2X.SFSEvent.ROOM_JOIN, this.onRoomJoin, this);
        global.sfs.addEventListener(SFS2X.SFSEvent.USER_ENTER_ROOM, this.onUserEnterRoom, this);
        global.sfs.addEventListener(SFS2X.SFSEvent.USER_EXIT_ROOM, this.onUserExitRoom, this);
        global.sfs.addEventListener(SFS2X.SFSEvent.USER_COUNT_CHANGE, this.onUserCountChange, this);
        global.sfs.addEventListener(SFS2X.SFSEvent.PUBLIC_MESSAGE, this.onPublicMessage, this);
        global.sfs.addEventListener(SFS2X.SFSEvent.PRIVATE_MESSAGE, this.onPrivateMessage, this);
        global.sfs.addEventListener(SFS2X.SFSEvent.EXTENSION_RESPONSE, this.onExtensionResponse, this);
        global.sfs.addEventListener(SFS2X.SFSEvent.USER_VARIABLES_UPDATE, this.onUserVarsUpdate, this);
        global.sfs.addEventListener(SFS2X.SFSEvent.ROOM_VARIABLES_UPDATE, this.onRoomVarsUpdate, this);
        global.sfs.addEventListener(SFS2X.SFSEvent.ROOM_FIND_RESULT, this.onRoomFindResult, this);
        global.sfs.addEventListener(SFS2X.SFSEvent.DISCONNECT, this.onSfsDisconnect, this);
        console.log ("this.onSfsDisconnect event ready");
        global.sfs.connect();
    },

    removeSfsListeners(){
        global.sfs.removeEventListener(SFS2X.SFSEvent.CONNECTION, this.onConnection);
        global.sfs.removeEventListener(SFS2X.SFSEvent.CONNECTION_LOST, this.onConnectionLost);
        global.sfs.removeEventListener(SFS2X.SFSEvent.LOGIN, this.onLogin);
        global.sfs.removeEventListener(SFS2X.SFSEvent.LOGIN_ERROR, this.onLoginError);
        global.sfs.removeEventListener(SFS2X.SFSEvent.ROOM_ADD, this.onRoomCreated);
        global.sfs.removeEventListener(SFS2X.SFSEvent.ROOM_CREATION_ERROR, this.onRoomCreationError);
        global.sfs.removeEventListener(SFS2X.SFSEvent.ROOM_JOIN_ERROR, this.onRoomJoinError);
        global.sfs.removeEventListener(SFS2X.SFSEvent.ROOM_JOIN, this.onRoomJoin);
        global.sfs.removeEventListener(SFS2X.SFSEvent.USER_ENTER_ROOM, this.onUserEnterRoom);
        global.sfs.removeEventListener(SFS2X.SFSEvent.USER_EXIT_ROOM, this.onUserExitRoom);
        global.sfs.removeEventListener(SFS2X.SFSEvent.USER_COUNT_CHANGE, this.onUserCountChange);
        global.sfs.removeEventListener(SFS2X.SFSEvent.PUBLIC_MESSAGE, this.onPublicMessage);
        global.sfs.removeEventListener(SFS2X.SFSEvent.PRIVATE_MESSAGE, this.onPrivateMessage);
        global.sfs.removeEventListener(SFS2X.SFSEvent.EXTENSION_RESPONSE, this.onExtensionResponse);
        global.sfs.removeEventListener(SFS2X.SFSEvent.USER_VARIABLES_UPDATE, this.onUserVarsUpdate);
        global.sfs.removeEventListener(SFS2X.SFSEvent.ROOM_VARIABLES_UPDATE, this.onRoomVarsUpdate);
        global.sfs.removeEventListener(SFS2X.SFSEvent.ROOM_FIND_RESULT, this.onRoomFindResult);
        global.sfs.removeEventListener(SFS2X.SFSEvent.DISCONNECT, this.onSfsDisconnect);
    },

    closeSfsConnection (event){
        if (global.sfs) {
            //this.removeSfsListeners();
            //console.log ("SFS listeners released. Connection state:", global.sfs.isConnected)
            if (global.sfs.isConnected){
                console.log ("Disconnecting from server...");
                global.sfs.disconnect();
                //this.scheduleOnce(global.scenes['roomScene'].checkIfSfsDisconnectionIsDone,0.2);
            }
        }
    },

    checkIfSfsDisconnectionIsDone(){
        if (!global.sfs.isConnected){
            this.removeSfsListeners();
            console.log ("Disconnection detected");
            global.scenes['roomScene'].onSfsDisconnect(null);
        }
        else {
            console.log ("Still connected to sfs");
            this.scheduleOnce(global.scenes['roomScene'].checkIfSfsDisconnectionIsDone,0.2);
        }
    },

    onSfsDisconnect(){
        console.log ("Sfs disconnection received");
        clearInterval(global.SfsKeepAliveHandler);
        //console.log ("Disconnected from sfs",global.SfsDisconnectReason);
        if (global.SfsDisconnectReason == global.SfsDisconnectReasons.userExitRoom){
            if (global.SfsRoomLeaveReason == RoomLeaveReasons.lowCredit){
                //console.log('user had low credit');
                global.SfsRoomLeaveReason = RoomLeaveReasons.unknown;
                if (global.scenes['roomScene']){
                    //console.log('room scene configured');
                    if (global.scenes['currentScene'] != global.scenes['roomScene']) {
                        //console.log('showing low credit');
                        this.scheduleOnce(function(){
                            global.scenes['roomScene'].executeRoomScene();
                        },1);
                    }
                    else {
                        global.scenes['roomScene'].showLowCreditMessage();
                    }
                }
            }
            else {
                //console.log (global.scenes['currentScene'],global.scenes['waitingScene']);
                if (global.scenes['currentScene'] == global.scenes['waitingScene']){
                    //console.log ("loading Room scene");
                    global.loadScene('roomScene');
                }
                if (global.scenes['currentScene'] == global.scenes['gameScene']){
                    if (global.loadScene('roomScene')){
                        global.loadScene('roomScene');
                    }
                    else{
                        console.log ("Disconnected 1");
                        //global.loadScene('gameScene');
                    }
                    
                }
            }

        }        
        else if (global.SfsDisconnectReason == global.SfsDisconnectReasons.lowCredit){
            global.loadScene('roomScene');
        }
        else if (global.SfsDisconnectReason == global.SfsDisconnectReasons.error){
            //Error shown, wait for user to click on continue button
        }
        else if (global.SfsDisconnectReason == global.SfsDisconnectReasons.userRequestWaitingScene){
            global.loadScene('roomScene');
        }
        else if (global.SfsDisconnectReason == global.SfsDisconnectReasons.surrender){
            global.loadScene('roomScene');
        }
        else if (global.SfsDisconnectReason == global.SfsDisconnectReasons.userRequestGameScene){
            global.loadScene('startScene');
        }
        else if (global.SfsDisconnectReason == global.SfsDisconnectReasons.userRequestRoomScene){
            console.log("loading start scene onSfsDisconnect");
            global.loadScene('startScene');
        }
        else if (global.SfsDisconnectReason == global.SfsDisconnectReasons.gameFinished){
            //we show a message and wait for user feedback in gameScene. Not actions needed
        }
        else if (global.SfsDisconnectReason == global.SfsDisconnectReasons.disconnectReceived){
            //we show a message and wait for user feedback in any scene. Not actions needed
        }
        else if (global.SfsDisconnectReason == global.SfsDisconnectReasons.error){
            //we show a message and wait for user feedback in any scene. Not actions needed
        }
        else {
            console.log("Unknown disconnection reason");
            global.loadScene('startScene');
        }
    },

    closeRoom(){
        global.SfsDisconnectReason = global.SfsDisconnectReasons.userRequestRoomScene;
        this.closeSfsConnection();
        this.errorDisplayNode.active = false;
    },

    doLogIn(username) {
        let sfsConnected = false;
        if (global.sfs) {
            if (global.sfs.isConnected){
                sfsConnected = true;
            }
        }
        //if (!global.connected)
        if (!sfsConnected)
            return;
        global.sfs.send(new SFS2X.LoginRequest(username.toString()));
    },

    onConnection(event)
    {
        // Reset view
        if (event.success)
        {                        
            console.log("Connected to Server!", new Date());
            global.connected = true;
            //Start ping to avoid loosing connection after 5 mins of iddle status
            global.sfsPingHandler = setInterval(global.sfs.keepAlive, 120000);

            var self = this;
            self.doLogIn(global.cookie_userName);
        }
        else
        {
            global.connected = false;
            var errorDesc = lang.translateText("Is the server running at all?","is_server_running");
            if (event.errorMessage){
                errorDesc = event.errorMessage  + " (code " + event.errorCode + ")";
            }
            var translatedError = lang.translateText("Connection failed: %ERRORMESSAGE%","connection_failed");
            translatedError = translatedError.replace ("%ERRORMESSAGE%",errorDesc);
            this.showError(translatedError);
            console.log(translatedError);
        }
    },

    showError (errorDescription){
        console.log ("Error:", errorDescription);
    },
    
    onConnectionLost(event)
    {
        global.connected = false;
        clearInterval(global.SfsKeepAliveHandler);
        console.log ("Connection lost");
        let errorMessage = "Connection Lost";
        let translatedMessage = lang.translateText(errorMessage,"connection_error");
        //console.log(errorMessage, new Date());

        if (global.scenes['gameScene'] && global.scenes['currentScene'] == global.scenes['gameScene']){
            console.log ("Connection Lost in game scene",global.scenes['gameScene'], global.scenes['currentScene']);
            global.scenes['currentScene'].onDisconnect (translatedMessage);
        }
        if (global.scenes['roomScene'] && global.scenes['currentScene'] == global.scenes['roomScene']){
            console.log ("Connection Lost in room scene");
            global.scenes['currentScene'].onDisconnect(translatedMessage);
        }
        if (global.scenes['waitingScene'] && global.scenes['currentScene'] == global.scenes['waitingScene']){
            console.log ("Connection Lost in waiting scene");
            global.scenes['currentScene'].onDisconnect(translatedMessage);
        }    
    },


    onLogin(event)
    {
        //console.log('login success');
        global.userId = event.user.id;
        global.user = event.user;

        var idVar = new SFS2X.SFSUserVariable("userID", global.cookie_userID);
        var creditVar = new SFS2X.SFSUserVariable("credits", global.cookie_credits);
        var avatarVar = new SFS2X.SFSUserVariable("avatar", global.cookie_avatar);
        var token = new SFS2X.SFSUserVariable("token", global.cookie_token);
        //console.log ("Token:", global.cookie_token);
        global.sfs.send(new SFS2X.SetUserVariablesRequest([idVar, creditVar, avatarVar,token]));
        this.roomJoinState = RoomJoinStates.searchingUnfinishedActiveGame;
        //this.searchUnfinishedActiveGame();
        this.createTestRoom();
    },

    onLoginError(event)
    {
        console.log('login error', event);
        this.showError(event.errorMessage);
    },

    onDisconnect(errorMessage)
    {
        this.showError(errorMessage);
        /*if (global.SfsDisconnectReason == global.SfsDisconnectReasons.surrender){
            if (global.loadScene('roomScene')){
                global.loadScene('roomScene');
            }
            else {
                if (global.loadScene('gameScene').isMobileUser){
                    global.loadScene('gameSceneMob');
                }
                else{
                    global.loadScene('gameScene');
                }
            }
        }*/

    },

    onRoomCreationError(evtParams)
    {
        console.log("Room creation failed: " + evtParams.errorMessage);
        var rooms = global.sfs.roomManager.getRoomList();
        var data = new SFS2X.SFSObject();
        global.sfs.send( new SFS2X.ExtensionRequest("KICK_ZONE", data));
        //console.log('rooms', rooms);
    },

    onRoomJoinError(event)
    {
        console.log("Room join error: " + event.errorMessage + " (code: " + event.errorCode + ")", true);
    },

    onRoomJoin(event)
    {
        //console.log("Room joined: " + event.room, event.user, event);
        global.currentRoom = event.room;
        var data = new SFS2X.SFSObject();
        global.sfs.send( new SFS2X.ExtensionRequest("WAITING_SCENE_READY", data, global.sfs.lastJoinedRoom) )                
        global.scenes['gameScene'].showGetReady(3);
    },

    onUserEnterRoom(event)
    {
        console.log('user enter room', event);
    },

    onUserCountChange(event) {
//        console.log('user count change', event);
    },

    onUserExitRoom(event)
    {
        console.log('user exit room', event);
        if (event.user.isItMe) {
            /*cc.director.loadScene('gameScene');
        }
        else {*/
            global.SfsDisconnectReason = global.SfsDisconnectReasons.userExitRoom;    
            global.scenes['roomScene'].closeSfsConnection();
            //global.scenes['currentRoom'] = null;
        }
        else {
            if (global.scenes['currentScene'] == global.scenes['waitingScene'])
                global.scenes['currentScene'].setUserList(global.sfs.lastJoinedRoom.getUserList());
        }

    },

    onPublicMessage(event)
    {
        console.log('Public Message Receive', event);
        // if (event.message == "ROUND_STARTED") {
        //     global.gameScript.newGame();
        // }
    },

    onPrivateMessage(event)
    {
        console.log('Private Message Receive', event);
    },

    createTestRoom(){
        this.createRoom (parseInt (0), parseInt (global.MIN_USERS), false);
    },

    createRoom(bet, numPlayers, isPublic) {
        if (!global.connected)
            return;
        let publicString = isPublic ? "_Public_" : "_Private_";
        var level = 10;
        let name = "" + level + publicString + global.user.name;

        let settings = new SFS2X.SFSGameSettings(name);
        //var permissions = {"allowNameChange":true,"allowpasswordstatechange":false,"allowPublicMessages":true,"allowResizing":true};
        let permissions = new SFS2X.RoomPermissions();
        permissions.allowNameChange = true;
        settings.maxUsers = numPlayers + 2;
        settings.minPlayersToStartGame = numPlayers;
        settings.maxVariables = 12;
        settings.isPublic = true;//All games are public to avoid rooms with passwords. Private rooms are handled by code with 
                                 //Room variables
        settings.notifyGameStarted = false;
        //console.log ("ROOM SETTINGS:",settings);
		settings.extension = new SFS2X.RoomExtension(global.SfsExtension + "-JS", global.SfsExtension + "Extension.js");
        settings.permissions = permissions;
        
        // Set the matching expression to filter users who can join the Room
        //settings.playerMatchExpression = new SFS2X.MatchExpression("credits", SFS2X.NumberMatch.GREATER_THAN_OR_EQUAL_TO, level * 100);
        
        
        // Set a Room Variable containing the description of the game
        let levelVar = new SFS2X.SFSRoomVariable("level", level);
        levelVar.isPersistent = true;
        levelVar.isPrivate = true;
        let betVar = new SFS2X.SFSRoomVariable("roomBet", parseInt (bet));
        betVar.isPersistent = true;
        betVar.isPrivate = true;
        let creatorVar = new SFS2X.SFSRoomVariable("creator", global.user.name);
        creatorVar.isPersistent = true;
        creatorVar.isPrivate = true;
        var isPrivate = true;
        if (isPublic){
            isPrivate = false;
        }

        let privateVar = new SFS2X.SFSRoomVariable("private", isPrivate);
        privateVar.isPersistent = true;
        privateVar.isPrivate = true;
        //console.log ("ROOM VARIABLES1:",betVar,levelVar, creatorVar, privateVar);
        settings.variables = [levelVar, creatorVar, privateVar,betVar];
        //Create the game
        global.sfs.send(new SFS2X.CreateSFSGameRequest(settings));
        //console.log ("variables sent");
    },

    onUserVarsUpdate(evt) {
        //console.log('on user vars update', evt);
        // The User that changed his variables
        let user = evt.user;
        let playerOrder = null;
        //console.log ("Changed var" + "(" + user.id + "):", evt.changedVars);
        if (user.id == global.userId){
            if (evt.changedVars.indexOf("order") >= 0) {
                playerOrder = user.getVariable("order").value;
                global.myOrder = playerOrder;
                //console.log('my order is set', global.myOrder);
            }
            if (evt.changedVars.indexOf("credits") >= 0) {
                let credits = user.getVariable("credits").value;
                //console.log('Credits:', credits);
                if (global.scenes['gameScene'] && global.scenes['currentScene'] == global.scenes['gameScene']){
                    global.scenes['gameScene'].onTotalCreditsChanged(credits);
                    //update credits in web page
                    //global.scenes['roomScene'].updateBrowserCredits(credits);
                }
                else {
                    global.credits = credits;
                }
            }
        }
        if (evt.changedVars.indexOf("avatar") >= 0) {
            let userAvatar = user.getVariable("avatar").value;
            //console.log('remote avatar user ' + user.id, userAvatar);
        }
        if (evt.changedVars.indexOf("isBot") >= 0) {
            let isBot = user.getVariable("isBot").value;
            if (global.scenes['gameScene'] && global.scenes['currentScene'] == global.scenes['gameScene'] && playerOrder != null) {
                //console.log('setting user score');
                global.scenes['gameScene'].changeBotIcon(user,isBot);
            }
            //console.log('remote avatar user ' + user.id, userAvatar);
        }
        if (evt.changedVars.indexOf("score") >= 0) {
            let score = user.getVariable("score").value;
            //playerOrder = (playerOrder - global.myOrder + global.playerCnt) % global.playerCnt;
            if (global.scenes['gameScene'] && global.scenes['currentScene'] == global.scenes['gameScene'] && playerOrder != null) {
                //console.log('setting user score');
                global.scenes['gameScene'].setUserScore(playerOrder, score);
            }
        }
        if (evt.changedVars.indexOf("ready") >= 0) {
            let ready = user.getVariable("ready").value;
            if (global.scenes['waitingScene'] && global.scenes['currentScene'] == global.scenes['waitingScene'] && playerOrder != null)
                global.scenes['waitingScene'].showPlayerReady(playerOrder, ready);
        }
    },

    onRoomVarsUpdate(evt) {
        // The User that changed his variables
        //console.log('on room vars update', evt);
        if (evt.changedVars.indexOf("deckCnt") >= 0) {
            var deckCnt = evt.room.getVariable("deckCnt");
            if (global.scenes['gameScene'] && global.scenes['currentScene'] == global.scenes['gameScene']) {
                global.scenes['gameScene'].doSetDeckCount(deckCnt.value);
            }
        }
        if (evt.changedVars.indexOf("trumpCard") >= 0) {
            var trumpCard = evt.room.getVariable("trumpCard");
            if (global.scenes['gameScene'] && global.scenes['currentScene'] == global.scenes['gameScene']) {
                global.scenes['gameScene'].doTakeTrumpCard(trumpCard.value);
            }
        }
    },
    // update (dt) {},

}