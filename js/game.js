var canvas = document.getElementById('canvas');
if(typeof(window.innerHeight) == 'number') {
//Non IE
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
} else if(document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
//IE 6+
	canvas.width = document.documentElement.clientWidth;
	canvas.height = document.documentElement.clientHeight;
} else if(document.body.clientWidth || document.body.clientHeight) {
//IE 4 compatible
	canvas.width = document.body.clientWidth;
	canvas.height = document.body.clientHeight;
}
canvas.width -= 25;
canvas.height -= 10;

var ctx = canvas.getContext('2d');
var autoCallBonus, autoCallLose;
var running = false, firstClick = true;
var updateTriHome = 0, up = true;
var arBns = [];

var NUMBER_BUBBLE = 80;
var score = 0;
var randomColor = Math.floor((Math.random() * 360) + 1); //0;

var todayTimestamp = new Date;
var todayRNG = new RNG(todayTimestamp.getDate() + '-' + (todayTimestamp.getMonth()+1) + '-' + todayTimestamp.getFullYear());

var requestAnim;
var requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame;
var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

var lose = function() {
	running = false;
	window.cancelAnimationFrame(requestAnim);
	clear();
	canvas.style.cursor = "default";
	ctx.font = "18px Raleway, Montserrat, sans serif";
	ctx.fillStyle = '#15b154';
	ctx.textAlign = 'center';
	ctx.fillText('GAME OVER', canvas.width/2, canvas.height - 10);

	for (var i = 0; i < arBns.length; i++) {
		ctx.beginPath();
		ctx.arc(arBns[i].x, arBns[i].y, arBns[i].radius, 0, Math.PI*2);
		ctx.closePath();
		ctx.fillStyle = '#555';
		ctx.fill();
	}

	ball.color = 'red';
	ball.draw();

	autoCallLose = setInterval(function() {
		firstClick = true;
		arBns = [];
		ball.draw();
		updateTriHome = 0;
		requestAnim = requestAnimationFrame(drawHome);
		document.getElementsByClassName('more')[0].style.visibility = 'visible';
		document.getElementsByClassName('more')[1].style.visibility = 'visible';
	}, 3000);
}

var ball = {
	x: canvas.width/2,
	y: canvas.height/2,
	radius: 7,
	color: 'white',
	draw: function() {
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, true);
		ctx.closePath();
		ctx.fillStyle = this.color;
		ctx.fill();

		ctx.font = "18px sans serif";
		ctx.fillStyle = '#15b154';
		ctx.textAlign = 'left';
		ctx.fillText('SCORE : ' + score, canvas.width/8, canvas.height - 20);
	},
	drawHome: function() {
		this.x = canvas.width/2;
		this.y = canvas.height/2;
		this.radius = 7;
		this.color = 'white';
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, true);
		ctx.closePath();
		ctx.fillStyle = this.color;
		ctx.fill();
	}
};

function clear() {
	ctx.fillStyle = 'rgba(255,255,255,1)';
	ctx.fillRect(0,0,canvas.width,canvas.height);
}

