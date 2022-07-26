class User {

    constructor(name, gender, birth, country, email, password, photo, admin){

        this._name = name;
        this._gender = gender;
        this._birth = birth;
        this._country = country;
        this._email = email;
        this._password = password;
        this._photo = photo;
        this._admin = admin;

        this._register = new Date();
    }

    get register(){
        return this._register;
    }

    get name(){
        return this._name;
    }

    set name(value){
        this._name = value;
    }
    
    get gender(){
        return this._gender;
    }

    set gender(value){
        this._gender = value;
    }
    
    get birth(){
        return this._birth;
    }

    set birth(value){
        this._birth = value;
    }
    
    get country(){
        return this._country;
    }

    set country(value){
        this._country = value;
    }
    
    get email(){
        return this._email;
    }

    set email(value){
        this._email = value;
    }
    
    get password(){
        return this._password;
    }

    set password(value){
        this._password = value;
    }
    
    get email(){
        return this._email;
    }

    set email(value){
        this._email = value;
    }
    
    get admin(){
        return this._admin;
    }

    set admin(value){
        this._admin = value;
    }

    loadFromJSON(json){
        for(let name in json){
            switch(name){
                case '_register':
                    this[name] = new Date(json[name]);
                    break;
                default:
                    this[name] = json[name];
            }
        }
    }

}