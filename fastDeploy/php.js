
	

	
	function parseFile(phpFolder,callback) {
		var realFileName = phpFolder + 'pull.php';
		
		console.log('parsing file: ' + realFileName);

		var exec = require('child_process').exec;
		var cmd = 'php' + ' ' + 'pull.php';
		
		exec(cmd, function(error, stdout, stderr) {
			callback(stdout);
		});
	}

module.exports =  {
parseFile,
};