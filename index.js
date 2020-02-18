const bodyParser = require('body-parser');
const multiparty = require('multiparty');
const express = require('express');
const fs = require('fs');

const imgbrd = require('./api/api');

// ----------------------------------------------------------------------

const app = express();

app.listen(6969, () => { console.log("Started!"); })

// ----------------------------------------------------------------------

app.use(bodyParser.raw());

app.set("view-engine", "ejs");

app.use(express.static('pages'));
app.use(express.static('pages/users'));

app.use(express.static('public/css'))
app.use(express.static('public/audio'))

// ----------------------------------------------------------------------

var fileId = newCode();

// ----------------------------------------------------------------------

app.get('*', (req, res) => {

    if(req.path.startsWith('/public/')) {

        console.log(`\nNew Request For File! (${req.path.slice(8)})`);

        if(fs.existsSync(`./public/${req.path.slice(8)}`)) {
            return res.sendFile(file(req.path.slice(8)));
        } else {
            return res.sendFile(file('404'));
        }
    }

    console.log(`\nNew Request For Page! (${req.path == '/' ? 'Home Page' : req.path.slice(1)})`);

    switch(req.path) {

        case "/":
            res.render(page('index'));
        break;

        case "/board":
            res.render(page('board'));
        break;

        case "/api/posts":
            res.send(imgbrd.getPosts());
        break;    

        default:
            res.render(page('404'));
        break;

    }

});

app.post('*', (req, res) => {

    if(!req.path.startsWith('/api/')) return res.sendFile(__dirname + '/public/404');
    var path = req.path.toLowerCase().slice(4);

    console.log(`\nNew API Request: ${path}`);

    switch(path) {

        case "/upload":

        var form = new multiparty.Form();

            form.parse(req, function(err, fields, files) {

                if(!fields || !files) return res.redirect('/board?e=Missing Fields Or Files')

                if(!fields.caption) return res.redirect('/board?e=No Caption Provided');
                if(!fields.caption[0]) return res.redirect('/board?e=No Caption Provided');
                if(fields.caption[0].length < 3 || fields.caption[0].length > 250) return res.redirect('/board?e=Caption Too Long Or Too Short');

                if(!files.image) return res.redirect('/board?e=No Image Provided');
                if(!files.image[0]) return res.redirect('/board?e=No Image Provided');

                var _fileId = fileId;

                fs.copyFileSync(files.image[0].path, `./public/images/${_fileId}.${files.image[0].headers['content-type'].split('/')[1]}`);
                imgbrd.submitPost(_fileId, files.image[0].headers['content-type'].split('/')[1], fields.caption[0], 'Anon');

                return res.redirect('/board');

            });

        break;

        case "/posts":
            res.send(imgbrd.getPosts());
        break;

        default:
            res.sendFile(__dirname + '/public/404');
        break;

    }

});

// ----------------------------------------------------------------------

function page(pageName) {
    return `${__dirname}/pages/${pageName}.ejs`;
}

function file(fileName) {
    return `${__dirname}/public/${fileName}`;
}

function newCode() {
    
    var posts = imgbrd.getPosts();

    var alphabet = "1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM-_";

    var codeUsed = true;

    while(codeUsed) {

        var code = "";

        for(var i = 0; i < 15; i++) {
            code += alphabet[Math.floor(Math.random() * Math.floor(alphabet.length))];
        }

        // Is Code Used?

        for(var i in posts) {
            if(posts[i].id == code) codeUsed = true;
        }

        codeUsed = false;

    }

    return code;

}