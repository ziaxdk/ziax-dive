var express = require('express'),
    app = express(),
    port = process.env.PORT || 3000;

/**
 * Enables the BrowserSync
 * When enables use http://localhost:3001 instead.
 * @return {void} none
 */
var enableBrowserSync = function() {
  var bs = require('browser-sync');
  bs({ open: false, proxy: 'localhost:' + port }, function() { console.log('bs ready...'); });
};

if (app.get('env') == 'development') {
  console.log('configure development');
  // enableBrowserSync();
}


app.get('/api/test', function(req, res) {
  var data = [];
  for (var i = 10 - 1; i >= 0; i--) {
    data.push({id: i, title: 'title' + i, date: new Date()});
  }
  res.send(data);
});

app.use(express.static(__dirname + '/src'));
app.listen(port, function() { console.log('ready on port ', port); });
