<!-- 
npm install http-server -g
$ http-server
or
npx http-server -->

# superuberminigameengine

A tiny game engine of delight

This ones the team work one!~

Game engine: a sum of its parts.


## Base goals 1
## games/notPac

+ Display
+ Loop
+ Render polygon in color
+ Add movement keys to polygon
+ Wrap position
+ Collide polygon to mouse
+ React to mouse
+ High score!!

Base goal 1 does not have an editor yet.
Though mouse could draw squares and the squares go to database, making for the smallest form of an editor


## Basic API

Need a unload()
Most important, so we can swap levels/games from memory

Now, for theory. There are two type of cameras, ortho and perspective. And 2 types of screen modes or coordinates, 2d, 3d. All are just techniques to convert spaces onto ScreenSpace. 2d being the simpler. And 3D being much more complicated, it allows 2D in 3d space and thus far more creative flexibility. So that is what we will focus on.

The BaseStation system should be pretty basic just memory management based, load/unload a game. Swap ram.
Setup «memory» and objects.

A «Render technique» or a «Pipeline» is a way and order to draw objects and handle matrices. We should have a basic one a «Game» can build from. This way the BaseSystem» does not have a rigid bias to the desgin
