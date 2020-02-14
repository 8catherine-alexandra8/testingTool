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
		this.testFiles = [];
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
			//determine if stats object is a file or a directory and
			//whether or not a file has a .test extension
			if (stats.isFile() && file.includes('.test.js')) {
				//if the filepath is a file and it ends in .test.js,
				//then save to this.testFiles array. Also, instead of just
				//throwing the file name into the array, wrap it inside
				//an object because that will be more useful
				this.testFiles.push({ name: filepath });
			} else if (stats.isDirectory()) {
				//if stats object is a directory, then create an array
				//containing the contents of the folder
				const childFiles = await fs.promises.readdir(filepath);
				//push childFiles into the "files" array that this for of
				//loop is currently itterating over but this:
				//files.push(childFiles); won't work because I'd end up with
				//an childFiles array nested inside of the files array
				//so using spread operator which will add each element of
				//child files individually into the files array
				files.push(...childFiles);
			}
		}
	}
}
module.exports = Runner;
