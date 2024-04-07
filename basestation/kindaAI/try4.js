
// see try3 for notes more so

// this version is a rewrite for a new stepwise formula
// ditching the recurssion phun
// in prusuit of an instructions list builder instead
// which was the original goal anyways


var dictionary = {
	// "number": { "type": "determiner" },
	"number": { "type": "number" },
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

var needsTable = {
	number : ["noun"],
	noun : [""],
	verb : ["noun"],
	adverb : ["verb", "noun"]
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
	hasItem(item){
		return this.includes(item);
	}
  
	getTopOfStack(){}
}



class WordComplex{
  finished = false;
  needsIndex = 0;
  _needs = [];
	// assigned = [];
	modified = {};
	instanceObjects = new CheapPool(); // 3d model or whatever
	alreadyMultiplied = false; // if a number is used to change count
  constructor({word,type,selfInstance,needs}){
    this.word = word;
    this.type = type;
    this.selfInstance = selfInstance;
    this._needs = needs;
  }
  get needs() {
    // here we rely on the index stepping and returning undefined when over
    return this._needs[this.needsIndex]
  }
  incrNeedsIndex(){
    // here we auto step up and auto finish logicly when needs are complete
    this.needsIndex++;
    if (this.needsIndex === this._needs.length) {
      this.finished = true;
    }
  }
	
	// GLUGHhh
	traverseModified( callback ) {
		callback( this );
		for (const prop in this.modified){ 
			this.modified[prop].traverseModified( callback );
		}		
	}
	// addAssigned(item){
	// 	if(this.assigned.indexOf(item) === -1){
	// 		this.assigned.push(item);
	// 	}
	// }
	// hasAssigned(item){
	// 	(this.assigned.indexOf(item) > -1) && return true;
	// 	return false;
	// }
}






function buildClassActionsJoinList(phrase) {
	// returns array
	// [ WordComplex() ]

	// tableItem here is a matching name of the type which does stuff
	// skips any word not in list, BUT might should not

	var wordsA = phrase.split(" ");
	// use findClassificationIndex here later

	let yy = [];
	for (var i = 0; i < wordsA.length; i++) {
		const word = wordsA[i];
		// number is special since its unsigned infinite as negative would be pointless
		
		// try {
			let _word = word;
			if (isNumber(word)) _word = "number";
			
			if(dictionary[_word]){	
				let type = dictionary[_word].type;
				let typenumber = isNumber(word) ? "number" : type;

				yy.push( new WordComplex(  { word:word, type: type, selfInstance:type === "noun", needs:needsTable[typenumber].slice() }) )
			}

		// } catch (e) {
		// 	debugger
		// }
		
		// if(word === "around"){
		// 	debugger
		// }
		
	}
	

	return yy;
}



// 
// ++++++++++++ PASTA
// 


// ok try 9001
// test current against stack backwards newst in
// test all que against current forwards oldest in
// if que item is met remove from que
// if current is not finished place in que
// place current in stack no matter
// 
// issue, 10 cats 12 dogs
//  12 will check and be apeased by cats in stack which is wrong
// 10 cats 12, 10 cats compleates a clause since the next word is a determinator
// Answer:
// treat "flying" as a live node not a modifer, so around modifies flying,
// only does flying care reference about its noun
// so its still looking for a noun but we check the verbs noun, seeeeeems right
// need a traverse then.....
function process({context, index, que, stack, data, instrs, buildThing, composeThing}) {
  let current = data[index];
	// debugger
  if (current.selfInstance) {
    instrs.add(`build : ${current.type} : ${current.word}`)
		buildThing({item:current, context:context});
		if( !current.needs ){
			current.finished = true;
			
			// ex: dog(s) which makes it unique for now, without a unique name just yet
			context.addNoun( current );
			
			>>>> 
			left it at here tryinhg to muster the logic to build a clause and skip to the next
		}
  }
	
	if(current.needs){
		
		// newest first
		// current looks in stack for its needs index
		// bug, 10 cats 12 birds, 12 will read the stack first and see cats
		// which is wrong for now
		// implied period or comma list builder, but we might not have that
		// ooooh new bug, 10 dogs, we need to handle the comma or it messes up a string match
		// 10 cats 12 dogs bug work here
		// this is a direction problem or a special case in that the noun has already been arrays built
		// or implied punctuation comma period or the like
		// 10 cats, 12 birds
		// cause
		// 10 cats flying flying 20 birds
		// flying will go backwards and the flags to make this correct are tooooo many
		// around : stack found a noun
		// around needs to check its modified for its traverse noun
		// to match if its this noun
		// debugger
		for (var ii = stack.length - 1; ii >= 0; ii--) {
			let stackPick = stack[ii];
			if( current.needs === stackPick.type ){
				
				// first traverse to make sure words needs is not already in the clause tree
				let good = true;
				current.traverseModified(function (item) {
					if(item === stackPick){
						good = false;
					}
				})
				debugger
				// DONT like this techniquie .alreadyMultiplied
				//  cause its baking flags into the processing instead of rules
				if(good && stackPick.alreadyMultiplied === false){
					current.incrNeedsIndex();
					current.modified[stackPick.word] = stackPick;
					
					composeThing({itemA:current, itemsB:stackPick, context:context});
					// see note above
					>>>>>
					if()
					instrs.add(`stack item match build : ${current.type} : ${current.word} + ${stackPick.type} : ${stackPick.word}`)
				}
				else {
					// instrs.add(`que add : ${current.type} : ${current.word} looking for ${current.needs}`)
					instrs.add(`skipped : ${current.type} : ${current.word} looking for ${current.needs}`)
				}
			}
		}
	}
  
	// now process the que
  if (que.length > 0) {
    
		// we will clone the que and loop on it
		// and remove as needed from the original to not break the loop
    let tempQue = que.slice();
    
		// oldest first
		for (var i = 0; i < tempQue.length; i++) {
      let qp = tempQue[i];
			// if(qp.type === "adverb"){
			// 	debugger
			// }
      if( qp.needs === current.type && current.alreadyMultiplied === false ){
        qp.incrNeedsIndex();
				qp.modified[current.word] = current;
				composeThing({itemA:qp, itemB:current, context:context})
        instrs.add(`que item match build : ${qp.type} : ${qp.word} + ${current.type} : ${current.word}`)
        if( !qp.finished ){
					if (que.hasItem(qp)) {
						instrs.add(`que item already in : ${qp.type} : ${qp.word}`)
					}
					else {
						instrs.add(`que item remove : ${qp.type} : ${qp.word} `)
						que.add(qp)
					}
        }
        else if(qp.finished){
          que.remove(qp);
        }
      }
			
    }
    
  }


	if(current.finished === false){
		que.add(current);
		instrs.add(`que add : ${current.type} : ${current.word}`)
	}

	stack.add(current)
}




// ++++++++++++






var data2 = buildClassActionsJoinList("10 birds flying around a dog")
// var data2 = buildClassActionsJoinList("10 birds flying around a 40 dog")


// Class DataThing{
// 
// }

// process(0)
// instrs

console.log("++++++++++");
// 
// var instrs = new CheapPool()
// var que = new CheapPool();
// var stack = new CheapPool();
// 
// var index = 0;
// 


class Animal{
	isAnimal = true;
	constructor(type){
		this.type = type;
		console.log(`type : im ${this.type}`);
	}
}

// just makes a 3d plane to the scene
function makePlane_CM(item){
	const yy = addPlane({
		colorHex: 0x5c5cff
	})
	item.instanceObjects.add( yy );
	
	yy.setColorHex(0xffffff);
	
	if (urlTable[item.word]) {
		// console.log("this.url", this.url);
		yy.loadImage(urlTable[item.word])
	}
	return yy;
}

// handles the logic building a noun,
// and then adds the 3d object to the scene
function buildThing({item, context}) {
	console.log(`buildn thing: ${item.word}`);
	if (item.type === "noun") {
		// let yy = new Animal(item.word)
		
		makePlane_CM(item);

	}
}





// verb > noun roughly
function composeThing({itemA, itemB, context}) {
	console.log(`composing thing A: ${itemA.word} * B: ${itemB.word}`);
	
	
	// cant think, need the count and arrayt pointers to work right
	
	if(itemA.type === "number" && itemB.instanceObjects.length > 0){
		debugger

		let yy = new CheapPool();
		yy.add(itemB.instanceObjects[0]);
		let count = +itemA.word;
		for (var i = 1; i < count; i++) {
			yy.add(makePlane_CM(itemB));
		}
		itemB.instanceObjects = yy;
		
		for (var ii = 0; ii < itemB.instanceObjects.length; ii++) {
			const pickedObject = itemB.instanceObjects[ii];
			pickedObject.randomPosition(-20, 20)
			pickedObject.position.z = 0;
		}
		
	}
	// if(itemA.type === "verb"){
	// 	// debugger
	// 	>>>>
	// }
	else if (itemA.type === "verb" && verbTables[itemA.word] && itemB.instanceObjects.length > 0) {
		for (var i = 0; i < itemB.instanceObjects.length; i++) {
			verbTables[itemA.word](itemB.instanceObjects[i])
		}
	}
}


// 
// for (var i = 0; i < data2.length; i++) {
// 
// 	process({
// 		index: i,
// 		que: que,
// 		stack: stack,
// 		data:data2,
// 		instrs:instrs,
// 		buildThing:buildThing,
// 		composeThing:composeThing
// 	})
// 
// }
// console.log(instrs);
// 
// // checking the modified pointers
// for (var i = 0; i < stack.length; i++) {
// 	let aa = [];
// 	for (const prop in stack[i].modified){ aa.push(stack[i].modified[prop].word) }
// 	console.log(` ${stack[i].word} m> ${aa }  `);
// }
// 


// thinking....
// each "line" might should be a class with subjects etc then
// keep simple for now
// class Sentence{
class Line{
	subject = null;
	object = null;
	verb = null;
	clauses = new CheapPool();
}

class AContext{
	subjectNoun = null;
	objectNoun = null;
	clauses = new CheapPool();
	clauseIndex = 0;
	// ex: dog(s) which makes it unique for now, without a unique name just yet
	addWord(item){
		this[item.word] = item;
	}
	addNoun(item){
		this.addWord(item);
		if(word.type === "noun"){
			this.parseNoun(item);
		}
	}
	parseNoun(word){
		
		// tinkering with storing grammar structure
		// would become a bigger refactor
		if ( this.subjectNoun === null ) {
			this.subjectNoun = item;
		}
		if (this.subjectNoun !== null && this.subjectNoun !== item  && !this.objectNoun ) {
			this.objectNoun = item;
		}
		
	}
}




// 
// 
// Setup
// 
// 
// 


function startParse(phrase){
	
	var instrs = new CheapPool()
	var que = new CheapPool();
	var stack = new CheapPool();

	var index = 0;
	
	// instance variables will be added here
	// actually, you handle object stuff in the callbacks
	var context = new AContext();
	
	
	var data2 = buildClassActionsJoinList(phrase)
	// var data2 = buildClassActionsJoinList("10 birds flying around a 40 dog")
	
	
	for (var i = 0; i < data2.length; i++) {
	
		process({
			context:context,
			index: i,
			que: que,
			stack: stack,
			data:data2,
			instrs:instrs,
			buildThing:buildThing,
			composeThing:composeThing
		})
	
	}
	
	console.log(instrs);
	
	// checking the modified pointers
	for (var i = 0; i < stack.length; i++) {
		let aa = [];
		for (const prop in stack[i].modified){ aa.push(stack[i].modified[prop].word) }
		console.log(` ${stack[i].word} m> ${aa }  `);
	}
	
	return {
		instrs:instrs,
		que:que,
		stack:stack,
		context:context
	}
	
}

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
	// startParse("10 dogs spinning")
	startParse("10 cats 40 birds")
	// startParse("20 birds spinning")
	// startParse("3 birds spinning 2 dogs spinning")
	// magicbox.value = "3 birds spinning 2 dogs spinning";
	magicbox.value = "10 cats flying";
	
	
}, 1000)
