//const sock = new WebSocket("wss://shutupjack.buzz/jack-botherer-3017", "bother");
const sock = new WebSocket("wss://shutupjack.buzz/jack-botherer-3017");
const vibrationDuration = 3000;  // milliseconds

const vibrateMaybe = () => {
    document.body.classList.add("shake");
    setTimeout(() => {
        document.body.classList.remove("shake");
    }, vibrationDuration);

    if (typeof navigator.vibrate === "function") {
        navigator.vibrate(vibrationDuration);
        return true;
    } else {
        console.log("Use on phone (and enable vibration in ring settings) for best results");
        return false;
    }
};

const displayStatus = (text) => {
    const statusElem = document.getElementById("text-status");
    statusElem.innerHTML = text;
    setTimeout(() => {
        const statusElemInner = document.getElementById("text-status");
        statusElemInner.innerHTML = "";
    }, vibrationDuration);
};

onload = (event) => {
    console.log("Loaded");
    //navigator.wakeLock.request("screen");
    const iAmJackButton = document.getElementById("i-am-jack");
    iAmJackButton.onclick = (event) => {
        sock.send("jack");
    };

    const requestShutUpButton = document.getElementById("request-shut-up");
    requestShutUpButton.onclick = (event) => {
        sock.send("shut up");
    };
};

sock.onmessage = (event) => {
    message = event.data;
    if (event.data === "Please shut up" || event.data.startsWith("Hi")) {
        let vibrated = vibrateMaybe();
        if (!vibrated) {
            message += " (vibration not supported on this device)";
        }
    }
    displayStatus(message);
};

// FML
//sock.onclose = (event) => {
//    const needToShutUpElem = document.getElementById("text-status");
//    needToShutUpElem.innerHTML += " [closed] " + event.code + " " + event.reason;
//}
//
//sock.onerror = (error) => {
//    const needToShutUpElem = document.getElementById("text-status");
//    needToShutUpElem.innerHTML = "whoopsie doodle " + error.code;
//};
