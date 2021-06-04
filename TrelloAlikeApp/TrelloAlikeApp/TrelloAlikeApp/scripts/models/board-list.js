class BoardList {
    constructor(username, user_id, autoincrement, brd = []) {
        this.username = username;
        this.user_id = user_id;
        this.boards = [...brd];
        this.autoincrement = autoincrement;
    }


    get length() {
        return this.boards.length;
    }

    get(id) {
        return this.boards.find((element) => element.id === id);
    }

    get_all(name='') {
        return this.boards.filter((brd) => brd.name.indexOf(name) !== -1);
    }

    add(name, color) {
        const added = new Board(
            (this.autoincrement++).toString()+'_B',
            name,
            color, 1);

        this.boards.push(added);
    }

    edit(id, name, color) {
        const index = this.boards.findIndex((element) => element.id === id);
        if (index >= 0) {
            this.boards[index].name = name ?? this.boards[index].name;
            this.boards[index].color = color ?? this.boards[index].color;
        }
    }

    remove(id) {
        const index = this.boards.findIndex((element) => element.id === id);
        if (index >= 0) {
            this.boards.splice(index, 1);
        }
    }

    replace(source_id, target_id) {
        const source_idx = this.boards.findIndex((element) => element.id === source_id);
        const target_idx = this.boards.findIndex((element) => element.id === target_id);
        if (source_idx >= 0 && target_idx >= 0) {
            const tmp_list = this.boards[source_idx].columns;
            this.boards[source_idx].columns = this.boards[target_idx].columns;
            this.boards[target_idx].columns = tmp_list;

            let tmp = this.boards[source_idx].name;
            this.boards[source_idx].name = this.boards[target_idx].name;
            this.boards[target_idx].name = tmp;

            tmp = this.boards[source_idx].color;
            this.boards[source_idx].color = this.boards[target_idx].color;
            this.boards[target_idx].color = tmp;

            tmp = this.boards[source_idx].autoincrement;
            this.boards[source_idx].autoincrement = this.boards[target_idx].autoincrement;
            this.boards[target_idx].autoincrement = tmp;
        }

    }

    addAll(brd) {
        this.boards = [...this.boards, ...brd];
    }


    get JSONObject() {
        const brds = {};
        for(const brd of this.boards) {
            brds[brd.id] = brd.JSONObject;
        }

        return {
            username: this.username,
            autoincrement: this.autoincrement,
            boards: brds
        }
    }

    toJSON() {
        return JSON.stringify(this.JSONObject);
    }
}
