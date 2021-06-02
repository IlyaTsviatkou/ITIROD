//import firebase from "firebase";

class TrelloAlikeApiService {
    constructor(lst) {
        this._database = firebase.database();
        this._list = lst;
    }

    logout() {
        return firebase.auth().signOut().then(()=>{
            this._list.username = null;
            this._list.user_id = null;
            this._list.autoincrement = null;
            this._list.boards = null;
        });
    }

    register(email, password) {
        return firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                const user = userCredential.user;

                this._list.username = user.email;
                this._list.user_id = user.uid;
                this._list.autoincrement = 1;
                this._list.boards = [];

                return {
                    user_id: user.uid,
                    username: user.email
                };
            });
    }


    login(email, password){
        return firebase.auth().signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                return {
                    user_id: user.uid,
                    username: user.email
                };
            });
    }

    getBoardList(userId) {
        const dbRef = this._database.ref(userId);
        return dbRef.get().then((snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                this._list.user_id = userId;
                this._list.autoincrement = data.autoincrement;
                this._list.username = data.username;

                this._list.boards = data.boards? Object.keys(data.boards).map(
                    (brd) => {
                        const cols = data.boards[brd].columns? Object.keys(data.boards[brd].columns).map(
                            (col) => {
                                const tsks = data.boards[brd].columns[col].tasks?
                                    Object.keys(data.boards[brd].columns[col].tasks).map(
                                    (tsk) => {
                                        return new Task(
                                            tsk,
                                            data.boards[brd].columns[col].tasks[tsk].name,
                                            data.boards[brd].columns[col].tasks[tsk].description,
                                            data.boards[brd].columns[col].tasks[tsk].color,
                                            data.boards[brd].columns[col].tasks[tsk].date === ""? null
                                                : new Date(data.boards[brd].columns[col].tasks[tsk].date)
                                        )
                                    }):[];

                                return new Column(
                                    col,
                                    data.boards[brd].columns[col].name,
                                    data.boards[brd].columns[col].autoincrement,
                                    tsks
                                )
                            }) :[];

                        return new Board(brd,
                            data.boards[brd].name,
                            data.boards[brd].color,
                            data.boards[brd].autoincrement,
                            cols);
                    }):[];
            } else {
                console.log("No data available");
            }
        });
    }

    setBoardList(){
        const dbRef = this._database.ref(this._list.user_id);
        return dbRef.set(this._list.JSONObject);
    }
}
