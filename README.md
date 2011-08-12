Node-Wakeup
===========

Quick and dirty cmd-line wakeup call. Set your time in the config.json, and a (local) path to the audio file you want to play.
The wakeup time string takes the form hh:mm AM, e.g. : 

	"wakeup": "5:45"

AM is optional in this case. Or, on the night-shift:

	"wakeup": "9:00 PM"

By the Way
----------

This may be the silliest yak-shaving exercise ever. Its late and I need to sleep, but first I have to write my own node.js powered alarm clock because 

a) I've mislaid the real, analogue one and its too late (and I'm too lazy) to go out and buy another
b) I don't fancy finding an installing a dedicated app for this simple task

TODO
----

* date-util could be a sub-module I guess. 
* Needs some CLI so you can see what the current time is, wakeup time set and time remaining.
* I've made tracks an array, thinking that you might want to stack up a few. No supported yet though.
