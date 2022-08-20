import { Recorder } from "./Recorder.js";

/** 録画対象 */
let _target = "";
/** 録画残り時間 */
let _leftTime = 0;
/** カウントダウンタイマー */
let _countDownTimer;
/** レコーダー */
let _recorder;

/** 録画ステータス */
let state;
/** 残り時間 */
let time;
/** 時間指定 */
let timeInput;
/** 入力欄 */
let input;
/** 録画履歴 */
let log;

window.addEventListener("load", () => {
    state = document.getElementById("state");
    time = document.getElementById("time");

    timeInput = document.getElementById("timeInput");

    input = document.getElementById("input");
    input.addEventListener("change", () => {
        start(input.value);
        input.value = "";
    });

    log = document.getElementById("log");

    _recorder = new Recorder(document.getElementById("camera"));
});

function start(input) {
    if (input === undefined) return;
    if (_target !== "") stop();

    _recorder.start();

    _target = input;
    _leftTime = timeInput.value;

    state.innerText = "録画中　 残り";

    time.innerText = _leftTime;
    time.style.color = "crimson";

    const p = document.createElement("p");

    const div1 = document.createElement("div");
    div1.innerText = timeText();
    p.appendChild(div1);

    const div2 = document.createElement("div");
    div2.style.color = "crimson";
    div2.style.fontWeight = "bold";
    div2.innerText = input;
    p.appendChild(div2);

    const div3 = document.createElement("div");
    div3.innerText = "の録画を開始します";
    p.appendChild(div3);

    log.insertBefore(p, log.firstChild);

    _countDownTimer = setInterval(countDown, 1000);
}

function stop() {
    _recorder.stop();
    _recorder.download(_target);

    state.innerText = "録画停止 残り";

    time.innerText = 0;
    time.style.color = "black";

    const p = document.createElement("p");

    const div1 = document.createElement("div");
    div1.innerText = timeText();
    p.appendChild(div1);

    const div2 = document.createElement("div");
    div2.style.color = "crimson";
    div2.style.fontWeight = "bold";
    div2.innerText = _target;
    p.appendChild(div2);

    const div3 = document.createElement("div");
    div3.innerText = "の録画を停止しました";
    p.appendChild(div3);

    log.insertBefore(p, log.firstChild);

    clearInterval(_countDownTimer);

    _target = "";
    _leftTime = 0;
}

function timeText() {
    const date = new Date();
    const hour = ("0" + date.getHours()).slice(-2);
    const minute = ("0" + date.getMinutes()).slice(-2);
    const second = ("0" + date.getSeconds()).slice(-2);

    return `${date.getMonth() + 1}/${date.getDay()} ${hour}:${minute}:${second}`;
}

function countDown() {
    --_leftTime;
    time.innerText = _leftTime;

    if (_leftTime <= 0) {
        stop();
    }
}
