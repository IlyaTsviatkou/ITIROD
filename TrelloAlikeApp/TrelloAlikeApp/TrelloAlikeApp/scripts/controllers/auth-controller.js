//import firebase from "firebase";

class AuthController {
    constructor(view, logId, regId, formId, boards, service) {
        this._authView = view;
        this._logId = logId;
        this._regId = regId;
        this._formId = formId;
        this._mode = 'reg';
        this._boards = boards;
        this._service = service;
    }

    authPageJump(mode) {
        return () => {
            this._mode = mode;
            this.initMain();
        }
    }

    setBoardsController(boardController) {
        this._boardController = boardController;
    }

    get validation() {
        return (event) => {
            event.preventDefault();
            if(event.target.closest('form')) {
                let empty = false;
                for (let elem in Object.keys(this._authForm.elements)) {
                    if(this._authForm.elements[elem] !== undefined && this._authForm.elements[elem].name) {
                        if (this._authForm.elements[elem].value.trim() === '') {
                            empty = true;
                        }
                    }
                }
                const btn = this._authForm.getElementsByTagName('button')[0];
                empty? btn.setAttribute('disabled', 'disabled'):
                    btn.removeAttribute('disabled');
            }
        }
    }

    _login(event) {
        event.preventDefault();
        this._service.login(
            this._authForm.elements['login'].value,
            this._authForm.elements['password'].value,).then((data)=>{
                this._service.getBoardList(data.user_id).then(
                    () => {
                        this._boardController.setList(this._boards);
                        this._boardController.init();
                    })
            }).catch(()=>this._authView.displayError());
    }

    async _register(event) {
        event.preventDefault();
        if(this._authForm.elements['password'].value === this._authForm.elements['repeat'].value) {
            this._service.register(
                this._authForm.elements['login'].value,
                this._authForm.elements['password'].value).then(()=>{
                this._service.setBoardList().then(
                    () => {
                        this._boardController.setList(this._boards);
                        this._boardController.init();
                    });
                }).catch(()=>this._authView.displayError());
        } else {
            this._authView.displayError();
        }
    }

    get authenticate() {
        return (event) => {
            event.preventDefault();
            if (event.target.closest('form')) {
                switch (this._mode) {
                    case 'reg': this._register(event); break;
                    case 'log': this._login(event); break;
                    default: break;
                }
            } else {
                event.stopPropagation();
            }
        }
    }

    initHeader(){
        this._authView.displayHeader(this._logId, this._regId);
        this._regButton = document.getElementById(this._regId);
        this._logButton = document.getElementById(this._logId);

        this._regButton.addEventListener('click', this.authPageJump('reg'));
        this._logButton.addEventListener('click', this.authPageJump('log'));
    }

    initMain() {
        this._authView.displayMain(this._mode, this._formId);
        this._authForm = document.getElementById(this._formId);
        this._authForm.addEventListener('input', this.validation);
        this._authForm.addEventListener('submit', this.authenticate);
    }

    init(){
        this.initHeader();
        this.initMain();
    }
}
