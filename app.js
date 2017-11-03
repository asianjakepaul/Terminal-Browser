const colors   = require('colors');
const term     = require('terminal-kit').terminal;
const sprintf  = require('util').format;
const readLine = require('readline');
const {validateUrl} = require('./utils');
const dateFormat = require('dateformat');
const request = require('request');
const hermit = require('hermit');

////////////////////////////////
//----------------------------//
// Copyright (c) 2017 NullDev //
//----------------------------//
////////////////////////////////

/**
 * Formats a date object to a string.
 * @param date - A date object (default: Date.now())
 * @param format - The format to use (default: "dd.mm.yyyy hh:MM:ss").
 * @returns {String} - A date represented as string.
 */
const getTimeStamp = (date = Date.now(), format = "dd.mm.yyyy hh:MM:ss") => {
  return dateFormat(date, format);
};

class PreLoader {
  constructor(message, style) {
    this._message = message;
    this._style = style;
    this._timer = null;
    this._frames = this._style.map((c) => {
      return sprintf(this.termRepeat(term.width, true) + '  \u001b[96m%s ', c);
    });
  }

  termRepeat(width, horizontal) {
    return horizontal ? " ".repeat(Math.round(width / 2) - 10) : "\n".repeat(Math.round(width / 2) - 2);
  };

  stop() {
    process.stdout.write('\u001b[0G\u001b[2K');
    clearInterval(this._timer);
  };

  start() {
    const len = this._frames.length;
    let i = 0;
    const draw = () => {
      process.stdout.write('\u001b[0G' + this._frames[i++ % len] + '\u001b[90m' + this._message + '\u001b[0m');
    };
    this._timer = setInterval(draw, 90);
  };


  set message(message) {
    this._message = message;
  }
}

class TerminalBrowser {

  constructor(options) {
    this._debug = options.debug || false;
    this._readLine = readLine.createInterface({
      input:  process.stdin,
      output: process.stdout
    });
    this._init();
  }

  debug(message) {
    if (this._debug) {
      const tag = ">> DEBUG".yellow.bgBlack;
      const colon = ": ".red.bgBlack;
      const dash = " - ".white.bgBlack.italic;
      const timestamp = `[${getTimeStamp()}]`.green.bgBlack.italic;
      message = message.cyan.bgBlack;
      console.log(tag + colon + dash + timestamp + message);
    }
  }

  _init() {
    const preLoader = new PreLoader("Loading ".italic.white, ["◡","◟","◜","◠","◝","◞"]);
    this.debug("Vertical Center the loading screen");
    this.debug("Start Loader");
    preLoader.start();
    let counter = 0;

    const tick = () => {
      counter++;
      preLoader.message = "Loading".italic.white + ".".repeat(counter).italic.white + " ";
      if (counter >= 5) {
        preLoader.stop();
        clearInterval(timer);
        this.onPreLoadFinished();
      }
    };
    const timer = setInterval(tick, 500);
  }

  clear() {
    term.clear()
  }

  onPreLoadFinished() {
    this.clear();
    this.main();
  }

  main() {
    this._readLine.question(" Enter a valid URL: ", (url) => {
      this.debug(`Got answer: ${url}`);

      if (validateUrl(url)) {
        request(url, (error, response, body) => {
          if (error) {
            console.log('Error loading URL!.'.red);
            this.main();
          }
          hermit(body, (err, res) => {
            if (err) {
              console.log('Error rendering response!.'.red);
              this.main()
            }
            console.log(res);
            console.log('='.repeat(200));
            this.main();
          })
        });
      } else {
        console.log('That doesn\'t seem like a valid URL.'.red);
        this.main();
      }

    });
  }
}

const debug = !!process.argv.find(arg => {
  arg = arg.toLowerCase();
  return arg === '-d' || arg === '--debug';
});

const terminal = new TerminalBrowser({debug: debug});
