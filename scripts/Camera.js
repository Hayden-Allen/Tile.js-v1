class Camera {
	constructor(follow){
		this.follow = follow;
	}		
	update(){
		var self = this;
		this.follow.update(c.width / 2 - this.follow.rect.x + this.follow.rect.w / 2, 
							c.height / 2 - this.follow.rect.y + this.follow.rect.h / 2);	
		var cx = this.follow.rect.x + this.follow.rect.w / 2, cy = this.follow.rect.y + this.follow.rect.h / 2;
		var	offx = c.width / 2 - cx, offy = c.height / 2 - cy;
		
		if(currentScene.xmax - currentScene.xmin > c.width && currentScene.ymax - currentScene.ymin > c.height){
			if(cx - currentScene.xmin < c.width / 2)
				offx = -currentScene.xmin;
			if(currentScene.xmax - cx < c.width / 2)
				offx = -currentScene.xmax + c.width;
			if(cy - currentScene.ymin < c.height / 2)
				offy = -currentScene.ymin;
			if(currentScene.ymax - cy < c.height / 2)
				offy = -currentScene.ymax + c.height;
		}
							
		var render = function(o){
						if(o !== self.follow.rect){
							if(o.update)
								o.update(offx, offy);
							else if(o instanceof AnimatedTile){
								o.draw(offx, offy, performance.now() - (performance.now() - start));
							}
							else
								o.draw(offx, offy);
						}
					}
		
		var start = performance.now();
		currentScene.layers[0].forEach(render);
		
		this.follow.rect.draw(offx, offy);
		
		start = performance.now();
		for(var i = 1; i < currentScene.layers.length; i++)
			currentScene.layers[i].forEach(render);
			
		ctx.fillStyle = "#000000";
		for(var i = 0; i < currentScene.lightMap.length; i++)
			for(var j = 0; j < currentScene.lightMap[i].length; j++){
				ctx.globalAlpha = 1 - (currentScene.lightMap[i][j] * (1 / lightMax));
				ctx.fillRect(currentScene.xmin + j * tilesize + offx, currentScene.ymin + i * tilesize + offy, tilesize, tilesize);
			}
		ctx.globalAlpha = 1;
		
		var self = this.follow;
		var x = self.rect.x, y = self.rect.y, w = self.rect.w, h = self.rect.h;
		currentScene.doors.forEach(async function(d){
			var dx = d.tile.x * (d.tile.grid ? tilesize : 1), dy = d.tile.y * (d.tile.grid ? tilesize : 1), dw = d.tile.w, dh = d.tile.h;
			
			if(x + w > dx && x < dx + dw && y + h > dy && y < dy + dh){
				if(d.usable && d.from === currentScene){
					fade(100, "#000000");
					
					currentScene = d.to;
					d.usable = false;
					self.rect.x = dx;
					self.rect.y = dy;
					
				}
				else if(d.usable && d.to === currentScene){
					fade(100, "#000000");
					
					currentScene = d.from;
					d.usable = false;
					self.rect.x = dx;
					self.rect.y = dy;
				}
			}
			else if(!d.usable)
				d.usable = true;
		});
	}
}