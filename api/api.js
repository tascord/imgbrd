const fs = require('fs');
var posts = JSON.parse(fs.readFileSync('./api/posts.json'));

// ----------------------------------------------------------------------

class Post {

    localPath = '';
    captionText = '';
    authorName = '';
    id = '';

    constructor(imageID, imageExtention, captionText, authorName) {
        this.localPath = `/public/images/${imageID}.${imageExtention}`;
        this.captionText = captionText
        this.authorName = authorName
        this.id = imageID;
    }

}

// ----------------------------------------------------------------------

function getPostByid(id) {

}

function submitPost(imageID, imageExtention, captionText, authorName) {
    posts.push(new Post(imageID, imageExtention, captionText, authorName));
    updatePosts();
}

function getPosts() {
    return posts;
}

// ----------------------------------------------------------------------

function updatePosts() {
    fs.writeFileSync('./api/posts.json', JSON.stringify(posts, null, 4));
}

// ----------------------------------------------------------------------

module.exports.submitPost = submitPost;
module.exports.getPosts = getPosts;