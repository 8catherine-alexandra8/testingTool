//require in assert for easier testing syntax
const assert = require('assert');
//first test is just making sure there is a text input in the html document
//render is an async function so need to use async await here
it('has a text input', async () => {
	//first need to call render, passing in the name of the file that we want to
	//be tested. Render will take the html document and load it up in
	//virtual DOM.  What is returned should be an object that represents all the
	//html that is inside of there, which can then be inpected/tested. render is
	//available globally, so no need to require render into this file
	const dom = await render('index.html');
	//using syntax from jsdom documentation, accessing just the input field, from
	//with the dom object
	const input = dom.window.document.querySelector('input');
	//use assert syntax to see if input exists.  Assert will automatically
	//throw an error if the value of input is falsy
	assert(input);
});
