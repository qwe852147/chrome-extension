const localStorageKey = "directApi";
const tbody = document.querySelector(".record-body");

const saveBtn = document.querySelector("#save");
const selectedBtn = document.querySelector("#selected");
const clearSelectedBtn = document.querySelector("#clearSelected");
const itemSelect = document.querySelector("#itemSelect");

const currentContainer = document.querySelector("#current");

let records = [];

saveBtn.addEventListener("click", () => {
  if (records == null) {
    records = [];
  }

  const storageValue = document.querySelector("#storageValue");
  const storageDescript = document.querySelector("#storageDescript");

  if (storageValue.value.trim() == "" || storageDescript.value.trim() == "") {
    return;
  }

  const newRecord = {
    value: storageValue.value,
    descript: storageDescript.value,
    id: new Date().getTime(),
  };

  records.push(newRecord);

  saveLocalRecords();
  createTr(tbody, newRecord);
  createOptions(itemSelect.value);

  storageValue.value = "";
  storageDescript.value = "";
});

selectedBtn.addEventListener("click", () => {
  const record = records.find((r) => r.id == itemSelect.value);

  chrome.storage.local.set({
    localSetId: record?.id,
  });

  if (record) {
    localStorage.setItem("testLocal", record.value);
    settingCurrentUse(record);
  } else {
    localStorage.removeItem("testLocal");
    settingCurrentUse();
  }
});

clearSelectedBtn.addEventListener("click", () => {
  chrome.storage.local.remove("localSetId");
  localStorage.removeItem("testLocal");
  createOptions();
});

queryLocalRecords();

function queryLocalRecords() {
  chrome.storage.local
    .get(["localStorageKey", "localSetId"])
    .then((result) => {
      console.log(result);
      records = result.localStorageKey ?? [];
      removeAllTableRow();
      createRecordTableRow();
      createOptions(result.localSetId);
    })
    .catch((err) => {});
}

function saveLocalRecords() {
  chrome.storage.local.set({
    localStorageKey: records,
  });
}

function removeAllTableRow() {
  tbody.innerHTML = "";
}

function createRecordTableRow() {
  if (records) {
    records.forEach((record) => {
      createTr(tbody, record);
    });
  }
}

function createTr(tbody, record) {
  const newTr = document.createElement("tr");
  const valueTd = document.createElement("td");
  valueTd.name = "value";
  valueTd.innerText = record.value;
  valueTd.classList.add("td-value");

  const descriptTd = document.createElement("td");
  descriptTd.name = "descript";
  descriptTd.innerText = record.descript;
  descriptTd.classList.add("td-descript");

  const btnTd = document.createElement("td");
  btnTd.style.width = "100px";
  const btn = document.createElement("button");
  btn.name = "clearBtn";
  btn.innerText = "刪除";
  btn.classList.add("clear-btn", "btn", "btn-danger", "rounded-pil");
  btn.addEventListener("click", () => {
    removeFromList(record);
    tbody.removeChild(newTr);
  });

  btnTd.appendChild(btn);
  newTr.appendChild(descriptTd);
  newTr.appendChild(valueTd);
  newTr.appendChild(btnTd);
  tbody.appendChild(newTr);
}

function removeFromList(record) {
  records = records.filter((r) => r.id != record.id);
  saveLocalRecords();
  createOptions(itemSelect.value);
}

function createOptions(selectedId) {
  itemSelect.innerHTML = "";
  itemSelect.value = undefined;

  let hasItem = null;

  records.forEach((r) => {
    const option = document.createElement("option");
    option.value = r.id.toString();
    option.innerText = r.descript;
    itemSelect.appendChild(option);
    if (!hasItem && selectedId == r.id) {
      hasItem = r;
    }
  });
  itemSelect.value = hasItem ? selectedId : undefined;
  if (hasItem) {
    itemSelect.value = selectedId;
    saveSetting(hasItem);
  } else {
    itemSelect.value = undefined;
    if (selectedId) {
      saveSetting();
    }
  }
}

function saveSetting(record) {
  chrome.storage.local.set({
    localSetId: record?.id,
  });

  if (record) {
    localStorage.setItem("testLocal", record.value);
    settingCurrentUse(record);
  } else {
    localStorage.removeItem("testLocal");
    settingCurrentUse();
  }
}

function settingCurrentUse(record) {
  currentContainer.innerText = record? `${record.descript}(${record.value})`:'';
}
