window.ignoreWords = ["a", "the", "now"];

// Research for later on taxonomy stuffs
// If we have a polymorphic word we can use tags to differentiate how to use it
window.dictionary = {
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

window.parsedDictionary = Object.entries(dictionary).reduce((newDict, [category, items]) => {

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
