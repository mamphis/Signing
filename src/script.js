canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const btnSave = document.querySelector('#save-canvas');
const btnClear = document.querySelector('#clear-canvas');
const inpColor = document.querySelector('#color-picker');

let mouseIsPressed = 0,
    actualX = 0,
    actualY = 0;

btnSave.onclick = () => {
    // console.log(cnv);
    // debugger;
    let downloadLink = document.createElement('a');
    downloadLink.setAttribute('download', 'signing.png');
    let dataURL = canvas.toDataURL('image/png');
    let url = dataURL.replace(/^data:image\/png/, 'data:application/octet-stream');
    downloadLink.setAttribute('href', url);
    downloadLink.click();

    downloadLink.remove();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setup();
};

btnClear.onclick = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setup();
};

inpColor.onchange = () => {
    ctx.strokeStyle = inpColor.value;
};
document.querySelectorAll('input[type=range]').forEach((input) => {
    const name = input.dataset.name;
    input.onchange = () => {
        window[name] = parseFloat(input.value);
        document.getElementById(name + '-value').innerText = input.value;
    };

    window[name] = parseFloat(input.value);
    document.getElementById(name + '-value').innerText = input.value;
});

function setup() {
    canvas.height = window.innerHeight * 0.9;
    canvas.width = window.innerWidth * 0.9;

    ctx.strokeStyle = inpColor.value;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
}

// brushSize simply is the thikness of the brush stroke
// const brushSize = 10
// const spring = 0.9
// const friction = 0.2
// const splitNum = 100
// const minWidth = 0.5

let isDrawing = false;
let v = 0.5;
let r = 0;
let vx = 0;
let vy = 0;

function draw() {
    let mouseX = actualX;
    let mouseY = actualY;
    if (mouseIsPressed) {
        if (!isDrawing) {
            isDrawing = true;
            x = mouseX;
            y = mouseY;
        }
        vx += (mouseX - x) * (1 - spring);
        vy += (mouseY - y) * (1 - spring);
        vx *= 1 - friction;
        vy *= 1 - friction;

        v += Math.sqrt(vx * vx + vy * vy) - v;
        v *= 0.15;

        oldR = r;
        r = brushSize - v;

        for (let i = 0; i < splitNum; ++i) {
            oldX = x;
            oldY = y;
            x += vx / splitNum;
            y += vy / splitNum;
            oldR += (r - oldR) / splitNum;
            if (oldR < 1) {
                oldR = 1;
            }
            ctx.beginPath();
            ctx.lineWidth = oldR + minWidth; // AMEND: oldR -> oldR+diff
            ctx.moveTo(x, y);
            ctx.lineTo(oldX, oldY);
            ctx.stroke();
        }
    } else if (isDrawing) {
        vx = vy = 0;
        isDrawing = false;
    }

    requestAnimationFrame(draw);
}

window.onload = () => {
    setup();
};

window.onresize = () => {
    canvas.height = window.innerHeight * 0.9;
    canvas.width = window.innerWidth * 0.9;
};

document.body.onmousedown = (me) => {
    if (
        me.x > canvas.offsetLeft &&
        me.y > canvas.offsetTop &&
        me.x < canvas.offsetLeft + canvas.width &&
        me.y < canvas.offsetTop + canvas.height &&
        me.button === 0
    )
        mouseIsPressed = true;
};
document.body.onmouseup = (me) => {
    if (me.button === 0) mouseIsPressed = false;
};

canvas.onmousemove = (me) => {
    actualX = me.x - canvas.offsetLeft;
    actualY = me.y - canvas.offsetTop;
};

requestAnimationFrame(draw);
