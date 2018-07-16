class Player extends Character {
	constructor(tile, speed, health){
		super(tile, speed, health);
		
		this.ui = new CharacterUI(this);
		
		this.controls = new Controls(this.rect, {speed: this.speed}, function(keys){
			var speed = this.extra.speed;
			if(keys.value != 0 && !keys.log2())
				speed /= Global.sqrt2;
		
			speed *= Global.delta / 1000;
		
			if(keys.at(3))
				this.obj.addY(-speed);
			if(keys.at(2))
				this.obj.addX(-speed);
			if(keys.at(1))
				this.obj.addY(speed);
			if(keys.at(0))
				this.obj.addX(speed);
			
			this.obj.x = Math.round(this.obj.x);
			this.obj.y = Math.round(this.obj.y);
		});
	}
}