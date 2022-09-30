export class Recorder {
    constructor(camera) {
        this.camera = camera;
        this.initialize();
    }

    async initialize() {
        this.mediaStream = null;

        this.recordedChunks = [];

        try {
            const mediaDevicesConstraints = {
                audio: true,
                video: { width: 1280, height: 720 },
            };

            this.mediaStream = new MediaStream();
            const inputStream = await navigator.mediaDevices.getUserMedia(mediaDevicesConstraints);
            const videos = inputStream.getVideoTracks();
            for (const v of videos) {
                this.mediaStream.addTrack(v);
            }

            this.camera.srcObject = this.mediaStream;
            this.camera.play();
        } catch (err) {
            throw new Error(err);
        }

    }

    start() {
        if (this.downloaing) {
            this.task = this.start;
            return;
        }

        this.mediaRecorder = new MediaRecorder(
            this.mediaStream,
            {
                mimeType: 'video/webm; codecs=vp8',
            }
        );
        this.mediaRecorder.ondataavailable = (event) => {
            this.recordedChunks.push(event.data);
        };
        this.mediaRecorder.start();
    }

    stop() {
        this.mediaRecorder.stop();
    }

    download(name) {
        this.downloaing = true;

        setTimeout(() => {
            const blob = new Blob(this.recordedChunks, { type: "video/webm" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display: none";
            a.href = url;
            a.download = `${name}.webm`;
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            delete this.mediaRecorder;
            this.recordedChunks = [];
            this.downloaing = false;

            if (this.task) {
                this.task();
                this.task = null;
            }
        }, 100);
    }
}
