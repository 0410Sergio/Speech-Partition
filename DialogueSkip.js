
let mapText = new Map();
let mapStart = new Map();
let mapEnd = new Map();
let mapSpeaker = new Map();
let jump = ''; // Current text id will be stored here.
let textLength = 0;
let intervalScroller;
let intervalOne;
let intervalTwo;

// Get length of json.
fetch("storage.json")
    .then(response => {
        return response.json();
    })
    .then(jsondata =>  textLength = jsondata.length);

// Take data from storage.json and map it to variables.
async function Collect() {
    await sleep(100); // Make sure got length first.

    // Create empty divs on page else all text won't load.
    for(let n=1; n < textLength; n++) {
        $("#dialogue")[0].innerHTML += "<div id = " + n + ">"+'null' + '</div><br>';
    }
    await sleep(100); // Make sure all divs created first.

    for(let i = 1; i < textLength; i++) {
        fetch("storage.json")
            .then(response => {
                return response.json();
            })
            .then(jsondata =>  mapText.set(i, jsondata[i].text))
            .then(jsondata => $("#" + i)[0].innerHTML = mapText.get(i));
        };
    for(let i = 1; i < textLength; i++) {
        fetch("storage.json")
            .then(response => {
                return response.json();
            })
            .then(jsondata =>  mapStart.set(i, jsondata[i].start))
        };
    for(let i = 1; i < textLength; i++) {
        fetch("storage.json")
            .then(response => {
                return response.json();
            })
            .then(jsondata =>  mapEnd.set(i, jsondata[i].end))
        };
    for(let i = 1; i < textLength; i++) {
        fetch("storage.json")
            .then(response => {
                return response.json();
            })
            .then(jsondata =>  mapSpeaker.set(i, jsondata[i].speaker))
        };
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

// Wait 4 seconds for all text to load before editing it.
async function timer() {
    await sleep(4000);

    for(let [key, value] of mapSpeaker) {
        
        if(value == 'A') {
            $("#"+ key)[0].style = "color:black" // Color code text by speaker.
        } 
        else if(value == 'B') {
            $("#"+ key)[0].style = "color:blue"
        }
    };

    // Check every .2 seconds for video time then scroll page to center text to match.
    intervalScroller = window.setInterval(() => {
        let time = myPlayer.currentTime();
        
        for(let [key, value] of mapStart){
            if(value/1000 <= time && mapEnd.get(key)/1000 > time) { // Go to div id between beginning and end of current speaker.
                jump = key; 
            }
        }
        document.getElementById(jump).scrollIntoView({block: 'center'});
      }, 200);
}

async function convoSplit() {
    await(3000);

    $( "#person1:button" ).click( function( event ) {
        firstPerson();
    });
    $( "#person2:button" ).click( function( event ) {
        secondPerson();
    });
    $( "#both:button" ).click( function( event ) {
        bothPeople();
    });
    $( ".feedback" ).click( function( event ) {       // Remove the auto-scroller.
        window.clearInterval(intervalScroller);
    });
};

function firstPerson() {
    window.clearInterval(intervalTwo);
                                            // Clear other active buttons and make first speaker active.
    $("#both").removeClass("active");
    $("#person2").removeClass("active");
    $("#person1").addClass("active");
    intervalOne = window.setInterval(() => {
                                            // Check every .2 seconds that the speaker is not speaker 'B' and jump past it.
        if(mapSpeaker.get(jump) == 'B') {   
            myPlayer.currentTime(mapStart.get(++jump)/1000);
        }
        console.log(mapSpeaker.get(jump));
        
    }, 200);
}

function secondPerson() {
    window.clearInterval(intervalOne);

    $("#both").removeClass("active");
    $("#person2").addClass("active");
    $("#person1").removeClass("active");
    intervalTwo = window.setInterval(() => {
        if($("#person2").hasClass("active")) {
            if(mapSpeaker.get(jump) == 'A') {
                myPlayer.currentTime(mapStart.get(++jump)/1000);
            }
            console.log(mapSpeaker.get(jump));
        }
    }, 200);
}

function bothPeople() {                  // Clear other intervals on speakers and return to both.
    window.clearInterval(intervalOne);
    window.clearInterval(intervalTwo);

    $("#both").addClass("active");
    $("#person2").removeClass("active");
    $("#person1").removeClass("active");
}

// Initialize
Collect(); 
timer();
convoSplit();