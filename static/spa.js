// *** GLOBAL VARIABLES ***
const body = document.body;
const addLinkButton = body.querySelector(".addPicture");
let inputBox = body.querySelector("#newPicUrl");
let inputURL;
let cardsArray = Array.from(body.querySelectorAll(".card"));
let imageArray = Array.from(body.querySelectorAll(".imgClass")); // array of images
let addImageButton = document.querySelector(".buttonAddImage");
let addImageForm = document.querySelector(".newPicture");


// *** HELPER FUNCTIONS ***

// swap position of two DOM elements, used to move elements to left/right
function swap(nodeA, nodeB) {
	const parentA = nodeA.parentNode;
	const siblingA = nodeA.nextSibling === nodeB ? nodeA : nodeA.nextSibling;

	// Move `nodeA` to before the `nodeB`
	nodeB.parentNode.insertBefore(nodeA, nodeB);

	// Move `nodeB` to before the sibling of `nodeA`
	parentA.insertBefore(nodeB, siblingA);
};


// sanitize user input, prevent XSS
function encodeHTML(url) {
	return url.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
}


// event delegation
function addGlobalDelegatedEventListener(type, selector, callback) {
	document.addEventListener(type, event => {
		let element = event.target;

		while (element) {
			if (element.matches(selector)) {
				callback(event);
				break;
			}
			element = element.parentElement;
		}
	})
}


// reset all cards to display mode
function resetToDisplayMode() {
	let allCards = Array.from(body.querySelectorAll(".card"));
	
	// for each card, remove the class that makes it edit mode
	for (cardIndex in allCards) {
		let card = allCards[cardIndex];

		let image = card.querySelector(".imgClass");
		let buttonDiv = card.querySelector(".divAllButtons");

		// classList.remove() will do nothing if the class doesnt exist
		image.classList.remove('imgInEdit')
		buttonDiv.classList.remove('buttonInEdit')
	}
}



// *** Non-Delegation Event Listeners, since there will only be 1 addImageButton and 1 addLinkButton ***

// toggle newPicture form display
addImageButton.addEventListener("click", (event) => {
	event.preventDefault();
	addImageForm.classList.toggle("displayNone");
})


// add photo to board
addLinkButton.addEventListener("click", (event) => { // alternatively, select all buttons, change type to button
	event.preventDefault(); // event doesnt end right after click
	
	let isUrlEmpty = !inputURL;
	inputURL = body.querySelector("#newPicUrl").value; // the url that user enters
	
	// if url box is not empty, take url and add card, else do nothing
	if (!isUrlEmpty) {
		inputURL = encodeHTML(inputURL); // sanitize
		
		let cardToAdd = `
		<div class="card size5 ">
			<img class="imgClass" src="${inputURL}">
			<div class="divAllButtons">
				<button class="leftBtn"> left </button>
				<button class="rightBtn"> right </button>
				<button class="expandBtn"> + </button>
				<button class="shrinkBtn"> - </button>
				<button class="deleteBtn"> Delete </button>
			</div>
		</div>`
		
		
		// find last card,
		let lastCard = cardsArray[cardsArray.length - 1];
		
		// new card inserted after last card
		lastCard.insertAdjacentHTML("afterend", cardToAdd);
	}
})




// *** GLOBAL (event delegation) EVENT LISTENERS ***

//  toggle between edit mode and display mode
addGlobalDelegatedEventListener("click", ".card", event => {
	// div with .card that is parent of img and buttons 
	let cardDiv = event.target.closest('div');

	let image = cardDiv.querySelector("img");
	let buttonDiv = cardDiv.querySelector(".divAllButtons");
	let isImageInEdit = image.classList.contains("imgInEdit");

	// make all photos display mode, aka no buttons
	resetToDisplayMode();

	// if image not in edit mode, put it in edit mode
	if (!isImageInEdit) {
		image.classList.toggle("imgInEdit");
		buttonDiv.classList.toggle("buttonInEdit");
	}
})


// cancel button on addImage form closes the image form
addGlobalDelegatedEventListener("click", ".closeForm", event => {
	event.preventDefault();
	addImageForm.classList.toggle("displayNone");
})


// when user clicks on delete button, removes the ancestor card of the button
addGlobalDelegatedEventListener("click", ".deleteBtn", event => {
	// cardDiv, ancestor of the delete button that was clicked
	let cardDiv = event.target.parentElement.parentElement;

	cardDiv.remove();
})


// user clicks left button
addGlobalDelegatedEventListener("click", ".leftBtn", event => {
	// cardDiv, ancestor of the delete button that was clicked
	let cardDiv = event.target.parentElement.parentElement;

	// previous element sibling
	let prevElementSib = cardDiv.previousElementSibling;

	// leftmost card will have previous element sibling of FORM
	let isLeftmostCard = prevElementSib.tagName == 'FORM';

	// if card is not leftmost card, move the card left
	if (!isLeftmostCard) {
		let elementToLeft = cardDiv.previousElementSibling;
		swap(elementToLeft, cardDiv);
	}
})


// user clicks right button
addGlobalDelegatedEventListener("click", ".rightBtn", event => {
	// cardDiv, ancestor of the delete button that was clicked
	let cardDiv = event.target.parentElement.parentElement;

	let isRightmostCard = cardDiv.nextElementSibling == null;

	// element to right of event.target
	let elementToRight = cardDiv.nextElementSibling;

	if (!isRightmostCard) {
		swap(cardDiv, elementToRight);
	}
})


// user clicks on + button
addGlobalDelegatedEventListener("click", ".expandBtn", event => {
	// card that user clicked on
	let cardDiv = event.target.parentElement.parentElement;

	// array of all classNames
	let classNameArr = cardDiv.className.split(' '); // string
	
	let curSize;
	let curSizeInt;
	let newSize;

	// go through all classes, get the one that determines size
	for (let className in classNameArr) {
		let curClass = classNameArr[className];

		if (curClass.includes('size')) {
			curSizeInt = parseInt(curClass.slice("-1"));
			curSize = 'size' + curSizeInt;
		}
	}

	// check if current size is largest allowed size
	if (curSizeInt < 9 && curSizeInt > 0) {
		newSize = curSizeInt++;
	} else {
		// cannot increase size past size9
		return;
	}

	newSize = 'size' + curSizeInt;
	cardDiv.classList.remove(curSize); // remove old size class
	cardDiv.classList.add(newSize); // add new size class
})


// user clicks on - button
addGlobalDelegatedEventListener("click", ".shrinkBtn", event => {
	// card that user clicked on
	let cardDiv = event.target.parentElement.parentElement;

	let classNameArr = cardDiv.className.split(' '); // string
	let curSize;
	let curSizeInt;
	let newSize;

	// change this logic
	for (let className in classNameArr) {
		let curClass = classNameArr[className];

		if (curClass.includes('size')) {
			curSizeInt = parseInt(curClass.slice("-1"));
			curSize = 'size' + curSizeInt;
		}
	}

	if (curSizeInt < 9 && curSizeInt > 1)  {
		newSize = curSizeInt--;
	} else {
		// cannot decrease size past size1
		return;
	}

	newSize = 'size' + curSizeInt

	cardDiv.classList.remove(curSize); // remove old class
	cardDiv.classList.add(newSize); // add new class
})
