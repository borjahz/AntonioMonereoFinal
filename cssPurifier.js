const purify = require('purify-css');

const content = ['index.html'];
const css = ['styles.css'];

const options = {
    output: 'porsiaacaso.css',
    minify: true,
    info: true
};

purify(content, css, options, function (purifiedAndMinifiedResult){
    console.log(purifiedAndMinifiedResult);
});