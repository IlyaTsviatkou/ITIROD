class AuthView {
    constructor(headerId, mainId, labelId) {
        this._headerId = headerId;
        this._mainId = mainId;
        this._labelId = labelId;
    }

    displayHeader(logId, regId) {
        const header = document.getElementById(this._headerId);
        header.innerHTML = `<figure class="row-container">
                        <img src="img/logo.png" alt="logo"/>
                        <figcaption><h2 class="text_white">TrelloAlikeApp</h2></figcaption>
                    </figure>
                    <nav>
                        <button class="button" id="${logId}">Login</button>
                        <button class="button" id="${regId}">Register</button>
                    </nav>`
    }

    displayMain(mode, formId) {
        const main = document.getElementById(this._mainId);
        main.innerHTML = `<h2 id="${this._labelId}" class="text_blue">${mode==='reg'?'Register':'Login'}</h2>
                    <form id = "${formId}" class="auth-form" action="../boards/boards.html">
                        <label class="text_blue auth-form__field">
                            Login\n
                            <input class="text-field" name="login" type="text" id="login" placeholder="Login">
                        </label>
                        <label class="text_blue auth-form__field">
                            Password
                            <input class="text-field" name="password" type="password" id="password"  placeholder="Password">
                        </label>

            ${mode==='reg'?'<label class="text_blue auth-form__field">' +
            '            Repeat password \n' +
            '            <input class="text-field" name="repeat" placeholder="Repeat password"  id="repeat-password" type="password">\n' +
            '        </label>':''}
                        <button class="button_green" type="submit" disabled>Submit</button>
                    </form>`;
    }

    displayError() {
        const label = document.getElementById(this._labelId);
        label.innerText = 'Incorrect Login or Password';
    }
}
