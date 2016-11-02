// Saves options to chrome.storage.sync.
function save_options() {
  var stufenServerDE = document.getElementById('stufenServerDE').value;
  var stufenClassicDE = document.getElementById('stufenClassicDE').value;
  chrome.storage.local.set({
    stufenServerDE: stufenServerDE,
    stufenClassicDE: stufenClassicDE
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.local.get({
    stufenServerDE: '',
    stufenClassicDE: ''
  }, function(items) {
    document.getElementById('stufenServerDE').value = items.stufenServerDE;
    document.getElementById('stufenClassicDE').value = items.stufenClassicDE;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);
