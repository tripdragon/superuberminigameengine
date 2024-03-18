


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
