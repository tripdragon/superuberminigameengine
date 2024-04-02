// this works, but we went for a whole new formula so moving 
// over to try4 !!

// Data is broken up as tables for 
// Word Dictionares, image urls, and modifier functions
// Word, url, verb, etc...
// Since we would like to keep data seperate and themeable
// we merge what we need later on


// this would be populated from external database
// word has primitive type
var dictionary = {
	"number": { "type": "determiner" },
	"bird": { "type": "noun"},
	"birds": { "type": "noun"},
	"cat": { "type": "noun"},
	"cats": { "type": "noun"},
	"flying": { "type": "verb" },
	"spinning": { "type": "verb" },
	"around": { "type": "adverb" },
	"dog": { "type": "noun" },
	"dogs": { "type": "noun" }
}


// lookup table for textures urls
var urlTable = {
	cat: "./sprites/NFT_NFT_NFT_could_this_becat2.png",
	cats: "./sprites/NFT_NFT_NFT_could_this_becat2.png",
	birds: "./sprites/NFT_cash_oranges_bird.png",
	birds: "./sprites/NFT_cash_oranges_bird.png",
	dog: "./sprites/dog1.png",
	dogs: "./sprites/dog1.png",
}


// references the global funtions ecs's
var verbTables = {
	flying: function(item) {
		fly(item)
	},
	spinning: function(item) {
		spin(item)
	},
}



function isNumber(strWord) {
	if (isNaN(strWord)) return false;
	return true;
}


