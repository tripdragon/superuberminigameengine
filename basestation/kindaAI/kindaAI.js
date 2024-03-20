
// node kindaAI.js

// only checks for "s" right now, so "walrus" would be false
// "i" or "es" fishes wont work, wellll fishes would....
function isKindaPural(word) {
  let bb = word.toLowerCase().substr(-1);
  if (bb === "s") return true;
  return false;
}

// NOTE must be the string version of the word
function isNumber(strWord) {
  if(isNaN(strWord)) return false;
  return true;
}

// NOTE should be the dictionary version of the word
const hasTag = (item, tag) => item?.tags.includes(tag);

const ignoreWords = ["a", "the", "now"];

// Research for later on taxonomy stuffs
// If we have a polymorphic word we can use tags to differentiate how to use it
var dictionary = {
  "nouns" : {
    "cat": { tags: [] },
    "dog": { tags: [] },
    "whale": { tags: [] },
    "fish": { tags: [] },
    "giraffe": { tags: [] },
    "tree": { tags: [] }
  },

  "verbs" : {
    "fly": { tags: ["action"] },
    "blast": { tags: ["action"] },
    "flutter": { tags: ["action"] },
    "rotate": { tags: ["action"] },
    "spin": { tags: ["action"] },
  },

  "adjectives" : {
    "big": { tags: ["modifier"] },
    "small": { tags: ["modifier"] }
  },

  "prepositions": {
    "above": {},
    "below": {},
    "beside": {},
    "between": {},
    "in": {},
    "inside": {},
    "into": {},
    "near": {},
    "on": {},
    "over": {},
    "through": {},
    "under": {},
    "underneath": {},
    "against": {},
    "alongside": {},
    "around": {},
    "behind": {},
    "beyond": {},
    "by": {},
    "onto": {},
    "off": {},
    "out": {},
    "up": {},
    "down": {},
    "across": {}
  }
};

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
          name: itemName, // Here for convenience
          tags: [...itemVal.tags || [], category]
        }
      };
    }, {}))
  };
}, {});

console.log("parsedDictionary", parsedDictionary);

const parseStatementToActionObject = (statement) => {

  // We need to turn this into an action statement as JSON
  const splitStatement = statement.split(" ")
    .filter((piece) => !ignoreWords.includes(piece));

  // WE CURRENTLY ONLY SUPPORT 1 ADJECTIVE PER SUBJECT, AND 1 PER PREPOSITION OBJECT, 2 TOTAL
  // Let's build on the rule for 1 adjective allowed each.
  // We can figure how to pluralize later, sry I know that goes against the assume-an-array model,
  // but let's try this we can version and update it later.

  // Show final shape of the actionObject
  const actionObject = {
    subject: '', // First noun we encounter
    number: '', // First num we encounter
    adjective: '', // Arr of adjectives encountered before a preposition
    verb: '', // First verb we encounter
    preposition: '', // First preposition we encounter
    prepositionObj: '', // 2nd noun we encounter
    prepositionObjAdjective: '', // Rest of the adjectives we encounter
    rest: [] // The remaining words
  };

  console.log('actionObject BEFORE', actionObject);

  splitStatement.forEach((word) => {

    let formattedWord = word.toLowerCase();

    // Check if it's a number first
    if (!isNaN(formattedWord)) {

      actionObject.number = Number(formattedWord);
      return;
    }

    // Normalize the word so we can better look it up in the parsedDictionary
    if (isKindaPural(word)) {
      formattedWord = formattedWord.slice(0, -1);
    }

    console.log('formattedWord', formattedWord);

    const wordObj = parsedDictionary[formattedWord];

    if (!wordObj) {
      console.warn('WARNING NO DICTIONARY MATCH for :', formattedWord);
      return;
    }

    const isNoun = hasTag(wordObj, "nouns");
    const isAdjective = hasTag(wordObj, "adjective");
    const isVerb = hasTag(wordObj, "verbs");
    const isPreposition = hasTag(wordObj, "prepositions");

    if (!actionObject.subject && isNoun) {
      actionObject.subject = wordObj;
    }
    else if (isNoun) {
      actionObject.prepositionObj = wordObj;
    }
    else if (isAdjective) {
      actionObject.adjectives.push(wordObj);
    }
    else if (isVerb) {
      actionObject.verb = wordObj;
    }
    else if (isPreposition) {
      actionObject.preposition = wordObj;
    }
  }, {});

  console.log("splitStatement", splitStatement);
  console.log("actionObject AFTER", actionObject);
};

// parseStatement("10 cats fly around a dog");
parseStatementToActionObject("3 dogs flutter under a tree");

// We're looking to build an object to parse the sentence into.
//

// export {parseStatementToActionObject, hasTag, ignoreWords, parsedDictionary, prepositions, isKindaPural, isNoun, isNumber, dictionary}
