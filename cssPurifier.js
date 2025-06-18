const purify = require('purify-css');

const content = ['index.html'];
const css = ['styles.css'];

const options = {
    output: 'porsiaacaso.css',
    minify: true,
    info: true
};

purify(content, css, options, function (purifiedAndMinifiedResult){
  if (process.env.NODE_ENV !== 'production') {
        console.log(purifiedAndMinifiedResult);
    }
});