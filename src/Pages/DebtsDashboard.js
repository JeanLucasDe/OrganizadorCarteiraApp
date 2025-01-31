import { useOutletContext } from "react-router-dom"
import styles from "./DebtsDashboard.module.css"
import { getFirestore, collection, getDocs,doc, setDoc, updateDoc, deleteDoc} from "@firebase/firestore";
import { useEffect, useState } from "react";
import moment from "moment";

export default function DebtsDashboard () {

    const [ind, db, user, mes, dividas,resultadoDividas] = useOutletContext()


    const [dados, setDados] = useState([]); // Criando cópia do array
    
    const dataAtual = moment();
    var vencimento = dataAtual.add(1,"month")
    vencimento = vencimento.format('YYYY-MM-DD')

    useEffect(() => {
        if (dividas && dividas.length > 0) {
          setDados([...dividas]); // Atualiza quando os dados chegarem
        }
      }, [dividas]); // Executa sempre que dadosOriginais mudar


    const HandleAddDebt = async() => {
        const novoItem = { id: dados.length + 1, description: "Nova Dívida", value: 100, vencimento}; // Objeto predefinido
        setDados((prev) => [...prev, novoItem]); // Adiciona o novo item ao array
        await updateDoc(doc(db, `Organizador/${user.email}/meses`, `${mes}`), {
            dividas : dados
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
    
    const SalveDebs = async (index) => {
        setEdit(false)
        setHandleEditValue(null)
        dividas[index].description = newDescription ? newDescription : dividas[index].description
        dividas[index].value = editedValue ? parseFloat(editedValue) : dividas[index].value
        await updateDoc(doc(db, `Organizador/${user.email}/meses`, `${mes}`), {
            dividas : dados
        })
    }


    const DeleteDebs = async(index) => {
        const novoArray = dados.filter((item) => item.id !== index);
        setDados((prev) => {
            const novoArray = prev.filter((item) => item.id !== index);
            return novoArray.length > 0 ? novoArray : []; // Retorna array vazio corretamente
        });
        await updateDoc(doc(db, `Organizador/${user.email}/meses`, `${mes}`), {
            dividas : novoArray
        })
    }

    return (
        <>
        <div className={styles.content}>
            {user && <button className={styles.btn_fluter} onClick={HandleAddDebt}>+</button>}
            <h3>Dívidas</h3>
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
                            <p>{moment(debts.vencimento).format('DD/MM/YYYY')}</p>
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