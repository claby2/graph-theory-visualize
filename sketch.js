var start = false;

const pointCount = 30;

var size = Math.min(window.innerWidth, window.innerHeight)/pointCount;

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

// INPUT

document.getElementById("startButton").addEventListener("click", ()=>{
    start = !start;
});

startx = document.getElementById("startx");
starty = document.getElementById("starty");
endx = document.getElementById("endx");
endy = document.getElementById("endy");

startx.value = 0;
starty.value = 0;
endx.value = pointCount-1;
endy.value = pointCount-1;

startx.max = pointCount-1;
starty.max = pointCount-1;
endx.max = pointCount-1;
endy.max = pointCount-1;


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

    if(start){
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
                if(grid[nx][ny] == 'x') continue;
                distance[nx][ny] = distance[cx][cy]+1;
                q.push([nx, ny]);
            }
    
    
    
        }
    
        if(distance[ex][ey] != -1){
            found = true;
            let c = color(0,255,0);
            fill(c);
            noStroke();
            square(xpos[ex], xpos[ey], size);
        }
    
        if(!found){
            for(var i = 0; i < pointCount; i++){
                for(var j = 0; j < pointCount; j++){
                    if(distance[i][j] !== -1){
                        let c = color(255,204,0);
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
                    let c = color(255,0,0);
                    fill(c);
                    noStroke();
                    square(xpos[i], ypos[j], size);
                }
            }
        }
    
        let c = color(0,0,255);
        fill(c);
        noStroke();
        square(xpos[sx], ypos[sy], size);

    } else {
        sx = startx.value;
        sy = starty.value;
        ex = endx.value;
        ey = endy.value;
        found = false;
        let c = color(255,255,255);
        fill(c);
        strokeWeight(1);
        stroke(1);
        for(var i = 0; i < pointCount; i++){
            for(var j = 0; j < pointCount; j++){
                square(xpos[i], ypos[j], size);
            }
        }
        reset(sx,sy,ex,ey)
        c = color(0,0,255);
        fill(c);
        noStroke();
        square(xpos[sx], ypos[sy], size);
    }

}