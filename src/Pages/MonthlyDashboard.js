import React, { useEffect, useState } from 'react';
import styles from './MonthlyDashboard.module.css';
import MonthlyOverview from '../Components/MonthlyOverview';
import {auth, app,firebase} from "../Service/firebase"
import { getFirestore, collection, getDocs,doc, setDoc, updateDoc, deleteDoc} from "@firebase/firestore";
import Dashboard from './Dashboard';
import NavBar from '../Components/NavBar';

const MonthlyDashboard = () => {

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


  const toggleNavbar = () => setIsOpen(!isOpen);

  const [debts, setDebts] = useState([
    { id: 1, description: 'Emprestimo', value: 1000 },
    { id: 2, description: 'Cartão', value: 200 }
  ]);

  
  const [monthlyExpenses, setMonthlyExpenses] = useState([
    { id: 1, description: 'Aluguel', value: 1000 },
    { id: 2, description: 'Contas de Luz', value: 200 }
  ]);
  
  const [guaranteeFund, setGuaranteeFund] = useState([
    { id: 1, description: 'Fundo de Garantia', value: 0 }
  ]);
  
  const [thirteenthSalary, setThirteenthSalary] = useState([
    { id: 1, description: 'Décimo Terceiro', value: 0 }
  ]);

  const [editedValue, setEditedValue] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [newDescription, setNewDescription] = useState("");

  const handleAdd = (category, description, value) => {
    const id = Date.now();
    const newItem = { id, description, value };
    switch (category) {
      case 'debts':
        setDebts([...debts, newItem]);
        break;
      case 'monthlyExpenses':
        setMonthlyExpenses([...monthlyExpenses, newItem]);
        break;
      case 'guaranteeFund':
        setGuaranteeFund([...guaranteeFund, newItem]);
        break;
      case 'thirteenthSalary':
        setThirteenthSalary([...thirteenthSalary, newItem]);
        break;
      default:
        break;
    }
  };

  const handleDelete = (category, id) => {
    switch (category) {
      case 'debts':
        setDebts(debts.filter(item => item.id !== id));
        break;
      case 'monthlyExpenses':
        setMonthlyExpenses(monthlyExpenses.filter(item => item.id !== id));
        break;
      case 'guaranteeFund':
        setGuaranteeFund(guaranteeFund.filter(item => item.id !== id));
        break;
      case 'thirteenthSalary':
        setThirteenthSalary(thirteenthSalary.filter(item => item.id !== id));
        break;
      default:
        break;
    }
  };

  const handleEdit = (category, id, value, description) => {
    setEditingId(id);
    setEditedValue(value);
    setNewDescription(description);
  };

  const handleSaveEdit = (category) => {
    const updatedItem = {
      id: editingId,
      description: newDescription,
      value: editedValue
    };

    switch (category) {
      case 'debts':
        setDebts(debts.map(item => item.id === editingId ? updatedItem : item));
        break;
      case 'monthlyExpenses':
        setMonthlyExpenses(monthlyExpenses.map(item => item.id === editingId ? updatedItem : item));
        break;
      case 'guaranteeFund':
        setGuaranteeFund(guaranteeFund.map(item => item.id === editingId ? updatedItem : item));
        break;
      case 'thirteenthSalary':
        setThirteenthSalary(thirteenthSalary.map(item => item.id === editingId ? updatedItem : item));
        break;
      default:
        break;
    }

    setEditingId(null);
    setEditedValue(null);
    setNewDescription("");
  };

  const handleChangeValue = (e) => {
    setEditedValue(e.target.value);
  };

  const handleChangeDescription = (e) => {
    setNewDescription(e.target.value);
  };



  const calculateRemaining = (category) => {
    let total = 0;
    switch (category) {
      case 'debts':
        total = debts.reduce((sum, item) => sum + item.value, 0);
        break;
      case 'monthlyExpenses':
        total = monthlyExpenses.reduce((sum, item) => sum + item.value, 0);
        break;
      case 'guaranteeFund':
        total = guaranteeFund.reduce((sum, item) => sum + item.value, 0);
        break;
      case 'thirteenthSalary':
        total = thirteenthSalary.reduce((sum, item) => sum + item.value, 0);
        break;
      default:
        break;
    }
    return total;
  }




  const ind = Meses && Meses.findIndex(dados=> dados.id == mes)

  const {dividas,gastosMensais} = Meses[ind] || []


  //Salves Debitos
  const SalveDebs = async (index) => {
    if (ind < 0) {
      await updateDoc(doc(db, `Organizador/${user.email}/meses`, `${mes}`), {
          dividas: [{
            id:debts.length,
            description:debts[debts.length - 1].description,
            value:debts[debts.length - 1].value
          }]
      }).then(()=> {
        console.log('adicionado')
      }).catch(e=> console.error(e))

    } else {
      if (index < 0) {
        const resultDividas = [...dividas, {
          id: dividas.length,
          description:debts[debts.length -1].description,
          value:debts[debts.length -1].value
        }]
        await updateDoc(doc(db, `Organizador/${user.email}/meses`, `${mes}`), {
          dividas : resultDividas
        })
      } else {
        dividas[index].description = newDescription
        dividas[index].value = parseFloat(editedValue)
        await updateDoc(doc(db, `Organizador/${user.email}/meses`, `${mes}`), {
          dividas : [...dividas]
        })
      }
      
    }
  }
  const DeleteDebs = async(id) => {
    dividas.splice(id, 1)
    await updateDoc(doc(db, `Organizador/${user.email}/meses`, `${mes}`), {
      dividas : [...dividas]
    })
  }




 
  //Salve GastosMensais
  const SalveMonth = async (index, id) => {
    if (ind < 0) {
      await updateDoc(doc(db, `Organizador/${user.email}/meses`, `${mes}`), {
        gastosMensais: [{
          id:monthlyExpenses.length,
          description:monthlyExpenses[monthlyExpenses.length - 1].description,
          value:monthlyExpenses[monthlyExpenses.length - 1].value
        }]
          
    })
    }else {
      if (index < 0) {
        const resultGastos = [...gastosMensais, {
          id: gastosMensais.length,
          description:monthlyExpenses[monthlyExpenses.length -1].description,
          value:monthlyExpenses[monthlyExpenses.length -1].value
        }]
        await updateDoc(doc(db, `Organizador/${user.email}/meses`, `${mes}`), {
          gastosMensais : resultGastos
        })
      } else {
        gastosMensais[index].description = newDescription
        gastosMensais[index].value = parseFloat(editedValue)
        await updateDoc(doc(db, `Organizador/${user.email}/meses`, `${mes}`), {
          gastosMensais : [...gastosMensais]
        })
      }
      
    }
  }
  const DeleteMonth = async(id) => {
    gastosMensais.splice(id, 1)
    await updateDoc(doc(db, `Organizador/${user.email}/meses`, `${mes}`), {
      gastosMensais : [...gastosMensais]
    })
  }

 

var resultadoGastosMensais = gastosMensais && gastosMensais.reduce(function(soma, atual) {
  return soma + atual.value;
}, 0)

var resultadoDividas = dividas && dividas.reduce(function(soma, atual) {
  return soma + atual.value;
}, 0)

  const renderContent = () => {
    switch (selectedCategory) {
      case 'debts':
        return (
          <div className={styles.content}>
            <h3>Dívidas</h3>
            <ul >
              {dividas && dividas.map((debt,id) => (
                <li key={debt.id} className={styles.listItem}>
                  {editingId === debt.id ? (
                    <div>
                      <input
                        type="text"
                        value={newDescription}
                        onChange={handleChangeDescription}
                      />
                      <input
                        type="number"
                        value={editedValue}
                        onChange={handleChangeValue}
                      />
                      <button onClick={() => {
                        handleSaveEdit('debts')
                        SalveDebs(id, debt.id)
                        }} className={styles.saveButton}>Salvar</button>
                    </div>
                  ) : (
                    <div>
                      {debt.description}: <span className={styles.amount}>R${debt.value}</span>
                      <button onClick={() => handleEdit('debts', debt.id, debt.value, debt.description)} className={styles.editButton}>Editar</button>
                      <button onClick={() =>{
                         handleDelete('debts', debt.id)
                         DeleteDebs(id)
                         }} className={styles.deleteButton}>X</button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
            <button onClick={() => {
              handleAdd('debts', 'Nova Dívida', 100)
              SalveDebs(-1)
            }} className={styles.addButton}
              
              >Adicionar Dívida</button>
            <p>Total Dívidas: R${resultadoDividas && resultadoDividas.toFixed(2)}</p>
          </div>
        );
      case 'monthlyExpenses':
        return (
          <div className={styles.content}>
            <h3>Gastos Mensais</h3>
            <ul>
              {gastosMensais && gastosMensais.map((expense, id)=> (
                <li key={expense.id} className={styles.listItem}>
                  {editingId === expense.id ? (
                    <div>
                      <input
                        type="text"
                        value={newDescription}
                        onChange={handleChangeDescription}
                      />
                      <input
                        type="number"
                        value={editedValue}
                        onChange={handleChangeValue}
                      />
                      <button onClick={() => {
                        handleSaveEdit('monthlyExpenses')
                        SalveMonth(id, expense.id)
                        }} className={styles.saveButton}>Salvar</button>
                    </div>
                  ) : (
                    <div>
                      {expense.description}: <span className={styles.amount}>R${expense.value}</span>
                      <button onClick={() => handleEdit('monthlyExpenses', expense.id, expense.value, expense.description)} className={styles.editButton}>Editar</button>
                      <button onClick={() => {
                        handleDelete('monthlyExpenses', expense.id)
                        DeleteMonth(id)
                        }} className={styles.deleteButton}>X</button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
            <button onClick={() => {
              handleAdd('monthlyExpenses', 'Nova Conta de Luz', 250)
              SalveMonth(-1)
              }} className={styles.addButton}>Adicionar Gasto</button>
            <p>Total Gastos Mensais: R${resultadoGastosMensais && resultadoGastosMensais.toFixed(2)}</p>
          </div>
        );
      case 'guaranteeFund':
        return (
          <div className={styles.content}>
            <h3>Fundo de Garantia</h3>
            <ul>
              {guaranteeFund.map(fund => (
                <li key={fund.id} className={styles.listItem}>
                  {editingId === fund.id ? (
                    <div>
                      <input
                        type="text"
                        value={newDescription}
                        onChange={handleChangeDescription}
                      />
                      <input
                        type="number"
                        value={editedValue}
                        onChange={handleChangeValue}
                      />
                      <button onClick={() => handleSaveEdit('guaranteeFund')} className={styles.saveButton}>Salvar</button>
                    </div>
                  ) : (
                    <div>
                      {fund.description}: <span className={styles.amount}>R${fund.value}</span>
                      <button onClick={() => handleEdit('guaranteeFund', fund.id, fund.value, fund.description)} className={styles.editButton}>Editar</button>
                      <button onClick={() => handleDelete('guaranteeFund', fund.id)} className={styles.deleteButton}>X</button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
            <button onClick={() => handleAdd('guaranteeFund', 'Novo Fundo', 200)} className={styles.addButton}>Adicionar Fundo</button>
            <p>Total Fundo de Garantia: R${calculateRemaining('guaranteeFund')}</p>
          </div>
        );
      case 'thirteenthSalary':
        return (
          <div className={styles.content}>
            <h3>Décimo Terceiro</h3>
            <ul>
              {thirteenthSalary.map(salary => (
                <li key={salary.id} className={styles.listItem}>
                  {editingId === salary.id ? (
                    <div>
                      <input
                        type="text"
                        value={newDescription}
                        onChange={handleChangeDescription}
                      />
                      <input
                        type="number"
                        value={editedValue}
                        onChange={handleChangeValue}
                      />
                      <button onClick={() => handleSaveEdit('thirteenthSalary')} className={styles.saveButton}>Salvar</button>
                    </div>
                  ) : (
                    <div>
                      {salary.description}: <span className={styles.amount}>R${salary.value}</span>
                      <button onClick={() => handleEdit('thirteenthSalary', salary.id, salary.value, salary.description)} className={styles.editButton}>Editar</button>
                      <button onClick={() => handleDelete('thirteenthSalary', salary.id)} className={styles.deleteButton}>X</button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
            <button onClick={() => handleAdd('thirteenthSalary', 'Novo Décimo Terceiro', 1200)} className={styles.addButton}>Adicionar 13º</button>
            <p>Total Décimo Terceiro: R${calculateRemaining('thirteenthSalary')}</p>
          </div>
        );
        case 'geral':
        return (
                <MonthlyOverview/>
                );
                case 'diaria':
        return (
                <Dashboard/>
                );
      default:
        return null;
    }
  };


  

  return (
    <div className={styles.dashboard}>
      <NavBar/>
      <div className={styles.mainContent}>
        {renderContent()}
      </div>
    </div>
  );
};

export default MonthlyDashboard;
