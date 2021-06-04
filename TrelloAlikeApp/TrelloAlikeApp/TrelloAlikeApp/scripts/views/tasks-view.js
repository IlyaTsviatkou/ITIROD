class TasksView {
    constructor(mainId, listId) {
        this._mainId = mainId;
        this._listId = listId;
    }

    displayMain(boardName) {
        const main = document.getElementById(this._mainId);
        main.innerHTML = `<h2 class="text_blue">${boardName}</h2>
        <div id="${this._listId}" class="column-list"></div>`;
    }

    displayTasks(col) {
        const lst = document.getElementById(this._listId);
        while (lst.firstElementChild != null) {
            lst.removeChild(lst.firstElementChild);
        }
        for(let item of col) {
            const column = document.createElement('section');
            column.setAttribute('class', 'column-list__item');
            column.setAttribute('id', item.id);
            column.innerHTML = `
                <div id="${item.id}-title" class="row-container">
                    <h3 class="text_blue">${item.name}</h3>
                </div>
    
                <div id="${item.id}-L" class="task-list">
                    ${item.get_all().map((elem) => 
                        `<article id="${elem.id}" draggable="true" 
                        class="task-list__item text_white item_${elem.color}">
                            <h4>${elem.name}</h4>
                            <p>${elem.description}</p>
                            <div class="row-container">
                                <time>${elem.dateString}</time>
                                <button id="${elem.id}-D-${item.id}" 
                                class="icon-button icon-button_white icon-button_shifted" title="Delete">
                                    <i class="fa fa-trash" aria-hidden="true"></i>
                                </button>
                                <button id="${elem.id}-E-${item.id}" 
                                class="icon-button icon-button_white" title="Edit">
                                    <i class="fa fa-pencil" aria-hidden="true"></i>
                                </button>
                            </div>
                        </article>`).join('\n')}
                </div>
    
                <button id="${item.id}-A" class="button_green task-list__button">
                    <i class="fa fa-plus" aria-hidden="true"></i> 
                </button>`;
            lst.insertAdjacentElement("beforeend", column)

        }
    }



}
