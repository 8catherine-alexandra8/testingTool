//require in fs module from node standard library
const fs = require('fs');
//require in path module from NSL
const path = require('path');
//create class to contain all the functions in this file
//and export it via module.exports
class Runner {
	//initialize an object for storing references to each test file that
	//needs to be executed
	constructor() {
		//define a place to store the test file references
		this.file = [];
	}
	//define a function for collecting the test files which will run
	//asynchronously, with an argument of target path which will
	//reference the folder or absolute path to the folder that we
	//want this function to investigate/collect from
	async collectFiles(targetPath) {
		//use promise based readir function from NSL to deliver
		//first array of targetPath's contents
		const files = await fs.promises.readdir(targetPath);
		//Iterate over the array created above and determine if each
		//element is a file or a folder
		for (let file of files) {
			//convert the 'file' into the full absolute name of the file
			//by joining targetPath with the file name, using the path
			//module from the NSL
			const filepath = path.join(targetPath, file);
			//run the lstat command on the filepath so that I can apply
			//the stats methods of isFile or isDirectory to the stats
			//object
			const stats = await fs.promises.lstat(filepath);
		}
	}
}
module.exports = Runner;
