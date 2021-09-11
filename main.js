// get reference to Canvas
var canvas = document.getElementById('canvas');

// get reference to canvas context
var context = canvas.getContext('2d');

//reference to loading screen;
var loading_screen = document.getElementById('loading');

//initialize loading variables
var loaded = false;
var load_counter = 0;

//initialize images for layers
var grass = new Image();
var paver = new Image();
var outline = new Image();
var trees = new Image();
var humans = new Image();

//create a lis of layer objects

var layer_list = [
    {
        'image': grass,
        'src': './Assets/05-grass.png',
        'z_index': -3.0,
        'position': {x:0 , y:0},
        'blend': null,
        'opacity': 1
    },
    
    {
        'image': paver,
        'src': './Assets/04-Paver.png',
        'z_index': -2.0,
        'position': {x:0 , y:0},
        'blend': null,
        'opacity': 1
    },


    {
        'image': outline,
        'src': './Assets/03-Outline.png',
        'z_index': -1.5,
        'position': {x:0 , y:0},
        'blend': null,
        'opacity': 1
    },

    {
        'image': trees,
        'src': './Assets/02-Trees.png',
        'z_index': -1.0,
        'position': {x:0 , y:0},
        'blend': null,
        'opacity': 1
    },

    {
        'image': humans,
        'src': './Assets/01-Humans.png',
        'z_index': 0.5,
        'position': {x:0 , y:0},
        'blend': null,
        'opacity': 0.9
    }
];

layer_list.forEach(function(layer,index){
    layer.image.onload = function() {
        load_counter += 1;
        if (load_counter >= layer_list.length) {
            hideLoading();
            requestAnimationFrame(drawCanvas);
        }
    }
    layer.image.src = layer.src;
    
});

function hideLoading() {
    loading_screen.classList.add('hidden');
}

function drawCanvas() {
    //clear what is in the canvas
    context.clearRect(0,0,canvas.width, canvas.height);


    //calculate how much the canvas should rotate
    var rotate_x = (pointer.y * -0.15) + (motion.y * -1.2);
    var rotate_y = (pointer.x * 0.15) + (motion.x * 1.2);

    var transform_string = "rotateX(" + rotate_x + "deg) rotateY(" + rotate_y + "deg)";

    //loop thriugh each ;ayer and draw it to the canvas
    layer_list.forEach(function(layer, index){

        layer.position = getOffset(layer);



        if (layer.blend) {
            context.globalCompositeOperation = layer.blend;
        } else {
            context.globalCompositeOperation = 'normal';
        }

        context.globalAlpha = layer.opacity;

        context.drawImage(layer.image, layer.position.x, layer.position.y);
    });
    requestAnimationFrame(drawCanvas);
}

function getOffset(layer) {
    var touch_multiplier = 0.1;
    var touch_offset_x = pointer.x * layer.z_index * touch_multiplier;
    var touch_offset_y = pointer.y * layer.z_index * touch_multiplier;

    var motion_multiplier = 2.5;
    var motion_offset_x = motion.x * layer.z_index * motion_multiplier;
    var motion_offset_y = motion.y * layer.z_index * motion_multiplier;

    var offset = {
        x: touch_offset_x + motion_offset_x,
        y: touch_offset_y + motion_offset_y
    };

    return offset;
}




/// touch and mouse controls ///

var moving = false;

// Initialize touch and mouse position
var pointer_initial = {
    x:0,
    y:0
}

var pointer = {
    x:0,
    y:0,
}

canvas.addEventListener('touchstart', pointerStart);
canvas.addEventListener('mousedown', pointerStart);


function pointerStart(event) {
    moving = true;
    if (event.type === 'touchstart') {
        pointer_initial.x = event.touches[0].clientX;
        pointer_initial.y = event.touches[0].clientY;
    } else if (event.type === 'mousedown') {
        pointer_initial.x = event.clientX;
        pointer_initial.y = event.clientY;
    }
}


window.addEventListener('touchmove', pointerMove);
window.addEventListener('mousemove', pointerMove)

function pointerMove(event) {
    event.preventDefault();
    if (moving === true) {
        var current_x = 0;
        var current_y = 0;
        if (event.type === 'touchmove') {
            current_x = event.touches[0].clientX;
            current_y = event.touches[0].clientY;
        } else if (event.type === 'mousemove') {
            current_x = event.clientX;
            current_y = event.clientY;
        }
        pointer.x = current_x - pointer_initial.x;
        pointer.y = current_y - pointer_initial.y;
    }

}

canvas.addEventListener('touchmove', function(event){
    event.preventDefault();
});

canvas.addEventListener('mousemove', function(event){
    event.preventDefault();
});

window.addEventListener('touchend', function(event){
    endGesture();
})

window.addEventListener('mouseup', function(event){
    endGesture();
})

function endGesture() {
    moving = false;

    pointer.x = 0;
    pointer.y = 0

}


/// MOTION CONTROLS///

//Initialize variables for motion-based parallax

var motion_initial = {
    x: null,
    y: null,
};

var motion = {
    x:0,
    y:0
};

//Listen to gyroscope events
window.addEventListener('deviceorientation', function(event){
    // if this is first time through
    if(!motion_initial.x && !motion_initial.y) {
        motion_initial.x = event.beta;
        motion_initial.y = event.gamma;
    }
    if (window.orientation === 0){  
        //the device is in potrait orientation
        motion.x = event.gamma - motion_initial.y;
        motion.y = event.beta - motion_initial.x;
    } else if (window.orientation === 90){
        //the device is in landscape mode on its left side
        motion.x = event.beta - motion_initial.x;
        motion.y = -event.gamma + motion_initial.y;
    } else if (window.orientation === -90) {
        // the device is in landscape on it right side
        motion.x = -event.beta + motion_initial.x;
        motion.y = -event.gamma - motion_initial.y;
    } else {
        //the device is upside down
        motion.x = -event.gamma + motion_initial.y;
        motion.y = -event.beta + motion_initial.x;
    }
});


window.addEventListener('orientationchange', function(event){
    motion_initial.x = 0;
    motion_initial.y = 0
});