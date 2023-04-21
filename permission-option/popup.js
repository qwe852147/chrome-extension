(function () {
    const button = document.querySelector('button');
    button.addEventListener('click', async (_event) => {

        // Use the isEnabled method to read the action's current state.
        chrome.permissions.request({
                permissions: ['scripting']
            })
            .then(async (granted) => {
                if (granted) {
                    button.disabled = true;
                    button.innerText = '取得權限成功';
                    await chrome.action.setPopup({
                        popup: ""
                    });

                } else {
                    button.innerText = '取得權限失敗';
                }
            });
    });
})();
