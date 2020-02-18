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
//test that a success message shows up in the browser when user clicks submit,
//after entering a valid email (valid: has an @ symbol)
it('shows a success message with a valid email', async () => {
	//render the virtual dom environment again using index.html as the source
	const dom = await render('index.html');
	//get a reference to the input element
	const input = dom.window.document.querySelector('input');
	//create a fake input
	input.value = 'fake@gmail.com';
	//trigger a form submission event by selecting form element, and manually
	//dispatch an event of type = submit.  First select the form
	dom.window.document
		.querySelector('form')
		//dispathc event passing in new event object that thinks it's getting a submit event
		.dispatchEvent(new dom.window.Event('submit'));

	//select the h1 element, look at the inner html on it and verify the text in it
	const h1 = dom.window.document.querySelector('h1');
	assert.strictEqual(h1.innerHTML, 'Looks good!');
});

//test that a fail message shows up in the browser when user clicks submit,
//after entering an invalid email (valid: has an @ symbol)
it('shows a fail message with an invalid email', async () => {
	//render the virtual dom environment again using index.html as the source
	const dom = await render('index.html');
	//get a reference to the input element
	const input = dom.window.document.querySelector('input');
	//create a fake input
	input.value = 'fakegmail.com';
	//trigger a form submission event by selecting form element, and manually
	//dispatch an event of type = submit.  First select the form
	dom.window.document
		.querySelector('form')
		//dispathc event passing in new event object that thinks it's getting a submit event
		.dispatchEvent(new dom.window.Event('submit'));

	//select the h1 element, look at the inner html on it and verify the text in it
	const h1 = dom.window.document.querySelector('h1');
	assert.strictEqual(h1.innerHTML, 'Invalid email');
});
