"use strict";

var _c      = require('colors');
var term    = require('terminal-kit').terminal
var sprintf = require('util').format;

////////////////////////////////
//----------------------------//
// Copyright (c) 2017 NullDev //
//----------------------------//
////////////////////////////////

var args    = process.argv;

//Start the script with the arguments --debug or -d to see logs (e.g.: node app.js --debug)
var _debug  = ["--debug", "-d"];

function isset(_var){ return (_var && _var != null && _var != "" ) ? true : false; }

function cl(){ 
	process.stdout.write('\x1Bc');
	term.clear()
}

function termrepeat(n, horizontal) { 
	if (horizontal) return " ".repeat(Math.round(n / 2) - 10);
	else return "\n".repeat(Math.round(n / 2) - 2);
}

function preloader(s_msg, s_style){
	this.start = function(){
		var _ = this;

		function startAnim(arr, interval) {
			var len = arr.length, i = 0;
			interval = interval || 100;
			var drawTick = function(){
				var str = arr[i++ % len];
				process.stdout.write('\u001b[0G' + str + '\u001b[90m' + s_msg + '\u001b[0m');
			};
			_.timer = setInterval(drawTick, interval);
		}

		var frames = s_style.map(function(c){ return sprintf(termrepeat(term.width, true) + '  \u001b[96m%s ', c); });
		startAnim(frames, 70);
	};

	this.message = function(message){ s_msg = message; };

	this.stop = function(){
		process.stdout.write('\u001b[0G\u001b[2K');
		clearInterval(this.timer);
	};
}

function dlog(text){
	_debug = _debug.map(v => v.toLowerCase());
	args = args.map(v => v.toLowerCase());
	if (_debug.some(r => args.indexOf(r) >= 0)){
		if (isset(text)) console.log(">> DEBUG".yellow + ": ".red + text.cyan);
		return true;
	}
	else return false;
}

function init(){
	cl();
	var loader = new preloader("Loading ".italic.white, ["◡","◟","◜","◠","◝","◞"]);
	dlog("Vertical Center the loading screen")
	console.log(termrepeat(term.height, false));
	dlog("Start Loader");
	loader.start();
	var _c = 4;
	var _dot = "";
	setInterval(function(){
		_c--;
		_dot += ".";
		loader.message("Loading".italic.white + _dot.italic.white + " ");
		dlog("Loop: " + _c);
		if (_c === 0){
			dlog("Stopping loader");
			loader.stop();
			dlog("Started!");
			main();
			clearInterval(this);
		}
	}, 500);
}

function renderUi(){
	cl();
	dlog("Render Browser UI");

}

function main(){
	dlog("Main");
	renderUi();
}

process.stdout.on('resize', function() {
	//Re-Render
});

dlog("Started!");
init();
