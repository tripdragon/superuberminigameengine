
// node kindaAI.js

window.parseStatementToActionObject = (statement) => {

  // We need to turn this into an action statement as JSON
  const splitStatement = statement.split(" ")
    // .filter((piece) => !ignoreWords.includes(piece));

  // WE CURRENTLY ONLY SUPPORT 1 ADJECTIVE PER SUBJECT, AND 1 PER PREPOSITION OBJECT, 2 TOTAL
  // Let's build on the rule for 1 adjective allowed each.
  // We can figure how to pluralize later, sry I know that goes against the assume-an-array model,
  // but let's try this we can version and update it later.

  // Show final shape of the actionObject
  const actionObject = {
    subject: '', // First noun we encounter
    number: '', // First num we encounter
    adjectives: [], // Arr of adjectives encountered before a preposition
    verb: '', // First verb we encounter
    preposition: '', // First preposition we encounter
    prepositionObj: '', // 2nd noun we encounter
    prepositionObjAdjectives: [], // Rest of the adjectives we encounter
    prepositionObjNumber: '',
    rest: [] // The remaining words
  };

  console.log('actionObject BEFORE', actionObject);

  splitStatement.forEach((word) => {

    let formattedWord = word.toLowerCase();

    // Check if it's a number first
    if (!isNaN(formattedWord)) {
      if (actionObject.number !== '') {
        actionObject.prepositionObjNumber = Number(formattedWord);
      }
      else {
        actionObject.number = Number(formattedWord);
      }

      return;
    }

    // Normalize the word so we can better look it up in the parsedDictionary
    if (isKindaPural(word)) {
      formattedWord = formattedWord.slice(0, -1);
    }

    const wordObj = parsedDictionary[formattedWord];

    if (!wordObj) {
      console.warn('WARNING NO DICTIONARY MATCH for :', formattedWord);
      actionObject.rest.push(formattedWord);
      return;
    }

    if (hasTag(wordObj, "nouns")) {
      if (!actionObject.subject) {
        actionObject.subject = wordObj;
      }
      else {
        actionObject.prepositionObj = wordObj;
      }
    }
    else if (hasTag(wordObj, "adjectives")) {
      if (actionObject.preposition) {
        actionObject.prepositionObjAdjectives.push(wordObj);
      }
      else {
        actionObject.adjectives.push(wordObj);
      }
    }
    else if (hasTag(wordObj, "verbs")) {
      actionObject.verb = wordObj;
    }
    else if (hasTag(wordObj, "prepositions")) {
      actionObject.preposition = wordObj;
    }
    else {
      actionObject.rest.push(wordObj);
    }
  }, {});

  console.log("splitStatement", splitStatement);

  return actionObject;
};

// parseStatement("10 cats fly around a dog");

// We're looking to build an object to parse the sentence into.

setTimeout(function (x) {
	console.log("¿??¿¿? tacos");
	console.log("debugging automated ");

  clearGame();

  const actionObject = parseStatementToActionObject(
    "3 small dogs flutter under 2 big trees dude"
  );

  // actionObject

  addPlane({
    colorHex: 0x5c5cff
  });

	// clearGame()
	// startParse("10 cats flying")

}, 1000);


// Register window funcs
