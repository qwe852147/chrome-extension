const domainInput = document.getElementById("domainInput");
const queryBtn = document.getElementById("query");
const cookiesTable = document.getElementById("cookies");

(async function initCookieValue() {
    domainInput.focus();
    // var cookies = await queryCookies();
    // await createCookieFiels(cookies);

    queryBtn.addEventListener('click', async (_event) => {
        await queryCookies(domainInput.value)
        await createCookieFiels(cookies);
    });
})();

async function queryCookies(domain) {
    return await chrome.cookies.getAll({
        domain
    });
}

async function createCookieFiels(cookies) {
    const cookiesTableBody = document.querySelector(".cookies-body");
    if (cookiesTableBody) {
        cookiesTable.removeChild(cookiesTableBody);
    }

    if (cookies == null) {
        cookies = [];
    }

    const newTbody = document.createElement("tbody");
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

        const sameSiteTd = document.createElement("td");
        sameSiteTd.name = "sameSite";
        sameSiteTd.innerText = cookie.sameSite;
        sameSiteTd.classList.add("td-sameSite");

        newTr.appendChild(nameTd);
        newTr.appendChild(valueTd);
        newTr.appendChild(pathTd);
        newTr.appendChild(expiresTd);
        newTr.appendChild(sameSiteTd);
        newTbody.appendChild(newTr);
    });
    cookiesTable.appendChild(newTbody);
}
