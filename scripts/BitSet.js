function BitSet(value) {
	this.value = value;
	this.at = function(index){
		return (this.value & Math.pow(2, index)) > 0;
	}
	this.set = function(index, val){
		if(this.at(index) != val)
			this.value ^= Math.pow(2, index);
		return this;
	}
}