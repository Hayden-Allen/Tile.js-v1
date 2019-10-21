class Character {	//movable character that can hold items
	constructor(tile, speed, health, inventory, scene){
		this.scene = scene ? scene : Global.currentScene;
		this.rect = tile;	//visual representation of the Character
		this.speed = speed;	//movement speed
		this.health = health;	//hitpoints (not actually used)
		this.maxHealth = health;	//max hitpoints (also not used)
		this.inventory = inventory ? inventory : new Inventory(5);	//carried items
		this.currentItem;	//equipped item
		this.setCurrentItem(this.inventory.items[0]);

		Global.currentScene.characters.push(this);	//add to Scene's character list
	}
	update(){
		var self = this;
		var x = self.rect.x, y = self.rect.y, w = self.rect.w, h = self.rect.h;
		//check and fix intersections based on angle between this and other Tiles
		Global.currentScene.rigids.forEach(function(r){
			if(r !== self.rect){
				var rx = r.wx, ry = r.wy, rw = r.w, rh = r.h;
				var slope = angle(x + w / 2, y + h / 2, rx + rw / 2, ry + rh / 2);	//angle between centers of Tiles

				if((slope.deg > 45 && slope.deg < 135) && x + w > rx && x < rx + rw && y + h > ry && y + h < ry + rh / 2)	//top
					self.rect.y = ry - h;
				if((slope.deg > 135 && slope.deg < 225) && y + h > ry && y < ry + rh && x + w > rx && x + w < rx + rw / 2)	//left
					self.rect.x = rx - w;
				if((slope.deg > 225 && slope.deg < 315) && x + w > rx && x < rx + rw && y < ry + rh && y > ry + rh / 2)	//bottom
					self.rect.y = ry + rh;
				if((slope.deg < 45 || slope.deg > 315) && y + h > ry && y < ry + rh && x < rx + rw && x > rx + rw / 2)	//right
					self.rect.x = rx + rw;
			}
		});

		//clamp health and handle death
		if(this.health > this.maxHealth)
			this.health = this.maxHealth;
		if(this.health <= 0){
			this.health = 0;
			console.log("DEAD");
		}
	}
	draw(offx, offy){
		this.rect.draw(offx, offy);
	}
	setCurrentItem(i){
		if(i){
			this.rect.setFirstChild(i.tile);	//add to children array for drawing
			this.currentItem = i;
		}
	}
}
