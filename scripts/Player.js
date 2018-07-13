class Player extends Character {
	constructor(tile, speed, health){
		super(tile, speed, health);
		
		this.controls = new Controls(this.rect, {speed: this.speed}, function(keys){
			var speed = this.extra.speed;
			if(!keys.log2())
				speed /= sqrt2;
		
			if(keys.at(3))
				this.obj.addY(-speed);
			if(keys.at(2))
				this.obj.addX(-speed);
			if(keys.at(1))
				this.obj.addY(speed);
			if(keys.at(0))
				this.obj.addX(speed);
		});
	}
}