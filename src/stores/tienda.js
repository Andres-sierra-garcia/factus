import { defineStore } from "pinia";
import { ref } from "vue";

export const useStore = defineStore ("tienda",()=>{

const token = ref("");
const refreshToken = ref("")
const username = ref("")

    function set_Token_RefreshToken (Token,RefreshToken){
        if(token){
            token.value= Token
            refreshToken.value= RefreshToken
        }
        else{
            console.log("no-token no-refreshToken");
        }
    }


    function setName (name){
        username.value = name
    }



    return{
        token,
        refreshToken,
        set_Token_RefreshToken,
        setName,
        username
    }

},{
    persist:true
})


