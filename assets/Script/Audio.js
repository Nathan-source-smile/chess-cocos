// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

var Audio = {
    playEffect (fileName){
        let filePath = "Audio/" + fileName;
        cc.loader.loadRes(filePath, function (err, sound){
            if (err){
                console.log ("Error playing effect", filePath);
                return;
            }
            cc.audioEngine.playEffect(sound, false);
        });
    },
    playMusic (fileName){
        let filePath = "Audio/" + fileName;
        cc.loader.loadRes(filePath, function (err, sound){
            if (err){
                console.log ("Error playing music", filePath);
                return;
            }
            cc.audioEngine.playMusic(sound, true);
        });
    },
    stopMusic (){
        cc.audioEngine.stopMusic();
    }

    // update (dt) {},
}
module.exports = Audio;