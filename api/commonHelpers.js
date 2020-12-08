var crypto = require('crypto');
var fs = require('fs');
var AWS = require('aws-sdk');

module.exports = {
	getISODate: function(){
		var fullISODate = new Date().toISOString();
		var dateRegExp = /(\d){4}-(\d){2}-(\d){2}/;
		var ISODateArr = fullISODate.match(dateRegExp);

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
		var text = '';
		var symbols = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

		for(var i = 0; i < length; i++){
			text += symbols.charAt(Math.floor(Math.random() * symbols.length));
		}

		return text;
	},

	uploadToS3Bucket: function(filePath, key){
		AWS.config.update({
			accessKeyId: process.env.AWS_ACCESS_KEY_ID,
			secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
			region: 'eu-west-1'
		});

		fs.readFile(filePath, function(err, data){
			if(err){
				throw err;
			}

			var binaryData = new Buffer(data, 'binary');
			var s3 = new AWS.S3();
			s3.putObject({
				Bucket: 'ivankorambo',
				Key: key,
				Body: binaryData,
				ACL: 'public-read'
			}, function(resp){
				console.log('Successfully uploaded package', key);
			});
		});
	}
};
