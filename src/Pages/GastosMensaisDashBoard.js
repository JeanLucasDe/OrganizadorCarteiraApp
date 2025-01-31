import { useOutletContext } from "react-router-dom"
import styles from "./DebtsDashboard.module.css"
import { getFirestore, collection, getDocs,doc, setDoc, updateDoc, deleteDoc} from "@firebase/firestore";
import { useEffect, useState } from "react";
import moment from "moment";

export default function GastosMensaisDashboard () {

    const [ind, db, user, mes, dividas,resultadoDividas,gastosMensais, resultadoGastosMensais] = useOutletContext()
    const dataAtual = moment();
    var vencimento = dataAtual.add(1,"month")
    vencimento = vencimento.format('YYYY-MM-DD')


    const [dados, setDados] = useState([]); // Criando cópia do array

    useEffect(() => {
        if (gastosMensais && gastosMensais.length > 0) {
          setDados([...gastosMensais]); // Atualiza quando os dados chegarem
        }
      }, [gastosMensais]); // Executa sempre que dadosOriginais mudar


    const HandleAddDebt = async() => {
        const novoArray = []
        const novoItem = { description: "Novo Gasto", value: 100 , vencimento}; // Objeto predefinido
        setDados((prev) => [...prev, novoItem]); // Adiciona o novo item ao array
        novoArray.push(...dados, novoItem)
        await updateDoc(doc(db, `Organizador/${user.email}/meses`, `${mes}`), {
            gastosMensais : novoArray
        })
    }

    const [handleEdit,setEdit] = useState(false)
    const [handleEditValue, setHandleEditValue] = useState(null)

    const SelectID = (id) => {
        setHandleEditValue(id)
        setEdit(true)
    }

    const [editedValue, setEditedValue] = useState(null);
    const [newDescription, setNewDescription] = useState("");
    const [newDate, setNewDate] = useState('') 
    
    const SalveDebs = async (index) => {
        setEdit(false)
        setHandleEditValue(null)

        dados[index].description = newDescription ? newDescription : dados[index].description
        dados[index].value = editedValue ? parseFloat(editedValue) : dados[index].value
        dados[index].vencimento = newDate ? moment(newDate).format('YYYY-MM-DD') : dados[index].vencimento

        await updateDoc(doc(db, `Organizador/${user.email}/meses`, `${mes}`), {
            gastosMensais : dados
        })
        
    }


    const DeleteDebs = async(index) => {
        const novoArray = dados.filter((item, id) => id !== index);
        setDados((prev) => {
            const novoArray = prev.filter((item,id) => id !== index);
            return novoArray.length > 0 ? novoArray : []; // Retorna array vazio corretamente
        });
        await updateDoc(doc(db, `Organizador/${user.email}/meses`, `${mes}`), {
            gastosMensais : novoArray
        })
    }

    return (
        <>
        <div className={styles.content}>
            {user && <button className={styles.btn_fluter} onClick={HandleAddDebt}>+</button>}
            <h3>Gastos Mensais</h3>
            <ul className={styles.list}>
                {dados && dados.map((debts, id)=> {
                    return (
                    <li className={styles.item}>
                        <div>
                            {handleEditValue === id  ?
                            <input 
                            type="text"
                            defaultValue={debts.description}
                            onChange={(e)=> setNewDescription(e.target.value)}
                            />
                            :
                            <p>{debts.description}</p>
                            }
                            {handleEditValue === id  ?
                            <input 
                            type="date"
                            defaultValue={debts.vencimento}
                            onChange={(e)=> setNewDate(e.target.value)}
                            />
                            :
                            <p>{moment(debts.vencimento).format('DD/MM/YYYY')}</p>
                            }
                            
                            {handleEditValue === id ?
                            <input 
                            type="number"
                            defaultValue={debts.value.toFixed(2)}
                            onChange={(e)=> setEditedValue(e.target.value)}
                            />
                            :
                            <p>R$ {debts.value.toFixed(2)}</p>
                            }
                            {handleEdit && handleEditValue === id && <button onClick={() => {
                                SalveDebs(id)
                            }}>salve</button>}
                        </div>
                        <div>
                            <p type='button' onClick={() => SelectID(id)}>✏️</p>
                            <p type="button" onClick={() => DeleteDebs(id)}>X</p>
                        </div>
                    </li>

                    )
                })}
            </ul>
            
        </div>

        </>
    )
}