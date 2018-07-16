function UIElement(src, x, y, extra){
	if(extra){
		extra.add = false;
		if(extra.visible)
			this.visible = extra.visible;
		else
			this.visible = true;
	}
	else
		extra = {add: false};
	
	if(extra.frames && extra.time)
		this.tile = new AnimatedTile(extra.frames, extra.time, src, x, y, extra);
	else
		this.tile = new Tile(src, x, y, extra);
	
	this.draw = function(offx, offy){
		if(this.visible)
			this.tile.draw(offx, offy);
	}
}