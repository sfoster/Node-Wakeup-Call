var fs = require('fs'), 
  path = require('path');
  exec = require('child_process').exec;
  require('date-utils');

var status = function(wakeup){
  now = new Date;
  var h = now.getHoursBetween(wakeup), 
    m = now.getMinutesBetween(wakeup) % 60;
  console.log("you have %s hrs, %s mins remaining", h, m);
  // 
};
var parseTime = function(str, day) {
  var m = str.toLowerCase().match(/\s*(\d{1,2}):(\d{1,2})\s*([AP]M)?/i);
  var h = parseInt(m[1]), 
    m = parseInt(m[2]),
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
}

fs.readFile("./config.json", function(err, data){
  data = JSON.parse(data);
  console.log("tracks: ", data.tracks);
  
  var now = new Date, 
    wakeup = parseTime(data.wakeup);

  console.log("wakeup tentatively set for: ", wakeup.toFormat("YYYY/MM/DD HH24:MI"));
  
  if(now > wakeup) {
    // its the morning already, set it for tommorow instead
    wakeup = parseTime(data.wakeup, Date.tomorrow());
    console.log("setting alarm for tommorow: ", wakeup.toFormat("YYYY/MM/DD HH24:MI"));
  }
  var delay = wakeup - now;
  console.log("wakeup set for: ", wakeup.toFormat("YYYY/MM/DD HH24:MI"));
  status(wakeup);

  var statusItv;
  if(delay > 0){
    statusItv = setInterval(function(){
      status(wakeup);
    }, 1000 * 60 * 30);
    
    setTimeout(function(){
      play(data.tracks[0], function(){
        console.log("Done");
        clearInterval(statusItv);
      });
    }, delay);
  }
});

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
