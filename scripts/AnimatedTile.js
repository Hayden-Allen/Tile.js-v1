class AnimatedTile extends Tile{
	constructor(frames, time, src, x, y, extra){
		super(src, x, y, extra);
		this.frames = frames;
		this.frame = 0;
		this.time = time;
		this.last = performance.now();
		this.frameTime = this.time / this.frames;
		if(extra && extra.delta)
			this.last -= extra.delta;
	}
	draw(offx, offy, time){
		if(this.grid)
			ctx.drawImage(this.img, this.frame * tilesize, 0, tilesize, tilesize, this.x * tilesize + offx, this.y * tilesize + offy, this.w, this.h);
		else
			ctx.drawImage(this.img, this.x + offx, this.y + offy, this.w, this.h, this.frame * tilesize, 0, tilesize, tilesize);
			
		if(time - this.last >= this.frameTime){
			this.last = time;
			this.frame = (this.frame + 1) % this.frames;
		}
	}
}

function AnimatedTileSheet(frames, time, src, x, y, w, h, extra){
	this.create = function(frames, time, src, x, y, w, h, extra){
		extra.grid = true;
		var tiles = [], start = performance.now();
		for(var i = 0; i < h; i++)
			for(var j = 0; j < w; j++){
				extra.delta = performance.now() - start;
				tiles.push(new AnimatedTile(frames, time, src, x + j, y + i, extra));
			}
				
		if(extra.surround){
			new TileStretch("", x - 1, y - 1, w + 2, 1, {rigid: true});	//top
			new TileStretch("", x - 1, y, 1, h + 1, {rigid: true});		//left
			new TileStretch("", x, y + h, w + 1, 1, {rigid: true});		//down
			new TileStretch("", x + w, y, 1, h, {rigid: true});			//right
		}
		return tiles;
	}
	if(!extra)
		extra = {rigid: false, surround: false};
	this.tiles = this.create(frames, time, src, x, y, w, h, extra);
}