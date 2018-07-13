class Tile{
	constructor(src, x, y, extra){//rigid, grid, w, h){
		this.img = new Image();
		if(src !== "")
			this.img.src = src;
		this.x = parseInt(x);
		this.y = parseInt(y);
		this.w = tilesize;
		this.h = tilesize;
		this.grid = true;
		this.rigid = false;
		this.extra = extra ? extra : {};
		
		if(extra){
			this.w = (extra.w ? extra.w : 1) * tilesize;
			this.h = (extra.h ? extra.h : 1) * tilesize;
			this.rigid = extra.rigid !== undefined ? extra.rigid : false;
			this.grid = extra.grid !== undefined ? extra.grid : true;
		}
		
		this.wx = this.x * (this.grid ? tilesize : 1);
		this.wy = this.y * (this.grid ? tilesize : 1);
		
		if(!extra || (extra && extra.add === undefined)){
			currentScene.add(this);
			if(this.rigid)
				currentScene.addRigid(this);
		}
	}
	draw (offx, offy){
		if(!this.grid)
			ctx.drawImage(this.img, this.x + offx, this.y + offy, this.w, this.h);
		else
			ctx.drawImage(this.img, this.x * tilesize + offx, this.y * tilesize + offy, this.w, this.h);
	}
	addX(x){
		this.x += parseInt(x);
		this.wx = parseInt(this.x * (this.grid ? tilesize : 1));
		//this.x = parseInt(this.x);
		//this.wx = parseInt(this.wx);
	}
	addY(y){
		this.y += parseInt(y);
		this.wy = parseInt(this.y * (this.grid ? tilesize : 1));
		//this.y = parseInt(this.y);
		//this.wy = parseInt(this.wy);
	}
	setSource(src){
		this.img = new Image();
		if(src !== "")
			this.img.src = src;
	}
}
function TileSheet(src, x, y, w, h, extra){
	this.create = function(src, x, y, w, h, extra){
		extra.grid = true;
		var tiles = [];
		var tw = 1, th = 1;
		if(extra.w)
			tw = extra.w;
		if(extra.h)
			th = extra.h;
			
		var dx = tw, dy = th;
		if(extra.dx)
			dx = extra.dx;
		if(extra.dy)
			dy = extra.dy; 
				
		for(var i = 0; i < h; i += dy)
			for(var j = 0; j < w; j += dx)
				tiles.push(new Tile(src, x + j, y + i, extra));
				
		if(extra.surround){
			var tw = 1, th = 1;
			if(extra.surround.extra){
				if(extra.surround.extra.w)
					tw = extra.surround.extra.w;
				if(extra.surround.extra.h)
					th = extra.surround.extra.h;
			}
				
			new TileSheet(extra.surround.src, x - tw, y - th, w + tw, th, extra.surround.extra);	//top
			new TileSheet(extra.surround.src, x - tw, y, tw, h + th, extra.surround.extra);		//left
			new TileSheet(extra.surround.src, x, y + h, w + tw, th, extra.surround.extra);		//down
			new TileSheet(extra.surround.src, x + w, y - th, tw, h + th, extra.surround.extra);			//right
		}
	}
	if(!extra)
		extra = {rigid: false};
	this.tiles = this.create(src, x, y, w, h, extra);
}