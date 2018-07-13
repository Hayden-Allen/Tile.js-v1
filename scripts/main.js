var c = document.getElementById("c");
var ctx = c.getContext("2d");

var tilesize = 40, lightMax = 15, sqrt2 = Math.sqrt(2);

function angle(x1, y1, x2, y2){
	var dx = x1 - x2, dy = y1 - y2;
	var theta = Math.atan(dy / dx);
		
	if(dx >= 0)
		theta = Math.PI * 2 - theta;
	else{
		if(dy <= 0)
			theta = Math.PI - theta;
		else
			theta = Math.PI * 3 - theta;
	}
	
	if(theta > Math.PI * 2)
		theta -= Math.PI * 2;
	if(theta < 0)
		theta += Math.PI * 2;
	
	return {dx: dx, dy: dy, theta: theta, deg: theta * (180 / Math.PI), sin: Math.sin(theta), cos: Math.cos(theta)};
}
function sleep(ms){
	return new Promise(resolve => setTimeout(resolve, ms));
}
async function fade(time, color){
	player.controls.locked = true;
	
	var step = 1 / time;
	ctx.fillStyle = color;
	ctx.globalAlpha = step;
	
	while(ctx.globalAlpha + step < 1){
		ctx.fillRect(0, 0, c.width, c.height);
		ctx.globalAlpha += step;
		await sleep(step);
	}
	
	player.controls.locked = false;
}
function debug(target, msg){
	document.getElementById(target).innerHTML = msg;
}

var controls = [];
var uis = [];
var keys = new BitSet(0);

var scene1 = new Scene(0);

var currentScene = scene1;
var player = new Player(new Tile("assets/tile/player.png", 640, 320, {grid: false, add: false}), 10, 6);
//var enemy = new Enemy(new Tile("assets/tile/enemy.png", 720, 320, {grid: false, rigid: true, add: false}), 5, 2, player);
var camera = new Camera(player);

var ui = new UI(player);

new TileSheet("assets/tile/grass.png", 0, 0, 30, 16, {rigid: false, 
				surround: {src: "assets/decoration/tree.png", extra: {rigid: true, w: 2, h: 2}}});			
new TileSheet("assets/tile/brick.png", 10, 1, 1, 2, {rigid: true});
new TileSheet("assets/tile/wood_log.png", 7, 2, 3, 1, {rigid: true});
new TileSheet("assets/tile/wood.png", 7, 3, 3, 1, {rigid: true});
new TileSheet("assets/tile/wood.png", 6, 4, 5, 2, {rigid: true});
new TileSheet("assets/tile/wood.png", 6, 6, 2, 1, {rigid: true});
new TileSheet("assets/tile/wood.png", 9, 6, 2, 1, {rigid: true});

new Tile("assets/tile/wood_log.png", 5, 4, {zindex: 1});
new Tile("assets/tile/wood_log.png", 6, 3, {rigid: true});
new Tile("assets/tile/wood_log.png", 10, 3, {rigid: true});
new Tile("assets/tile/wood_log.png", 11, 4, {zindex: 1});
new Tile("assets/decoration/campfire.png", 9, 8);
new Tile("assets/decoration/campfire.png", 4, 10);

new AnimatedTile(3, 250, "assets/animation/fire.png", 9, 8, {rigid: true, lightIntensity: 15});
new AnimatedTile(3, 250, "assets/animation/fire.png", 4, 10, {rigid: true, lightIntensity: 15});
new AnimatedTile(3, 250, "assets/animation/fire.png", 22, 4, {rigid: true, lightIntensity: 15});
new AnimatedTile(3, 250, "assets/animation/fire.png", 22, 12, {rigid: true, lightIntensity: 15});

new AnimatedTile(3, 1000, "assets/animation/smoke.png", 10, 0, {rigid: false, zindex: 1});

new AnimatedTileSheet(3, 1000, "assets/animation/water.png", 5, 8, 4, 4, {rigid: true});

