
var myPlayer = videojs('my-video', {
    controlBar: {
        muteToggle: false,
        CurrentTimeDisplay: true,
        VolumeMenuButton: true,
        DurationDisplay: true,
        LiveDisplay: true

    }
});

myPlayer.ready(function(){
    var myPlayer = this;

    //myPlayer.play();
    //myPlayer.currentTime();

});
