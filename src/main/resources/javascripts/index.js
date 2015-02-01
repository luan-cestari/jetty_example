$(document).ready(function(){


    // Canvas Variables
    var canvas = $('#canvas1');
    var context = canvas.get(0).getContext('2d');
    var canvasWidth = canvas.width();
    var canvasHeight = canvas.height();



    var svgWidth = $(window).get(0).innerWidth - 0.5 * $(window).get(0).innerWidth;
    var svgHeight = $(window).get(0).innerHeight - 0.04 * $(window).get(0).innerHeight;
    var svgX = 0.04 * $(window).get(0).innerWidth;
    var svgY = 0.0 * $(window).get(0).innerHeight;
    $('#svg').attr('width', svgWidth);
    $('#svg').attr('height', svgHeight);
    //$('#svg').attr('viewBox', '0 0 ' + svgWidth + ' ' + svgHeight);
    $('#svg g:first-child').attr('transform', 'translate(' + svgX + ',' + svgY + ')');
    
    $('#sliderH').attr('min', 100);
    $('#sliderH').attr('max', svgHeight);
    $('#sliderW').attr('min', 100);
    $('#sliderW').attr('max', svgWidth);
    $('#sliderW').attr('value', svgWidth);


    var diff;
    var previous;
    $('#sliderW').on('focus', function () {
        previous = this.value;
    }).change(function() {
        svgWidth = $('#sliderW').val();
        diff = (previous - svgWidth) / previous;
        if(diff < 0) {
            svgHeight = svgHeight + svgHeight * -diff;
        } else {
            svgHeight = svgHeight - svgHeight * diff;   
        }
        console.log("altura" + svgHeight);
        console.log("largura" + svgWidth)
        $('#svg')[0].setAttribute('viewBox', '0 0 ' + svgWidth + ' ' + svgHeight);
        previous = this.value;
    });

    $('#sliderX').change(function() {
        svgX = 0.04 * $(window).get(0).innerWidth;
        $('#svg g:first-child').attr('transform', 'translate(' + svgX + ',' + svgY + ')');
    });
    $('#sliderY').change(function() {
        svgY = 0.0 * $(window).get(0).innerHeight;
        $('#svg g:first-child').attr('transform', 'translate(' + svgX + ',' + svgY + ')');
    });



    // Get (x, y) points from a path segment or more
    function pathToPoints(segments) {
        var count = segments.numberOfItems;
        var result = [], segment, x, y;
        for (var i = 0; i < count; i++) {
            segment = segments.getItem(i);
            switch(segment.pathSegType) {
                case SVGPathSeg.PATHSEG_MOVETO_ABS:
                case SVGPathSeg.PATHSEG_LINETO_ABS:
                case SVGPathSeg.PATHSEG_CURVETO_CUBIC_ABS:
                case SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_ABS:
                case SVGPathSeg.PATHSEG_ARC_ABS:
                case SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_ABS:
                case SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_SMOOTH_ABS:
                    x = segment.x;
                    y = segment.y;
                    break;
                
                case SVGPathSeg.PATHSEG_MOVETO_REL:                
                case SVGPathSeg.PATHSEG_LINETO_REL:
                case SVGPathSeg.PATHSEG_CURVETO_CUBIC_REL:
                case SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_REL:
                case SVGPathSeg.PATHSEG_ARC_REL:
                case SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_REL:
                case SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_SMOOTH_REL:
                    x = segment.x;
                    y = segment.y;
                    if (result.length > 0) {
                        x += result[result.length - 1].x;
                        y += result[result.length - 1].y;
                    }
                    break;
                
                case SVGPathSeg.PATHSEG_LINETO_HORIZONTAL_ABS:
                    x = segment.x;
                    y = result[result.length - 1].y;
                    break;
                case SVGPathSeg.PATHSEG_LINETO_HORIZONTAL_REL:
                    x = result[result.length - 1].x + segment.x;
                    y = result[result.length - 1].y;
                    break;

                case SVGPathSeg.PATHSEG_LINETO_VERTICAL_ABS:
                    x = result[result.length - 1].x;
                    y = segment.y;
                    break;
                case SVGPathSeg.PATHSEG_LINETO_VERTICAL_REL:
                    x = result[result.length - 1].x;
                    y = segment.y + result[result.length - 1].y;
                    break;
                case SVGPathSeg.PATHSEG_CLOSEPATH:
                    return result;
                default:
                    console.log('unknown path command: ', segment.pathSegTypeAsLetter);
            }
            result.push({
                x: x,
                y: y
            });
        }
        return result;
    }

    function getPathArray() {
        var svg = document.querySelector('#svg');
        var path = document.querySelector('#svg path');
        var points = pathToPoints(path.pathSegList);
        return points;
    }

    var position = 0;
    var pathArray = getPathArray();
    var polypoints = makePolyPoints(pathArray);

    function makePolyPoints(pathArray) {
        var points = [];
        for (var i = 1; i < pathArray.length; i++) {
            var startPt = pathArray[i - 1];
            var endPt = pathArray[i];
            var dx = endPt.x - startPt.x;
            var dy = endPt.y - startPt.y;
            for (var n = 0; n <= 100; n++) {
                var x = startPt.x + dx * n / 100;
                var y = startPt.y + dy * n / 100;
                points.push({
                    x: x,
                    y: y
                });
            }
        }
        return (points);
    }


    // Keyboard Variables
    var leftKey = 37;
    var upKey = 38;
    var rightKey = 39;
    var downKey = 40;


    // Keyboard event listeners
    $(window).keydown(function(e){
        var keyCode = e.keyCode;
        if(keyCode == leftKey){
            car.left = true;
        } else if(keyCode == upKey){
            car.forward = true;
        } else if(keyCode == rightKey){
            car.right = true;
        } else if (keyCode == downKey){
            car.backward = true;
        }
    });
    $(window).keyup(function(e){
        var keyCode = e.keyCode;
        if(keyCode == leftKey){
            car.left = false;
        } else if(keyCode == upKey){
            car.forward = false;
        } else if(keyCode == rightKey){
            car.right = false;
        } else if (keyCode == downKey){
            car.backward = false;
        }
    });


    // Start & Stop button controlls
    var playAnimation = true;
    
    var startButton = $('#startAnimation');
    var stopButton = $('#stopAnimation');
    
    // startButton.hide();
    startButton.click(function(){
        $(this).hide();
        stopButton.show();
        playAnimation = true;
        updateStage();
    });
    stopButton.click(function(){
        $(this).hide();
        startButton.show();
        playAnimation = false;
    });

    
    // Resize canvas to full screen
    function resizeCanvas(){
        canvas.attr('width', $(window).get(0).innerWidth - 0.5 * $(window).get(0).innerWidth);
        canvas.attr('height', $(window).get(0).innerHeight - 0.0 * $(window).get(0).innerHeight);
        canvasWidth = canvas.width();
        canvasHeight = canvas.height();
    }
    resizeCanvas();
    $(window).resize(resizeCanvas);


    function initialise(){
        initStageObjects();
        drawStageObjects();
        updateStage();
    }
    

    // Car object and properties
    function Car(src, x, y){        
        this.image = new Image();
        this.image.src = src;
        
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.angle = 90;
    
        this.topSpeed = 15;

        this.topDrift = 34;
        // Seems to be a nice proportion, since the topDrift are like 34, 45, 56, 67, 78...
        this.minDrift = Math.floor(this.topDrift / 10); // for control pourpose only
        this.driftGearStick = this.topDrift % 10;       // for control pourpose only

        this.acceleration = 0.1;
        this.reverse = 0.1;
        this.brakes = 0.3;
        this.friction = 0.05;
        this.handeling = 15;
        this.grip = 15;
        this.minGrip = 5;
        this.speed = 0;
        this.drift = 0;
    
        this.left = false;
        this.up = false;
        this.right = false;
        this.down = false;
    }

    
    // Create any objects needed for animation        
    function initStageObjects(){
        car = new Car('images/car.png',canvas.width()/2,canvas.height()/2);
    }
    
    
    function drawStageObjects(){
        context.save();
        context.translate(car.x,car.y);
        context.rotate((car.angle + car.drift) * Math.PI/180);    
        context.drawImage(car.image, -25 , (-47 + (Math.abs(car.drift / 3))));
        // context.fillRect(-5, -5, 10, 10);
        context.restore();
    }
    
    
    function clearCanvas(){
        context.clearRect(0, 0, canvasWidth, canvasHeight);  
        context.beginPath();
    }
    
    
    function updateStageObjects(){
        
        // Faster the car is going, the worse it handels
        if(car.handeling > car.minGrip){
            car.handeling = car.grip - car.speed;
        }
        else{
            car.handeling = car.minGrip + 1;
        }
        
        
        // Car acceleration to top speed
        if(car.forward){
            if(car.speed < car.topSpeed){
                car.speed = car.speed + car.acceleration;
            }            
        }        
        else if(car.backward){
            if(car.speed < 1 && -car.speed < car.topSpeed){
                car.speed = car.speed - car.reverse;    
            }
            else if(car.speed > 1){
                car.speed = car.speed - car.brakes;
            }
        }
        

        // Car drifting logic (still working on it...)
        if (car.forward) {
            // If car reach 90% the very own speed, then start drifting
            if(car.left && car.speed > (car.topSpeed * 0.90) && car.drift > -car.topDrift){
                car.drift = car.drift - car.driftGearStick;
            }
            else if(car.right && car.speed > (car.topSpeed * 0.90) && car.drift < car.topDrift){
                car.drift = car.drift + car.driftGearStick;
            }
        } else {
            if(car.drift < -car.minDrift){
                car.drift = car.drift + car.driftGearStick;
            } else  if(car.drift > car.minDrift){
                car.drift = car.drift - car.driftGearStick;
            } 
        }


        // General car handeling when turning    
        if(car.left){
            car.angle = car.angle - (car.handeling * car.speed/car.topSpeed);
        } else if(car.right){
            car.angle = car.angle + (car.handeling * car.speed/car.topSpeed);    
        }
        
        
        // Use this div to display any info I need to see visually
        $('#stats').html(car.speed);
            
        
        // Constant application of friction / air resistance
        if(car.speed > 0){
            car.speed = car.speed - car.friction;
        } else if(car.speed < 0) {
            car.speed = car.speed + car.friction;   
        }
        

        // Update car velocity (speed + direction)
        car.vy = -Math.cos(car.angle * Math.PI / 180) * car.speed;
        car.vx = Math.sin(car.angle * Math.PI / 180) * car.speed;    
        
        
        // Plot the new velocity into x and y cords
        // if(position < polypoints.length) {

            // More work here is needed
        //     var pt = polypoints[Math.round(position)];
        //     car.y = pt.y + car.vy;
        //     car.x = pt.x + car.vx;
        //     position+= car.speed;

        // } else {

        car.y = car.y + car.vy;
        car.x = car.x + car.vx;

        // }

    }


    // Main animation loop
    function updateStage(){
        clearCanvas();
        updateStageObjects();
        drawStageObjects();        
        
        if(playAnimation){
            setTimeout(updateStage, 25);
        }
    }

    
    // Initialise the animation loop
    initialise();
        
});