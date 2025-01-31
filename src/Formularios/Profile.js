import React, { useState, useEffect } from 'react';
import styles from './Profile.module.css';
import {auth, app} from "../Service/firebase"
import { getFirestore, collection, getDocs,doc, setDoc} from "@firebase/firestore";



const Profile = () => {

  

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
  const [usuarios, setUsuarios] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    phone:''
  });
  const db = getFirestore(app)
  const Collec = collection(db, "Organizador")

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Dados do perfil:', formData);
    alert('Perfil salvo com sucesso!');
  };

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
                const getUsers = async () => {
                  const dataUser = await getDocs(Collec)
                  setUsuarios((dataUser.docs.map((doc) => ({...doc.data(), id: doc.id}))))
  
              };
              getUsers()
            }
        })
    }, [])

    const usuario = usuarios && user && usuarios.findIndex(dados => dados.id == user.email) || []

    
    const AddUser = async(e) => {
      e.preventDefault()
      await setDoc(doc(db, `Organizador`, `${user.email}`), {
          nome: formData.name && formData.name,
          telefone: formData.phone && formData.phone
      })
      await setDoc(doc(db, `Organizador/${user.email}/meses`, `${mes}`), {
        dividas: [],
        gastosMensais: [],
        gastosDiarios: {},
        meta: 100,
        acumulado: 0,
        diarias: [],
        dia: 0
    })
      .then(()=> {
        window.location.href = '/page'
      }).catch(e=> console.error(e))
    }


    console.log(usuario)
    if (usuario ) {
      setTimeout(()=> {
        if (usuario ) {
          window.location.href = '/page'
        }

      },1000)
    }



  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Perfil do Motorista</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label>
          Nome:
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </label>
        <label>
          Telefone:
          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
        </label>
        
        <button className={styles.submitButton} onClick={(e)=> AddUser(e)}>Salvar</button>
      </form>
    </div>
  );
};

export default Profile;
