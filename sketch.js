var start = false;

var pointCount = Math.floor(Math.min(window.innerWidth, window.innerHeight)/35);

var size = pointCount;

var c;

var xpos = [];
var ypos = [];

var algorithm;

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

var visited = [];

for(var i = 0; i < pointCount; i++){
    visited[i] = new Array(pointCount);
    for(var j = 0; j < pointCount; j++){
        visited[i][j] = 0;
    }
}

var accessNum = 0;

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
    resetBlocks();
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
}

window.addEventListener("resize", ()=>{
    start = false;

    pointCount = Math.floor(Math.min(window.innerWidth, window.innerHeight)/35);
    
    size = pointCount;
    for(var i = 0; i < pointCount; i++){
        xpos[i] = i*pointCount;
        ypos[i] = i*pointCount;
    }

    ex = pointCount-1;
    ey = pointCount-1; 
    sx = 0;
    sy = 0;

    reset(sx,sy,ex,ey)
    resetBlocks();
    setup();
})

// ANIMATION + LOGIC

let statusOutput = document.getElementById("statusOutput");
let accessCount = document.getElementById("accessCount");
let status = document.getElementById("status");

function resetBlocks(){
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
}

function reset(isx, isy, iex, iey) {
    accessNum = 0;

    isx = parseInt(isx, 10);
    isy = parseInt(isy, 10);
    iex = parseInt(iex, 10);
    iey = parseInt(iey, 10);
    
    q = [];

    sx = isx;
    sy = isy;

    for(var i = 0; i < pointCount; i++){
        for(var j = 0; j < pointCount; j++){
            distance[i][j] = -1;
        }
    }

    distance[isx][isy] = 0;
    
    q.push([isx, isy]);
    
    ex = iex; 
    ey = iey;

    //DFS reset
    for(var i = 0; i < pointCount; i++){
        for(var j = 0; j < pointCount; j++){
            visited[i][j] = 0;
        }
    }
}

reset(sx,sy,ex,ey)

var dx = [0, 0, 1, -1];
var dy = [1, -1, 0, 0];

let genMazeButton = document.getElementById("genMazeButton");

function generateMaze(){

    for(var i = 0; i < pointCount; i++){
        for(var j = 0; j < pointCount; j++){
            grid[i][j] = 'x';
        }
    }

    grid[sx][sy] = null;

    let walls =[];

    if(sx+1 < pointCount) walls.push([sx+1, sy]);
    if(sx-1 >= 0) walls.push([sx-1, sy]);
    if(sy+1 < pointCount) walls.push([sx, sy+1]);
    if(sy-1 >= 0) walls.push([sx, sy-1]);


    while(walls.length > 0){
        let randomWall = Math.floor(Math.random()*walls.length);
        var nx = walls[randomWall][0];
        var ny = walls[randomWall][1];
        
        let uc = [];

        if(nx + 1 < pointCount && grid[nx+1][ny] !== 'x') uc.push([nx-1, ny]);
        if(nx - 1 >= 0 && grid[nx-1][ny] !== 'x') uc.push([nx+1, ny]);
        if(ny + 1 < pointCount && grid[nx][ny+1] !== 'x') uc.push([nx, ny-1]);
        if(ny - 1 >= 0 && grid[nx][ny-1] !== 'x') uc.push([nx, ny+1]);

        if(uc.length === 1){
            grid[nx][ny] = null;
            if(uc[0][0] >= 0 && uc[0][0] < pointCount && uc[0][1] >= 0 && uc[0][1] < pointCount){
                grid[uc[0][0]][uc[0][1]] = null;

                if(uc[0][0] + 1 < pointCount && grid[uc[0][0]+1][uc[0][1]] === 'x') walls.push([uc[0][0]+1, uc[0][1]]);
                if(uc[0][0] - 1 >= 0 && grid[uc[0][0]-1][uc[0][1]] === 'x') walls.push([uc[0][0]-1, uc[0][1]]);
                if(uc[0][1] + 1 < pointCount && grid[uc[0][0]][uc[0][1]+1] === 'x') walls.push([uc[0][0], uc[0][1]+1]);
                if(uc[0][1] - 1 >= 0 && grid[uc[0][0]][uc[0][1]-1] === 'x') walls.push([uc[0][0], uc[0][1]-1]);

            }
        }

        walls.splice(randomWall, 1);
    }

}

genMazeButton.addEventListener("click", ()=>{
    selectingEnd = false;
    selectingStart = false;
    placingBlock = false;
    start = false;
    generateMaze();
})

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);

    for(var i = 0; i < pointCount; i++){
        for(var j = 0; j < pointCount; j++){
            square(xpos[i], ypos[j], size);
        }
    }

}

let found = false;

//Draw

function draw() {

    accessCount.innerText = accessNum;

    algorithm = document.getElementById("algorithmSelect").value;

    if(mouseIsPressed && placingBlock){
        if(mouseX <= pointCount*pointCount && mouseX >= 0 && mouseY <= pointCount*pointCount && mouseY >= 0){
            grid[floor(mouseY/pointCount)][floor(mouseX/pointCount)] = 'x';
        }
    }

    if(start){
        if(found){
            status.style.color = "#76FF03";
            status.innerText = "Found!";
        } else {
            status.style.color = "#FFFF00";
            status.innerText = "Searching..."
        }
        startButton.innerText = "clear";
        if(algorithm === "bfs"){
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
                    accessNum++;
                    q.push([nx, ny]);
                }
        
            }
        
            if(distance[ex][ey] !== -1){
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
        } else if(algorithm === "dfs"){
            if(!found && q !== undefined && q.length > 0){
                var cx = q[q.length-1][0];
                var cy = q[q.length-1][1];
                visited[cx][cy] = 1;
                q.pop();
                for(var i = 0; i < 4; i++){
                    var nx = cx + dx[i];
                    var ny = cy + dy[i];
                    if(nx < 0 || ny < 0) continue;
                    if(nx >= pointCount || ny >= pointCount) continue;
                    if(visited[nx][ny]) continue;
                    if(grid[ny][nx] == 'x') continue;
                    accessNum++;
                    q.push([nx, ny]);
                }
            }

            if(visited[ex][ey] !== 0){
                found = true;
            }
        
            c = color(endColor);
            fill(c);
            noStroke();
            square(xpos[ex], xpos[ey], size);
    
            if(!found){
                for(var i = 0; i < pointCount; i++){
                    for(var j = 0; j < pointCount; j++){
                        if(visited[i][j] !== 0){
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


        }

    } else {
        startButton.innerText = "start";
        status.style.color = "#FAFAFA";
        status.innerText = "Not Running";
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