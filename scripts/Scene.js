function Scene(lightMin){
	this.xmin;
	this.xmax;
	this.ymin;
	this.ymax;
	this.lightMin = lightMin;
	this.lightMap = [];
	this.lights = [];
	
	this.rigids = [];
	this.doors = [];
	this.layers = [];
	this.layers.push([]);
	//console.log(this.layers);
	
	this.add = function(obj){				
		if(this.ymin === undefined || obj.wy < this.ymin)
			this.ymin = obj.wy;
		if(this.ymax === undefined || obj.wy + obj.h > this.ymax)
			this.ymax = obj.wy + obj.h;
		if(this.xmin === undefined || obj.wx < this.xmin)
			this.xmin = obj.wx;
		if(this.xmax === undefined || obj.wx + obj.w > this.xmax)
			this.xmax = obj.wx + obj.w;		
			
		var zindex = obj.extra.zindex;
		if(!zindex)
			this.layers[0].push(obj);
		else{
			while(zindex > this.layers.length - 1)
				this.layers.push([]);
			this.layers[zindex].push(obj);
		}
		
		if(obj.extra.lightIntensity)
			this.lights.push({x: obj.wx / tilesize, y: obj.wy / tilesize, i: obj.extra.lightIntensity});
	}
	this.addRigid = function(obj){
		this.rigids.push(obj);
	}
	this.addDoor = function(obj){
		this.layers[0].push(obj.tile);
		this.doors.push(obj);
	}
	this.update = function(){
		this.objects.forEach(function(o){
			o.draw();
		});
	}
	this.finalize = function(){
		for(var i = 0; i <= (this.ymax - this.ymin) / tilesize; i++){
			this.lightMap.push([]);
			for(var j = 0; j <= (this.xmax - this.xmin) / tilesize; j++)
				this.lightMap[i].push(this.lightMin);
		}
		
		function propagate(x, y, i){
			if(i <= 0 || x < 0 || x >= self.lightMap[0].length || y < 0 || y >= self.lightMap.length || self.lightMap[y][x] < 0 &&
				Math.abs(self.lightMap[y][x]) > self.lightMin + i)
				return;
			
			//console.log("{" + x + ", " + y + "}, " + (i + self.lightMin));
			
			self.lightMap[y][x] = self.lightMin + i;
			if(self.lightMap[y][x] > lightMax)
				self.lightMap[y][x] = lightMax;
			self.lightMap[y][x] *= -1;
			
			propagate(x, y - 1, i - 1);
			propagate(x, y + 1, i - 1);
			propagate(x - 1, y, i - 1);
			propagate(x + 1, y, i - 1);
		}
		
		var self = this;
		this.lights.forEach(function(l){
			var y = l.y - self.ymin / tilesize, x = l.x - self.xmin / tilesize;
			//self.lightMap[y][x] += l.i;
			propagate(x, y, l.i);
			
		});
		for(var i = 0; i < self.lightMap.length; i++)
				for(var j = 0; j < self.lightMap[i].length; j++)
					self.lightMap[i][j] = Math.abs(self.lightMap[i][j]);
		//console.log(this.lightMap);
		this.doors.forEach(function(d){
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