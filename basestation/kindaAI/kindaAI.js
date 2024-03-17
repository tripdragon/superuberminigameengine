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

function isNoun(word) {
  if(word.noun) return true;
  return false;
}

function isNumber(word) {
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



// Research for later on taxonomy stuffs
// If we have a polymorphic word we can use tags to differentiate how to use it
var dictionary = {
  "animals" : {
    "cat": { tags: ["noun"] },
    "dog": { tags: ["noun"] },
    "whale": { tags: ["noun"] },
    "fish": { tags: ["noun"] },
    "giraffe": { tags: ["noun"] }
  },

  "verbs" : {
    "fly": { tags: ["action"] },
    "blast": { tags: ["action"] },
    "flutter": { tags: ["action"] },
    "rotate": { tags: ["action"] },
    "spin": { tags: ["action"] }
  },

  "adjectives" : {
    "big": { tags: ["modifier"] },
    "small": { tags: ["modifier"] }
  },

  "adverbs" : {
    "around": { tags: ["action"] }
  }
};

const prepositions = [
  "above",
  "below",
  "beside",
  "between",
  "in",
  "inside",
  "into",
  "near",
  "on",
  "over",
  "through",
  "under",
  "underneath",
  "against",
  "alongside",
  "around",
  "behind",
  "beyond",
  "by",
  "onto",
  "off",
  "out",
  "up",
  "down",
  "across"
];

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


// a = "10 cats fly around a dog"
// b = a.split(" ")

// 10 + cats
// cats + fly
// fly + around
// a / scratch
// around + dog
// dog ? .


// foreach and for each

a = "10 cats fly around a dog."

// console.log('b', b);

const parsedDictionary = Object.entries(dictionary).reduce((newDict, [category, items]) => {

  return {
    ...newDict,
    ...(Object.entries(items).reduce((collector, [itemName, itemVal]) => {

      return {
        ...collector,
        [itemName]: {
          ...itemVal,
          name: itemName,
          tags: [...itemVal.tags, category]
        }
      };
    }, {}))
  };
}, {});

const ignoreWords = ["a", "the", "now"];

console.log("parsedDictionary", parsedDictionary);

const hasTag = (item, tag) => item.tags.includes(tag);

/*
  Ex: 3 dogs sleep under a tree
  Working idea of what this could be
  Example obj: {
    subject: "dog",
    number: 3,
    action: "sleep",
    preposition: "under",
    preopositionObj: "tree"
  }
*/

const parseStatementToActionObject = (statement) => {

  // We need to turn this into an action statement as JSON
  const splitStatement = statement.split(" ")
    .filter((piece) => !ignoreWords.includes(piece));

  const actionObject = splitStatement.reduce((collector, word) => {

    let formattedWord = word.toLowerCase();

    if (isKindaPural(word)) {
      formattedWord = formattedWord.slice(0, -1);
    }

    console.log('formattedWord', formattedWord);
    const dictMatch = parsedDictionary[formattedWord];

    if (!dictMatch) {
      console.warn('WARNING NO DICTIONARY MATCH');
      return collector;
    }

    newInfo = {};

    if (!collector[dictMatch.name] && hasTag(dictMatch, 'noun')) {
      newInfo.subject1 = { ...dictMatch };
    }

    return {
      ...collector,
      ...newInfo
    };
  }, {});

  console.log("splitStatement", splitStatement);
  console.log("actionObject", actionObject);
};

// parseStatement("10 cats fly around a dog");
parseStatementToActionObject("3 dogs sleep under a tree");

// We're looking to build an object to parse the sentence into.
//
