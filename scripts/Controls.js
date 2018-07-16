function Controls(obj, extra, on) {
	this.obj = obj;
	this.extra = extra;
	this.on = on;
	this.locked = false;
	Global.controls.push(this);
}