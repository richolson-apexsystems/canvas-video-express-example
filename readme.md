This is a basic application that illustrates how to use rtsp-relay with Dockerized rtsp-simple-server acting as an RTSP stream proxy.

#### VSCode

I used a vscode wsl terminal to install and run the express application.

#### Windows PowerShell

The rtsp server commands and ffmpeg commands were run from Windows PowerShell terminals.

#### Quick Start

After cloning the repository, navigate to the 'canvas-video' directory, open a wsl terminal and run `npm install`.
To start the server run `node server`.

#### RTSP Server

With Docker Desktop running open a Windows PowerShell terminal, navigate to the canvas-video-express-example directory where `rtsp-simple-server.yml` is located and run the following command:

```
docker run --rm -it -e RTSP_PROTOCOLS=tcp -p 8554:8554 -p 1935:1935 -p 8888:8888 -v $PWD/rtsp-simple-server.yml:/rtsp-simple-server.yml aler9/rtsp-simple-server
```

From the same directory in another Windows PowerShell terminal run:

```
ffmpeg -re -stream_loop -1 -i $PWD\big_buck_bunny_720p_surround.mp4 -rtsp_transport tcp -c:v copy -c:a copy -f rtsp rtsp://localhost:8554/profile2/media.smp
```
