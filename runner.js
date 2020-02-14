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
	//add a method for running the tests in the test files once they've all
	//been collected into the testFiles array
	async runTests() {
		//define "it" globally
		//iterate through the testFiles array, and remember that 'file' is an
		//object with a name property that has a value of the absolute path of
		//the file
		for (let file of this.testFiles) {
			//to mimic Mocha fully, define a beforeEach function
			const beforeEaches = [];
			global.beforeEach = (fn) => {
				beforeEaches.push(fn);
			};
			//define "it" globally passing in the description for "it",
			//as defined in the forEach.test.js and the function associated
			//with "it"
			global.it = (desc, fn) => {
				console.log(desc);
			};
			//to execute each test file, require it.  Requiring in the file will
			//cause node to find the file, load up the code and execute the code
			//insdie of it.
			require(file.name);
		}
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
				//child files individually into the files array.  Also,
				//this doesn't quite work either: files.push(...childFiles);
				//because when the for loop starts iterating over what
				//is being added now, this line: const filepath = path.join(targetPath, file);
				//isn't going to yeild the correct path for these elements
				//so using map to add the childFiles with correct paths
				files.push(...childFiles.map((f) => path.join(file, f)));
			}
		}
	}
}
module.exports = Runner;