var scene2 = new Scene(5);
currentScene = scene2;

new TileSheet("assets/tile/stone.png", 0, 1, 12, 6, {rigid: false, surround: {src: "", extra: {rigid: true}}});
new TileSheet("assets/tile/wood.png", 0, -3, 12, 4, {rigid: false});
new TileSheet("assets/tile/wood.png", 0, 6, 8, 1, {rigid: true});
new TileSheet("assets/tile/wood.png", 9, 6, 3, 1, {rigid: true});
new TileSheet("assets/tile/brick.png", 7, 0, 4, 2, {rigid: true});
new TileSheet("assets/tile/brick.png", 8, -3, 2, 3, {rigid: true});
new TileSheet("assets/decoration/wood_pile.png", 8, 1, 2, 1, {rigid: true});
new AnimatedTileSheet(3, 250, "assets/animation/fire.png", 8, 1, 2, 1, {rigid: false, lightIntensity: 9});

new Tile("assets/tile/brick_slope_tl.png", 7, -1, {rigid: true});
new Tile("assets/tile/brick_slope_tr.png", 10, -1, {rigid: true});
new Tile("assets/decoration/bear_rug.png", 8, 2, {w: 2, h: 2});
new Tile("assets/decoration/table.png", 0, 1, {rigid: true});
new Tile("assets/decoration/lamp.png", 0, 0, {lightIntensity: 10});

new Door(new Tile("assets/tile/door.png", 8, 6), scene1, scene2);
scene1.finalize();
scene2.finalize();

currentScene = scene1;

var cursor = new Cursor(1, 1);

var debugObj = new DebugInfo(0, 0, 0, 0), lastTime = performance.now();
var minSprites = Number.MAX_SAFE_INTEGER, maxSprites = 0;
function update(){
	requestAnimationFrame(update);
	
	ctx.clearRect(0, 0, c.width, c.height);
	ctx.fillStyle = "#000000";
	ctx.fillRect(0, 0, c.width, c.height);
	
	var sprites = camera.update();
	if(sprites < minSprites)
		minSprites = sprites;
	if(sprites > maxSprites)
		maxSprites = sprites;
	
	debugObj.update(player.rect.x, player.rect.y, sprites, minSprites, maxSprites, 1000 / (performance.now() - lastTime));
	lastTime = performance.now();
	debug("debug", debugObj.string());
	
	controls.forEach(function(c){
		if(!c.locked)
			c.on(keys);
	});
	uis.forEach(function(u){
		u.draw();
	});
	
	if(player.controls.locked){
		ctx.globalAlpha = .75;
		ctx.fillStyle = "#ffffff";
		ctx.fillRect(tilesize, tilesize, c.width - tilesize * 2, c.height - tilesize * 2);
		cursor.draw(0, 0);
	}
	console.log(cursor.controls.locked);
}
update();

window.onkeypress = function(e){
	if(e.keyCode == 101)
		player.health--;
	if(e.keyCode == 114)
		player.health++;
	if(e.keyCode === 113){
		keys.flip(4);
		player.controls.locked = !player.controls.locked;
		cursor.controls.locked = !cursor.controls.locked;
	}
}
window.onkeydown = function(e){
	//e.preventDefault();
	switch(e.keyCode){
	case 87: 
		keys.set(3, true);
	break;
	case 65: 
		keys.set(2, true); 
	break;
	case 83: 
		keys.set(1, true); 
	break;
	case 68: 
		keys.set(0, true); 
	break;
	case 187: 
		var debug = document.getElementById("debug");
		if(debug.style.visibility === "hidden")
			debug.style.visibility = "visible";
		else
			debug.style.visibility = "hidden";
	break;
	}
}
window.onkeyup = function(e){
	//e.preventDefault();
	switch(e.keyCode){
	case 87: keys.set(3, false); break;
	case 65: keys.set(2, false); break;
	case 83: keys.set(1, false); break;
	case 68: keys.set(0, false); break;
	}
}