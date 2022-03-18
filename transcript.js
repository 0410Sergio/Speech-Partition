const axios = require("axios");
const fs = require('fs')
const assembly = axios.create({
  baseURL: "https://api.assemblyai.com/v2",
  headers: {
    authorization: "Your api token",
    "content-type": "application/json"
  },
});
var len;
var data = fs.readFileSync("storage.json");
var myObject = JSON.parse(data);

// Get transcript from AssemblyAI server.
async function Start() {
  await assembly
    .get(`/transcript/${'Your transcript id here'}`)
    .then((res) => (len = res.data.utterances.length))                // Get length first.
    .catch((err) => console.error(err));
    
  for(let i=0; i < len; i++) {
    await Gather(i);

    fs.readFile("./storage.json", "utf8", function readFileCallback(err, data) {
      if (err) {
        console.log(err);
      }
      var obj = JSON.parse(data);                                
      obj.push(myObject);                                       // Make sure JSON file has [{}]
      var json = JSON.stringify(obj, null, 2);
      fs.writeFile("./storage.json", json, "utf8", (err) => {   // Push next object in transcript to JSON file.
        if (err) {
          console.log(err);
        } else {
          console.log("Done");
        }
      });
      
    });

  }
}

// Get the next object in the transcript.
async function Gather(i) {
  await assembly
    .get(`/transcript/${'Your transcript id here'}`)
    .then((res) => (myObject = (res.data.utterances[i])))          // .utterances gets only the text, start, end, and speaker labels.
    .catch((err) => console.error(err));
}

Start();
