class TasksController {
    constructor(view, listId, btnId, service) {
        this._tasksView = view;
        this._listId = listId;
        this._btnId = btnId;
        this._service = service;


        this._movingId = null;
        this._sourceColId = null;
        this._targetColId = null;
    }

    setBoard(board) {
        this._board = board;
    }

    setAddEditTaskController(addEditTaskController) {
        this._addEditTaskController = addEditTaskController;
    }

    get cancel() {
        return (event) => {
            event.preventDefault();
            this.init();
            event.stopPropagation();
        }
    }


    get dragstartHandler() {
        return (event) => {
            let target = event.target;
            if (target.tagName === 'ARTICLE') {
                this._movingId = target.id;
                this._sourceColId = target.parentElement.id.split('-')[0];
            }
        }
    }

    get dragoverHandler() {
        return (event) => {
            event.preventDefault();
            let target = event.target;
            if (target.tagName === 'DIV') {
                if(target.id.split('-')[1]==='L') {
                    this._targetColId = target.id.split('-')[0];
                }
            }
        }
    }

    get dragendHandler() {
        return (event) => {
            if(this._movingId !== null && this._sourceColId !== null && this._targetColId !== null) {
                if(this._sourceColId !== this._targetColId) {
                    this._board.move(this._movingId, this._sourceColId, this._targetColId);
                    this._service.setBoardList().then(()=>
                        this._tasksView.displayTasks(this._board.get_all()));
                }
            }

            this._movingId = null;
            this._sourceColId = null;
            this._targetColId = null;
        }
    }

    get clickHandler() {
        return (event) => {
            event.preventDefault();
            let target = event.target.closest('i, h3')? event.target.parentElement: event.target;
            if (target.tagName === 'BUTTON') {
                const args = target.id.split('-');
                switch (args[1]){
                    case 'D':{
                                const colId = args[2];
                                const column = this._board.get(colId);
                                column.remove(args[0]);
                                this._service.setBoardList().then(()=>
                                    this._tasksView.displayTasks(this._board.get_all()));
                    }break;
                    case 'E':{
                                const column = this._board.get(args[2]);
                                this._addEditTaskController.setParams(this._board.name, column, args[0]);
                                this._addEditTaskController.init();
                    }break;
                    case 'A':{
                        if(args[0].split('_')[1] === 'C') {
                            const column = this._board.get(args[0]);
                            this._addEditTaskController.setParams(this._board.name, column);
                            this._addEditTaskController.init();
                        }
                    }break;
                    default: break;
                }
            }
            else{
                event.stopPropagation();
            }
        }
    }

    init(){
        this._tasksView.displayMain(this._board.name);
        this._tasksView.displayTasks(this._board.get_all());

        this._list = document.getElementById(this._listId);

       this._list.addEventListener('click', this.clickHandler);
       this._list.addEventListener('dragstart', this.dragstartHandler);
       this._list.addEventListener('dragover', this.dragoverHandler);
       this._list.addEventListener('dragend', this.dragendHandler);

    }
}
