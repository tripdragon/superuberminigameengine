const magicbox = document.getElementById("magicbox");
magicbox.addEventListener("send", (ev) => {
	console.log("have : ", ev.detail);
	const magicspeel = ev.detail;
	// if (magicspeel === "neat!") {
	//   clearGame()
	//   spin( addManyPlanes({span:20,width:2,height:2,count:100,colorHex:"random"}) )
	// }
	// else if(magicspeel !== ""){
	//   eval(magicspeel);
	// }

	clearGame()

	// startParse("10 birds flying around a dog");
	// debugger

	let aa = magicspeel.split(".");
	for (var i = 0; i < aa.length; i++) {
		startParse(aa[i]);
	}

	// startParse(magicspeel);
	// addPlane({colorHex:0x5c5cff})
});



// PASTED IN CODE HASTE WITH!!



// here we see that we CAN get a working nesting composition
// BUTTTTTT its very ridgid
// and holding references is fiddly
// around( fly(buildA(bird, 4, birds)), buildA(dog, 2, dogs) )


function buildArrayOfObjects(objectFunc, count = 0) {
	const yy = [];
	let _count = 0;
	if (count < -1) _count = 0;
	for (var i = 0; i < count; i++) {
		yy.push(objectFunc())
	};
	console.log("build array");
	return yy;
}


class ConceptWord {
	needs = ""; // change this to an array later
	count = 0;
	constructor({
		type = "",
		needs = "",
		count = 0,
		check,
		build,
		imageURL
	} = {}) {
		this.needs = needs;
		this.count = count;
		this.type = type;
		if (this.check) this.check = check;
		if (this.build) this.build = build;
		this.imageURL = imageURL;
	}
	check() {}
	build() {}
}


var urlNames = {
	cat: "./sprites/NFT_NFT_NFT_could_this_becat2.png",
	cats: "./sprites/NFT_NFT_NFT_could_this_becat2.png",
	birds: "./sprites/NFT_cash_oranges_bird.png",
	birds: "./sprites/NFT_cash_oranges_bird.png",
	dog: "./sprites/dog1.png",

}

// references the global funtions ecs's
var verbActions = {
	// flying : fly(item.objects[i])
	flying: function(item) {
		fly(item)
	},
	spinning: function(item) {
		spin(item)
	},
}


class MockPlane {
	isPlane = true;
	constructor(src) {
		if (urlNames["src"]) {
			console.log(urlNames["src"]);
		} else {
			console.log("??¿¿ no url");
		}
		console.log("built mock plane");
	}
}

function mockFlying(item) {
	item.flying = true;
	console.log("built mock flying");
}

function mockAdverb(item) {
	item.adverb = true;
	console.log("built mock adverb");
}


class CheapPool extends Array {
	add(item) {
		this.push(item);
	}
	remove(item) {
		const index = this.indexOf(item);
		if (index > -1) {
			this.splice(index, 1);
		}
	}
	getTopOfStack(){
		
	}
}

var mockFactories = {

	// builds an array of object its placed
	number: new ConceptWord({
		count: 10,
		needs: "noun",
		check: function(item) {
			// if(item.type === "noun"){
			if (item.type === this.needs) {
				let yy = this.build(item);
				return {
					data: yy,
					finished: true,
					kind: "objectsArray"
				}
			}
			return {
				data: null,
				finished: false
			}
		},
		build: function(item) {
			let yy = [];
			for (var i = 0; i < this.count; i++) {

				yy.push(item.action.build(item))
				item.objects = yy; // hard assign of 3d objects for now
			}

			return yy;
		}
	}),

	// builds a Plane()
	noun: new ConceptWord({
		check: function(item) {
			return {
				data: null,
				finished: true
			}
		},
		build: function(item) {
			// const yy = new MockPlane(url)
			// debugger
			const yy = addPlane({
				colorHex: 0x5c5cff
			})
			yy.setColorHex(0xffffff);
			if (item.url) {
				console.log("item.url", item.url);
				yy.loadImage(item.url)
			}
			return yy;
		}
	}),

	// adds properties to object
	verb: new ConceptWord({
		needs: "noun",
		type: "verb",
		check: function(item) {
			// if(item.type === "noun"){
			if (item.type === this.needs) {
				this.build(item)
				return {
					data: item,
					finished: true
				}
			}
			return {
				data: null,
				finished: false
			}
		},
		// 

		build: function(item) {
			console.log("cant put verb selector in here properly");
			// mockFlying(item)
			// debugger
			if (item.objects) {
				for (var i = 0; i < item.objects.length; i++) {
					// spin(item.objects[i])
					if (this.verbActionName && verbActions[this.verbActionName]) {
						verbActions[this.verbActionName](item.objects[i])
					}

					// fly(item.objects[i])
				}
			}
			console.log("this wont work right now cause its a complex object");
			// spin(item)
		}
	}),

	// adds properties to object
	adverb: new ConceptWord({
		needs: "verb",
		check: function(item) {
			// if(item.type === "verb"){
			if (item.type === this.needs) {
				this.build(item)
				return {
					data: item,
					finished: true
				}
			}
			return {
				data: null,
				finished: false
			}
		},
		build: function(item) {
			mockAdverb(item)
		}
	}),



}

