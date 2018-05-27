var crypto = require('crypto'),
	fs = require('fs'),
	AWS = require('aws-sdk'),
	configAWS = require('./../configSet/configAWS.json');

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
	},
	
	uploadToS3Bucket: function(filePath, key){
		AWS.config.update({
			accessKeyId: configAWS.accessKeyId,
			secretAccessKey: configAWS.secretAccessKey,
			region: configAWS.region
		});
		
		fs.readFile(filePath, function(err, data){
			if(err){
				throw err;
			}
			
			var binaryData = new Buffer(data, 'binary'),
				s3 = new AWS.S3();
			s3.putObject({
				Bucket: configAWS.Bucket,
				Key: key,
				Body: binaryData,
				ACL: 'public-read'
			}, function(resp){
				console.log('Successfully uploaded package', key);
			});
		});
	}
};
