const express = require('express');
const path = require("path");
const fs = require("fs");

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.use("/gwf/file/", express.static(__dirname + "/gwf"));

// home
app.get('/static/scg.js', function(req, res) {
    res.sendFile(path.join(__dirname, '../build/scg.js'));
});

app.get('/static/test.css', function(req, res) {
    res.sendFile(path.join(__dirname, 'test.css'));
});

app.get('/static/test.js', function(req, res) {
    res.sendFile(path.join(__dirname, 'test.js'));
});

app.get('/', function(req, res) {
    res.render('index');
});

function get_gwf_files(p) {
    var files = [];
    var gwf_path = path.join(__dirname, 'gwf');
    if (p) {
        gwf_path = path.join(gwf_path, p);
    }

    fs.readdirSync(gwf_path).forEach(f => {
        stat = fs.statSync(path.join(gwf_path, f))
        if (stat.isFile()) {
            files.push(f);
        }
    });
    return files;
}

app.get('/gwf/list', function(req, res) {
    var files = get_gwf_files(null);
    res.writeHead(200, {"Content-Type": "application/json"});
    res.end(JSON.stringify(files));
});

app.get('/gwf/list/:path', function(req, res) {
    var files = get_gwf_files(req.params.path);
    res.writeHead(200, {"Content-Type": "application/json"});
    res.end(JSON.stringify(files));
});

// app.get('/gwf/file/:filename', function(req, res) {
//     var filename = req.params.filename;
//     res.sendFile(path.join(__dirname, 'gwf/' + filename));
// });

app.get('/test/list', function(req, res) {
    var files = [];
    fs.readdirSync(path.join(__dirname, 'containers')).forEach(f => {
        files.push(f.replace('.js', ''));
    });
    res.writeHead(200, {"Content-Type": "text/javascript"});
    res.end(JSON.stringify(files));
});

app.get('/test/:testname', function(req, res) {
    res.render('test', {
        'test_name': req.params.testname
    });
});

app.get('/test/get/:testname', function(req, res) {
    var testname = req.params.testname;
    res.sendFile(path.join(__dirname, 'containers/' + testname + ".js"));
});

// run server
app.listen(8005, function () {
    console.log('Test app listening on port 8005!');
});