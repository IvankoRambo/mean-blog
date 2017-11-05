module.exports = {
	getISODate: function(){
		var fullISODate = new Date().toISOString(),
			dateRegExp = /(\d){4}-(\d){2}-(\d){2}/,
			ISODateArr = fullISODate.match(dateRegExp);
			
		if(ISODateArr && ISODateArr.length){
			return ISODateArr[0];
		}
	}	
};
