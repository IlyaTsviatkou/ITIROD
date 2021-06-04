class BoardsController{

    constructor(view, listId, formId, toBoardsId, logoutId, btnId, service) {
        this._boardsView = view;
        this._listId = listId;
        this._formId = formId;
        this._toBoardsId = toBoardsId;
        this._logoutId = logoutId;
        this._btnId = btnId;
        this._service = service;

        this._editedId = null;

        this._sourceId = null;
        this._targetId = null;
    }

    setTasksController(tasksController) {
        this._tasksController = tasksController;
    }

    setAuthController(authController) {
        this._authController = authController;
    }

    setList(boards) {
        this._boards = boards;
    }

    get authPageJump() {
        return (event) => {
            event.preventDefault();
            this._authController.init();
        }
    }

    get boardsPageJump() {
        return (event) => {
            event.preventDefault();
            this._editedId = null;
            this.initMain();
        }
    }

    get search() {
        return (event) => {
            event.preventDefault();
            this._boardsView.displayBoards(this._boards.get_all(this._searchForm.elements['name'].value.trim()));
        }
    }

    get addEdit(){
        return (event) => {
            event.preventDefault();
            if (event.target.closest('form')) {
                if(event.target.elements['name'].value.trim() !== '') {
                    if (this._editedId === null) {
                        this._boards.add(
                            event.target.elements['name'].value,
                            event.target.elements['color'].value
                        );
                    } else {
                        this._boards.edit(
                            this._editedId,
                            event.target.elements['name'].value,
                            event.target.elements['color'].value,
                        )
                    }
                    this._editedId = null;
                    this._service.setBoardList().then(()=>this.initMain());
                }
            }
        }
    }

    get addEditMode() {
        return (event) => {
            event.preventDefault();
            this._boardsView.displayAddEdit('add-edit','cancel');
            const addEditForm = document.getElementById('add-edit');
            if(this._editedId !== null) {
                addEditForm.elements['name'].value = this._boards.get(this._editedId).name;
            }
            addEditForm.addEventListener('submit', this.addEdit);
            const cancelButton = document.getElementById('cancel');
            cancelButton.addEventListener('click', this.boardsPageJump);
        }
    }

    get dragstartHandler() {
        return (event) => {
            let target = event.target;
            if (target.tagName === 'SECTION') {
                this._sourceId = target.id;
            }
        }
    }

    get dragoverHandler() {
        return (event) => {
            event.preventDefault();
            let target = event.target;
            if (target.tagName === 'SECTION') {
                this._targetId = target.id;
            }
        }
    }

    get dragendHandler() {
        return (event) => {
            if(this._sourceId !== this._targetId) {
                this._boards.replace(this._sourceId, this._targetId);
                this._service.setBoardList().then(()=>this.search(event));
            }

            this._sourceId = null;
            this._targetId = null;
        }
    }

    get clickHandler() {
        return (event) => {
            event.preventDefault();

            let target = event.target.closest('i, h3')? event.target.parentElement: event.target;

            switch (target.tagName) {
                case 'BUTTON': {
                    const args = target.id.split('-');
                    switch (args[1]){
                        case 'D':{
                            this._boards.remove(args[0]);
                            this._service.setBoardList().then(()=>this.search(event));
                        }break;
                        case 'E':{
                            this._editedId = args[0];
                            this.addEditMode(event);
                        }break;
                    }
                } break;
                case 'SECTION': {
                    this._tasksController.setBoard(this._boards.get(target.id));
                    this._tasksController.init();
                } break;
                case 'IMG': {
                    this._tasksController.setBoard(this._boards.get(target.id));
                    this._tasksController.init();
                } break;
                default: event.stopPropagation(); break;
            }
        }
    }

    initHeader(){
        this._boardsView.displayHeader(this._boards.username, this._toBoardsId, this._logoutId);

        this._boardButton = document.getElementById(this._toBoardsId);
        this._logoutButton = document.getElementById(this._logoutId);

        this._logoutButton.addEventListener('click', this.authPageJump);
        this._boardButton.addEventListener('click', this.boardsPageJump);
    }

    initMain(){
        this._boardsView.displayMain();
        this._boardsView.displayBoards(this._boards.get_all());

        this._list = document.getElementById(this._listId);
        this._searchForm = document.getElementById(this._formId);
        this._addButton = document.getElementById(this._btnId);

        this._searchForm.addEventListener('submit', this.search);
        this._list.addEventListener('click', this.clickHandler);
        this._list.addEventListener('dragstart', this.dragstartHandler);
        this._list.addEventListener('dragover', this.dragoverHandler);
        this._list.addEventListener('dragend', this.dragendHandler);
        this._addButton.addEventListener('click', this.addEditMode);
    }

    init() {
        this.initHeader();
        this.initMain();
    }
}
