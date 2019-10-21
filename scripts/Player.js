class Player extends Character {
	constructor(tile, speed, health, inventory){
		super(tile, speed, health, inventory);

		this.direction = 0;	//rotates graphic based on which key was pressed last
		this.ui = new CharacterUI(this);	//health icons in top left

		var self = this;
		this.controls = new Controls(this.rect, {player: this, speed: this.speed}, function(keys){
			var speed = this.extra.speed;
			if(!keys.log2())	//constant speed for diagonal movement
				speed /= Global.sqrt2;

			speed *= Global.delta / 1000;	//scale by frame time

			//movement
			if(keys.at(3))
				this.obj.addY(-speed);
			if(keys.at(2))
				this.obj.addX(-speed);
			if(keys.at(1))
				this.obj.addY(speed);
			if(keys.at(0))
				this.obj.addX(speed);

			//used for direction
			if(Global.recentKey.at(3))
				player.direction = 0;
			else if(Global.recentKey.at(2))
				player.direction = 3;
			else if(Global.recentKey.at(1))
				player.direction = 2;
			else if(Global.recentKey.at(0))
				player.direction = 1;

			//round to avoid weird graphical things
			this.obj.x = Math.round(this.obj.x);
			this.obj.y = Math.round(this.obj.y);

			if(keys.at(5)){	//if space is pressed, use current item
				if(self.currentItem)
					self.currentItem.attack();
				keys.flip(5);	//disable space
			}
		});
	}
	draw(offx, offy){	//perform rotation and draw graphic
		var x = this.rect.x + this.rect.w / 2, y = this.rect.y + this.rect.h / 2;
		ctx.save();
		ctx.translate(x + offx, y + offy);
		ctx.rotate(this.direction * Math.PI / 2);
		this.rect.draw(-x, -y);
		ctx.restore();
	}
}
