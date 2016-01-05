// ==UserScript==
// @name      Hack Amazon
// @namespace http://0fk.org/
// @include   http://www.amazon.co.jp/*
// @run-at    document-end
// ==/UserScript==

(function (chrome, document, history) {
  function replaceURL(newURL) {
    history.replaceState('', '', newURL);
  }

  function attachLinks(links) {
    var hrNode = document.querySelector('#centerCol>hr');
    if (!hrNode) {
      console.error('[hack-amazon] hrNode not found.');
      return;
    }

    var divNode = document.createElement('div');
    for (var i = 0, iz = links.length; i < iz; ++i) {
      if (i) divNode.appendChild(document.createTextNode(' '));
      var aNode = divNode.appendChild(document.createElement('a'));
      aNode.setAttribute('href', links[i].url);
      aNode.appendChild(document.createTextNode(links[i].label));
    }
    hrNode.parentNode.insertBefore(divNode, hrNode.nextSibling);
  }

  chrome.runtime.sendMessage({
    action: 'tiny.options'
  }, (response) => {
    var options = response.options;

    var asinNode = document.querySelector('#ASIN,input[name="ASIN.0"]');
    if (!asinNode) return;
    var asin = asinNode.value;
    if (!asinNode.value) return;

    options.associate_id && replaceURL('/dp/' + asin + '?tag=' + options.associate_id);

    var links = [];
    options.attach_bookmeter && links.push({ label: 'bookmeter', url: 'http://bookmeter.com/b/' + asin });
    options.attach_calil && links.push({ label: 'calil', url: 'https://calil.jp/book/' + asin });
    links.length && attachLinks(links);
  });
}(chrome, document, history));
