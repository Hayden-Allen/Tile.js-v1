function Door(tile, from, to){	//lets player travel between Scenes
	this.tile = tile;	//graphic
	this.from = from;	//Scene from
	this.to = to;			//destination Scene
	//add to both Scenes
	this.from.addDoor(this);
	this.to.addDoor(this);
	this.usable = true;	//whether or not the player stepping on this tile will trigger the Door or not

	Global.currentScene.doors.push(this);	//add to special doors array
}
