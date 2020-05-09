/******************************************************************************
                           BUILD FILE FOR DUALSELECT
******************************************************************************/
// requires
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// constants
const projectName = 'dualselect';
const version = '1.0';

console.info('');
console.info('********************************************************************************');
console.info('*                                dualselect                                    *');
console.info('********************************************************************************');
console.info('');
console.log('... building ' + projectName + ' ' + version + ' ...');
console.log();

fs.rmdirSync('lib' + path.sep + projectName, {recursive: true});
fs.mkdirSync('lib' + path.sep + projectName + path.sep + 'js', {recursive: true});
fs.mkdirSync('lib' + path.sep + projectName + path.sep + 'css', {recursive: true});

const jsfiles = [
	projectName + path.sep + 'js' + path.sep + projectName + '.js'
];

for(var idx=0; idx < jsfiles.length; ++idx) {
	console.debug('... building ' + jsfiles[idx]);
	var outfile = 'lib' + path.sep + (jsfiles[idx]).replace('.js', ('-' + version + '.min.js'));
	var cmd = 'uglifyjs src' + path.sep + jsfiles[idx] + ' -o ' + outfile;
	exec(cmd, function(err, stdout, stderr) {
		console.log(`${stdout}`);
		if (err) {
			console.error(cmd, err);
			console.error('');
			console.error(`${stderr}`);
			return -1;
		}
	});
}

const cssfiles = [
	projectName + path.sep + 'css' + path.sep + projectName + '.css'
];

for(var idx=0; idx < cssfiles.length; ++idx) {
	console.debug('... building ' + cssfiles[idx]);
	var outfile = 'lib' + path.sep + (cssfiles[idx]).replace('.css', ('-' + version + '.min.css'));
	var cmd = 'uglifycss src' + path.sep + cssfiles[idx] + ' > ' + outfile;
	exec(cmd, function(err, stdout, stderr) {
		console.log(`${stdout}`);
		if (err) {
			console.error(cmd, err);
			console.error('');
			console.error(`${stderr}`);
			return -1;
		}
	});
}

console.info('');
console.info('successfully built ' + projectName + ' v' + version);
console.info('');
