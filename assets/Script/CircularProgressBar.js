// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        circularProgressBar: {
            default: null,
            type: cc.ProgressBar
        },        
        _from: 0,
        _to: 0,
        _duration: 0,
        _elapsed: 0,
        _percentage: 0,
        _tween: null,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.enabled = false;
    },
    isDone(){
        return this.elapsed >= this.duration;
    },

    progressTo (duration, percentage){
        if (percentage < 0 || percentage > 1){
                return;
        }
        //this.action(duration,percentage);
        this.tween (duration, percentage);
    },

    setTo(percentage){
        this._percentage = percentage;
        this.circularProgressBar.progress = this._percentage;
    },
    tween (duration, percentage){
        if (this._tween){
                this._tween.stop();
        }
        this._tween = cc.tween(this.circularProgressBar).to(duration,{progress:percentage}).call(()=>{
            this._tween = null;
        }).start();
    },
    action(duration,percentage){
        this._from = this.circularProgressBar.progress;
        this._to = percentage;
        this._elapsed = 0;
        this._duration = duration;
        this.enabled = true;
    },

    update(dt) {
        if (this.isDone()) {
            this.enabled = false;
            return;
        }
 
        this._elapsed += dt;
 
        let t = this._elapsed / (this._duration > 0.0000001192092896 ? this._duration : 0.0000001192092896);
        t = (1 > t ? t : 1);
        this.step(t > 0 ? t : 0);
    },
 
    step(dt) {
        let percentage = this._from + (this._to - this._from) * dt;
        if (this._percentage != percentage) {
            this._percentage = cc.misc.clamp01(percentage);
            this.circularProgressBar.progress = this._percentage;
        }
    },
});
