function Projectile(src, x, y, speed, direction){
	this.tile = new Tile(src, x, y, {grid: false, zindex: -1});
	this.speed = speed;
	this.direction = direction;
	
	Global.currentScene.projectiles.push(this);
	
	this.update = function(offx, offy){
		this.tile.x += this.direction.x * this.speed;
		this.tile.y += this.direction.y * this.speed;
	}
}