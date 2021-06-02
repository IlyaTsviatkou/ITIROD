class AddEditTaskController {
    constructor(view, service) {
        this._addEditTaskView = view;
        this._service = service;
    }

    setParams(boardName, column, taskId = null) {
        this._column = column;
        this._boardName = boardName;
        this._task = this._column.get(taskId) ?? null;
    }

    setTasksController(tasksController) {
        this._tasksController = tasksController;
    }

    get cancel() {
        return (event) => {
            this._tasksController.init();
        }
    }

    get addEdit(){
        return (event) => {
            event.preventDefault();
            if (event.target.closest('form')) {
                if (event.target.elements['name'].value.trim() !== '' &&
                    event.target.elements['description'].value.trim() !== '') {
                    if (this._task === null) {
                        this._column.add({
                                name: event.target.elements['name'].value,
                                description: event.target.elements['description'].value,
                                date: event.target.elements['date'].value !== '' ?
                                    new Date(`${event.target.elements['date'].value}T00:00:00`) :
                                    null,
                                color: event.target.elements['color'].value
                            });
                    } else {
                        this._column.edit(this._task.id,
                            {
                                name: event.target.elements['name'].value,
                                description: event.target.elements['description'].value,
                                date: event.target.elements['date'].value !== '' ?
                                    new Date(`${event.target.elements['date'].value}T00:00:00`) :
                                    null,
                                color: event.target.elements['color'].value
                            })
                    }
                    this._service.setBoardList().then(()=>this._tasksController.init());
                }
            }
        }
    }

    init() {
        const label = this._task === null?
            `Add new task to column '${this._column.name}' of board '${this._boardName}'`:
            `Edit task '${this._task.name}' of column '${this._column.name}' of board '${this._boardName}'`
        this._addEditTaskView.displayMain(label, 'add-edit', 'cancel');
        const addEditForm = document.getElementById('add-edit');
        if(this._task !== null) {
            addEditForm.elements['name'].value = this._task.name;
            addEditForm.elements['description'].value = this._task.description;
            addEditForm.elements['date'].value = this._task.date !== null?
                this._task.dateFormatString.split('T')[0]: '';
        }
        addEditForm.addEventListener('submit', this.addEdit);
        const cancelButton = document.getElementById('cancel');
        cancelButton.addEventListener('click', this.cancel);
    }
}
