const express = require('express');
const ws = require('ws'); 
const http = require(`http`); 
const rtspRelay = require('rtsp-relay');
// this stuff below is needed to read/write to rtsp-simple-server.yml file, not doing that in this demo yet.
const fs = require('fs-extra');
const readline = require('readline');
const insertLine = require('insert-line');

const app = express();
// client was having hard time finding this var so I made it global - just for this demo
roomName = 'room300';  // in application we will get this from db.

const vidserver = http.createServer(app);
const { proxy, scriptUrl } = rtspRelay(app, vidserver);

app.ws('/api/stream/:cameraIP', (ws, req) =>
  proxy({
    additionalFlags: ['-q', '1'], // these are flags passed to ffmpeg 
    transport: 'tcp',

    url: `rtsp://localhost:8554/${req.params.cameraIP}`, // cameraIP contains our proxy name from client.
  })(ws),
);

app.get('/', (req, res) =>
  res.send(`
  <canvas id='canvas'></canvas>

  <script src='${scriptUrl}'></script>
  <script>
  
  setTimeout(function() {
    
    loadPlayer({
      
      /**     
        here we are specifiying the rtsp proxy url - this is being streamed from our local rtsp-simple-server instance no matter
        where the actual camera comes from. All url's called in client code will always start like this: rtsp://localhost:8554/
        Then we add our room identifier, so something like room300 would be: rtsp://localhost:8554/room300 
        it is important to note: the rtsp-simple-server.yml file already has our a url defined that will work with the other values
        defined in this app. The following is already defined in yml file: 
        paths: 
          room300:
            source: "rtsp://localhost:8554/profile2/media.smp" 
        we must modify this file each time we add or remove an rtsp camera url. 
        rtsp-relay module gives us the ability to pass a parameter from client to server so we use that to pass our room name by
        constructing our url in client as follows: rtsp://localhost:8554/${roomName}    
      */ 
      
      url: 'ws://' + location.host + '/api/stream/${roomName}',
      canvas: document.getElementById('canvas'),
      onDisconnect: () => console.log('Connection lost!') 
    });
  }, 500);
  </script>
`),
);
vidserver.listen(3000);

