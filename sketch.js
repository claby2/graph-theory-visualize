var start = false;

const pointCount = Math.floor(Math.min(window.innerWidth, window.innerHeight)/32);

var size = pointCount;

var c;

var xpos = [];
var ypos = [];

for(var i = 0; i < pointCount; i++){
    xpos[i] = i*pointCount;
    ypos[i] = i*pointCount;
}

var grid = new Array(pointCount);
for(var i = 0; i < pointCount; i++){
    grid[i] = new Array(pointCount);
}

var distance = [];

for(var i = 0; i < pointCount; i++){
    distance[i] = new Array(pointCount);
    for(var j = 0; j < pointCount; j++){
        distance[i][j] = -1;
    }
}

var q = [];

var ex = pointCount-1;
var ey = pointCount-1; 

var sx = 0;
var sy = 0;

// COLORS

startColor = [30,136,229]
endColor = [85,139,47]
blockColor = [255,61,0];

// INPUT

startButton = document.getElementById("startButton");

startButton.addEventListener("click", ()=>{
    selectingStart = false;
    selectingEnd = false;
    placingBlock = false;
    start = !start;
});

var selectingStart = false;
var selectingEnd = false;
var placingBlock = false;

document.getElementById("toggleSelectStart").addEventListener("click", ()=>{
    selectingStart = true;
    selectingEnd = false;
    placingBlock = false;
    start = false;
});

document.getElementById("toggleSelectEnd").addEventListener("click", ()=>{
    selectingEnd = true;
    selectingStart = false;
    placingBlock = false;
    start = false;
});

document.getElementById("placeBlock").addEventListener("click", ()=>{
    placingBlock = true;
    selectingStart = false;
    selectingEnd = false;
    start = false;
});

document.getElementById("resetBlock").addEventListener("click", ()=>{
    c = color(255,255,255);
    fill(c);
    strokeWeight(1);
    stroke(1);
    for(let i = 0; i < pointCount; i++){
        for(let j = 0; j < pointCount; j++){
            grid[j][i] = null;
            square(xpos[j], ypos[i], size);
        }
    }
});

function mouseClicked() {
    if(selectingStart){
        if(mouseX <= pointCount*pointCount && mouseX >= 0 && mouseY <= pointCount*pointCount && mouseY >= 0){
            sx = floor(mouseX/pointCount);
            sy = floor(mouseY/pointCount);
            selectingStart = false;
        }
    } else if(selectingEnd){
        if(mouseX <= pointCount*pointCount && mouseX >= 0 && mouseY <= pointCount*pointCount && mouseY >= 0){
            ex = floor(mouseX/pointCount);
            ey = floor(mouseY/pointCount);
            selectingEnd = false;
        }
    }
    //else if(placingBlock){
    //     if(mouseX <= pointCount*pointCount && mouseX >= 0 && mouseY <= pointCount*pointCount && mouseY >= 0){
    //         grid[floor(mouseY/pointCount)][floor(mouseX/pointCount)] = 'x';
    //         console.log(grid[floor(mouseY/pointCount)][floor(mouseX/pointCount)]);
    //     }
    // }
}

// ANIMATION + LOGIC

function reset(isx, isy, iex, iey) {
    isx = parseInt(isx, 10);
    isy = parseInt(isy, 10);
    iex = parseInt(iex, 10);
    iey = parseInt(iey, 10);
    
    q = [];

    sx = isx;
    sy = isy;

    for(let i = 0; i < pointCount; i++){
        for(let j = 0; j < pointCount; j++){
            distance[i][j] = -1;
        }
    }

    distance[isx][isy] = 0;
    
    q.push([isx, isy]);
    
    ex = iex; ey = iey;
}

reset(sx,sy,ex,ey)

var dx = [0, 0, 1, -1];
var dy = [1, -1, 0, 0];

function setup() {
    createCanvas(displayWidth, displayHeight);

    for(var i = 0; i < pointCount; i++){
        for(var j = 0; j < pointCount; j++){
            square(xpos[i], ypos[j], size);
        }
    }

}

let found = false;

function draw() {

    if(mouseIsPressed && placingBlock){
        if(mouseX <= pointCount*pointCount && mouseX >= 0 && mouseY <= pointCount*pointCount && mouseY >= 0){
            grid[floor(mouseY/pointCount)][floor(mouseX/pointCount)] = 'x';
            console.log(grid[floor(mouseY/pointCount)][floor(mouseX/pointCount)]);
        }
    }

    if(start){
        startButton.innerText = "clear";
        if(!found && q !== undefined && q.length > 0){
            var cx = q[0][0];
            var cy = q[0][1];
    
            q.shift();
    
    
            for(var i = 0; i < 4; i++){
                var nx = cx + dx[i];
                var ny = cy + dy[i];
                if(nx < 0 || ny < 0) continue;
                if(nx >= pointCount || ny >= pointCount) continue;
                if(distance[nx][ny] != -1) continue;
                if(grid[ny][nx] == 'x') continue;
                distance[nx][ny] = distance[cx][cy]+1;
                q.push([nx, ny]);
            }
    
        }
    
        if(distance[ex][ey] != -1){
            found = true;
        }
    
        c = color(endColor);
        fill(c);
        noStroke();
        square(xpos[ex], xpos[ey], size);

        if(!found){
            for(var i = 0; i < pointCount; i++){
                for(var j = 0; j < pointCount; j++){
                    if(distance[i][j] !== -1){
                        c = color(255,204,0);
                        fill(c);
                        noStroke();
                        square(xpos[i], ypos[j], size);
                    }
                }
            }
        }
    
        for(var i = 0; i < pointCount; i++){
            for(var j = 0; j < pointCount; j++){
                if(grid[i][j] === 'x'){
                    c = color(blockColor);
                    fill(c);
                    noStroke();
                    square(xpos[j], ypos[i], size);
                }
            }
        }
    
        c = color(startColor);
        fill(c);
        noStroke();
        square(xpos[sx], ypos[sy], size);

    } else {
        startButton.innerText = "start";
        found = false;

        c = color(255,255,255);
        fill(c);
        strokeWeight(1);
        stroke(1);
        for(var i = 0; i < pointCount; i++){
            for(var j = 0; j < pointCount; j++){
                square(xpos[i], ypos[j], size);
            }
        }

        reset(sx,sy,ex,ey)

        c = color(blockColor);
        fill(c);
        strokeWeight(1);
        stroke(1);

        for(var i = 0; i < pointCount; i++){
            for(var j = 0; j < pointCount; j++){
                if(grid[i][j] === 'x'){
                    square(xpos[j], ypos[i], size);
                }
            }
        }

        c = color(endColor);
        fill(c);
        noStroke();
        square(xpos[ex], ypos[ey], size);

        c = color(startColor);
        fill(c);
        noStroke();
        square(xpos[sx], ypos[sy], size);
    }

}