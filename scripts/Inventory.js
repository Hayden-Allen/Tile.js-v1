function Inventory(size, items){
	this.size = size;
	this.items = items ? items : [];
	
	this.add = function(item){
		if(this.items.length + 1 <= this.size){
			this.items.push(item);
		}
	}
}