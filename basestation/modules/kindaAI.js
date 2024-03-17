a = "10 cats fly around a dog"
b = a.split(" ")

// 
// +b[0]
// isNaN(b[1])

// animals = {
//   "cat":0,
//   "dog":1,
//   "whale":2,
//   "giraffe":3,
//   "fish":4
// }

// let isS = str.substr(-1);

// is number

// is next a noun


// only checks for "s" right now, so "walrus" would be false
// "i" or "es" fishes wont work, wellll fishes would....
function isKindaPural(word) {
  let bb = word.toLowerCase().substr(-1);
  if (bb === "s") return true;
  return false;
}

function isNoun(word){
  if(word.noun) return true;
  return false;
}
function isNumber(word){
  if(isNaN(word)) return false;
  return true;
}

// class Entry{
//   // for now we only allow one type, noun, verb, adjective
//   constructor({name,type,animal,thing,action}={}){
//     this.name = name;
//     this.animal = animal;
//     this.thiing = thing;
//     this.action = action;
//     this.type = type;
//   }
// }
// 
// var dictionary = {
// 
//   // animals
// 
//   "cat": { "name":"cat", "type":"noun", "animal", : true },
//   "dog": { "name":"dog", "type":"noun", "animal", : true },
//   "whale": { "name":"whale", "type":"noun", "animal", : true },
//   "fish": { "name":"fish", "type":"noun", "animal", : true },
//   "giraffe": { "name":"giraffe", "type":"noun", "animal", : true },
//   // 
//   // new Entry({name:"cat", type:"noun", animal:true}),
//   // "dog": new Entry({name:"dog", type:"noun", animal:true}),
//   // "whale": new Entry({name:"whale", type:"noun", animal:true}),
//   // "fish": new Entry({name:"fish", type:"noun", animal:true}),
//   // "giraffe": new Entry({name:"giraffe", type:"noun", animal:true}),
//   // 
// 
//   // verbs
//   verbs : {
// 
//   },
// 
//   "fly": { "name":"fly", "type":"verb", "action", : true },
//   "blast": { "name":"blast", "type":"verb", "action", : true },
//   "fly": new Entry({name:"fly", type:"verb", action:true}),
//   "blast": new Entry({name:"blast", type:"verb", action:true}),
//   "flutter": new Entry({name:"flutter", type:"verb", action:true}),
//   "rotate": new Entry({name:"rotate", type:"verb", action:true}),
//   "spin": new Entry({name:"spin", type:"verb", action:true}),
// 
//   // adjective
//   "big": new Entry({name:"big", type:"adjective", modifier:true}),
//   "small": new Entry({name:"small", type:"adjective", modifier:true}),
// 
//   // adverb
//   "around": new Entry({name:"around", type:"adjective", action:true}),
// }



var dictionary = {

  "animals" : {
    "cat": { "name":"cat", "noun" : true },
    "dog": { "name":"dog", "noun" : true },
    "whale": { "name":"whale", "noun" : true},
    "fish": { "name":"fish", "noun" : true},
    "giraffe": { "name":"giraffe", "noun" : true },
  },
  
  "verbs" : {
    "fly": { "name":"fly", "action" : true },
    "blast": { "name":"blast", "action" : true },
    "flutter": { "name":"flutter", "action" : true },
    "rotate": { "name":"rotate", "action" : true },
    "spin": { "name":"spin", "action" : true },
  },
  
  "adjectives" : {
    "big": { "name":"big", "modifier" : true },
    "small": { "name":"small", "modifier" : true },
  },
  
  "adverbs" : {
    "around": { "name":"around", "action" : true },
  }
  
}

// // var nouns = {}
// // var verbs = {}
// var caches = {}
// var animals = {}
// 
// for (var prop in dictionary) {
//     caches[dictionary[prop].type] = dictionary[prop]
//     // if (dictionary[prop].type === "noun") {
//     //   nouns[prop] = dictionary[prop];
//     // }
//     if (dictionary[prop].animal) {
//       animals[prop] = dictionary[prop];
//     }
// }


a = "10 cats fly around a dog"
b = a.split(" ")

10 + cats
cats + fly
fly + around
a / scratch
around + dog
dog ? .


foreach and for each
