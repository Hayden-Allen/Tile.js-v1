function Projectile(src, x, y, speed, direction){	//Tile that moves in a line until it hits something
	this.tile = new Tile(src, x, y, {grid: false, zindex: -1});
	this.speed = speed;	//scalar applied to each component of direction
	this.direction = direction;

	Global.currentScene.projectiles.push(this);

	this.update = function(offx, offy){	//move in both directions
		this.tile.x += this.direction.x * this.speed;
		this.tile.y += this.direction.y * this.speed;
	}
}
