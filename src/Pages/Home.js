import Login from "../Components/Login"
import {firebase, auth} from "../Service/firebase"
import { useState,useEffect } from "react"



export default function Home () {

    const [user, setUser] = useState();
    
    useEffect(()=>{
        auth.onAuthStateChanged(user => {
            if (user) {
                const {uid, displayName, photoURL, email} = user
                setUser({
                    id: uid,
                    nome:displayName ? displayName : '',
                    avatar:photoURL ? photoURL : '',
                    email
                })
            }
        })
    }, [])


    


    return (
        <>
            {user ?
            window.location.href= '/perfil'
            :
            <Login/>
            }
        </>
    )
}