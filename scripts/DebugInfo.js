function DebugInfo(){	//string displayed under canvas
	this.x = 0;
	this.y = 0;

	this.sprites = 0;	//sprites drawn in current frame
	this.minSprites = 0;	//minimum sprites drawn for current Scene
	this.maxSprites = 0;	//maximum sprites drawn for current Scene

	this.fps = 0;	//frames per second
	this.avgfps = 0;	//average frames per second
	this.totalfps = 0;	//total frames drawn
	this.updates = 1;

	this.pad = function(places, num){	//pad string for formatting reasons
		var s = num + "";
		while(s.length < places) s = "0" + s;
		return s;
	}

	//for if # of updates or total frames overflows
	var temp = new Date();
	this.avgfpsstart = this.pad(2, temp.getHours()) + ":" + this.pad(2, temp.getMinutes()) + ":" + this.pad(2, temp.getSeconds());

	this.update = function(x, y, sprites, minSprites, maxSprites, fps){
		this.x = x;	//player x
		this.y = y;	//player y

		this.sprites = sprites;	//sprites drawn in current frame
		this.minSprites = minSprites;	//minimum sprites drawn for current Scene
		this.maxSprites = maxSprites;	//maximum sprites drawn for current Scene

		this.fps = Math.round(fps);	//current framerate
		this.totalfps += fps;	//add current framerate to total
		this.updates++;	//increment update

		//for when updates or totalfps overflow
		if(this.updates > Number.MAX_SAFE_INTEGER || this.totalfps > Number.MAX_SAFE_INTEGER){
			this.updates = 1;
			this.totalfps = fps;
			var temp = new Date();
			this.avgfpsstart = this.pad(2, temp.getHours()) + ":" + this.pad(2, temp.getMinutes()) + ":" + this.pad(2, temp.getSeconds());
		}
		//divide all fps counts by # of updates to get average fps
		this.avgfps = Math.round(this.totalfps / this.updates);
	}
	this.string = function(){	//format string for display under canvas
		return `{ Player: (${this.x}, ${this.y}) | Player Tile: (${parseInt(this.x / Global.tilesize)}, ${parseInt(this.y / Global.tilesize)}) |
				Sprites: ${this.sprites} (min: ${this.minSprites}, max: ${this.maxSprites}) |
				FPS: ${this.fps} | Average FPS: ${this.avgfps} (since ${this.avgfpsstart}) }`;
	}
}