function mockAdverb(item){
	item.adverb = "adverb neat!";
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


// here we see that we CAN get a working nesting composition
// BUTTTTTT its very ridgid
// and holding references is fiddly
// around( fly(buildA(bird, 4, birds)), buildA(dog, 2, dogs) )


// function buildArrayOfObjects(objectFunc, count = 0) {
// 	const yy = [];
// 	count = Math.max(0, count); // no negative counts
// 	for (var i = 0; i < count; i++) {
// 		yy.push(objectFunc())
// 	};
// 	console.log("build array");
// 	return yy;
// }


class ConceptWord {
	needs = ""; // change this to an array later, also maybe rename to accepts
	finished = false;
	data = null;
	dataKind = "";
	constructor({ word = "", type = "", needs = "", count = 0, check, build, url = "" } = {}) {
		// debugger
		this.needs = needs;
		this.count = count;
		if(type === "number" && isNumber(word)) this.count = +word;
		this.type = type;
		this.word = word;
		if (this.check) this.check = check;
		if (this.build) this.build = build;
		this.url = url;
		
		if(type === "verb" && verbTables[word]){
			this.modifier = verbTables[word];
		}
	}
	check() {}
	build() {}
	modifier(){}
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
	getTopOfStack(){}
}


const factories = {
	// Builds the data and functions for the types of words
	// each is returning a new instance so as to allow unique values
	// instead of buggy references
	
	number : function(props) {
		return new ConceptWord({
			// type:props.type, word:props.word,
			...props,
			count: 10,
			needs: "noun",
			check: function(item) {
				if (item.type === this.needs) {
					// let yy = this.build(item);
					this.data = this.build(item);
					this.finished = true;
					this.dataKind = "objectsArray";
					// return { data: yy, finished: true, kind: "objectsArray" }
					return this;
				}
				this.finished = false;
				this.data = null;
				return this;
				// return { data: null, finished: false }
			},
			build: function(item) {
				let yy = [];
				// we reuse the original first
				if(item.type === "noun" && Array.isArray(item.data) ){
					yy.push(item.data[0]);
					// then sub 1 from the count
					for (var i = 1; i < this.count; i++) {
						// yy.push(item.action.build(item))
						// yy.push(item.build(item))
						yy.push(item.build())
						// item.objects = yy; // hard assign of 3d objects for now
					}
					// mutates the thing????
					// hmmmm
					item.data = yy;
					return item.data;
				}
				return [];
			}
		})
	},

	noun : function(props){
		return new ConceptWord({
			// type:props.type, word:props.word, url:props.url,
			...props,
			// noun needs to other words to do anything, but delay build
			check: function() {
				this.finished = true;
				this.data = [this.build()]; // force an array, so number can pick from it
				return this;
			},
			build: function() {
				const yy = addPlane({
					colorHex: 0x5c5cff
				})
				yy.setColorHex(0xffffff);
				if (this.url) {
					console.log("this.url", this.url);
					yy.loadImage(this.url)
				}
				return yy;
			}
		})
	},


	verb : function(props) {
		return new ConceptWord({
			type:props.type, word:props.word,
			needs: "noun",
			type: "verb",
			check: function(item) {
				// like : item.type === "noun"
				if (item.type === this.needs) {
					this.build(item)
					this.data = item;
					this.finished = true;
					return this;
				}
				this.data = null;
				this.finished = false;
				return this;
			},

			build: function(item) {
				console.log("cant put verb selector in here properly");
				// if (item.objects) {
				if (item.dataKind = "objectsArray" && Array.isArray(item.data) ) {
					for (var i = 0; i < item.data.length; i++) {
						// spin(item.objects[i])
						this.modifier(item.data[i]);
					}
				}
			}
		})
	},


	adverb : function (props) {
		return new ConceptWord({
			type:props.type, word:props.word,
			needs: "verb",
			check: function(item) {
				if (item.type === this.needs) {
					this.build(item)
					this.data = item;
					this.finished = true;
					// return { data: item, finished: true }
					return this;
				}
				this.data = null;
				this.finished = false;
				return this;
				// return {
				// 	data: null,
				// 	finished: false
				// }
			},
			
			build: function(item) {
				mockAdverb(item)
			}
			
		})
	}
}



function buildClassActionsJoinList(phrase) {
	// returns array
	// [ DataBlock(), DataBlock() ]

	// tableItem here is a matching name of the type which does stuff
	// skips any word not in list, BUT might should not

	var wordsA = phrase.split(" ");
	// use findClassificationIndex here later

	let yy = [];
	for (var i = 0; i < wordsA.length; i++) {
		const word = wordsA[i];
		// number is special since its unsigned infinite as negative would be pointless
		if (isNumber(word)) {
			yy.push( factories["number"]({type:"number", word:word}) );
		} 
		else if (dictionary[word] && factories[dictionary[word].type]) {
			// >>> 23848
			// debugger
			yy.push( factories[dictionary[word].type]({type:dictionary[word].type, word:word, url:urlTable[word]}) );
		}
	}
	
	return yy;
}





// 
// 
// Recursion Logics
// 
// 



// 
// :o Start

function startParse(phrase) {
	// ideally we should be able to produce an EDL
	// from the phrase and run that against a functions list
	// both for asset testing and easy to compose complexities
	// but that makes it strict and fiddly


	const dataArray = buildClassActionsJoinList(phrase);
  // at this point we should be merging the dictionary selected list to the
  // functions action list
  // Since actions are very unique in their own right per word
  // solving this looks to require a dynamic look up
	// BUT we dont yet know modifier values for numbers and such
  
	let scene = [];

	recursiveFn({ lim: dataArray.length, 
		index: 0, 
		dataArray: dataArray, 
		queue: new Queue(), 
		scene: scene, 
		pool: new CheapPool() 
	});
}

// :x


function handle3DObjects(scene, resultData) {
	// this is for adding object to the scene
	// well global addPlane() auto does that right already
	// so instead we just futz with position for now
	
	if (resultData.dataKind === "objectsArray") {
		for (var ii = 0; ii < resultData.data.length; ii++) {
			const pickedObject = resultData.data[ii];
			scene.push(pickedObject)
			pickedObject.randomPosition(-20, 20)
			pickedObject.position.z = 0;
		}
	}
	
}


function hasNeed(aa,bb) {
	// checks if the grammar types appease each other
	// aa needs to know, bb is telling
		
	if (aa === "determiner" && bb === "noun" ||
			aa === "verb" && bb === "noun" ||
			// aa === "adjective" && bb === "verb" ) {
			aa === "adverb" && bb === "verb" ) {
		return true;
	}

	return false;

}

// @selected : T dataArray[i]
// @queue : T queue???
// just churns on the data and works with the queues
function currentWordTest_CM(selected, queue, scene) {
	// nouns dont need anything, so we just build them first
	// which gives a single .data array [object]
	if(selected.type === "noun"){
		let yy = selected.check(); // this just builds here, so .check is the wrong name, process maybe
		(yy.finished) && (yy.dataKind === "objectsArray") && yy.data.forEach( item => scene.push(item) );
		if (yy.finished == false) {
			queue.addItem(selected);
		}
	}
	else if (selected.needs !== "") {
		if (queue.stock.length > 0) {
			
			let picked = null;
			
			for (var ii = queue.stock.length - 1; ii >= 0; ii--) {
				if (selected.needs === queue.stock[ii].type) {
					picked = queue.stock[ii];
					break;
				}
			}
			// >>>
			// this is running the previous animal again when the next number happens
			//  so its adding an object to the scene
			//  then the new noun instances as 1 without the number
			if (picked) {
				let yy = selected.check(picked);
				(yy.finished) && (yy.dataKind === "objectsArray") && yy.data.forEach( item => scene.push(item) );
			}

		}
		
		if (selected.finished == false) {
			queue.addItem(selected);
		}
		
	}
}


// number is from queue.items[ii];
function numberToNoun(number, noun) {
	debugger
	if( hasNeed(number.type, noun.type) ){
		debugger
		if(number.type === "number"){
			
				number.data = this.build(item);
				number.finished = true;
				number.dataKind = "objectsArray";
			
				let yy = [];
				// we reuse the original first
				debugger
				if(Array.isArray(noun.data) && noun.data.length > 0 ){
					debugger
					yy.push(item.data[0]);
					// then sub length from the count
					let len = len = pick.count - 1;
					// let len = len = pick.count - item.data.length;

					for (var i = 0; i < len; i++) {
						yy.push(noun.build())
					}
					// mutates the thing????
					// hmmmm
					noun.data = yy;
					
				}
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
	

	currentWordTest_CM(selected, queue, scene)

	
	for (var ii = queue.items.length - 1; ii >= 0; ii--) {
		// console.log("¿^^?");
		// hiding the check here makes not knowing the stuff confusing
		// check internal is what does data building like instances
		// should be in here, its easy to NOT know wtf is going on otherwise
		
		
		// trying a functional flow
		const pickItem = queue.items[ii];
		numberToNoun(selected, pickItem)

		if (pickItem.finished) {
			console.log("¿¿¿ FFF ????");
			// this mutates the array and removes the item at the index
			queue.items.splice(ii, 1);
			handle3DObjects(scene,pickItem);
		}
		
		
		
		// let resultData = queue.items[ii].check(selected);
		// 
		// if (resultData.finished) {
		// 	console.log("¿¿¿ FFF ????");
		// 	queue.items.splice(ii, 1);
		// 	handle3DObjects(scene,resultData);
		// }
	
	}


	// current word test
	// currentWordTest_CM(selected, queue, scene)

	// singular noun self builds
	// cant figure out
	// else if (selected.action.needs === "" && selected.type === "noun") {
	// 
	// }


	// add no matter what
	queue.addStock(selected);

	console.log(dataArray[index].type);

	// recurrrrrsion
	index++;
	recursiveFn({ lim: lim, index: index, dataArray: dataArray, queue: queue, scene: scene, pool: pool });
	console.log("bbbb", index);
}


// 
// 
// Setup
// 
// 
// 


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

	let aa = magicspeel.split(".");
	for (var i = 0; i < aa.length; i++) {
		startParse(aa[i]);
	}

	// startParse(magicspeel);
	// addPlane({colorHex:0x5c5cff})
});



setTimeout(function (x) {
	console.log("¿??¿¿? tacos");
	console.log("debugging automated ");
	
	clearGame()
	// startParse("10 cats flying")
	// startParse("20 birds spinning")
	startParse("3 birds spinning 2 dogs spinning")
	magicbox.value = "3 birds spinning 2 dogs spinning";
	
}, 1000)
