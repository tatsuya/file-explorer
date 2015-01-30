var fs = require('fs');
var path = require('path');

var stdin = process.stdin;
var stdout = process.stdout;

fs.readdir(__dirname, function(err, files) {
  console.log('');

  if (!files.length) {
    return console.log('    \033[31m No files to show!\033[39m\n');
  }

  console.log('   Select which file or directory you want to see\n');

  // called for each file walked in the directory
  var stats = {};

  function file(i) {
    var filename = files[i];

    fs.stat(path.join(__dirname, filename), function(err, stat) {
      stats[i] = stat;

      if (stat.isDirectory()) {
        console.log('     '+i+'   \033[36m' + filename + '/\033[39m');
      } else {
        console.log('     '+i+'   \033[90m' + filename + '\033[39m');
      }

      if (++i == files.length) {
        read();
      } else {
        file(i);
      }
    });
  }

  /**
   * Read user input when files are shown
   */
  function read() {
    console.log('');
    stdout.write('   \033[33mEnter your choice: \033[39m');

    stdin.resume();
    stdin.setEncoding('utf8');
    stdin.on('data', option);
  }

  /**
   * Called with the option supplied by the user
   */
  function option(data) {
    var n = Number(data);
    var filename = files[n];
    if (!filename) {
      stdout.write('   \033[31mEnter your choice: \033[39m');
    } else {
      stdin.pause();

      if (stats[n].isDirectory()) {
        fs.readdir(path.join(__dirname, filename), function(err, files) {
          console.log('');
          console.log('   (' + files.length + ' files)');
          files.forEach(function (file) {
            console.log('     -   ' + file);
          });
          console.log('');
        });
      } else {
        fs.readFile(path.join(__dirname, filename), 'utf8', function(err, data) {
          console.log('');
          console.log('\033[90m' + data.replace(/(.*)/g, '     $1') + '\033[39m');
        });
      }
    }
  }

  file(0);
});
