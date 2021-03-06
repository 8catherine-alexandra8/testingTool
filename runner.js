//require in fs module from node standard library
const fs = require('fs');
//require in path module from NSL
const path = require('path');
//require in chalk to make the test responses color coded
const chalk = require('chalk');
//require in render to be able to test web based projects
const render = require('./render');
//to make this test framework work on projects that rely on external dependencies
//that may contain their own test files in their directories, set
//up an array for directories that should be excluded from our search for test
//files
const forbiddenDirs = [ 'node_modules' ];

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
			//console log to indicate that some tests are about to run for
			//whichever file I'm iterating over
			console.log(chalk.white(`testing file: ${file.shortName}`));
			//to mimic Mocha fully, define a beforeEach function
			const beforeEaches = [];
			//make render available to anyone using testing framework
			global.render = render;
			global.beforeEach = (fn) => {
				beforeEaches.push(fn);
			};
			//define "it" globally passing in the description for "it",
			//as defined in the forEach.test.js and the function associated
			//with "it".  Making this async now so that it can work with the
			//render function propertly
			global.it = async (desc, fn) => {
				beforeEaches.forEach((func) => func());
				//adding try/catch for error handling
				try {
					await fn();
					//add reporting so that if a test passes and the program
					//moves on to the next test, the tester is told as much.
					//If the test throws an error, this console.log will
					//be skipped and the program will go straight to the catch
					//statement. Added tab \t to indent console log
					console.log(chalk.green(`\tOK - ${desc}`));
				} catch (err) {
					//formatting error message so that, if it spans multiple lines,
					//each new line character (\n) will be repalced with the same
					//new line character, plus two tabs
					const message = err.message.replace(/\n/g, '\n\t\t');
					//add console log for feedback to the test re: error and on
					//which test. Added tab \t to indent console log
					console.log(chalk.red(`\tX - ${desc}`));
					//rather than printing out the whole error, just print the
					//message without all the extraneous info that shows up in the
					//console when there is an error. Also passing in '\t' as the
					//first argument as this will indent the error message
					console.log(chalk.red('\t', message));
				}
			};
			//to execute each test file, require it.  Requiring in the file will
			//cause node to find the file, load up the code and execute the code
			//insdie of it.  Wrap require statement in try/catch to deal with
			//any extraneous gibberish that might be inside the test file by mistake
			try {
				require(file.name);
			} catch (err) {
				//console log what the typo was
				console.log(chalk.red(err.message));
			}
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
				//an object because that will be more useful.  filepath yeilds
				//the whole absolute file path. so passing in a reference to
				//the relative path also, so that can be accessed later
				this.testFiles.push({ name: filepath, shortName: file });
				//adding in condition for excluding certain directories before
				//proceeding with what to do if isDirecory
			} else if (
				stats.isDirectory() &&
				!forbiddenDirs.includes(file)
			) {
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
