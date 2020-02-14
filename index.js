#!/usr/bin/env node
//Above is initial setup to be able to run this program
//from the command line
//Below: requiring in Runner class from runner.js
const Runner = require('./runner');
//create new instance of the runner
const runner = new Runner();
//define a helper function to allow me to run collectFiles
//from here, for testing as I build, because my node.js doesn't
//support top-level await expressions.  Await statements must be
//contained within a function
const run = async () => {
	//pass in process.cwd() so that collectFiles examines the directory
	//from which tme is being run
	const results = await runner.collectFiles(process.cwd());
	console.log(results);
};
run();
