function Scene(lightMin){	//stores Tiles and lighting data
	//canvas coordinate boundaries
	this.xmin;
	this.xmax;
	this.ymin;
	this.ymax;
	//light data
	this.lightMin = Math.min(Global.lightMax, lightMin);
	this.lightMap = [];
	this.lights = [];
	//special arrays to speed up certain operations
	this.rigids = [];
	this.doors = [];
	this.layers = [];
	this.layers.push([]);
	this.characters = [];
	this.projectiles = [];

	this.add = function(obj){
		//update boundaries if necessary
		if(this.ymin === undefined || obj.wy < this.ymin)
			this.ymin = obj.wy;
		if(this.ymax === undefined || obj.wy + obj.h > this.ymax)
			this.ymax = obj.wy + obj.h;
		if(this.xmin === undefined || obj.wx < this.xmin)
			this.xmin = obj.wx;
		if(this.xmax === undefined || obj.wx + obj.w > this.xmax)
			this.xmax = obj.wx + obj.w;

		var zindex = obj.extra.zindex;	//determines which layer to put it in
		if(!zindex)	//if undefined, put it in bottom layer
			this.layers[0].push(obj);
		else{
			if(zindex == -1)	//put in top layer
				zindex = this.layers.length - 1;
			while(zindex > this.layers.length - 1)	//create layers until specified one is reached, if necessary
				this.layers.push([]);
			this.layers[zindex].push(obj);
		}

		if(obj.extra.lightIntensity)	//if has light property, add to lights array for later processing
			this.lights.push({x: obj.wx / Global.tilesize, y: obj.wy / Global.tilesize, i: obj.extra.lightIntensity});
	}
	this.addRigid = function(obj){	//add to rigid array
		this.rigids.push(obj);
	}
	this.addDoor = function(obj){	//add to doors array
		this.layers[0].push(obj.tile);
		this.doors.push(obj);
	}
	this.update = function(){	//draw everything
		this.objects.forEach(function(o){
			o.draw();
		});
	}
	this.finalize = function(){	//create grid of light values
		//generate empty grid
		for(var i = 0; i <= (this.ymax - this.ymin) / Global.tilesize; i++){
			this.lightMap.push([]);
			for(var j = 0; j <= (this.xmax - this.xmin) / Global.tilesize; j++)
				this.lightMap[i].push(this.lightMin);
		}

		function propagate(x, y, i){	//recursively fill out grid
			var newLight = Math.min(Global.lightMax, i);	//new value. clamped to lightMax to avoid rendering bugs with - opacities

			//return if out of bounds or current is >= new
			if(i <= 0 || (x < 0 || x >= self.lightMap[0].length || y < 0 || y >= self.lightMap.length) ||
				Math.abs(self.lightMap[y][x]) >= newLight)
				return;

			self.lightMap[y][x] = newLight;	//set value to new value

			//propagate in cardinal directions
			propagate(x, y - 1, i - 1);
			propagate(x, y + 1, i - 1);
			propagate(x - 1, y, i - 1);
			propagate(x + 1, y, i - 1);
		}

		var self = this;
		if(this.lightMin != Global.lightMax){	//propagate for each light. This is not an additive algorithm, so it might look weird
			this.lights.forEach(function(l){
				var y = l.y - self.ymin / Global.tilesize, x = l.x - self.xmin / Global.tilesize;
				propagate(x, y, Math.min(Global.lightMax, l.i + self.lightMin));
			});
		}

		for(var i = 0; i < self.lightMap.length; i++)	//make sure no negative values
			for(var j = 0; j < self.lightMap[i].length; j++)
				self.lightMap[i][j] = Math.abs(self.lightMap[i][j]);

		this.doors.forEach(function(d){	//put doors on top of everything else
			var index;
			for(var i = 0; i < self.layers.length && index === undefined; i++)
				for(var j = 0; j < self.layers[i].length && index === undefined; j++)
					if(self.layers[i][j] === d.tile)
						index = {x: j, y: i};
			self.layers[index.y].splice(index.x, 1);
			self.layers[self.layers.length - 1].push(d.tile);
		});
	}
}
