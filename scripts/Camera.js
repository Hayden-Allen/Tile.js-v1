class Camera {
	constructor(follow){
		this.follow = follow;
		this.minSprites = Number.MAX_SAFE_INTEGER;
		this.maxSprites = 0;
		this.count = 0;
	}		
	update(time){
		var self = this;
		this.follow.update();	
		var cx = this.follow.rect.x + this.follow.rect.w / 2, cy = this.follow.rect.y + this.follow.rect.h / 2;
		var	offx = c.width / 2 - cx, offy = c.height / 2 - cy;
		
		if(Global.currentScene.xmax - Global.currentScene.xmin > c.width && Global.currentScene.ymax - Global.currentScene.ymin > c.height){
			if(cx - Global.currentScene.xmin < c.width / 2)
				offx = -Global.currentScene.xmin;
			if(Global.currentScene.xmax - cx < c.width / 2)
				offx = -Global.currentScene.xmax + c.width;
			if(cy - Global.currentScene.ymin < c.height / 2)
				offy = -Global.currentScene.ymin;
			if(Global.currentScene.ymax - cy < c.height / 2)
				offy = -Global.currentScene.ymax + c.height;
		}
							
		var render = function(o){
			if(o instanceof AnimatedTile)
				o.update(time);
			
			if(o !== self.follow.rect && o.wx + o.w + offx > 0 && o.wx + offx < c.width && o.wy + o.h + offy > 0 && o.wy + offy < c.height){
				count++;
				if(o instanceof AnimatedTile)
					o.draw(offx, offy);
				else if(o.update)
					o.update(offx, offy);
				else
					o.draw(offx, offy);
			}
		}
		
		var start = performance.now(), count = 0;
		Global.currentScene.layers[0].forEach(render);
		
		this.follow.rect.draw(offx, offy);
		Global.currentScene.characters.forEach(function(c){
			if(c !== self.follow){
				c.update();
				c.rect.draw(offx, offy);
			}
		});
	
		for(var i = 1; i < Global.currentScene.layers.length; i++)
			Global.currentScene.layers[i].forEach(render);
			
		ctx.fillStyle = "#000000";
		for(var i = 0; i < Global.currentScene.lightMap.length; i++)
			for(var j = 0; j < Global.currentScene.lightMap[i].length; j++)
				rect(Global.currentScene.xmin + j * Global.tilesize + offx - .225, Global.currentScene.ymin + i * Global.tilesize + offy - .225, 
					Global.tilesize + .45, Global.tilesize + .45, "#000000", 1 - (Global.currentScene.lightMap[i][j] / Global.lightMax));
		ctx.globalAlpha = 1;
		
		var self = this;
		var x = self.follow.rect.x, y = self.follow.rect.y, w = self.follow.rect.w, h = self.follow.rect.h;
		
		Global.currentScene.doors.forEach(async function(d){
			var dx = d.tile.x * (d.tile.grid ? Global.tilesize : 1), dy = d.tile.y * (d.tile.grid ? Global.tilesize : 1), dw = d.tile.w, dh = d.tile.h;
			
			if(x + w > dx && x < dx + dw && y + h > dy && y < dy + dh){
				if(d.usable && d.from === Global.currentScene){
					Global.currentScene = d.to;
					player.scene = d.to;
					d.usable = false;
					self.follow.rect.x = dx;
					self.follow.rect.y = dy;
					
					self.maxSprites = 0;
					self.minSprites = Number.MAX_SAFE_INTEGER;
				}
				else if(d.usable && d.to === Global.currentScene){
					Global.currentScene = d.from;
					player.scene = d.from;
					d.usable = false;
					self.follow.rect.x = dx;
					self.follow.rect.y = dy;
					
					self.maxSprites = 0;
					self.minSprites = Number.MAX_SAFE_INTEGER;
				}
			}
			else if(!d.usable)
				d.usable = true;
		});
		
		this.minSprites = Math.min(count, this.minSprites);
		this.maxSprites = Math.max(count, this.maxSprites);
		this.count = count;
	}
}