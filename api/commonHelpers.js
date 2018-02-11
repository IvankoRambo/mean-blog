var crypto = require('crypto');

module.exports = {
	getISODate: function(){
		var fullISODate = new Date().toISOString(),
			dateRegExp = /(\d){4}-(\d){2}-(\d){2}/,
			ISODateArr = fullISODate.match(dateRegExp);
			
		if(ISODateArr && ISODateArr.length){
			return ISODateArr[0];
		}
	},
	
	sha256Hash: function(data){
		if(data){
			return crypto.createHash('sha256').update(data).digest('hex');
		}
	},
	
	generateStr: function(length){
		length = length || 5;
		var text = '',
			symbols = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		
		for(var i = 0; i<length; i++){
			text += symbols.charAt(Math.floor(Math.random() * symbols.length));
		}
		
		return text;
	}
};
