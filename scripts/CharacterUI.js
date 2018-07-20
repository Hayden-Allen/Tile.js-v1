function CharacterUI(target){
	this.target = target;
	this.maxHealth = target.maxHealth;
	this.health = target.health;
	this.elements = [];
	this.lastHeart = 0;
	
	this.cursor = new UIElement("assets/ui/cursor.png", 1, 1, {frames: 2, time: 500});
	this.cursor.controls = new Controls(this.cursor.tile, {last: performance.now()}, function(keys){
			var now = performance.now();
			if(now - this.extra.last > 100){
				if(keys.at(3))
					this.obj.y = Math.max(1, this.obj.y - 1);
				if(keys.at(2))
					this.obj.x = Math.max(1, this.obj.x - 1);
				if(keys.at(1))
					this.obj.y = Math.min(c.height / Global.tilesize - 2, this.obj.y + 1);
				if(keys.at(0))
					this.obj.x = Math.min(c.width / Global.tilesize - 2, this.obj.x + 1);
				this.extra.last = now;	
			}
		});
	this.cursor.controls.locked = true;
	this.showInventory = false;
	
	for(var i = 0; i < this.maxHealth / 2; i++)
		this.elements.push(new UIElement("assets/ui/heart_empty.png", c.width - (i + 1) * Global.tilesize / 2, 0, {grid: false, w: .5, h: .5}));
	for(var i = 0; i < parseInt(this.health / 2); i++){
		this.elements[i].tile.setSource("assets/ui/heart_full.png");
		this.lastHeart += 2;
	}
	if(this.health / 2 !== parseInt(this.health / 2)){
		this.elements[parseInt(this.health / 2)].setSource("assets/ui/heart_half.png");
		this.lastHeart++;
	}
	
	Global.uis.push(this);
	
	this.inventorySwitch = function(){
		this.showInventory = !this.showInventory;
		this.cursor.controls.locked = !this.cursor.controls.locked;
	}
	
	this.draw = function(){
		if(target.maxHealth != this.maxHealth)
			this.maxHealth = target.maxHealth;
		while(this.maxHealth / 2 > this.elements.length)
			this.elements.push(new UIElement("assets/ui/heart_empty.png", c.width - (i + 1) * tilesize, 0, {grid: false, add: false}));
		while(this.maxHealth / 2 < this.elements.length)
			this.elements.pop();
		
		
		var direction = Math.sign(target.health - this.health);
		
		while(this.health != target.health){
			if(this.lastHeart % 2 == 1)
					this.elements[parseInt(this.lastHeart / 2)].tile.setSource(direction < 0 ? "assets/ui/heart_empty.png" : "assets/ui/heart_full.png");
				else
					this.elements[this.lastHeart / 2 - (direction < 0 ? 1 : 0)].tile.setSource("assets/ui/heart_half.png");
			
			this.lastHeart += direction;
			this.health += direction;
		}
		
		this.elements.forEach(function(t){
			t.draw(0, 0);
		});
		
		if(this.showInventory){
			rect(Global.tilesize, Global.tilesize, c.width - Global.tilesize * 2, c.height - Global.tilesize * 2, "#ffffff", .75);
			
			var x = Global.tilesize * 1.25, y = Global.tilesize;
			this.target.inventory.items.forEach(function(i){
				i.tile.draw(x - i.tile.wx, y - i.tile.wy);
				x += Global.tilesize;
				if(x >= c.width / Global.tilesize * 2){
					x = Global.tilesize * 1.25;
					y += Global.tilesize;
				}
			});
			
			this.cursor.draw(0, 0);
		}
	}
}