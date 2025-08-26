// alert("Tracking...")

var topLeft;
var topRight;
var bottomLeft;
var bottomRight;
const sleep = ms => new Promise(r => setTimeout(r, ms));

setInterval(
    async function(request, sender, sendResponse){
        console.log("Full Page Screenshot");
        var canvas = await html2canvas(document.body);
        pageImageData = canvas.toDataURL('image/png')
        takeScreenshot = false;
        chrome.runtime.sendMessage({
            type:'fullPage',
            datetime: Date.now(),
            pageImage: pageImageData
        }).then((response) => {
            console.log(response);
            console.log("received response");
        })
    }, 5000
)

document.addEventListener('click', async (event) => {
    var pageImageData;
    var imageData;

    var elcanvas = await html2canvas(event.srcElement);
    imageData = elcanvas.toDataURL('image/png')

    chrome.runtime.sendMessage({
        type: "click",
        tagname: event.target.tagName,
        id: event.target.className,
        text: event.target.innerText,
        data: event.data,
        datetime: Date.now(),
        elementImage: imageData
    }).then((response) => {
        console.log(response);
        console.log("received response");
    })
})

// document.body.addEventListener('load', async (event) => {

// })

document.addEventListener('input', async (event) => {
    chrome.runtime.sendMessage({
        type: "input",
        tagname: event.target.tagName,
        id: event.target.className,
        text: event.target.innerText,
        data: event.data,
        datetime: Date.now()
    }).then((response) => {
        console.log(response);
        console.log("received response");
    })
})

document.addEventListener('mousedown', async (event) => {
    topLeft = {x:event.pageX, y:event.pageY};
})

document.addEventListener('mouseup', async (event) => {
    bottomRight = {x: event.pageX, y: event.pageY};
    // Populate the rest 
    bottomLeft = {x: topLeft.x, y: event.pageY};
    topRight = {x: event.pageX, y:topLeft.y};
    var canv = await html2canvas(document.body, {
        x: topLeft.x,
        y: topLeft.y,
        width: topRight.x - topLeft.x,
        height: bottomLeft.y - topLeft.y});
    chrome.runtime.sendMessage({
        type: "capture",
        image: canv.toDataURL('image/png'),
        datetime: Date.now()
    }).then((response) => {
        console.log(response);
        console.log("received response");
    })
})