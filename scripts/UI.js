function UI(target){
	this.target = target;
	this.maxHealth = target.maxHealth;
	this.health = target.health;
	this.tiles = [];
	this.lastHeart = 0;
	
	for(var i = 0; i < this.maxHealth / 2; i++)
		this.tiles.push(new Tile("assets/heart_empty.png", c.width - (i + 1) * tilesize, 0, {grid: false, add: false}));
	for(var i = 0; i < parseInt(this.health / 2); i++){
		this.tiles[i].setSource("assets/heart_full.png");
		this.lastHeart += 2;
	}
	if(this.health / 2 !== parseInt(this.health / 2)){
		this.tiles[parseInt(this.health / 2)].setSource("assets/heart_half.png");
		this.lastHeart++;
	}
	
	uis.push(this);
	
	this.draw = function(){
		if(target.maxHealth != this.maxHealth)
			this.maxHealth = target.maxHealth;
		while(this.maxHealth / 2 > this.tiles.length)
			this.tiles.push(new Tile("assets/heart_empty.png", c.width - (i + 1) * tilesize, 0, {grid: false, add: false}));
		while(this.maxHealth / 2 < this.tiles.length)
			this.tiles.pop();
		
		
		var direction = Math.sign(target.health - this.health);
		
		while(this.health != target.health){
			if(this.lastHeart % 2 == 1)
					this.tiles[parseInt(this.lastHeart / 2)].setSource(direction < 0 ? "assets/heart_empty.png" : "assets/heart_full.png");
				else
					this.tiles[this.lastHeart / 2 - (direction < 0 ? 1 : 0)].setSource("assets/heart_half.png");
			
			this.lastHeart += direction;
			this.health += direction;
		}
		
		this.tiles.forEach(function(t){
			t.draw(0, 0);
		});
	}
}