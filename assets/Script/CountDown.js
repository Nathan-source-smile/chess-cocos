export default cc.Class({
    extends: cc.Component,

    properties: {
        timerLabel: {
            default: null,
            type: cc.Label
        },        
        timerNode: {
            default: null,
            type: cc.Node
        },        
        _finalTime: null,
        _countsLeft:0,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    setFinalTime (seconds){
        var currentDate = new Date();
        this._finalTime = new Date();
        this._finalTime.setSeconds (currentDate.getSeconds() + seconds);
    },

    getCurrentTimerString (){
        var currentDate = new Date();
        var timerString = "0:00";
        if (this._finalTime >= currentDate){
            var timeDifference = this._finalTime - currentDate;
            var secondsDifference = Math.ceil(timeDifference / 1000);
            var mins = Math.floor(secondsDifference/60);
            var secs = secondsDifference % 60;
            //var timerString = "" + (mins < 10 ? "0" : "") + mins + ":" + (secs < 10 ? "0" : "") + secs;
            timerString = "" + mins + ":" + (secs < 10 ? "0" : "") + secs;
        }
        return timerString;
    },

    displayTimerString (timerString){
        if (timerString.localeCompare(this.timerLabel.string)!=0){
            this.timerLabel.string = timerString;
        }
    },


    startCountDown (seconds){
        this.enabled = true;
        this.setFinalTime(seconds);
        this.timerNode.active = true;
        this.displayTimerString(this.getCurrentTimerString());
        //Interval between repetitions
        let interval = 1;
        // Time of repetition
        let repeat = seconds;
        // Start delay
        let delay = 1;
        this._countsLeft = seconds;
        this.schedule(function() {
            this._countsLeft --;
            this.displayTimerString(this.getCurrentTimerString());
        }, interval, repeat, delay);    
    },


    start () {
    },

    update (dt) {
        var currentDate = new Date();
        if (this._finalTime != null){
            //console.log (this._finalTime, currentDate, this._countsLeft);
            if (this._finalTime < currentDate && this._countsLeft <= 0){
                this._finalTime = null;
                this.enabled = false;
                this.timerNode.active = false;
            }    
        }
    },
});