var mockDictionary = {
	// word has primitive type
	"number": {
		"type": "determiner"
	},
	"bird": {
		"type": "noun",
		url: "./sprites/NFT_NFT_NFT_could_this_becat2.png"
	},
	"birds": {
		"type": "noun",
		url: "./sprites/NFT_NFT_NFT_could_this_becat2.png"
	},
	"cat": {
		"type": "noun",
		url: "./sprites/NFT_NFT_NFT_could_this_becat2.png"
	},
	"cats": {
		"type": "noun",
		url: "./sprites/NFT_NFT_NFT_could_this_becat2.png"
	},
	"flying": {
		"type": "verb"
	},
	"spinning": {
		"type": "verb"
	},
	"around": {
		"type": "adverb"
	},
	"dog": {
		"type": "noun"
	},
	"dogs": {
		"type": "noun"
	}
}

function isNumber(strWord) {
	if (isNaN(strWord)) return false;
	return true;
}


class DataBlock {
	// [ {type:"noun", word:"bird", action: tableItem } ]
	finished = false;
	constructor({
		type,
		word,
		action,
		url
	}) {
		this.type = type;
		this.word = word;
		this.action = action;
		this.url = url;
	}
}

function buildClassActionsJoinList(phrase) {
	// returns array
	// [ DataBlock(), DataBlock() ]

	// tableItem here is a matching name of the type which does stuff
	// skips any word not in list, BUT might shoudl not

	var wordsA = phrase.split(" ");
	// use findClassificationIndex here later

	let yy = [];
	for (var i = 0; i < wordsA.length; i++) {
		const word = wordsA[i];
		// number is special since its unsigned infinite
		if (isNumber(word)) {
			yy.push(new DataBlock({
				type: "number",
				word: word,
				action: mockFactories["number"]
			}))
		} else if (mockDictionary[word] && mockFactories[mockDictionary[word].type]) {
			// >>>>>
			let url = urlNames[word];
			yy.push(new DataBlock({
				type: mockDictionary[word].type,
				word: word,
				action: mockFactories[mockDictionary[word].type],
				url: url
			}))
		}
	}
	return yy;
}


// 
// :o Start

// ideally we should beable to produce an EDL
// from the phrase and run that against a functions list
// both for asset testing and easy to compose complexities
//  but that makes it strict and fiddly
function startParse(phrase) {

	let scene = [];
	let pool = new CheapPool();

  // at this point we should be merging the dictionary selected list to the
  // functions action list
  // Since actions are very unique in their own right per word
  // solving this looks to require a dynamic look up
	// BUT we dont yet know modifier values for numbers and such
  
	let dataArray = buildClassActionsJoinList(phrase)
	let queueA = new Queue();
	
	// this is a crappy patch
	for (let i = 0; i < dataArray.length; i++) {
		if (dataArray[i].type === "number") {
			dataArray[i].action.count = +dataArray[i].word;
		}
		if (dataArray[i].type === "verb") {
			// debugger
			dataArray[i].action.verbActionName = dataArray[i].word;
		}
	}
	// verbActions
	// fly(item.objects[i])


	const index = 0;
	const lim = dataArray.length;

	recursiveFn({ lim: lim, index: index, dataArray: dataArray, queue: queueA, scene: scene, pool: pool });
}

