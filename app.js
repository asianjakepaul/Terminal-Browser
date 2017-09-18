"use strict";

var _c       = require('colors');
var term     = require('terminal-kit').terminal
var sprintf  = require('util').format;
var readline = require('readline');
var validate = require('./validate').validate;

////////////////////////////////
//----------------------------//
// Copyright (c) 2017 NullDev //
//----------------------------//
////////////////////////////////

var args = process.argv;

var rl = readline.createInterface({
	input:  process.stdin,
	output: process.stdout
});

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

function getTS() {
	var date  = new Date();
	var hour  = date.getHours(),
		min   = date.getMinutes(),
		sec   = date.getSeconds(),
		year  = date.getFullYear(),
		month = date.getMonth() + 1,
		day   = date.getDate();

	hour  = (hour  < 10 ? "0" : "") + hour;
	min   = (min   < 10 ? "0" : "") + min;
	sec   = (sec   < 10 ? "0" : "") + sec;
	month = (month < 10 ? "0" : "") + month;
	day   = (day   < 10 ? "0" : "") + day;

    return "[" + day + "." + month + "." + year + " " + hour + ":" + min + ":" + sec + "]";
}

function dlog(text){
	_debug = _debug.map(v => v.toLowerCase());
	args = args.map(v => v.toLowerCase());
	if (_debug.some(r => args.indexOf(r) >= 0)){
		if (isset(text)) console.log(
			">> DEBUG".yellow.bgBlack    + ": ".red.bgBlack + 
			getTS().green.bgBlack.italic + " - ".white.bgBlack.italic + 
			text.cyan.bgBlack
		);
		return true;
	}
	else return false;
}

function preloader(s_msg, s_style){
	this.start = function(){
		var _ = this;
		function startAnim(arr) {
			var len = arr.length, i = 0, interval = 90;
			var drawTick = function(){
				var _s = arr[i++ % len];
				process.stdout.write('\u001b[0G' + _s + '\u001b[90m' + s_msg + '\u001b[0m');
			};
			_.timer = setInterval(drawTick, interval);
		}
		var frames = s_style.map(function(c){ return sprintf(termrepeat(term.width, true) + '  \u001b[96m%s ', c); });
		startAnim(frames, 70);
	};
	this.message = function(msg){ s_msg = msg; };
	this.stop = function(){
		process.stdout.write('\u001b[0G\u001b[2K');
		clearInterval(this.timer);
	};
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
	dlog("Render Browser UI");
	process.stdout.write("\n");
	rl.question(" URL: ", (a) => {
		dlog("Got: " + a);
		getValRes(a);
	});
}

function getValRes(url){
	var res = validate(url);
	var response = null;
	switch(res){
		case 0: {
			cl();
			response = " Seems like this URL is not valid. Try again";
			console.log("\n" + response.red);
			renderUi();
			break;
		}
		case 1: {
			rl.close();
			cl();
			response = " Valid.";
			console.log("\n" + response.green);
			doRender(url);
			break;
		}
	}
}

function main(){
	dlog("Main");
	cl();
	process.stdout.write("\n");
	renderUi();
}

process.stdout.on('resize', function() {
	//Re-Render
});

dlog("Started!");
init();
