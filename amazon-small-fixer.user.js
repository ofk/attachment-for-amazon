// ==UserScript==
// @name      Amazon Small Fixer
// @namespace http://0fk.org/
// @include   http://www.amazon.co.jp/*
// @run-at    document-end
// ==/UserScript==

(function (document) {
  var asinNode = document.querySelector('#ASIN,input[name="ASIN.0"]');
  if (!asinNode) return;
  var asin = asinNode.value;
  if (!asinNode.value) return;

  history.replaceState('', '', '/dp/' + asin + '?tag=ofk00-22');

  var hrNode = document.querySelector('#centerCol>hr');
  if (!hrNode) {
    console.error('[amazon-small-fixer] hrNode not found.');
    return;
  }

  var divNode = document.createElement('div');
  divNode.innerHTML =
    '<a href="http://bookmeter.com/b/' + asin + '">bookmater</a> ' +
    '<a href="https://calil.jp/book/' + asin + '">calil</a>';
  hrNode.parentNode.insertBefore(divNode, hrNode.nextSibling);
}(document));
