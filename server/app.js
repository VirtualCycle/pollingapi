const express = require('express')
const redis = require('redis')
const path = require('path')
const bodyparser = require('body-parser')
const formidable = require('formidable')
var client = redis.createClient({ port: 6379, host: '127.0.0.1', db: 1 })

const app = express()
app.use(express.static(path.resolve('.') + '/public'))
app.use(bodyparser.json())
app.use(bodyparser.urlencoded())

app.get('/', function(req, res) {
    res.sendFile(path.resolve('.') + '/public/index.html')
})
app.get('/create', function(req, res) {
    res.sendFile(path.resolve('.') + '/public/create.html')
})
app.get('/vote', function(req, res) {
    res.sendFile(path.resolve('.') + '/public/vote.html')
})
app.post('/api/poll', function(req, res) {
    var form = new formidable.IncomingForm()
    form.parse(req, function(err, fields) {
        console.log(fields)
    })

    // var question = req.body.question
    // var pollOptions = req.body.pollOptions
    // client.incr('pollId')
    // client.get('pollId', function(err, reply) {
    //     var pollId = parseInt(reply)
    //     set(pollId, question, pollOptions)
    // })

    res.sendStatus(201)
})

function set(pollId, question, pollOptions) {
    client.hset('poll:' + pollId, 'question', question, function(err, reply) {
        console.log('set ' + reply)
    })
    client.hset('poll:' + pollId, 'pollId', pollId, function(err, reply) {
        console.log('set ' + reply)
    })
    pollOptions.forEach(element => {
        client.hset('pollOptions:' + pollId, element, 0, function(err, reply) {
            console.log('set ' + reply)
        })
    })
    client.hset('pollOptions:' + pollId, 'pollId', pollId, function(err, reply) {
        console.log('set ' + reply)
    })
}
app.get('/api/poll/:id', function(req, res) {
    var pollId = req.params.id
    client.hgetall('poll:' + pollId, function(err, reply) {
        res.send(reply)
    })
})
app.get('/api/pollOptions/:id', function(req, res) {
    var pollId = req.params.id
    client.hgetall('pollOptions:' + pollId, function(err, reply) {
        res.send(reply)
    })
})
app.post('/api/poll/vote/:option', function(req, res) {
    var option = req.params.option
    var data = option.split('+')
    client.hget('pollOptions:' + data[0], data[1], function(err, reply) {
        var votes = parseInt(reply) + 1
        client.hset('pollOptions:' + data[0], data[1], votes, function(err, reply) {
            console.log(reply)
        })
        res.sendStatus(201)
    })
})
const port = 3000
app.listen(port, () => {
    console.log('Running on port ' + port)
})
