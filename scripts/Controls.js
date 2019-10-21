function Controls(obj, extra, on) {	//used to control various objects
	this.obj = obj;
	this.extra = extra;
	this.on = on;
	this.locked = false;
	Global.controls.push(this);
}
