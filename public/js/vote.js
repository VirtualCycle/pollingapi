window.onload = function() {
    fetchCards()
        // makeButtonsClickable()
}

function fetchCards() {
    var xhr = new XMLHttpRequest()
    xhr.open('GET', '/api/getpoll', true)
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var input = JSON.parse(xhr.responseText)
            var inp = input.map(function(x) {
                var ind = x.indexOf(':')
                return x.slice(ind + 1)
            })
            inp.sort()
            for (var i = 0; i < inp.length; i++) {
                createCard(inp[i])
            }
        }
    }
    xhr.send()
}

function createCard(pollId) {
    var xhr = new XMLHttpRequest()
    xhr.open('GET', '/api/getquestion/' + pollId, true)
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var input = JSON.parse(xhr.responseText)
            var question = input.question
            var container = document.getElementById('votecards')
            var html = ''
            html += '<div class="col s6">'
            html += '<div class="card teal darken-1">'
            html += '<div class="card-content white-text">'
            html += '<span class="card-title">' + question + '</span>'
            html += '</div>'
            html += '<div class="card-action">'
            html += '<div id="vote-button" class="col">'
            html += '<a class="waves-effect waves-light btn modal-trigger" href="#modal" onClick = "getData(' + pollId + ')">Vote</a>'
            html += '</div>	</div> </div> </div>'
            container.insertAdjacentHTML('beforeend', html)
        }
        $('.modal-trigger').leanModal()
    }
    xhr.send()
}

function getData(pollId) {
    var xhr = new XMLHttpRequest()
    xhr.open('GET', '/api/polloptions/' + pollId, true)
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var response = JSON.parse(xhr.responseText)
            var question = response.question
            var options = response.options
            var list = []
            for (let key in options) {
                if (key !== 'pollId' && key !== 'pollCount') {
                    list.push(key)
                }
            }
            var count = 1
            var html = ''
            html += '<div class="flow-text">' + question + '</div>'
            html += '<form id="modal-form" action="/api/vote/' + pollId + '" enctype="multipart/form-data" method="post">'
            list.forEach(element => {
                if (count === 1) {
                    html += '<div class="flow-text"><input class="with-gap" name="option" type="radio" id="option' + count + '" value="' + element + '" checked/><label for="option' + count + '">' + element + '</label></div>'
                } else {
                    html += '<div class="flow-text"><input class="with-gap" name="option" type="radio" id="option' + count + '" value="' + element + '"  /><label for="option' + count + '">' + element + '</label></div>'
                }
                count++
            })
            html += '</form>'
            html += '<br/><div id="modal-submit"><a class="waves-effect waves-light btn">Submit</a></div>'
            document.getElementById('modal-content').innerHTML = html
            makeButtonsClickable(pollId)
        }
    }
    xhr.send()
}

function makeButtonsClickable(pollId) {
    var button = document.getElementById('modal-submit')
    button.addEventListener('click', function() {
        var obj = {}
        var options = document.getElementById('modal-form').childNodes
        for (var i = 0; i < options.length; i++) {
            if (options[i].firstChild.checked) {
                obj['option'] = options[i].firstChild.value
            }
        }
        if (obj.hasOwnProperty('option')) {
            $('#modal').closeModal()
            vote(obj, pollId)
        }
    })
}

function vote(option, pollId) {
    console.log(option)
    var xhr = new XMLHttpRequest()
    xhr.open('POST', `/api/vote/${pollId}`, true)
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            response = xhr.responseText
            if (response == 1) {
                console.log(response)
            } else {
                Materialize.toast('You have already voted on this poll', 5000, 'rounded')
            }
        }
    }
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.send(JSON.stringify(option))
}
