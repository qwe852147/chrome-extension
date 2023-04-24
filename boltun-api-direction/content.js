chrome.storage.local.get(["localStorageKey", "localSetId"])
    .then((result) => {

        localSetId = result.localSetId;
        records = result.localStorageKey ?? [];

        if (localSetId) {
            const record = records.find(r => r.id == localSetId);            
            if (record) {
                setLocalStorageValue(record.value);
            } else {
                removeLocalStorageValue();
            }
        } else {
            removeLocalStorageValue();
        }
    })
    .catch((err) => { });


function setLocalStorageValue(v) {
    localStorage.setItem("debug_api_host", v);
}

function removeLocalStorageValue() {
    localStorage.removeItem("debug_api_host");
}
