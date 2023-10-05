import { makeAutoObservable } from "mobx"

export default class UserStore{
    _user

    constructor(){
        this._user={}
   
       
        makeAutoObservable(this)
    }

    setuser(user){
        this._user = user
    }
   

   
    
    get user(){
        return this._user
    }

   
}
