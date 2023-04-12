// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

function makeRed() {
  document.body.style.backgroundColor = "red";
}

// Called when the user clicks on the browser action.
chrome.action.onClicked.addListener(function (tab) {  
  // No tabs or host permissions needed!
  console.log("Turning " + tab.url + " red!");
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: makeRed,
  });
});
