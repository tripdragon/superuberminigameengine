
// node kindaAI.js

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

// foreach and for each

// a = "10 cats fly around a dog."

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

// console.log("parsedDictionary", parsedDictionary);

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
      console.warn('WARNING NO DICTIONARY MATCH for :', formattedWord);
      return collector;
    }

    const newInfo = {};

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
// parseStatementToActionObject("3 dogs sleep under a tree");

// We're looking to build an object to parse the sentence into.
//

export {parseStatementToActionObject, hasTag, ignoreWords, parsedDictionary, prepositions, isKindaPural, isNoun, isNumber, dictionary}
