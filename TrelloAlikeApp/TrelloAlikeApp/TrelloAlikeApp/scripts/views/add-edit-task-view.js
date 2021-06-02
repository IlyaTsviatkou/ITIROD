class AddEditTaskView {
    constructor(mainId) {
        this._mainId = mainId;
    }

    displayMain(label, formId, cancelId) {
        const main = document.getElementById(this._mainId);
        main.innerHTML = `<h2 class="text_blue">${label}</h2>
        <form id="${formId}" class="task-form">
            <div class="row-container">
                <label class="vertical-field main-field text_blue">Color
                    <select name="color" class="text-field">
                        <option class="item_red text_white" value="red">Red</option>
                        <option class="item_orange text_white" value="orange">Orange</option>
                        <option class="item_yellow text_white" value="yellow">Yellow</option>
                        <option class="item_green text_white" value="green">Green</option>
                        <option class="item_cyan text_white" value="cyan">Cyan</option>
                        <option class="item_blue text_white" value="blue">Blue</option>
                        <option class="item_violet text_white" value="violet">Violet</option>
                    </select>
                </label>
                <label class="vertical-field main-field text_blue">Name
                    <input name="name" class="text-field">
                </label>
            </div>
            <label class="vertical-field main-field text_blue description">Description
                <textarea name="description" class="text-field"></textarea>
            </label>
            <label class="vertical-field main-field text_blue date-field">Date
                <input type="date" name="date" class="text-field">
            </label>
            <div class="row-container">
                <button id="${cancelId}" class="button button_blue">Cancel</button>
                <button type="submit" class="button button_green">Confirm</button>
            </div>
        </form>`;
    }
}
