import IncrementalDOM from 'incremental-dom';

window.elementOpen = IncrementalDOM.elementOpen;
window.elementClose = IncrementalDOM.elementClose;
window.text = IncrementalDOM.text;

IncrementalDOM.patch(document.body, function () {
  <h1>suchwow</h1>
});
