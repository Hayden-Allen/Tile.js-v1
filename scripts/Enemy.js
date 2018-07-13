class Enemy extends Character {
	constructor(tile, speed, health, target){
		super(tile, speed, health);
		
		this.controls = new Controls(this.rect, {speed: this.speed, target: target}, function(keys){
			var xd = Math.sign((this.obj.wx + this.obj.w / 2) - (this.extra.target.rect.wx + this.extra.target.rect.w / 2));
			var yd = Math.sign((this.obj.wy + this.obj.h / 2) - (this.extra.target.rect.wy + this.extra.target.rect.h / 2));
			var speed = this.extra.speed;
			
			if(xd != 0 && yd != 0)
				speed /= sqrt2;
			
			if(this.obj.wx < this.extra.target.rect.wx - tilesize || this.obj.wx > this.extra.target.rect.wx + tilesize ||
				this.obj.wy < this.extra.target.rect.wy - tilesize || this.obj.wy > this.extra.target.rect.wy + tilesize){
				this.obj.addX(-xd * speed);
				this.obj.addY(-yd * speed);
			}
		});
	}
}