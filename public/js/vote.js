window.onload = function () {
  fetchCards()
}

function fetchCards () {
  var xhr = new XMLHttpRequest()
  xhr.open('GET', '/api/getpoll', true)
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      var input = JSON.parse(xhr.responseText)
      var inp = input.map(function (x) {
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

function createCard (pollId) {
  var xhr = new XMLHttpRequest()
  xhr.open('GET', '/api/getquestion/' + pollId, true)
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      var input = JSON.parse(xhr.responseText)
      var question = input.question
      var container = document.getElementById('votecards')
      var html = ''
      html += '<div class="col s6">'
      html += '<div class="card teal darken-1">'
      html += '<div class="card-content white-text">'
      html += '<span class="card-title">' + question + '</span>'
      // html += '<p>dlfljadslfjalsjdfljaljdfljaldfjlajdflkjasldjflajk</p>'
      html += '</div>'
      html += '<div class="card-action">'
      html += '<a href="#">Click here to participate</a>'
      html += '</div>	</div>	</div>'
      container.insertAdjacentHTML('beforeend', html)
    }
  }
  xhr.send()
}
