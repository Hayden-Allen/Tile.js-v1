var Global = {
	tilesize: 40,	//width and height of Tiles
	lightMax: 15,	//max light value
	sqrt2: Math.sqrt(2),	//for speed calculations
	//for easy updating
	controls: [],
	uis: [],
	keys: new BitSet(0),	//window input events effect this
	/*+-+-+-+-+-+-+-+-+
	 *|7|6|5|4|3|2|1|0|
	 *+-+-+-+-+-+-+-+-+
	 *| | |_|Q|W|A|S|D|
	 *+-+-+-+-+-+-+-+-+
	 */
	recentKey: new BitSet(0),	//last key pressed
	currentScene: null,
	debugObj: debugObj = new DebugInfo(0, 0, 0, 0),	//string under canvas
	delta: 0,	//time since last frame
	paused: false
}

var c = document.getElementById("c");	//canvas
c.width = window.innerWidth - Global.tilesize;
c.height = window.innerHeight - Global.tilesize;
var ctx = c.getContext("2d");	//canvas draw context

function rect(x, y, w, h, color, opacity){	//draws and fills a rectangle
	ctx.fillStyle = color;
	ctx.globalAlpha = opacity;
	ctx.fillRect(x, y, w, h);
}
function pause(){
	player.controls.locked = true;
	Global.paused = true;
}
function unpause(){
	player.controls.locked = false;
	Global.paused = false;
}
function angle(x1, y1, x2, y2){	//angle between two points
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
function sleep(ms){	//for use in async functions
	return new Promise(resolve => setTimeout(resolve, ms));
}
function debug(target, msg){	//sets text of html elements
	document.getElementById(target).innerHTML = msg;
}

var scene1 = new Scene(0);	//outside

Global.currentScene = scene1;

var sword = new Item(new Tile("assets/item/sword.png", Global.tilesize / 2, -Global.tilesize / 2, {w: .5, grid: false, zindex: 1, add: false}),
	{atk: 5, def: 0, spd: 0, hp: 0, time: 250}, "Sword",
	async function(){
		if(this.canAttack){
			this.canAttack = false;

			player.rect.children[0].y -= 15;	//move up
			new Projectile("assets/tile/stone.png", player.rect.wx, player.rect.wy, 10,	//spawn projectile in direction player is pointing
				{x: (player.direction % 2) * (2 - player.direction), y: (1 - player.direction % 2) * (player.direction - 1)});
			await sleep(this.stats.time);	//wait to reset animation
			player.rect.children[0].y += 15;	//move back down

			this.canAttack = true;	//allow more attacks
		}
	});

var player = new Player(new Tile("assets/tile/player.png", 40 * 7, 40 * 7, {grid: false, add: false}), Global.tilesize * 10, 6,
	new Inventory(5, [sword]));	//has sword item
var enemy = new Enemy(new Tile("assets/tile/enemy.png", 40 * 7, 40, {grid: false, rigid: true, add: false}), 200, 2);	//follows player around
var camera = new Camera(player);	//center Scene on player

new TileSheet("assets/tile/grass.png", 0, 0, 30, 16, {rigid: false,
				surround: {src: "assets/decoration/tree.png", extra: {rigid: true, w: 2, h: 2}}});	//background and surrounding trees
new TileSheet("assets/tile/brick.png", 10, 1, 1, 2, {rigid: true});	//chimney
new TileSheet("assets/tile/wood_log.png", 7, 2, 3, 1, {rigid: true});	//roof
//house
new TileSheet("assets/tile/wood.png", 7, 3, 3, 1, {rigid: true});
new TileSheet("assets/tile/wood.png", 6, 4, 5, 2, {rigid: true});
new TileSheet("assets/tile/wood.png", 6, 6, 2, 1, {rigid: true});
new TileSheet("assets/tile/wood.png", 9, 6, 2, 1, {rigid: true});

//roof
new Tile("assets/tile/wood_log.png", 5, 4, {zindex: 1});
new Tile("assets/tile/wood_log.png", 6, 3, {rigid: true});
new Tile("assets/tile/wood_log.png", 10, 3, {rigid: true});
new Tile("assets/tile/wood_log.png", 11, 4, {zindex: 1});
//texture under fire
new Tile("assets/decoration/campfire.png", 9, 8);
new Tile("assets/decoration/campfire.png", 4, 10);

//lights
new AnimatedTile(3, 250, "assets/animation/fire.png", 9, 8, {rigid: true, lightIntensity: 13});
new AnimatedTile(3, 250, "assets/animation/fire.png", 4, 10, {rigid: true, lightIntensity: 13});
new AnimatedTile(3, 250, "assets/animation/fire.png", 22, 4, {rigid: true, lightIntensity: 13});
new AnimatedTile(3, 250, "assets/animation/fire.png", 22, 12, {rigid: true, lightIntensity: 13});
new AnimatedTile(3, 250, "assets/animation/fire.png", 17, 8, {rigid: true, lightIntensity: 13});

new AnimatedTile(3, 1000, "assets/animation/smoke.png", 10, 0, {rigid: false, zindex: 1});	//smoke coming from chimney

new AnimatedTileSheet(4, 1000, "assets/animation/water.png", 5, 8, 4, 4, {rigid: true});	//pond

var scene2 = new Scene(5);	//inside house
Global.currentScene = scene2;

new TileSheet("assets/tile/stone.png", 0, 1, 12, 6, {rigid: false, surround: {src: "", extra: {rigid: true}}});	//floor
//walls
new TileSheet("assets/tile/wood.png", 0, -3, 12, 4, {rigid: false});
new TileSheet("assets/tile/wood.png", 0, 6, 8, 1, {rigid: true});
new TileSheet("assets/tile/wood.png", 9, 6, 3, 1, {rigid: true});
//chimney
new TileSheet("assets/tile/brick.png", 7, 0, 4, 2, {rigid: true});
new TileSheet("assets/tile/brick.png", 8, -3, 2, 3, {rigid: true});
new Tile("assets/tile/brick_slope_tl.png", 7, -1, {rigid: true});
new Tile("assets/tile/brick_slope_tr.png", 10, -1, {rigid: true});
//fireplace
new TileSheet("assets/decoration/wood_pile.png", 8, 1, 2, 1, {rigid: true});
new AnimatedTileSheet(3, 250, "assets/animation/fire.png", 8, 1, 2, 1, {rigid: false, lightIntensity: 9});
//decorations
new Tile("assets/decoration/bear_rug.png", 8, 2, {w: 2, h: 2});
new Tile("assets/decoration/table.png", 0, 1, {rigid: true});
new Tile("assets/decoration/lamp.png", 0, 0, {lightIntensity: 10});
//door back outside
new Door(new Tile("assets/tile/door.png", 8, 6), scene1, scene2);

//create lightmaps
scene1.finalize();
scene2.finalize();

Global.currentScene = scene1;

var last = performance.now(), lastDebug = performance.now();
function update(){
	requestAnimationFrame(update);
	ctx.clearRect(0, 0, c.width, c.height);	//clear screen
	rect(0, 0, c.width, c.height, "#000000", 1);	//black background

	var now = performance.now();
	Global.delta = now - last;
	last = now;

	camera.update(now);	//draw frame

	//write debug info
	debugObj.update(player.rect.x.toFixed(2), player.rect.y.toFixed(2), camera.count, camera.minSprites, camera.maxSprites, 1000 / (performance.now() - lastDebug));
	lastDebug = performance.now();
	debug("debug", debugObj.string());

	//update controls and draw ui
	Global.controls.forEach(function(c){
		if(!c.locked)
			c.on(Global.keys);
	});
	Global.uis.forEach(function(u){
		u.draw();
	});
}
update();

//handle keyboard input
window.onkeypress = function(e){
	e.preventDefault();
	switch(e.keyCode){
	case 101: player.health--; break;
	case 114: player.health++; break;
	case 113:
		Global.keys.flip(4);
		Global.paused ? unpause() : pause();
		player.ui.inventorySwitch();
	break;
	case 32: Global.keys.set(5, true); break;
	}
}
window.onkeydown = function(e){
	//e.preventDefault();
	switch(e.keyCode){
	case 87:
		Global.keys.set(3, true);
		Global.recentKey.zeroSet(3, true);
	break;
	case 65:
		Global.keys.set(2, true);
		Global.recentKey.zeroSet(2, true);
	break;
	case 83:
		Global.keys.set(1, true);
		Global.recentKey.zeroSet(1, true);
	break;
	case 68:
		Global.keys.set(0, true);
		Global.recentKey.zeroSet(0, true);
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
	case 87: Global.keys.set(3, false); break;
	case 65: Global.keys.set(2, false); break;
	case 83: Global.keys.set(1, false); break;
	case 68: Global.keys.set(0, false); break;
	}
}
