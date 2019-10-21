function Inventory(size, items){	//collection of items
	this.size = size;	//max number of items
	this.items = items ? items : [];	//array of items

	this.add = function(item){	//if within size bounds, add new item to array
		if(this.items.length + 1 <= this.size){
			this.items.push(item);
		}
	}
}
