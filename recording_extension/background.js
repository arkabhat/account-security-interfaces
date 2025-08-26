var capture;
chrome.runtime.onInstalled.addListener(() => {
    capture = false;
});
// chrome.action.onClicked.addListener((tab) => {
//     flag = true;
// });
// chrome.tabs.onUpdated.addListener(function(activeTabId, changeInfo, activeTab){
//     if(flag) {
//         chrome.scripting.executeScript({
//             target: { tabId: activeTabId },
//             files: ["scripts/tracking.js"]
//           });
//     }
// })

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse){
        if(request.type) {
            // var ind = "id_" + request.datetime.toString();
            // const req = new XMLHttpRequest();
            // const baseUrl = "https://127.0.0.1:5000/user_interaction";
            // // const urlParams = `email=${email}&password=${pwd}`;
        
            // req.open("POST", baseUrl, true);
            // req.setRequestHeader("Content-type", "application/json");
            // req.send(JSON.stringify(request));
        
            // req.onreadystatechange = function() { // Call a function when the state changes.
            //     if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            //         console.log("Got response 200!");
            //         sendResponse({status:"success"});
            //     }
            // }
            if (request.type === 'input' || request.type === 'click' || request.type === 'fullPage'){
                if(!capture) {
                    console.log("User Input or Webpage Loaded")
                    console.log(request);
                    fetch('http://127.0.0.1:5052/user_interaction', {
                        method: 'POST',
                        headers: {
                        'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(request)
                    }).then((resp) => {
                        sendResponse({status:"success"})
                    })
                }
            } else if (request.type === 'captureModeChange') {
                capture = request.captureMode;
                sendResponse({status:"success"});
            } else if (request.type === 'capture') {
                if(capture) {
                    // Get screenshot and port over
                    console.log("Getting a capture")
                    console.log(request)
                    console.log(capture)
                    capture = false;
                    fetch('http://127.0.0.1:5052/user_interaction', {
                        method: 'POST',
                        headers: {
                        'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(request)
                    }).then((resp) => {
                        sendResponse({status:"success"})
                    })
                }
            }
        }
        sendResponse({status:"failure"});
});