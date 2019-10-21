class Camera {	//calculates offset coordinates so that Scene moves relative to player
	constructor(follow){
		this.follow = follow;	//the object this camera is following
		//for debugging use
		this.minSprites = Number.MAX_SAFE_INTEGER;
		this.maxSprites = 0;
		this.count = 0;
	}
	update(time){
		var self = this;
		this.follow.update();	//update target
		var cx = this.follow.rect.x + this.follow.rect.w / 2, cy = this.follow.rect.y + this.follow.rect.h / 2;	//center of target
		//x + w / 2 + offx = c.width / 2
		//offx = c.width / 2 - (x + w / 2) = offx - cx
		var	offx = c.width / 2 - cx, offy = c.height / 2 - cy;

		//clamp offsets to Scene boundaries
		if(Global.currentScene.xmax - Global.currentScene.xmin > c.width &&
				Global.currentScene.ymax - Global.currentScene.ymin > c.height){
			if(cx - Global.currentScene.xmin < c.width / 2)
				offx = -Global.currentScene.xmin;
			if(Global.currentScene.xmax - cx < c.width / 2)
				offx = -Global.currentScene.xmax + c.width;
			if(cy - Global.currentScene.ymin < c.height / 2)
				offy = -Global.currentScene.ymin;
			if(Global.currentScene.ymax - cy < c.height / 2)
				offy = -Global.currentScene.ymax + c.height;
		}

		//if non-integer, this produces weird effects with the lighting rectangles
		offx = Math.round(offx);
		offy = Math.round(offy);

		//draws Scene
		var render = function(o){
			if(o instanceof AnimatedTile)	//update all AnimatedTiles with current time
				o.update(time);

			if(o !== self.follow.rect && //object is not target AND it's visible
					o.wx + o.w + offx > 0 && o.wx + offx < c.width &&	o.wy + o.h + offy > 0 && o.wy + offy < c.height){
				count++;	//increment number of drawn sprites
				if(o instanceof AnimatedTile)
					o.draw(offx, offy);
				else if(o.update)	//Characters
					o.update(offx, offy);
				else  //Tiles
					o.draw(offx, offy);
			}
		}

		var start = performance.now(), count = 0;	//start time and number of drawn sprites

		for(var i = 0; i < Global.currentScene.projectiles.length; i++){	//update projectiles
			var p = Global.currentScene.projectiles[i];	//current projectile

			p.update();	//move it

			//if it's out of bounds of the Scene, delete it
			if(p.tile.y <= Global.currentScene.ymin || p.tile.y + p.tile.h >= Global.currentScene.ymax ||
				p.tile.x <= Global.currentScene.xmin || p.tile.x + p.tile.w >= Global.currentScene.xmax){
					var layer = Global.currentScene.layers[Global.currentScene.layers.length - 1];
					for(var j = 0; j < layer.length; j++){
						if(layer[j] === p.tile){
							layer.splice(j, 1);
							break;
						}
					}
					var projectiles = Global.currentScene.projectiles;
					for(var j = 0; j < projectiles.length; j++){
						if(projectiles[j] === p){
							projectiles.splice(j, 1);
							break;
						}
					}
			}
		}
		Global.currentScene.layers[0].forEach(render);	//draw first layer

		this.follow.draw(offx, offy);	//draw target

		Global.currentScene.characters.forEach(function(c){	//draw and update all other characters
			if(c !== self.follow){
				c.update();
				c.draw(offx, offy);
			}
		});

		for(var i = 1; i < Global.currentScene.layers.length; i++)	//draw all other layers
			Global.currentScene.layers[i].forEach(render);

		//draw lighting effects from lightMap values
		ctx.fillStyle = "#000000";
		for(var i = 0; i < Global.currentScene.lightMap.length; i++)
			for(var j = 0; j < Global.currentScene.lightMap[i].length; j++)
				rect(Global.currentScene.xmin + j * Global.tilesize + offx, Global.currentScene.ymin + i * Global.tilesize + offy,
					Global.tilesize, Global.tilesize, "#000000", 1 - (Global.currentScene.lightMap[i][j] / Global.lightMax));
		ctx.globalAlpha = 1;	//in case it was changed in calls to rect

		var self = this;
		var x = self.follow.rect.x, y = self.follow.rect.y, w = self.follow.rect.w, h = self.follow.rect.h;

		//check all doors to see if player has walked into one
		Global.currentScene.doors.forEach(async function(d){
			var dx = d.tile.x * (d.tile.grid ? Global.tilesize : 1);
			let dy = d.tile.y * (d.tile.grid ? Global.tilesize : 1);
			let dw = d.tile.w, dh = d.tile.h;

			if(x + w > dx && x < dx + dw && y + h > dy && y < dy + dh){	//if intersect
				if(d.usable && d.from === Global.currentScene){	//if usable
					Global.currentScene = d.to;	//switch Scene
					player.scene = d.to;	//move player to new Scene
					d.usable = false;			//can't use until player moves back off of it
					//set player coords to door coords
					self.follow.rect.x = dx;
					self.follow.rect.y = dy;

					//reset debug info
					self.maxSprites = 0;
					self.minSprites = Number.MAX_SAFE_INTEGER;
				}
				else if(d.usable && d.to === Global.currentScene){	//same thing, just for the Door's other Scene
					Global.currentScene = d.from;
					player.scene = d.from;
					d.usable = false;
					self.follow.rect.x = dx;
					self.follow.rect.y = dy;

					self.maxSprites = 0;
					self.minSprites = Number.MAX_SAFE_INTEGER;
				}
			}
			else if(!d.usable)	//if intersect and not usable, enable
				d.usable = true;
		});

		//update debug info based on render
		this.minSprites = Math.min(count, this.minSprites);
		this.maxSprites = Math.max(count, this.maxSprites);
		this.count = count;
	}
}
