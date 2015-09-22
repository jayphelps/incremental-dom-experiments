import IncrementalDOM from 'incremental-dom';

window.elementOpen = IncrementalDOM.elementOpen;
window.elementClose = IncrementalDOM.elementClose;
window.text = IncrementalDOM.text;

IncrementalDOM.patch(document.body, function () {
  return <h1>suchwow</h1>
});

window.onclick = function () {
  IncrementalDOM.patch(document.body, function () {
    return <h1>pink power ranger</h1>
  });
};