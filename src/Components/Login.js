import React from 'react';
import styles from './Login.module.css';
import {firebase} from "../Service/firebase"

const Login = () => {
  

  const HandleClickLoginGoogle = async() => {
    const provider = new firebase.auth.GoogleAuthProvider()
    const result = await firebase.auth().signInWithPopup(provider);
    if (!result.user) {
        const {uid, displayName, photoURL} = result.user
        if (!displayName && !photoURL) {
            throw new Error('Usuário sem Nome ou foto')
        }
        window.location.href="/perfil/controle"
    }
}

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Carteira Organizadora</h1>
        <button className={styles.googleButton} onClick={HandleClickLoginGoogle}>
          Entrar com Google
        </button>
      </div>
    </div>
  );
};

export default Login;