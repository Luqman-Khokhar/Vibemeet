// Isolated-world script: MAIN world has no chrome.runtime, so hand it the extension base URL.
document.documentElement.dataset.vibemeetBase = chrome.runtime.getURL('');
