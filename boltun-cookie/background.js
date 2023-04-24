// Copyright 2021 Google LLC
//
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

// Show the demo page once the extension is installed
chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.create({
    url: "setting.html"
  });
});
