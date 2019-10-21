class Tile{	//square with a texture
	constructor(src, x, y, extra){
		//store texture
		this.img = new Image();
		if(src !== "")
			this.img.src = src;
		//set bounds
		this.x = parseInt(x);
		this.y = parseInt(y);
		this.w = Global.tilesize;
		this.h = Global.tilesize;
		this.grid = true;	//whether or not the coordinates are in Scene space
		this.rigid = false;	//not rigid by default
		this.extra = extra ? extra : {};	//extra data
		this.children = [];

		if(extra){	//update instance values based on extra data
			this.w = (extra.w ? extra.w : 1) * Global.tilesize;
			this.h = (extra.h ? extra.h : 1) * Global.tilesize;
			this.rigid = extra.rigid !== undefined ? extra.rigid : false;
			this.grid = extra.grid !== undefined ? extra.grid : true;
			this.alpha = extra.alpha !== undefined ? extra.alpha : 1;
		}

		//canvas coordinates (for drawing)
		this.wx = this.x * (this.grid ? Global.tilesize : 1);
		this.wy = this.y * (this.grid ? Global.tilesize : 1);

		if(!extra || extra && extra.add !== false)	//automatically add to Scene
			Global.currentScene.add(this);
		if(this.rigid)	//add to special rigid array if necessary
			Global.currentScene.addRigid(this);
	}
	addChild(child){	//add tile to children array
		this.children.push({c: child, x: child.x, y: child.y});
		child.x += this.x;
		child.y += this.y;
	}
	setFirstChild(child){	//reserved as equipped item slot for Characters
		var obj = {c: child, x: child.x, y: child.y};
		if(this.children.length < 1)
			this.children.push(obj);
		else
			this.children[0] = obj;
		child.x += this.x;
		child.y += this.y;
	}
	draw (offx, offy){	//draw self, update and draw children
		ctx.globalAlpha = this.alpha;
		if(!this.grid)
			ctx.drawImage(this.img, this.x + offx, this.y + offy, this.w, this.h);
		else
			ctx.drawImage(this.img, this.x * Global.tilesize + offx, this.y * Global.tilesize + offy, this.w, this.h);

		var self = this;
		this.children.forEach(function(c){
			c.c.addX(self.x + c.x - c.c.x);
			c.c.addY(self.y + c.y - c.c.y);
			c.c.draw(offx, offy);
		});
	}
	addX(x){	//update x coords
		this.x += x;
		this.wx = this.x * (this.grid ? Global.tilesize : 1);
	}
	addY(y){	//update y coords
		this.y += y;
		this.wy = this.y * (this.grid ? Global.tilesize : 1);
	}
	setSource(src){	//change texture
		this.img = new Image();
		if(src !== "")
			this.img.src = src;
	}
}
function TileSheet(src, x, y, w, h, extra){	//rectangular grid of Tiles
	this.create = function(src, x, y, w, h, extra){
		extra.grid = true;
		var tiles = [];
		//for Tiles whose textures take up more than 1 Scene coordinate (like trees)
		var tw = 1, th = 1;
		if(extra.w)
			tw = extra.w;
		if(extra.h)
			th = extra.h;

		//direction to create grid in
		var dx = tw, dy = th;
		if(extra.dx)
			dx = extra.dx;
		if(extra.dy)
			dy = extra.dy;

		//create grid
		for(var i = 0; i < h; i += dy)
			for(var j = 0; j < w; j += dx)
				tiles.push(new Tile(src, x + j, y + i, extra));

		//surround with rigid tiles
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
