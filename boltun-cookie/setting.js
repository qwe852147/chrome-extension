const domainInput = document.getElementById("domainInput");
const queryBtn = document.getElementById("query");
const cookiesTable = document.getElementById("cookies");

let saveBtns = [];
let secures = [];
let sameSites = [];

(async function initCookieValue() {
    queryBtn.addEventListener('click', async (_event) => {
        var cookies = await queryCookies(domainInput.value)
        await createCookieFiels(cookies);
    });
    queryBtn.click();
    domainInput.focus();
})();

async function queryCookies(domain) {
    if (domain == '') {
        domain = undefined;
    }
    return await chrome.cookies.getAll({
        domain
    });
}

async function createCookieFiels(cookies) {
    const cookiesTableBody = document.querySelector(".cookies-body");
    if (cookiesTableBody) {
        cookiesTableBody.innerHTML = '';
    }

    if (cookies == null) {
        cookies = [];
    }

    const newTbody = cookiesTableBody;
    cookies.forEach((cookie) => {
        const newTr = document.createElement("tr");

        const nameTd = document.createElement("td");
        nameTd.name = "name";
        nameTd.innerText = cookie.name;
        nameTd.classList.add("td-name");

        const valueTd = document.createElement("td");
        valueTd.name = "value";
        valueTd.innerText = cookie.value;
        valueTd.classList.add("td-value");

        const domainTd = document.createElement("td");
        domainTd.name = "domain";
        domainTd.innerText = cookie.domain;
        domainTd.classList.add("td-domain");

        const pathTd = document.createElement("td");
        pathTd.name = "path";
        pathTd.innerText = cookie.path;
        pathTd.classList.add("td-path");

        const expiresTd = document.createElement("td");
        expiresTd.name = " expires";
        expiresTd.innerText = cookie?.expirationDate ?
            new Date(cookie.expirationDate).toISOString() :
            "";
        expiresTd.classList.add("td-expirationDate");

        newTr.appendChild(nameTd);
        newTr.appendChild(valueTd);
        newTr.appendChild(domainTd);
        newTr.appendChild(pathTd);
        newTr.appendChild(expiresTd);
        createAndListen(cookie, newTr)

        newTbody.appendChild(newTr);
    });
    cookiesTable.appendChild(newTbody);
}

function createAndListen(cookie, newTr) {
    const secureCheckbox = document.createElement('input');
    secureCheckbox.type = "checkbox";
    secureCheckbox.name = "secure-checkbox";
    secureCheckbox.checked = cookie.secure;

    const secureTd = document.createElement("td");
    secureTd.name = "secure";
    secureTd.classList.add("td-secure");
    secureTd.appendChild(secureCheckbox);

    const sameSiteSelect = document.createElement('select');
    sameSiteSelect.value = cookie.sameSite;

    const laxOptions = document.createElement('option');
    laxOptions.value = 'lax';
    laxOptions.text = 'Lax';
    laxOptions.selected = cookie.sameSite == '' || cookie.sameSite == 'lax';
    const strictOptions = document.createElement('option');
    strictOptions.value = 'strict';
    strictOptions.text = 'Strict';
    strictOptions.selected = cookie.sameSite == 'strict';
    const noneOptions = document.createElement('option');
    noneOptions.value = 'no_restriction';
    noneOptions.text = 'None';
    noneOptions.selected = cookie.sameSite == 'no_restriction';
    sameSiteSelect.appendChild(laxOptions);
    sameSiteSelect.appendChild(strictOptions);
    sameSiteSelect.appendChild(noneOptions);

    const sameSiteTd = document.createElement("td");
    sameSiteTd.name = "sameSite";
    sameSiteTd.appendChild(sameSiteSelect);
    sameSiteTd.classList.add("td-sameSite");

    const saveButton = document.createElement('button');
    saveButton.innerText = "儲存";
    saveButton.classList = "btn btn-primary hidden";
    const saveButtonTd = document.createElement("td");
    saveButtonTd.name = "saveButton";
    saveButtonTd.style.width = '100px';
    saveButtonTd.appendChild(saveButton)
    saveButtonTd.classList.add("td-save-button");

    const deleteButton = document.createElement('button');
    deleteButton.innerText = "刪除";
    deleteButton.classList = "btn btn-danger";
    const deleteButtonTd = document.createElement("td");
    deleteButtonTd.name = "deleteButton";
    deleteButtonTd.style.width = '100px';
    deleteButtonTd.appendChild(deleteButton)
    deleteButtonTd.classList.add("td-delete-button");

    newTr.appendChild(secureTd);
    newTr.appendChild(sameSiteTd);
    newTr.appendChild(saveButtonTd);
    newTr.appendChild(deleteButtonTd);

    secureCheckbox.onchange = (e) => cookieEdited(saveButton);
    sameSiteSelect.onchange = (e) => cookieEdited(saveButton);
    saveButton.onclick = () => saveBtnClick(secureCheckbox, sameSiteSelect, cookie);

    deleteButton.onclick = () => removeCookie(cookie);
}

function cookieEdited(saveButton) {
    saveButton.classList.remove('hidden');
}

function getCookieUrl(cookie) {
    const protocol = cookie.secure ? 'https:' : 'http:';
    return `${protocol}//${cookie.domain}${cookie.path}`;
}

function removeCookie(cookie) {
    chrome.cookies.remove({
        name: cookie.name,
        storeId: cookie.storeId,
        url: getCookieUrl(cookie)
    }, () => queryBtn.click())
}

function saveBtnClick(secureCheckbox, sameSiteSelect, cookie) {
    cookie.sameSite = sameSiteSelect.value;
    cookie.secure = secureCheckbox.checked;
    const cookieUrl = getCookieUrl(cookie);
    const domain = cookie.domain;
    console.log(cookie, domain, cookieUrl)
    chrome.cookies.set({
        domain: domain,
        expirationDate: cookie.expirationDate,
        httpOnly: cookie.httpOnly,
        name: cookie.name,
        path: cookie.path,
        sameSite: cookie.sameSite,
        secure: cookie.secure,
        storeId: cookie.storeId,
        value: cookie.value,
        url: cookieUrl
    }, () => queryBtn.click());
}
