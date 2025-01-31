import styles from '../Pages/MonthlyDashboard.module.css';
import {auth, app,firebase} from "../Service/firebase"

 const handleClickLogOut = () => {
    firebase.auth().signOut()
    .then(() => {window.location.href = "/"})
    .catch(() => {alert('não foi possivel sair da conta')})
}

export default function NavBar () {
    return (
        <nav className="navbar navbar-expand-md navbar-dark bg-dark">
            <a className="navbar-brand" href="/">Dashboard Financeiro</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav"  aria-label="Toggle navigation" >
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className={`collapse navbar-collapse`} id="navbarNav">
                <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                    <a className={`nav-link `} href='/page/geral'>Geral</a>
                </li>
                <li className="nav-item">
                    <a className={`nav-link`} href='/page/dividas'>Dívidas</a>
                </li>
                
                <li className="nav-item">
                    <a className={`nav-link `} href='/page/gastosmensais'>Gastos Mensais</a>
                </li>
                {/**<li className="nav-item">
                    <a className={`nav-link `} >Fundo de Garantia</a>
                </li>
                <li className="nav-item">
                    <a className={`nav-link `} >Décimo Terceiro</a>
                </li>*/}
                <li className="nav-item">
                    <a className={`nav-link `} href='/page/diaria'>Diária</a>
                </li>
                <li className="nav-item">
                    <a className={`nav-link`} type="button" onClick={handleClickLogOut}>Sair</a>
                </li>
                </ul>
            </div>
        </nav>
    )
}