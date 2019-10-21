function UIElement(src, x, y, extra){
	this.visible = true;	//if false it will not be rendered
	if(extra){
		extra.add = true;
		if(extra.visible)
			this.visible = extra.visible;
	}
	else
		extra = {add: true};

	//create appropriate Tile
	if(extra.frames && extra.time)
		this.tile = new AnimatedTile(extra.frames, extra.time, src, x, y, extra);
	else
		this.tile = new Tile(src, x, y, extra);

	this.draw = function(offx, offy){
		if(this.visible)
			this.tile.draw(offx, offy);
	}
}
