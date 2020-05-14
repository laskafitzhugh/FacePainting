p5.disableFriendlyErrors = true;

let video;
let poseNet;

//initialize important variables
let leftEarX = 0;
let leftEarY = 0;
let rightEarX = 0;
let rightEarY = 0;
let headWidth;
let headHeight;

//path variables
let paths = [];
let next = 0;
let current;
let previous;

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.hide();
  console.log(ml5);
  poseNet = ml5.poseNet(video, modelReady);
  poseNet.on('pose', gotPoses);
  
  //create vectors to track current previous oval locations
  current = createVector(0,0);
  previous = createVector(0,0);
}

//get important data points from poseNet
function gotPoses(poses) {
  //console.log(poses);
  if (poses.length > 0) {
    //face data points and math:
    leftEarX = poses[0].pose.keypoints[3].position.x;
    leftEarY = poses[0].pose.keypoints[3].position.y;
    rightEarX = poses[0].pose.keypoints[4].position.x;
    rightEarY = poses[0].pose.keypoints[4].position.y;
    headWidth = rightEarX - leftEarX; //making this abs val messes up ellipse location
    headHeight = (headWidth * 3)/2;
  }
}

function modelReady() {
  console.log('model ready');
}

function drawPath(){
  if (millis() > next) {

    // Grab mouse position      
    current.x = leftEarX+(headWidth/2);
    current.y = lerp(leftEarY, rightEarY, 0.5);

    // New circle's force is based on mouse movement
    let force = p5.Vector.sub(current, previous);
    force.mult(0.05);

    // Add new circle
    paths[paths.length - 1].add(headWidth, headHeight, current, force);
    
    // Schedule next circle
    next = millis() + random(100);

    // Store mouse values
    previous.x = current.x;
    previous.y = current.y;
  }
  // Draw all paths
  for( let i = 0; i < paths.length; i++) {
    paths[i].update();
    paths[i].display();
  }
}

function draw() {
  background(220);
  image(video, 0, 0);
  
  /*
  //check frame rate
  let fps = frameRate();
  fill(255);
  stroke(0);
  text("FPS: " + fps.toFixed(2), 10, height - 10);
  */
  
  next = 0;
  previous.x = leftEarX+(headWidth/2);
  previous.y = lerp(leftEarY, rightEarY, 0.5);
  paths.push(new Path(headWidth, headHeight));
  
  drawPath();
}
