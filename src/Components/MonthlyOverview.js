import React, { useState, useEffect } from 'react';
import styles from './MonthlyOverview.module.css';
import {auth, app} from "../Service/firebase"
import { getFirestore, collection, getDocs,doc, setDoc, updateDoc, deleteDoc} from "@firebase/firestore";

const MonthlyOverview = () => {

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

  const [user, setUser] = useState();
  const [Meses, setMeses] = useState([]) 
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
                const CollecMeses = collection(db, `Organizador/${user.email}/meses`)

                const dataMeses = await getDocs(CollecMeses)

                setMeses((dataMeses.docs.map((doc) => ({...doc.data(), id: doc.id}))))
            };
            getUsers()
          }
      })
  }, [])

  const ind = Meses && Meses.findIndex(dados=> dados.id == mes)

  const {dividas, gastosMensais, meta, diarias, gastosDiarios, acumulado} = Meses && Meses[ind] || []


  
  var resultadoDividas = dividas && dividas.reduce(function(soma, atual) {
    return soma + atual.value;
  }, 0)
  
  var resultadoGastosMensais = gastosMensais && gastosMensais.reduce(function(soma, atual) {
    return soma + atual.value;
  }, 0)
  
  



  


  // Valores fictícios e lógicos de cálculo
  
  const [monthEndDate, setMonthEndDate] = useState(new Date('2025-01-31'));

  const expenses = gastosDiarios && Object.values(gastosDiarios).reduce((acc, curr) => acc + curr, 0);

  const expectedAmount = meta - expenses; // Valor estimado após os descontos
  const totalMonth = expectedAmount * 30; // Total esperado no mês com 30 dias
  const décimoTerceiro = totalMonth * 0.0833; // Calculando o décimo terceiro (1/12 do valor total mensal)
  const fundoGarantia = totalMonth * 0.08; // Calculando o fundo de garantia (8% do total mensal)

  
  // Calculando a porcentagem para cada tipo de desconto
  const progressPercentage = {
    fuel: (gastosDiarios && gastosDiarios.fuel / meta) * 100,
    rent: (gastosDiarios && gastosDiarios.rent / meta) * 100,
    food: (gastosDiarios && gastosDiarios.food / meta) * 100,
    maintence: (gastosDiarios && gastosDiarios.maintence / meta) * 100,
    extra: (gastosDiarios && gastosDiarios.extra / meta) * 100,
  };

  const remainingAmount = acumulado - resultadoDividas - resultadoGastosMensais;


  return (
    <div className={styles.monthlyOverviewContainer}>
      {/* Cabeçalho */}
      <div className={styles.monthlyOverviewHeader}>
        <h2>Visão Geral do Mês</h2>
        <p className={styles.currentDate}>
          Data: {monthEndDate.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Total Estimado */}
      <div className={styles.totalMonthBox}>
        <h3>Total Estimado do Mês</h3>
        <h4 className={styles.totalAmount}>R$ {totalMonth.toFixed(2)}</h4>
        <h3>Sobra do mês</h3>
        <h4 className={styles.totalAmount}>R$ {(totalMonth - resultadoDividas - resultadoGastosMensais).toFixed(2)}</h4>
      </div>

        {/* Total Estimado */}
        <div className={styles.totalMonthBox}>
        <h4>Meta Diária</h4>
        <h4>R$ {meta && meta.toFixed(2)}</h4>
        <h5>sub-total(com descontos): <h4  className={styles.totalAmount}>R$ {expectedAmount.toFixed(2)}</h4></h5>
      </div>

      {/* Progresso de Descontos */}
      <h5 className={styles.center}>Descontos Diários</h5>
      <div className={styles.progressBox}>
        <div className={`${styles.progressCircle} ${styles.fuel}`}>
          <div className={styles.percentage}>{Math.round(progressPercentage.fuel)}%</div>
        </div>

        <div className={`${styles.progressCircle} ${styles.rent}`}>
          <div className={styles.percentage}>{Math.round(progressPercentage.rent)}%</div>
        </div>

        <div className={`${styles.progressCircle} ${styles.food}`}>
          <div className={styles.percentage}>{Math.round(progressPercentage.food)}%</div>
        </div>

        <div className={`${styles.progressCircle} ${styles.maintence}`}>
          <div className={styles.percentage}>{Math.round(progressPercentage.maintence)}%</div>
        </div>
        <div className={`${styles.progressCircle} ${styles.extra}`}>
          <div className={styles.percentage}>{Math.round(progressPercentage.extra)}%</div>
        </div>

      </div>

      {/* Resumo de Status (Esperado vs Acumulado) */}
      <div className={styles.totalMonthBox}>
        <div className={styles.statusItem}>
          <h4>Valor Acumulado</h4>
          <p className={`${styles.amount} ${acumulado < totalMonth ? styles.negative : styles.positive}`}>
            {acumulado && acumulado.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Despesas e Fundo de Garantia */}
      <div className={styles.expensesBox}>
        <h5>Despesas Mensais</h5>
        <div className={styles.totalExpenses}>
          <h4>Total de Despesas: R$ {resultadoGastosMensais && resultadoGastosMensais.toFixed(2)}</h4>
        </div>
      </div>
      <div className={styles.expensesBox}>
        <h5>Dívidas</h5>
        <div className={styles.totalExpenses}>
          <h4>Total de Dívidas: R$ {resultadoDividas && resultadoDividas.toFixed(2)}</h4>
        </div>
      </div>

      {/* Resumo Financeiro */}
      <div className={styles.financialBox}>
        <h4>Resumo Financeiro</h4>
        <div className={styles.financialItem}>
          <p>Fundo de Garantia (8%)</p>
          <p>{fundoGarantia.toFixed(2)}</p>
        </div>
        <div className={styles.financialItem}>
          <p>Décimo Terceiro</p>
          <p>{décimoTerceiro.toFixed(2)}</p>
        </div>
      </div>

      {/* Box de Valor Restante */}
      <div className={styles.remainingBox}>
        <h4>Progesso</h4>
        <p className={`${styles.remainingAmount} ${remainingAmount >= 0 ? styles.positive : styles.negative}`}>
          R$ {remainingAmount.toFixed(2)}
        </p>
      </div>

      {/* Aviso de Meta */}
      <div className={styles.warningSection}>
        {acumulado < totalMonth ? (
          <p className={styles.warningText}>Meta ainda não alcançada!</p>
        ) : (
          <p className={styles.successText}>Meta alcançada!</p>
        )}
      </div>


    </div>
  );
};

export default MonthlyOverview;
