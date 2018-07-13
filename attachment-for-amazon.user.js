// ==UserScript==
// @name      Attachment for Amazon
// @namespace http://0fk.org/
// @include   http://www.amazon.co.jp/*
// @include   https://www.amazon.co.jp/*
// @run-at    document-end
// ==/UserScript==

(function (chrome, document, history) {
  function attachLinks(links) {
    var hrNode = document.querySelector('#centerCol>hr');
    if (!hrNode) {
      console.error('[attachment-for-amazon] hrNode not found.');
      return;
    }

    var divNode = document.createElement('div');
    for (var i = 0, iz = links.length; i < iz; ++i) {
      if (i) divNode.appendChild(document.createTextNode(' '));
      var aNode = divNode.appendChild(document.createElement('a'));
      aNode.setAttribute('href', links[i].url);
      links[i].onClick && aNode.addEventListener('click', links[i].onClick);
      aNode.appendChild(document.createTextNode(links[i].label));
    }
    hrNode.parentNode.insertBefore(divNode, hrNode.nextSibling);
  }

  function copyText(str) {
    var copyNode = document.createElement('textarea');
    copyNode.value = str;
    document.body.appendChild(copyNode);
    copyNode.select();
    var ret = document.execCommand('copy');
    document.body.removeChild(copyNode);
    return ret;
  }

  chrome.runtime.sendMessage({
    action: 'tiny.options'
  }, (response) => {
    var options = response.options;

    var asinNode = document.querySelector('#ASIN,input[name="ASIN.0"]');
    if (!asinNode) return;
    var asin = asinNode.value;
    if (!asinNode.value) return;

    var links = [];
    var copyUrl = function (e) {
      e.preventDefault();
      var ret = copyText(location.protocol + '//' + location.host + options.rewrite_path.replace(/{asin}/g, asin));
      ret || alert('Fail to copy clean URL');
    };
    options.rewrite_path && links.push({ label: 'copy', url: '#', onClick: copyUrl });
    options.attach_bookmeter && links.push({ label: 'bookmeter', url: 'http://bookmeter.com/b/' + asin });
    options.attach_calil && links.push({ label: 'calil', url: 'https://calil.jp/book/' + asin });

    links.length && attachLinks(links);
  });
}(chrome, document, history));
