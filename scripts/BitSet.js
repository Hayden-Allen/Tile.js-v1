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
	this.flip = function(index){
		this.value ^= Math.pow(2, index);
	}
	this.log2 = function(){
		return Math.log2(this.value) === parseInt(Math.log2(this.value));
	}
}