

export function  ColorDetect(){

    return true;
}

const cameraDeviceIds = [/* { deviceId, label } */];
navigator.mediaDevices.enumerateDevices().then(function(mediaDevices) {
  for (let len = mediaDevices.length, i = 0; i < len; i++) {
    const item = mediaDevices[i];
    // NOTE: カメラデバイスの場合、 kind プロパティには "videoinput" が入っている:
    if (item.kind === "videoinput") {
      const deviceId = item.deviceId;
      const label = item.label;
      // NOTE: ここでデバイスID（とラベル）を適当な変数に保存しておく
      cameraDeviceIds.push({ deviceId, label });
    }
  }
});



function draw() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // ctx.drawImage(video, 0, 0);
    requestAnimationFrame(draw);
}


window.addEventListener('load', function() {
    startup();
});

function startup() {
    const medias = {
        audio: false,
        video: {
            deviceId: cameraDeviceIds[0],
            // facingMode: "user"   // フロントカメラを利用する
            // facingMode: { exact: "environment" } // リアカメラを利用する場合
        }
    };
    navigator.mediaDevices.getUserMedia(medias).then(function(stream) {
        video.srcObject = stream;
        medias.play();
        console.log("awakeeeeee");
        requestAnimationFrame(draw);
        
    }).catch(function(err) {
        window.alert("カメラの使用が許可されませんでした");
    });
}