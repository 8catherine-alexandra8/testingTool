//require in the path module so that I can join two paths together
const path = require('path');
const jsdom = require('jsdom');
//pull off the constructor function from jsdom
const { JSDOM } = jsdom;
//make function called render that takes the filename of the file I want
//to open up. fromFile returns a promise so marking render as async to handle
//the promise
const render = async (filename) => {
	//take the file name and turn it into the full path
	const filePath = path.join(process.cwd(), filename);
	//use fromFile function, per documentation from npmjs jsdom documentation,
	//passing in filePath as the first argument.  passing in an object as the
	//second argument and it has a couple of options
	const dom = await JSDOM.fromFile(filePath, {
		//dangerously is ok because I'm only ever going to run a js files
		//that I wrote.  It would be potentially dangerously to send a js file,
		//authored by someone else, through node, as node is connected
		//to all the files and folders on the entire computer. If a maliscious
		//js file was run through this program it could have devastating
		//consequences to the OS-(more details on that in the documentation)
		runScripts : 'dangerously',
		resources  : 'usable'
	});
	//add code to get JSDOM to wait for index.js to load before running tests
	//wrapping it inside of a promise that won't resolve until this event is
	//triggered
	return new Promise((resolve, reject) => {
		dom.window.document.addEventListener('DOMContentLoaded', () => {
			//call resolve once DOM content has fully loaded, passing in the dom
			resolve(dom);
		});
	});
	//no longer need to return dom here as the promise above is now
	//returning the dom
	//return dom;
};
//exporting but not calling the render function
module.exports = render;
