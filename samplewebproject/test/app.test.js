//first test is just making sure there is a text input in the html document
//render is an async function so need to use async await here
it('has a text input', async () => {
	//first need to call render, passing in the name of the file that we want to
	//be tested. Render will take the html document and load it up in
	//virtual DOM.  What is returned should be an object that represents all the
	//html that is inside of there, which can then be inpected/tested. render is
	//available globally, so no need to require render into this file
	const dom = await render('index.html');
});