var drawBonus = function() {
	requestAnim = requestAnimationFrame(drawBonus);

	//MODIF: ctx.fillStyle = 'hsl(' + randomColor + ', 70%, 60%)';
	ctx.fillStyle = '#8c8c8c';
	ctx.fillRect(0,0,canvas.width,canvas.height);
	randomColor = (randomColor + .2) % 360;

	var arBns_length = arBns.length;
	for (var allBns = 0; allBns < arBns_length; allBns++) {
		if(Math.sqrt(Math.pow(ball.x - arBns[allBns].x, 2) + Math.pow(ball.y - arBns[allBns].y, 2)) < ball.radius + arBns[allBns].radius - 1) {
			if(arBns[allBns].radius > ball.radius) {
				return lose();
			} else {
				arBns.splice(allBns, 1);
				if(allBns > 0)
					allBns--;
				arBns_length--;
				ball.radius += .5;
				score++;
			}
		}

		if(arBns[allBns].x > canvas.width + arBns[allBns].radius || arBns[allBns].x < -2*arBns[allBns].radius || arBns[allBns].y > canvas.height + arBns[allBns].radius || arBns[allBns].y < -2*arBns[allBns].radius) {
			arBns.splice(allBns, 1);
			if(allBns > 0)
				allBns--;
			arBns_length--;
		}

		arBns[allBns].x += arBns[allBns].vx;
		arBns[allBns].y += arBns[allBns].vy;

		ctx.beginPath();
		ctx.arc(arBns[allBns].x, arBns[allBns].y, arBns[allBns].radius, 0, Math.PI*2);
		ctx.closePath();
	//MODIF: ctx.fillStyle = 'hsl(' + arBns[allBns].color + ', 60%, 25%)';//colors[arBns[allBns].color];
	ctx.fillStyle = 'hsl(' + arBns[allBns].color + ', 70%, 30%)';
	ctx.fill();
	arBns[allBns].color = (arBns[allBns].color + .2) % 360;
	}

	if(arBns.length < NUMBER_BUBBLE) {
		for (var i = arBns.length; i < NUMBER_BUBBLE; i++) {
			var rad = todayRNG.random(Math.abs(ball.radius - 3), ball.radius + 6);
			switch(todayRNG.random(0, 4)) {
				case 0:
				arBns.push({
					x: todayRNG.random(0, canvas.width), 
					y: 0 + rad,
					vx: todayRNG.random(-2, 3),
					vy: todayRNG.random(1, 3),
					radius: rad,
					color: todayRNG.random(randomColor+90, randomColor+271) % 360 //todayRNG.random(0, colors.length)
				});
				break;
				case 1:
				arBns.push({
					x: todayRNG.random(0, canvas.width), 
					y: canvas.height - rad,
					vx: todayRNG.random(-2, 3),
					vy: todayRNG.random(-2, 0),
					radius: rad,
					color: todayRNG.random(randomColor+90, randomColor+271) % 360 //todayRNG.random(0, colors.length)
				});
				break;
				case 2:
				arBns.push({
					x: 0 + rad, 
					y: todayRNG.random(0, canvas.height), 
					vx: todayRNG.random(1, 3),
					vy: todayRNG.random(-2, 3),
					radius: rad,
					color: todayRNG.random(randomColor+90, randomColor+271) % 360 //todayRNG.random(0, colors.length)
				});
				break;
				case 3:
				arBns.push({
					x: canvas.width - rad, 
					y: todayRNG.random(0, canvas.height), 
					vx: todayRNG.random(-2, 0),
					vy: todayRNG.random(-2, 3),
					radius: rad,
				color: todayRNG.random(randomColor+90, randomColor+271) % 360 //todayRNG.random(0, colors.length)
				});
				break;
			}
		}
	}
	ball.draw();
}

var drawHome = function() {
	if(autoCallLose)
		clearInterval(autoCallLose);
	requestAnim = requestAnimationFrame(drawHome);

	//MODIF: ctx.fillStyle = 'hsl(' + randomColor + ', 70%, 60%)';
	ctx.fillStyle = '#8c8c8c';
	ctx.fillRect(0,0,canvas.width,canvas.height);
	randomColor = (randomColor + .2) % 360;

	ball.drawHome();

	ctx.beginPath();
	ctx.moveTo(canvas.width/2, canvas.height/2 - 12 - updateTriHome);
	ctx.lineTo(canvas.width/2 - 8, canvas.height/2 - 22 - updateTriHome);
	ctx.lineTo(canvas.width/2 + 8, canvas.height/2 - 22 - updateTriHome);
	ctx.lineTo(canvas.width/2, canvas.height/2 - 12 - updateTriHome);
	ctx.fillStyle = 'black';
	ctx.fill();

	if(updateTriHome <= 0 && up === false) {
		up = true;
	} else if(updateTriHome >= 10 && up === true) {
		up = false;
	}

	if(up) {
		updateTriHome += .25;
	} else {
		updateTriHome -= .25;
	}
}

canvas.addEventListener('mousemove', function(e) {
	if (running) {
		ball.x = e.clientX;
		ball.y = e.clientY;
	}
});

canvas.addEventListener('click',function(e){
	if (!running && firstClick) {
		var moreClassName = document.getElementsByClassName('more');
		for (var i = 0; i < moreClassName.length; i++) {
			moreClassName[i].style.visibility = 'hidden';
		}
		window.cancelAnimationFrame(requestAnim);
		canvas.style.cursor = "none";
		running = true;
		firstClick = false;
		score = 0;
		requestAnim = requestAnimationFrame(drawBonus);
	}
});

ball.draw();
requestAnim = requestAnimationFrame(drawHome);