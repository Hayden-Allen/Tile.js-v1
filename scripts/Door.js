function Door(tile, from, to){
	this.tile = tile;
	this.from = from;
	this.to = to;
	this.from.addDoor(this);
	this.to.addDoor(this);
	this.usable = true;
	
	Global.currentScene.doors.push(this);
}
