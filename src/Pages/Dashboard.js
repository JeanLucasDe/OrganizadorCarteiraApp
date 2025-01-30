import React, { useState, useEffect } from 'react';
import styles from './Dashboard.module.css';
import {auth, app} from "../Service/firebase"
import { getFirestore, collection, getDocs,doc, setDoc, updateDoc, deleteDoc} from "@firebase/firestore";
import moment from "moment/moment"

const Dashboard = () => {


  var [valor, setValor] = useState(0)
  

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

  const {dividas, gastosMensais, meta, diarias, gastosDiarios, acumulado,dia} = Meses && Meses[ind] || []



  const expenses = gastosDiarios && Object.values(gastosDiarios).reduce((acc, curr) => acc + curr, 0);

  const TotalCDescontos = dia-expenses









  const [dailyGoal, setDailyGoal] = useState(250); // Meta diária fixa
  const [dailyExpenses, setDailyExpenses] = useState({
    fuel: 0,
    rent: 0,
    food: 0
  }); // Gastos diários com combustível, aluguel e alimentação
  const [totalSavings, setTotalSavings] = useState(0); // Total acumulado ao longo do mês

  const handleExpenseChange = (event) => {
    const { name, value } = event.target;
    setDailyExpenses((prev) => ({
      ...prev,
      [name]: value ? parseFloat(value) : 0
    }));
  };

  const handleGoalChange = (event) => {
    setDailyGoal(parseFloat(event.target.value));
  };

  const handleConcludeDay = () => {
    const dailyRemaining = dailyGoal - (dailyExpenses.fuel + dailyExpenses.rent + dailyExpenses.food);
    setTotalSavings(totalSavings + dailyRemaining);
    // Reset expenses for the next day
    setDailyExpenses({ fuel: 0, rent: 0, food: 0 });
  };

  const dailyRemaining = dailyGoal - (dailyExpenses.fuel + dailyExpenses.rent + dailyExpenses.food);
  const monthlyAccumulated = totalSavings + dailyRemaining;

  const today = new Date();
  const formattedDate = today.toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });



  const SendValueAcumulator = async() => {
    const result = (dia + parseFloat(valor))

    if (valor) {
      await updateDoc(doc(db, `Organizador/${user.email}/meses`, `${mes}`), {
          dia: parseFloat(result)
        }).then(()=> window.location.reload())
    }
  }

  const sendAcumulator= async () => {
    const result = (acumulado + TotalCDescontos)

    await updateDoc(doc(db, `Organizador/${user.email}/meses`, `${mes}`), {
        acumulado: result,
        dia:0,
        diarias: [...diarias, {
          data:moment().format('YYYY-MM-DD'),
          value: TotalCDescontos
        }]
      }).then(()=> window.location.reload())
    
  }

  const AlterMeta= async () => {
    await updateDoc(doc(db, `Organizador/${user.email}/meses`, `${mes}`), {
        meta: dailyGoal,
      }).then(()=> window.location.reload())
    
  }

  const [fuel, setFuel] = useState()
  const [rent, setRent] = useState()
  const [maintence, setMaintence] = useState()
  const [extra, setExtra] = useState()
  const [food, setFood]= useState()

  const AlterDispenses = async () => {
    await updateDoc(doc(db, `Organizador/${user.email}/meses`, `${mes}`), {
        gastosDiarios: {
          fuel: fuel ? parseFloat(fuel) : parseFloat(gastosDiarios.fuel),
          rent:rent ? parseFloat(rent) : parseFloat(gastosDiarios.rent),
          maintence:maintence ? parseFloat(maintence) : parseFloat(gastosDiarios.maintence),
          extra: extra ? parseFloat(extra) :parseFloat( gastosDiarios.extra),
          food:food ? parseFloat(food) : parseFloat(gastosDiarios.food)
        },
      }).then(()=> window.location.reload())
    
  }


  const restante = meta - dia
  

  return (
    <div className={styles.dashboard}>
      <h2 className={styles.title}>Dashboard Financeiro</h2>

      <div className={styles.date}>
        <h3>{formattedDate}</h3>
      </div>

      <div className={styles.card}>
        <h3>Meta Diária</h3>
        <div className={styles.metaDaily}>
          <input
            type="number"
            defaultValue={meta}
            onChange={handleGoalChange}
            className={styles.goalInput}
          />
          <span className={styles.currency}>R$</span>
          <span className={styles.editIcon} type="button" onClick={() => AlterMeta()}>✏️</span>
        </div>
        <p>Defina sua meta diária para alcançar sua meta mensal</p>
      </div>

      <div className={styles.card}>
        <h3>Despesas Diárias</h3>
        <div className={styles.expenseInput}>
          <label>
            Combustível:
            <input
              type="number"
              name="fuel"
              defaultValue={gastosDiarios && gastosDiarios.fuel}
              onChange={(e)=> setFuel(e.target.value)}
              placeholder="0"
            />

          </label>
          <label>
            Aluguel:
            <input
              type="number"
              name="rent"
              defaultValue={gastosDiarios && gastosDiarios.rent}
              onChange={(e)=> setRent(e.target.value)}
              placeholder="0"
            />

          </label>
          <label>
            Alimentação:
            <input
              type="number"
              name="food"
              defaultValue={gastosDiarios && gastosDiarios.food}
              onChange={(e)=> setFood(e.target.value)}
              placeholder="0"
            />

          </label>
          <label>
            Manutenção:
            <input
              type="number"
              name="maintence"
              defaultValue={gastosDiarios && gastosDiarios.maintence}
              onChange={(e)=> setMaintence(e.target.value)}
              placeholder="0"
            />

          </label>
          <label>
            Extras:
            <input
              type="number"
              name="extra"
              defaultValue={gastosDiarios && gastosDiarios.extra}
              onChange={(e)=> setExtra(e.target.value)}
              placeholder="0"
            />

          </label>
        </div>
        <button>Editar <span className={styles.editIcon} type="button" onClick={() => AlterDispenses()}>✏️</span></button>
        <h4>Restante para atingir a Meta Diária:</h4>
        <div className={styles.remaining}>
          <span className={styles.amount}>R$ {restante && restante.toFixed(2)}</span>
        </div>

        <h4>Total Até Agora:</h4>
        <div className={styles.remaining}>
          <span className={styles.amount}>R$ {dia && dia.toFixed(2)}</span>
        </div>

        <div className={styles.monthlyAccumulated}>
          <input className={styles.amount}
          type='number'
          onChange={(e)=> setValor(e.target.value)}
          />
          <button
          className={styles.concludeButton}
          onClick={() => SendValueAcumulator()}
          >Lançar</button>
        </div>
      </div>

      <div className={styles.card}>
        <button className={styles.concludeButton} onClick={()=> {
          handleConcludeDay()
          sendAcumulator()
          }}>
          {TotalCDescontos > 0 &&
          <span>
            <h5>Lucro</h5>
            <h5>R$ {TotalCDescontos.toFixed(2)}</h5>
          </span>
          }
          Concluir Diária
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
