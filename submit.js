const axios = require("axios");
const assembly = axios.create({
  baseURL: "https://api.assemblyai.com/v2",
  headers: {
    authorization: "Your api token",
    "content-type": "application/json",
  },
});

assembly
  .post(`/transcript`, {
    audio_url: 'http://dock-home.com/debate.mp4',
    speaker_labels: true
    
  })
  .then((res) => console.log(res.data))
  .catch((err) => console.error(err));