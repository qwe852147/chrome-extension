// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

function makeCorlor() {
  document.body.style.backgroundColor = `#${Math.floor(Math.random()*16777215).toString(16)}`;
}


chrome.permissions.contains({
  permissions: ['scripting']
}).then((result) => {
  if (!result) {
    chrome.action.setPopup({
      popup: "popup.html"
    });
  }
});


// Called when the user clicks on the browser action.
chrome.action.onClicked.addListener(function (tab) {
  chrome.scripting.executeScript({
    target: {
      tabId: tab.id
    },
    func: makeCorlor,
  });
});
