const player = document.getElementById('video');
let src = null;
let dst = null;
let cap = null;
let isCvLoaded = false

let hsv = null;
let img = null;
let lower = [90, 64, 0];
let upper = [150, 255, 255];
let frame_mask = null;

export function ColorDetect() {
    return null;
}

function onOpenCvReady() {
    if (cv.getBuildInformation) {
        console.log(cv.getBuildInformation());
        onloadCallback();
    } else {
        cv['onRuntimeInitialized'] = () => {
            console.log(cv.getBuildInformation());
            onloadCallback();
        }
    }
};

function onloadCallback() {
    isCvLoaded = true;
};

const constraints = {
    video: true,
};

// Attach the video stream to the video element and autoplay.
navigator.mediaDevices.getUserMedia(constraints)
    .then((stream) => {
        player.srcObject = stream;
        player.addEventListener('canplay', onVideoCanPlay, false);
    });

function onVideoCanPlay() {
    player.width = player.videoWidth // width, heightを設定しないとcap.read(src)で失敗する。
    player.height = player.videoHeight
    setTimeout(processVideo, 100);
};

const FPS = 30;

function processVideo() {
    try {
        if (!isCvLoaded) {
            setTimeout(processVideo, 100);
            return;
        } else if (cap == null) {
            cap = new cv.VideoCapture(player);
        }
        let begin = Date.now();

        src = new cv.Mat(player.height, player.width, cv.CV_8UC4);
        dst = new cv.Mat();

        img = src;
        cap.read(src);
        cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);

        hsv = cv.cvtColor(img, dst, cv.COLOR_BGR2HSV)
        frame_mask = cv.inRange(hsv, lower, upper)
        dst = cv.bitwise_and(img, img, mask = frame_mask)

        cv.imshow('canvas', dst);

        src.delete();
        dst.delete();

        let delay = 1000 / FPS - (Date.now() - begin);
        setTimeout(processVideo, delay);
    } catch (err) {
        console.error(err.message);
    }
    return;
};


window.addEventListener('load', function() {
    onOpenCvReady();
});