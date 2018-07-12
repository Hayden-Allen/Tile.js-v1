function DebugInfo(x, y, rendered, fps){
	this.x = x;
	this.y = y;
	this.rendered = rendered;
	this.fps = fps;
	this.avgfps = fps;
	this.updates = 1;
	
	this.update = function(x, y, rendered, fps){
		this.x = x;
		this.y = y;
		this.rendered = rendered;
		this.fps = fps;
		this.updates++;
		if(this.updates > Number.MAX_SAFE_INTEGER)
			this.updates = 1;
		this.avgfps = ((this.avgfps * (this.updates - 1)) + fps) / this.updates;
	}
	this.string = function(){
		return `{ px: ${this.x}, py: ${this.y}, sprites: ${this.rendered}, fps: ${Math.round(this.fps)}, avgfps: ${Math.round(this.avgfps)} }`;
	}
}