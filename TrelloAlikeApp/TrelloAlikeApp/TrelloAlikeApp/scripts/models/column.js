class Column {
    constructor(id, name, autoincrement,  tsk = []) {
        this.id = id;
        this.name = name;
        this.tasks = [...tsk];
        this.autoincrement = autoincrement;
    }

    get length() {
        return this.tasks.length;
    }

    get(id) {
        return this.tasks.find((element) => element.id === id);
    }

    get_all() {
        return this.tasks;
    }

    add(tsk) {
        const { name, description, date, color } = tsk;
        const added = new Task(
            (this.autoincrement++).toString()+'_T',
            name,
            description,
            color,
            date);

        this.tasks.push(added);
    }

    edit(id, tsk) {
        const index = this.tasks.findIndex((element) => element.id === id);
        if (index >= 0) {
            this.tasks[index].name = tsk.name;
            this.tasks[index].description = tsk.description;
            this.tasks[index].color = tsk.color;
            this.tasks[index].date = tsk.date ?? null;
        }
    }

    remove(id) {
        const index = this.tasks.findIndex((element) => element.id === id);
        if (index >= 0) {
            this.tasks.splice(index, 1);
        }
    }

    addAll(tsk) {
        this.tasks = [...this.tasks, ...tsk];
        this.autoincrement += tsk.length;
    }

    get JSONObject() {
        const tsks = {}
        for(const tsk of this.tasks) {
            tsks[tsk.id] = tsk.JSONObject
        }

        return {
            name: this.name,
            autoincrement: this.autoincrement,
            tasks: tsks
        }
    }

    toJSON() {
        return JSON.stringify(this.JSONObject);
    }
}
