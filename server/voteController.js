const redis = require('redis')
const bodyparser = require('body-parser')
const formidable = require('formidable')
var client = redis.createClient({ port: 6379, host: '127.0.0.1', db: 1 })

module.exports = function(app) {
    app.post('/api/vote/:option', function(req, res) {
        var ip = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress
        var option = req.params.option
        var form = new formidable.IncomingForm()
        form.parse(req, function(err, fields) {
                console.log(fields)
            })
            // var data = option.split('+')
        var arr = []
        console.log(option)
            // console.log(req.body)
            // client.hset('ip', ip, 1, function(err, reply) {
            //     arr.push(reply)
            //     if (reply) {
            //         client.hget('pollOptions:' + data[0], data[1], function(err, reply) {
            //             var votes = parseInt(reply) + 1
            //             client.hset('pollOptions:' + data[0], data[1], votes, function(err, reply) {
            //                 console.log(reply)
            //             })
            //             client.hget('pollOptions:' + data[0], 'pollCount', function(err, reply) {
            //                 var count = parseInt(reply) + 1
            //                 client.hset('pollOptions:' + data[0], 'pollCount', count, function(err, reply) {
            //                     console.log(reply)
            //                 })
            //             })
            //         })
            //     }
        res.send(arr)
            // })
    })
}
