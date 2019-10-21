class AnimatedTile extends Tile{
	constructor(frames, time, src, x, y, extra){
		super(src, x, y, extra);
		this.frames = frames;	//number of frames of animation contained within the sprite
		this.frame = 0;	//current frame
		this.time = time;	//time for the animation to complete 1 cycle
		this.frameTime = this.time / this.frames;	//time per frame
		this.cw = extra && extra.cw ? extra.cw : undefined;	//crop width; width per frame
		this.last = performance.now();	//time of last frame switch

		var self = this;
		this.img.onload = function(){	//if custom crop width not defined, set it to image width / number of frames
			if(self.cw === undefined)
				self.cw = self.img.width / self.frames;
		}
	}
	update(time){	//switches frame
		if(time - this.last >= this.frameTime){
			this.frame = (this.frame + 1) % this.frames;	//loops automatically
			this.last = time;
		}
	}
	draw(offx, offy){
		if(this.grid)	//if coordinates are in Scene space, multiply by Global.tileSize
			ctx.drawImage(this.img, this.frame * this.cw, 0, this.cw, this.cw, this.x * Global.tilesize + offx, this.y * Global.tilesize + offy, this.w, this.h);
		else //otherwise
			ctx.drawImage(this.img, this.x + offx, this.y + offy, this.w, this.h, this.frame * Global.tilesize, 0, Global.tilesize, Global.tilesize);
	}
}

function AnimatedTileSheet(frames, time, src, x, y, w, h, extra){	//rectangle of AnimatedTiles
	this.create = function(frames, time, src, x, y, w, h, extra){
		extra.grid = true;	//they are in Scene space
		var tiles = [];
		//create grid of dimensions wxh
		for(var i = 0; i < h; i++)
			for(var j = 0; j < w; j++)
				tiles.push(new AnimatedTile(frames, time, src, x + j, y + i, extra));

		if(extra.surround){	//borders grid with invisible rigid Tiles
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
