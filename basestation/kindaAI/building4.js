
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

function isNumber(strWord) {
	if (isNaN(strWord)) return false;
	return true;
}

// phrase = "10 birds flying around a dog";
// splits = phrase.split(" ")

splitsB = ["10", "birds", "flying", "around", "dog"]
data = ["number", "noun", "verb", "adverb", "noun"]
selfInsta = [false, true, false, false, false] // only noun
needs = [["noun"], [""], ["noun"], ["verb", "noun"], [""]]

splitsB = ["10", "flying", "birds", "around", "dog"]
data = ["number", "verb", "noun",  "adverb", "noun"]
selfInsta = [false, false, true, false, false] // only noun
needs = [["noun"], ["noun"], [""],  ["verb", "noun"], [""]]

// splitsB = ["2", "birds", "14", "dogs"]
// data = ["number", "noun", "number", "noun"]
// selfInsta = [false, true, false, true] // only noun
// needs = [["noun"], [""], ["noun"], [""]]


class Word{
  finished = false;
  needsIndex = 0;
  _needs = [];
	// assigned = [];
	modified = {};
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

// data2 = splitsB.map((word, i) => ( { word:word, type: data[i], finished:false, selfInstance:selfInsta[i], needs:needs[i].slice(), needsIndex : 0 } ))

data2 = splitsB.map((word, i) => (
  new Word(  { word:word, type: data[i], selfInstance:selfInsta[i], needs:needs[i].slice() })
))



que = new CheapPool();
stack = new CheapPool();

index = 0;

instrs = new CheapPool()


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
function process(index) {
  let current = data2[index];
  
  if (current.selfInstance) {
    instrs.add(`build : ${current.type} : ${current.word}`)
		buildThing(current);
		if( !current.needs ) current.finished = true;
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
			let sp = stack[ii];
			if( current.needs === sp.type ){
				
				// first traverse to make sure words needs is not already in the clause tree
				let good = true;
				current.traverseModified(function (item) {
					if(item === sp){
						good = false;
					}
				})
				
				if(good){
					current.incrNeedsIndex();
					current.modified[sp.word] = sp;
					composeThing(current, sp)
					instrs.add(`stack item match build : ${current.type} : ${current.word} + ${sp.type} : ${sp.word}`)
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
			
      if( qp.needs === current.type ){
        qp.incrNeedsIndex();
				qp.modified[current.word] = current;
				composeThing(qp, current)
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



class Animal{
	isAnimal = true;
	constructor(type){
		this.type = type;
		console.log(`type : im ${this.type}`);
	}
}

function buildThing(item) {
	console.log(`buildn thing: ${item.word}`);
	if (item.type === "noun") {
		let yy = new Animal(item.word)
	}
}

function composeThing(itemA, itemB) {
	console.log(`composing thing A: ${itemA.word} * B: ${itemB.word}`);
	
}


// Class DataThing{
// 
// }

// process(0)
// instrs

console.log("++++++++++");

instrs = new CheapPool()
for (var i = 0; i < data2.length; i++) {
	process(i)
}
console.log(instrs);


// checking the modified pointers
for (var i = 0; i < stack.length; i++) {
	let aa = [];
	for (const prop in stack[i].modified){ aa.push(stack[i].modified[prop].word) }
	console.log(` ${stack[i].word} m> ${aa }  `);
}
