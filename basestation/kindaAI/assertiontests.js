


// these are not yet real tests, just docs for expectected systems

++
"10 birbs flying around a dog"

grammar: subject: 10 birds, verb: flying, story(word): around, object: dog

composition: around(flying(birds[10])),dog)

sceneGrapth: {
  birds = sprites.length is 10
  birds has entity "flyAround" with .target dog
  dog = sprite.length is 1
  dog position = 0
  birds position next frame changes
}

visually: birds position is scattered on screen
Dog is in center
birds position each frame around the dog in some capacity
\\

10 birds, 4 cats doing stuff
10 birds and 2 cats ...

10 green cats flying towards a block of cheese
1 2 0 3 4 5 8 6 7
In order of subjects and modifiers when found out of order
If you imagine a gradient makes for an intreesting AI noise pattern
"cats 10 green" " flying towards" "a" "cheese block" "of"
cats 10 green flying towards a cheese block of
neko hachi midorin kurma ni cheeseu blocku
Neko 10 midori no chīzu burokku ni mukatte tonde imasu.

"10 birbs flying around a dog"
dog a around flying birds 10
birbs 10, around flying, dog a

flying birbs 10, dog a around
10 birbs flying, birbs flying around, flying around a, around a dog, a dog

look for model
birbs, flying, dog



function isKindaPural(word) {
  let bb = word.toLowerCase().substr(-1);
  if (bb === "s") return true;
  return false;
}

function isNoun(word) {
  if(word.noun) return true;
  return false;
}



// isAdjective
// 
// function whatIs(word){
//   let val = "sa~";
//   if (isNoun(word)) {
//     val = "noun";
//   }
//   else if (isNumber(word)) {
//     val = "number";
//   }
//   else if (isVerb(word)) {
//     val = "verb";
//   }
//   else if (isAdjective(word)) {
//     val = "verb";
//   }
// }
// 

function isNumber(word) {
  if(isNaN(word)) return false;
  return true;
}

var dd = {
  "birb" : {"categories":["noun"]},
  "birbs" : {"categories":["noun"]},
  "flying" : {"categories":["verb"]},
  "around" : {"categories":["adverb"]},
  "dog" : {"categories":["noun"]},
  "dogs" : {"categories":["noun"]},
}

function scoop1(phrase) {
  const aa = phrase.split(" ");
  const out = [];
  for (var i = 0; i < aa.length; i++) {
    if (dd[aa[i]]) {
      out.push( {word:aa[i], data:dd[aa[i]]} );
    }
    else if( isNumber(aa[i]) ){
      out.push( {word:aa[i], data:{
          "categories":["number"]
        }
      });
    }
  }
  return out;
}

var aa = "10 birbs flying around a dog";
var m1 = scoop1(aa)

function parse1(scooped) {
  const out = [];
  for (var i = 0; i < scooped.length; i++) {
    out[i] = scooped[i].data.categories[0];
  }
  return out;
}

"a dog walks in the park"
var aa = "10 birbs flying around a dog";
var m1 = scoop1(aa)
var m2 = parse1(m1)


let hold = null;
for (var i = 0; i < array.length; i++) {
  array[i]
}


var model1 = ["subject", "verb", "object"];



var aa = "10 birbs flying around a dog";

s: 10
10 what?
s: 10 birbs
verb?
s: 10 birbs flying
object? There are more words to go
s: 10 birbs flying around
that is an adverb, flying around what?
s: a
a what?
s: a dog
object found
flying around around a dog
so, 10 birds(flying(around(dog)))
or around(flying(10birbs), dog)
or

determiner, noun(subject), verb, adverb, determiner, object

determiner waits
noun found
noun checks if something was before, determiner edits noun as number, if was "a" or "the", then its just ignored
hold let bb = birbs[]
walk for next routine
verb modifies bb[] flying( bb )
walk for next routine
adverb modifies previous verb, waits for noun
determiner, does nothing but waits for noun, since its "a" its ignored, if it were number would modify next noun
object found, refences previous determiner, references previous adverb thats waiting


in pairs:

var aa = "10 birbs flying around a dog";

s: 10 birds => determiner, noun
noun has priority, so consults determiner being a number
current Subject = birds[]

s: flying around => verb, adverb
verb references present subject
verb has priority of adverb, so around(flying) but around needs to wait SINCE phrase was more words

s: a dog => determiner, noun
"a" is ignored
since we have a subject AND an adverb asking for a target, dog becomes Object = dog


reordering with model
determiner, noun(subject), verb, adverb, determiner, noun(object)

noun(subject)+determiner, + verb+adverb, >> noun(object)+determiner


noun.addVerb(v.addAdverb(a).addObject(noun))


UGH
10 cows, ten cats, and 4 bats¿ all sitting on chairs in a park watching the rock show

ten, bat, rock, watching(facing)


number, a, the, is a determiner








function walkThough1(data, model){
  
  let count = data.length;

  function step(index) {
    if (true) {
      
    }
  }
  
  for (var i = 0; i < data.length; i++) {
    data[i]
  }
  
}


traverse( callback ) {

  callback( this );

  const children = this.children;

  for ( let i = 0, l = children.length; i < l; i ++ ) {

    children[ i ].traverse( callback );

  }

}




var aa = "10 birbs flying around a dog";

var bb = parse1(aa)




bb = aa.split(" ")
cc = whatIs(bb[0])



++++++++
