//require in fs module from node standard library
const fs = require('fs');
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
		return files;
	}
}
module.exports = Runner;
