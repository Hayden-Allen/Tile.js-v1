class Player extends Character {
	constructor(tile, speed){
		super(tile, speed);
		
		this.controls = new Controls(this.rect, {speed: this.speed}, function(keys){
			var speed = this.extra.speed;
			if(Math.log2(keys.value) !== parseInt(Math.log2(keys.value)))
				speed /= Math.sqrt(2);
		
			if(keys.at(3))
				this.obj.y -= speed;
			if(keys.at(2))
				this.obj.x -= speed;
			if(keys.at(1))
				this.obj.y += speed;
			if(keys.at(0))
				this.obj.x += speed;
				
			this.obj.x = parseInt(this.obj.x);
			this.obj.y = parseInt(this.obj.y);
		});
	}
}