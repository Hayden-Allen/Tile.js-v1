class Enemy extends Character {	//enemy that follows a target around
	constructor(tile, speed, health, scene, target){
		super(tile, speed, health, scene);

		this.controls = new Controls(this.rect, {speed: this.speed, target: target ? target : player, scene: scene ? scene : Global.currentScene},
		function(keys){	//control function
			if(this.extra.scene === this.extra.target.scene){	//if in the same scene as its target
				//directions to move in
				var xd = Math.sign((this.obj.wx + this.obj.w / 2) - (this.extra.target.rect.wx + this.extra.target.rect.w / 2));
				var yd = Math.sign((this.obj.wy + this.obj.h / 2) - (this.extra.target.rect.wy + this.extra.target.rect.h / 2));
				var speed = this.extra.speed;

				if(xd != 0 && yd != 0)	//if diagonal movement, maintain constant speed
					speed /= Global.sqrt2;

				speed *= Global.delta / 1000;	//scale by frame time

				//if not on top of target, move towards it
				if(this.obj.wx < this.extra.target.rect.wx - Global.tilesize || this.obj.wx > this.extra.target.rect.wx + Global.tilesize ||
					this.obj.wy < this.extra.target.rect.wy - Global.tilesize || this.obj.wy > this.extra.target.rect.wy + Global.tilesize){
					this.obj.addX(-xd * speed);
					this.obj.addY(-yd * speed);
				}
			}
		});
	}
}
