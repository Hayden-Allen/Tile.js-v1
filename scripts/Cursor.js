function Cursor(x, y){	//movable cursor graphic
	this.tile =  new AnimatedTile(2, 500, "assets/animation/cursor.png", x, y, {add: false});
	this.controls = new Controls(this.tile, {last: performance.now()}, function(keys){
		var now = performance.now();
		if(now - this.extra.last > 100){
			if(keys.at(3))
				this.obj.y = Math.max(1, this.obj.y - 1);
			if(keys.at(2))
				this.obj.x = Math.max(1, this.obj.x - 1);
			if(keys.at(1))
				this.obj.y = Math.min(c.height / tilesize - 2, this.obj.y + 1);
			if(keys.at(0))
				this.obj.x = Math.min(c.width / tilesize - 2, this.obj.x + 1);
			this.extra.last = now;
		}
	});
	this.controls.locked = true;

	this.draw = function(offx, offy){
		this.tile.draw(offx, offy);
	}
}