// :x


function handle3DObjects(scene, resultData) {
	// this is for adding object to the scene
	
	if (resultData.kind === "objectsArray") {
		for (var ii = 0; ii < resultData.data.length; ii++) {
			const pickedObject = resultData.data[ii];
			scene.push(pickedObject)
			pickedObject.randomPosition(-20, 20)
			pickedObject.position.z = 0;
		}
	}
	
}


// @selected : T dataArray[i]
// @queue : T queue???
// just churns on the data and works with the queues
function currentWordTest_CM(selected, queue) {
	if (selected.action.needs !== "") {
		if (queue.stock.length > 0) {
			
			let picked = null;
			
			for (var ii = queue.stock.length - 1; ii >= 0; ii--) {
				if (selected.action.needs === queue.stock[ii].type) {
					picked = queue.stock[ii];
					break;
				}
			}
			
			if (picked) {
				let yy = selected.action.check(picked);
				if (yy.finished) {
					selected.finished = true;
					if (yy.kind === "objectsArray") {
						for (var rr = 0; rr < yy.data.length; rr++) {
							scene.push(yy.data[rr])
						}
					}
				}
			}

		}
		
		if (selected.finished == false) {
			queue.addItem(selected);
		}
		
	}
}


// words
function recursiveFn({ lim, index, dataArray, queue, scene, pool }) {
	console.log("aaa", index);
	if (index === lim) {
		console.log("out 111");
		return;
	}


	let selected = dataArray[index];

	// we need to have control of the order and specials data
	// shelving it away in queue with pointer logic is annoying

	// checking each previous word
	// loop backwards for "previous in"
	// since its looping, doing a getTop() wont work since we might skip it
	// if its finished its tossed
	for (var ii = queue.items.length - 1; ii >= 0; ii--) {
		
		// hiding the check here makes not knowing the stuff confusing
		// check internal is what does data building like instances
		// should be in here, its easy to NOT know wtf is going on otherwise
		let resultData = queue.items[ii].action.check(selected);
		
		if (resultData.finished) {
			queue.items.splice(ii, 1);
			handle3DObjects(scene,resultData);
		}

	}


	// current word test
	currentWordTest_CM(selected, queue)

	// singular noun self builds
	// cant figure out
	// else if (selected.action.needs === "" && selected.type === "noun") {
	// 
	// }


	// Missing dog!!!!

	// add no matter what
	queue.addStock(selected);

	console.log(dataArray[index].type);

	// recurrrrrsion
	index++;
	recursiveFn({ lim: lim, index: index, dataArray: dataArray, queue: queue, scene: scene, pool: pool });
	console.log("bbbb", index);
}



class Queue {
	items = new CheapPool();
	stock = new CheapPool();

	// nextItem(){
	//   if (this.items.length > 0) {
	//     let pick = this.items[this.items.length-1];
	//     return pick;
	//     // let mm = this.items[i].action.check(dataItem);
	//   }
	// }
	// 
	// nextStock(){
	//   if (this.stock.length > 0) {
	//     let pick = this.stock[this.stock.length-1];
	//     return pick;
	//     // let mm = this.items[i].action.check(dataItem);
	//   }
	// }


	addItem(item) {
		this.items.add(item);
	}
	removeItem(item) {
		this.items.remove(item);
	}

	addStock(item) {
		this.stock.add(item);
	}
	removeStock(item) {
		this.stock.remove(item);
	}

	// NOT sure about this...
	// flush(){
	//   for (var i = this.items.length-1; i >= 0; i--) {
	//     if(this.items[i].finished === true){
	//       this.items[i].finished = true;
	//       console.log(this.items[i]);
	//       this.items.splice(i,1);
	//     }
	//   }
	// }

}





setTimeout(function (x) {
	console.log("¿??¿¿? tacos");
	console.log("debugging automated ");
	
	clearGame()
	startParse("10 cats flying")
	
}, 1000)
