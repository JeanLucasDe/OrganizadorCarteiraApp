import { Outlet } from "react-router-dom";
import NavBar from "../Components/NavBar";
import {auth, app,firebase} from "../Service/firebase"
import { getFirestore, collection, getDocs,doc, setDoc, updateDoc, deleteDoc} from "@firebase/firestore";
import { useEffect, useState } from "react";


export default function Carteira () {

    const now = new Date();
    const meses = [
      {mes:'janeiro', id:0},
      {mes:'fevereiro', id:1},
      {mes:'março', id:2},
      {mes:'abril', id:3},
      {mes:'maio', id:4},
      {mes:'abril', id:5},
      {mes:'junho', id:6},
      {mes:'julho', id:7},
      {mes:'agosto', id:8},
      {mes:'setembro', id:9},
      {mes:'outubro', id:10},
      {mes:'novembro', id:11},
      {mes:'dezembro', id:12}
    ]
    const mes = meses[now.getMonth()].mes
  
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');
  
    
    const [Meses, setMeses] = useState([])
  
    const [user, setUser] = useState();
    const db = getFirestore(app)
    
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
                const getUsers = async () => {
                  const Collecmeses = collection(db, `Organizador/${user.email}/meses`)
  
                  const dataMeses = await getDocs(Collecmeses)
  
                  setMeses((dataMeses.docs.map((doc) => ({...doc.data(), id: doc.id}))))
  
              };
              getUsers()
            }
        })
    }, [])


    const ind = Meses && Meses.findIndex(dados=> dados.id == mes)

    const {dividas,gastosMensais} = Meses[ind] || []


    var resultadoGastosMensais = gastosMensais && gastosMensais.reduce(function(soma, atual) {
        return soma + atual.value;
      }, 0)
      
      var resultadoDividas = dividas && dividas.reduce(function(soma, atual) {
        return soma + atual.value;
      }, 0)








    return (
        <>
            <NavBar/>
            <Outlet context={[ind, db, user, mes, dividas,resultadoDividas, gastosMensais, resultadoGastosMensais]}/>
        </>
    )
}