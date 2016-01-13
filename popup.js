var api = '';
chrome.storage.sync.get("apikey", function (obj) {
  if (obj.apikey!=null) {
    api = obj.apikey;
    document.getElementById("input").value = api;
  } else {
    document.getElementById("input").value = 'Введите свой API key';
  }
  getData();
});

function clickHandler(e) {
  var input = document.getElementById("input").value;
  chrome.storage.sync.set({"apikey": input});
  location.reload();
  
}

document.addEventListener( "DOMContentLoaded" , function () {
  document.getElementById("btn_submit").addEventListener( "click" , clickHandler);
});

function getData() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "https://kano.is/index.php?k=api&username=billsmith&api=" + api + "&json=y&work=y", true); // тут происходит ГЕТ запрос на указанную страницу
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) // если всё прошло хорошо, выполняем, что в скобках
    {
      
      var json = xhr.responseText;                         // Response
      json = json.replace(/^[^(]*\(([\S\s]+)\);?$/, '$1'); // Turn JSONP in JSON
      json = JSON.parse(json);
      
      var rows = json['rows'];
      
      var name = '';
      var rate5min = '';
      var rate1h = '';
      var html = 'API key: ' + api + '<p>';
      
      for (var i = 0; i < rows; i++) {
        name = json['workername:' + i];
        rate5min = Math.round(json['w_hashrate5m:' + i] / 1000000000);
        rate1h = Math.round(json['w_hashrate1hr:' + i] / 1000000000);
        
        html += '<b>' + name + '</b></br>' +
                '5min: <b>' + rate5min + "</b></br>1hour: <b>" + rate1h + '</b><p>';
        
      }
  
      
      var dannie = document.getElementById('dannie');
      dannie.style.width="220px";
      dannie.innerHTML = html; // добавляем в блок с id=dannie  полученный код
  
    }
  }
  xhr.send();
}
