const player = document.getElementById('video');
let src = null;
let dst = null;
let cap = null;
let isCvLoaded = false

let hsv = null;
let img = null;
let lower = null;
let upper = null;
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
        hsv = new cv.Mat();
        frame_mask = new cv.Mat();

        cap.read(src);
        // cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);

        // lower = new cv.Mat(src.rows, src.cols, src.type(), [0, 0, 0, 0]);
        // upper = new cv.Mat(src.rows, src.cols, src.type(), [150, 150, 150, 255]);
        lower = [230, 155, 0, 0];
        upper = [255, 195, 25, 255];
        let low = new cv.Mat(src.rows, src.cols, src.type(), lower);
        let high = new cv.Mat(src.rows, src.cols, src.type(), upper);

        // const lower = cv.matFromArray(3, 1, cv.CV_64FC1, [
        //     H * 0.9,
        //     S * 0.4,
        //     V * 0.3
        // ])

        // // 肌として認識する色範囲(上限)
        // const upper = cv.matFromArray(3, 1, cv.CV_64FC1, [
        //     H * 1.3,
        //     Math.min(S * 1.3, 255),
        //     Math.min(V * 3, 255)
        // ])

        cv.cvtColor(src, hsv, cv.COLOR_RGBA2GRAY);
        cv.inRange(hsv, low, high, frame_mask);
        cv.bitwise_and(src, src, dst);

        cv.imshow('canvas', dst);
        src.delete();
        dst.delete();
        frame_mask.delete();

        let delay = 1000 / FPS - (Date.now() - begin);
        setTimeout(processVideo, delay);
    } catch (err) {
        // console.error(err.message);
    }

    return;
};


window.addEventListener('load', function() {
    onOpenCvReady();
});