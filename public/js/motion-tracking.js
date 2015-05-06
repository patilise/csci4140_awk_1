init();
var params = {
    resetPosition: false,
    accelerationThershold: 0.3,
    accelerationLimit: 100,
    resetVelocityCountdown: 1,
    moveMagnitude: 15,
    resetCube: function(){ this.resetPosition = true; }
};
var totalDisp = [];
totalDisp.x = 0;
totalDisp.y = 0;
totalDisp.z = 0;
var displacement = [];
displacement.x = 0;
displacement.y = 0;
displacement.z = 0;
var velocity = [];
velocity.x = [0.0,0.0];
velocity.y = [0.0,0.0];
velocity.z = [0.0,0.0];
var acceleration = [];
acceleration.x = [0.0,0.0];
acceleration.y = [0.0,0.0];
acceleration.z = [0.0,0.0];
var motionDuration = 0.0;
var idleCount = 0;



function init() {
    if ((window.DeviceMotionEvent) || ('listenForDeviceMovement' in window)) {
        window.addEventListener('devicemotion', deviceMotionHandler, false);
    } else {
        document.getElementById("dmEvent").innerHTML = "Not supported on your device or browser.  Sorry."
    }
}
function deviceMotionHandler(eventData) {
    var info, xyz = "[X, Y, Z]";
    // Grab the acceleration including gravity from the results  
    info = xyz.replace("X", round(eventData.acceleration.x));
    info = info.replace("Y", round(eventData.acceleration.y));
    info = info.replace("Z", round(eventData.acceleration.z));
    document.getElementById("moAccel").innerHTML = info;
    
    // Grab the acceleration including gravity from the results
    info = xyz.replace("X", round(eventData.accelerationIncludingGravity.x));
    info = info.replace("Y", round(eventData.accelerationIncludingGravity.y));
    info = info.replace("Z", round(eventData.accelerationIncludingGravity.z));
    document.getElementById("moAccelGrav").innerHTML = info;
    
    // Grab the acceleration including gravity from the results
    info = xyz.replace("X", round(eventData.rotationRate.alpha));
    info = info.replace("Y", round(eventData.rotationRate.beta));
    info = info.replace("Z", round(eventData.rotationRate.gamma));
    document.getElementById("moRotation").innerHTML = info;
    info = eventData.interval;
    document.getElementById("moInterval").innerHTML = info;
    
    
    // Calculate the displacement from acceleration
    
    var dt = eventData.interval; //deltaTime    
    acceleration.x[1] = -eventData.acceleration.x;
    acceleration.y[1] = -eventData.acceleration.y;
    acceleration.z[1] = -eventData.acceleration.z;    
    
    var accelerationMagnitude = Math.sqrt(acceleration.x[1]*acceleration.x[1] +  acceleration.y[1]*acceleration.y[1] + acceleration.z[1]*acceleration.z[1]);
    
    if (accelerationMagnitude < params.accelerationThershold) {     
        idleCount += 1;
    } else {
        idleCount = 0;
        motionDuration += dt;
    }
    if (idleCount >= params.resetVelocityCountdown){
        velocity.x[0] = 0;
        velocity.y[0] = 0;
        velocity.z[0] = 0;
        motionDuration = 0;
    }
    if (Math.abs(acceleration.x[1]) > params.accelerationLimit) {
        if (acceleration.x[1] > 0) {
            acceleration.x[1] = params.accelerationLimit;
        } else {
            acceleration.x[1] = -params.accelerationLimit;
        }
        if (acceleration.y[1] > 0) {
            acceleration.y[1] = params.accelerationLimit;
        } else {
            acceleration.y[1] = -params.accelerationLimit;
        }
        if (acceleration.z[1] > 0) {
            acceleration.z[1] = params.accelerationLimit;
        } else {
            acceleration.z[1] = -params.accelerationLimit;
        }
       
    }
    if (motionDuration == dt) //when motion start
    {
        acceleration.x[0] = acceleration.x[1];
        acceleration.y[0] = acceleration.y[1];
        acceleration.z[0] = acceleration.z[1];
    }
    
    //Double integration method
    
    // v[i] = v[i-1] + (a[i]+a[i-1])/2 * dt
    velocity.x[1] = velocity.x[0] + ((acceleration.x[1]+acceleration.x[0])/2) * dt;
    velocity.y[1] = velocity.y[0] + ((acceleration.y[1]+acceleration.y[0])/2) * dt;
    velocity.z[1] = velocity.z[0] + ((acceleration.z[1]+acceleration.z[0])/2) * dt;
    
    // s += (v[i]+v[i-1])/2 * dt
    displacement.x += ((velocity.x[0]+velocity.x[1])/2) * dt;
    displacement.y += ((velocity.y[0]+velocity.y[1])/2) * dt;
    displacement.z += ((velocity.z[0]+velocity.z[1])/2) * dt;    
    
    totalDisp.x += displacement.x;
    totalDisp.y += displacement.y;
    totalDisp.z += displacement.z;
    
    //update initial velocity
    velocity.x[0] = velocity.x[1];
    velocity.y[0] = velocity.y[1];
    velocity.z[0] = velocity.z[1];
    
    //update initial acceleration 
    acceleration.x[0] = acceleration.x[1];  
    acceleration.y[0] = acceleration.y[1]; 
    acceleration.z[0] = acceleration.z[1]; 
    
    info = xyz.replace("X", round(totalDisp.x)+"m");  
    info = info.replace("Y", round(totalDisp.y)+"m");
    info = info.replace("Z", round(totalDisp.z)+"m");    
    document.getElementById("moDisplacement").innerHTML = info;
    
    info = xyz.replace("X", round(velocity.x[0])+"ms^-1");
    info = info.replace("Y", round(velocity.y[0])+"ms^-1");
    info = info.replace("Z", round(velocity.z[0])+"ms^-1");
    document.getElementById("moVelocity").innerHTML = info;
   
}
function round(val) {
    var amt = 1000;
    return Math.round(val * amt) /  amt;
}