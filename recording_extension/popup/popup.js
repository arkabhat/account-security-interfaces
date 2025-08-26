console.log("Started Extension!")

function save_recording() {
    const request = {dirpath: document.getElementById('fpath').value}
    fetch('http://127.0.0.1:5052/save_user_interaction', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
    }).then((resp) => {
        var content = resp.json();
        console.log(content);
    })
}

document.getElementById("save_recording").addEventListener("click", save_recording)

function toggle_screenshot() {
    var el = document.getElementById('screenshot_mode');
    if (el.innerText === "Screenshot Mode: Off") {
        el.innerText = "Screenshot Mode: On";
        chrome.runtime.sendMessage({
            type: 'captureModeChange',
            captureMode: "True"
        }).then((response) => {
            console.log(response);
        })
    } else {
        el.innerText = "Screenshot Mode: Off";
        chrome.runtime.sendMessage({
            type: 'captureModeChange',
            captureMode: "False"
        }).then((response) => {
            console.log(response);
        })
    }
}
document.getElementById("screen_capture").addEventListener("click", toggle_screenshot)