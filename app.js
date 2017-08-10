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
var _debug  = ["--debug", "-d"];

function isset(_var){ return (_var && _var != null && _var != "" ) ? true : false; }

function cl(){ 
	process.stdout.write('\x1Bc');
	term.clear()
}

function preloader(s_msg, s_style){
	this.start = function(){
		var _ = this;
		var render = s_style;

		function startAnim(arr, interval) {
			var len = arr.length, i = 0;
			interval = interval || 100;
			var drawTick = function(){
				var str = arr[i++ % len];
				process.stdout.write('\u001b[0G' + str + '\u001b[90m' + s_msg + '\u001b[0m');
			};
			_.timer = setInterval(drawTick, interval);
		}

		var frames = render.map(function(c){ return sprintf('  \u001b[96m%s ', c); });
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
	var loader = new preloader("Loading ".white, ["◜","◠","◝","◞","◡","◟"]);
	console.log('\n');
	loader.start();
	var _c = 4;
	var _dot = "";
	setInterval(function(){
		_c--;
		_dot += ".";
		loader.message("Loading".white + _dot.white + " ");
		if (_c === 0){
			loader.stop();
			cl();
			dlog("Started!");
			main();
		}
	}, 500);
}

function renderUi(){
	cl();
  //stuff
}

function main(){
	dlog("Main");
	renderUi();
  //more stuff
}

process.stdout.on('resize', function() {
	//Re-Render
});

dlog("Started!");
init();
