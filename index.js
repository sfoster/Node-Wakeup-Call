var fs = require('fs'), 
  path = require('path'),
  exec = require('child_process').exec;
require('date-utils');

var config = null, 
  statusItv = null;

var status = function(wakeup){
  now = new Date;
  var h = now.getHoursBetween(wakeup), 
    m = now.getMinutesBetween(wakeup) % 60; 
  console.log("you have %s hrs, %s mins remaining", h, m);
  // 
};

var parseTime = function(str, day) {
  var m = str.toLowerCase().match(/\s*(\d{1,2}):(\d{1,2})\s*([AP]M)?/i);
  var h = parseInt(m[1], 10), 
    m = parseInt(m[2], 10),
    isPM = m[3] && m[3] == "pm";
  if(isPM && h <= 12){
    h += 12;
  };
  var time = day || Date.today();
  time.add({ 
    minutes: m,
    hours: h
  }); // adds time to existing time
  return time;
};

function run(){
  fs.readFile(__dirname + "/config.json", function(err, data){
    config = JSON.parse(data);

    var now = new Date, 
      wakeupTime = parseTime(config.wakeup);

      if(now >= wakeupTime) {
        // its the morning already, set it for tommorow instead
        wakeupTime = parseTime(config.wakeup, Date.tomorrow());
      }

      var delay = wakeupTime - now;
      console.log("wakeup set for: ", wakeupTime.toFormat("YYYY/MM/DD HH24:MI"));
      status(wakeupTime);

      if(delay > 0){
        statusItv = setInterval(function(){
          status(wakeupTime);
        }, 1000 * 60 * 30);
        setTimeout(function(){
          wakeup();
        }, delay);
      }

  });
}

function wakeup(){
  console.log("Now playing: " + config.tracks[0]);
  statusItv && clearInterval(statusItv);

  var trackPath = path.resolve(config.tracks[0]);
  
  play(trackPath, function(){
    console.log("Done");
    if(config.repeat) {
      // run it again
      // no harm in re-parsing the config to pick up change
      run();
    }
  });
}

function play(file, cb){
  // afplay is an osx utility for playing audio
  var args = [
    'afplay', '"'+file+'"'
  ];
  var proc = exec(args.join(' '), 
    function(error, stdout, stderr){
      if(error){
        console.log("Error returned from `afplay` exec call");
        throw error;
      } else {
        cb && cb();
      }
  });
}

if(require.main === module) {
  process.chdir(__dirname);
  run();
}
