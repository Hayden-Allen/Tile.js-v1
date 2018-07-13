class Character {
	constructor(tile, speed, health){
		this.rect = tile;
		this.speed = speed;
		this.health = health;
		this.maxHealth = health;
		currentScene.characters.push(this);
	}
	update(){
		var self = this;
		var x = self.rect.x, y = self.rect.y, w = self.rect.w, h = self.rect.h;
		currentScene.rigids.forEach(function(r){
			if(r !== self.rect){
				var rx = r.x * (r.grid ? tilesize : 1), ry = r.y * (r.grid ? tilesize : 1), rw = r.w, rh = r.h;
				var slope = angle(x + w / 2, y + h / 2, rx + rw / 2, ry + rh / 2);
				
				if((slope.deg > 45 && slope.deg < 135) && x + w > rx && x < rx + rw && y + h > ry && y + h < ry + rh / 2)
					self.rect.y = ry - h;
				if((slope.deg > 135 && slope.deg < 225) && y + h > ry && y < ry + rh && x + w > rx && x + w < rx + rw / 2)
					self.rect.x = rx - w;
				if((slope.deg > 225 && slope.deg < 315) && x + w > rx && x < rx + rw && y < ry + rh && y > ry + rh / 2)
					self.rect.y = ry + rh;
				if((slope.deg < 45 || slope.deg > 315) && y + h > ry && y < ry + rh && x < rx + rw && x > rx + rw / 2)
					self.rect.x = rx + rw;
			}
		});
		if(this.health > this.maxHealth)
			this.health = this.maxHealth;
		if(this.health <= 0){
			this.health = 0;
			console.log("DEAD");
		}
	}
}
