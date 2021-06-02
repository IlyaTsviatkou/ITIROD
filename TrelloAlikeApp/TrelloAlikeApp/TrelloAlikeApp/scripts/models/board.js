class Board {
    constructor(id, name, color, autoincrement, col = []) {
        this.id = id;
        this.name = name;
        this.color = color;
        this.autoincrement = autoincrement;
        if(col.length === 0) {
            this.columns = [new Column((this.autoincrement++).toString() + '_C', "DO", 1),
                new Column((this.autoincrement++).toString() + '_C', "DOING", 1),
                new Column((this.autoincrement++).toString() + '_C', "DONE", 1)];
        } else {
            this.columns =[...col];
        }

    }

    get length() {
        return this.columns.length;
    }

    get(id) {
        return this.columns.find((element) => element.id === id);
    }

    get_all() {
        return this.columns;
    }


    move(tsk_id, source_col_id, target_col_id) {
        const source_col_idx = this.columns.findIndex((element) => element.id === source_col_id);
        const target_col_idx = this.columns.findIndex((element) => element.id === target_col_id);
        if (source_col_idx >= 0 && target_col_idx >= 0) {
            const { name, description, color, date} = this.columns[source_col_idx].get(tsk_id);
            this.columns[target_col_idx].add({
                    name: name,
                    description: description,
                    color: color,
                    date: date === null ? null : new Date(date)
            });
            this.columns[source_col_idx].remove(tsk_id);
        }
    }




    get JSONObject() {
        const cols = {};
        for(const col of this.columns) {
            cols[col.id] = col.JSONObject;
        }

        return {
            name: this.name,
            autoincrement: this.autoincrement,
            color: this.color,
            columns: cols
        }
    }

    toJSON() {
        return JSON.stringify(this.JSONObject);
    }
}
