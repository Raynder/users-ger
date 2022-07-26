class UserController {

    constructor(formIdCreate, formIdUpdate, tableId){

        this.formEl = document.getElementById(formIdCreate);
        this.formUpdateEl = document.getElementById(formIdUpdate);
        this.tableEl = document.getElementById(tableId);

        this.onSubmit();
        this.onEdit();
        this.selectAll();
    }

    onEdit(){
        document.querySelector("#box-user-update .btn-cancel").addEventListener('click', e => {

            this.showPanelCreate();

        })

        this.formUpdateEl.addEventListener('submit', e => {
            e.preventDefault();

            let btn = this.formUpdateEl.querySelector("[type=submit]");

            btn.disabled = true;

            let values = this.getValues(this.formUpdateEl);

            let index = this.formUpdateEl.dataset.trIndex;
            
            let tr = this.tableEl.rows[index];

            let userOld = JSON.parse(tr.dataset.user);

            let result = Object.assign({}, userOld, values);

            this.getPhoto(this.formUpdateEl).then(
                content => {
                    if(!values._photo){
                        result._photo = userOld._photo;
                    }
                    else{
                        console.log("Tem foto, substituir");
                        result._photo = content;
                    }

                    tr.dataset.user = JSON.stringify(result);

                    tr.innerHTML = `
                        <tr>
                            <td><img src="${result._photo}" alt="User Image" class="img-circle img-sm"></td>
                            <td>${result._name}</td>
                            <td>${result._email}</td>
                            <td>${result._admin ? 'sim' : 'não'}</td>
                            <td>${Utils.dateFormat(result._register)}</td>
                            <td>
                            <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
                            <button type="button" class="btn btn-danger btn-delete btn-xs btn-flat">Excluir</button>
                            </td>
                        </tr>
                    `;

                    this.addEventsTr(tr);

                    this.updateCount();

                    this.formUpdateEl.reset();

                    btn.disabled = false;

                    this.showPanelCreate();
                },
                e => {
                    console.log(e);
                }
            )
        })
    }

    showPanelCreate(){
        document.querySelector('#box-user-create').style.display = 'block';
        document.querySelector('#box-user-update').style.display = 'none';
    }

    showPanelUpdate(){
        document.querySelector('#box-user-create').style.display = 'none';
        document.querySelector('#box-user-update').style.display = 'block';
    }

    onSubmit(){
        this.formEl.addEventListener('submit', e => {
            e.preventDefault();

            let btn = this.formEl.querySelector("[type=submit]")

            btn.disabled = true;

            let values = this.getValues(this.formEl);
            if(!values){
                this.formEl.reset();
                btn.disabled = false;
                return false;
            }


            values.photo = "";

            this.getPhoto(this.formEl).then(
                content => {
                    values.photo = content;

                    this.insert(values);

                    this.addLine(values);

                    this.formEl.reset();
                    btn.disabled = false;
                },
                e => {
                    console.log(e);
                }
            )
        
        })
    }

    getPhoto(formEl){

        return new Promise((resolve, reject) => {
            let fileReader = new FileReader();
    
            let elements = [...formEl.elements].filter(item => {
                if(item.name == 'photo'){
                    return item;
                }
            })
    
            let file = elements[0].files[0]
    
            fileReader.onload = () => {
    
                resolve(fileReader.result);
    
            };

            fileReader.onerror = (e) => {
                reject(e);
            }
    
            file ? fileReader.readAsDataURL(file): resolve("dist/img/avatar.png");
        });
    }

    getValues(formEl){

        let user = {};
        let isValid = true;

        [...formEl.elements].forEach((field) => {

            if(['name', 'email', 'password'].indexOf(field.name) > -1 && !field.value){
                field.parentElement.classList.add('has-error');
                isValid = false;
            }

            if(field.name == 'gender'){
                if(field.checked) user[field.name] = field.value;
            }
            else if(field.name == 'admin'){
                user[field.name] = field.checked
            }
            else{
                user[field.name] = field.value;
            }
        });

        if(!isValid) return false;
    
        return new User(
            user.name,
            user.gender,
            user.birth,
            user.country,
            user.email,
            user.password,
            user.photo,
            user.admin
        )
    }

    getUsersStorage(){
        let users = [];
        if(sessionStorage.getItem('users')){
            users = JSON.parse(sessionStorage.getItem('users'));
        }
        return users;
    }

    selectAll(dataUser){
        let users = this.getUsersStorage();
        users.forEach(dataUser  => {
            let user = new User();
            user.loadFromJSON(dataUser);
            this.addLine(user);
        })

    }

    insert(data){
        let users = this.getUsersStorage();
        users.push(data);
        sessionStorage.setItem('users', JSON.stringify(users));
    }

    addLine(dataUser){

        let tr = document.createElement('tr');

        tr.dataset.user = JSON.stringify(dataUser);
    
        tr.innerHTML = `
            <tr>
                <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
                <td>${dataUser.name}</td>
                <td>${dataUser.email}</td>
                <td>${dataUser.admin ? 'sim' : 'não'}</td>
                <td>${Utils.dateFormat(dataUser.register)}</td>
                <td>
                <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
                <button type="button" class="btn btn-danger btn-delete btn-xs btn-flat">Excluir</button>
                </td>
            </tr>
        `;

        this.addEventsTr(tr);


        this.tableEl.appendChild(tr);

        this.updateCount();
    
    }

    addEventsTr(tr){
        tr.querySelector('.btn-delete').addEventListener('click', e => {
            if(confirm("Deseja realmente excluir?")){
                this.remove(tr);
            }
        });

        tr.querySelector('.btn-edit').addEventListener('click', e => {
            let json = JSON.parse(tr.dataset.user);

            this.formUpdateEl.dataset.trIndex = tr.sectionRowIndex;

            for(let name in json){
                
                let field = this.formUpdateEl.querySelector("[name="+name.replaceAll('_','')+"]");

                if(field){

                    switch(field.type){
                        case 'file':
                            continue;
                        case 'radio':
                            field = this.formUpdateEl.querySelector("[name="+name.replaceAll('_','')+"][value="+json[name]+"]");
                            field.checked = true;
                            break;
                        case 'checkbox':
                            field.checked = json[name];
                            break;
                        default:
                            field.value = json[name];
                    }
                } 
            }

            this.formUpdateEl.querySelector(".photo").src = json.photo;

            this.showPanelUpdate();
        })
    }

    updateCount(){
        let users = 0;
        let admin = 0;

        [...this.tableEl.children].forEach(tr => {
            let user = JSON.parse(tr.dataset.user);

            if(user._admin) admin++;
            users++;

        })

        document.querySelector('#number-users').innerHTML = users;
        document.querySelector('#number-users-admin').innerHTML = admin;
    }

    remove(tr){
        this.tableEl.removeChild(tr);
        this.updateCount();
    }

}