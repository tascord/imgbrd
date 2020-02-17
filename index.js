const express = require('express');
const fs = require('fs');

// ----------------------------------------------------------------------

const app = express();

app.listen(6969, () => { console.log("Started!"); })

// ----------------------------------------------------------------------

app.set("view-engine", "ejs");

app.use(express.static('pages'));
app.use(express.static('pages/users'));

app.use(express.static('public/css'))
app.use(express.static('public/audio'))

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

        default:
            res.render(page('404'));
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
