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

for(var i = 0; i < 29; i++){
    grid[13][i] = 'x';
}

grid[13][5] = null;


grid[13][20] = null;

var dx = [0, 0, 1, -1];
var dy = [1, -1, 0, 0];

var distance = [];

var q = []; //queue

for(var i = 0; i < pointCount; i++){
    distance[i] = new Array(pointCount);
    for(var j = 0; j < pointCount; j++){
        distance[i][j] = -1;
    }
}

var sx = 0; var sy = 0;



distance[sx][sy] = 0;

q.push([sx, sy]);

var ex = 29; var ey = 20;


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



    } else {
        console.log(found);
        console.log(distance[ex][ey])
        noLoop();
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

}