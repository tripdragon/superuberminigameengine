

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
					let yy = this.build(item);
					this.finished = true;
					return { data: yy, finished: true, kind: "objectsArray" }
				}
				this.finished = false;
				return { data: null, finished: false }
			},
			build: function(item) {
				let yy = [];
				for (var i = 0; i < this.count; i++) {

					// yy.push(item.action.build(item))
					yy.push(item.build(item))
					item.objects = yy; // hard assign of 3d objects for now
				}

				return yy;
			}
		})
	},

	noun : function(props){
		return new ConceptWord({
			// type:props.type, word:props.word, url:props.url,
			...props,
			// noun needs to other words to do anything, but delay build
			check: function(item) {
				return {
					data: null,
					finished: true
				}
			},
			build: function(item) {
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
					return { data: item, finished: true }
				}
				return { data: null, finished: false }
			},

			build: function(item) {
				console.log("cant put verb selector in here properly");
				if (item.objects) {
					for (var i = 0; i < item.objects.length; i++) {
						// spin(item.objects[i])
						this.modifier(item.objects[i]);
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
	if (selected.needs !== "") {
		if (queue.stock.length > 0) {
			
			let picked = null;
			
			for (var ii = queue.stock.length - 1; ii >= 0; ii--) {
				if (selected.needs === queue.stock[ii].type) {
					picked = queue.stock[ii];
					break;
				}
			}
			
			if (picked) {
				let yy = selected.check(picked);
				(yy.finished) && (yy.kind === "objectsArray") && yy.data.forEach( item => scene.push(item) );
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
		// console.log("¿^^?");
		// hiding the check here makes not knowing the stuff confusing
		// check internal is what does data building like instances
		// should be in here, its easy to NOT know wtf is going on otherwise
		let resultData = queue.items[ii].check(selected);
		
		
		// console.log(resultData);
		
		if (resultData.finished) {
			console.log("¿¿¿ FFF ????");
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
	startParse("20 birds spinning")
	
}, 1000)
