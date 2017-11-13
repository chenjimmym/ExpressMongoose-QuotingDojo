var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
var path = require('path');
app.use(express.static(path.join(__dirname, './static')));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/quote_db');
mongoose.Promise = global.Promise;
var quoteSchema = new mongoose.Schema({
    name: String,
    quote: String
}, {
    timestamps: true
});

var Quote = mongoose.model('Quote', quoteSchema);

app.get('/', function(request, response){
    response.render('index')
})

app.get('/quotes', function(request, response){
    Quote.find({}, function(error, quotes){
        console.log(quotes);
        response.render('quotes', {key: quotes})
    })
})

app.post('/quotes', function(request, response){
    console.log('@@@@@@', request.body);
    var quote = new Quote({name: request.body.name, quote: request.body.quote});
    quote.save(function(error){
        if (error){
            console.log('there is error');
        } else {
            console.log('successfully added');
            response.redirect('/quotes');
        }
    })
})

app.listen(8000,function(){
    console.log('listenning port 8000');
});