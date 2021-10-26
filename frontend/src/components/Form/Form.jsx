import React, {useState} from 'react';
import styles from './Form.module.css'
import { useClickOutside } from '../Kebab/Kebab.jsx';

const Form = ({ setForm, handler, type, name, price, amount, id, thesis }) => {
    const [ text, setText ] = useState(null)

    const onChange = (e) => {
        if(type === "Edit Thesis"){
            setText({...text, stockId: id, name, [e.target.name] : e.target.value})
        } else if(type==="Edit Holding"){
            let input = {...text, holdingId: id, [e.target.name] : e.target.value}
            if(!input.amount){
                input.amount = amount
            }
            if (!input.price){
                input.price = price
            }
            setText(input)
        }else {
            setText({...text, [e.target.name] : e.target.value})
        }
    }

    return (
        <div className={styles.formWrapper}>
            <div className={styles.formBg}></div>
            <form ref={useClickOutside(() => setForm(false))} onChange={(e)=> onChange(e)} className={styles.holdingForm} onSubmit={(e) => handler(e,text)}>
                <div className={styles.formContent}>
                <div onClick={()=> setForm(false)} className={styles.closeForm}>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <h2>{type === "Add Holding Two" ? "Add Holding" : type}</h2>
                <div>
                    <p>Ticker Symbol</p>
                    <input type="text" name="name" readOnly={type==="Edit Thesis" || type === "Edit Holding" || type === "Add Holding Two"} value={type === "Edit Thesis" || type === "Edit Holding" || type === "Add Holding Two" ? name : undefined}/>
                </div>
                {type !== "Edit Thesis" && type !== "Add Stock" && 
                <div className={styles.holdingWrapper}>
                    <div className={styles.quantityWrapper}>
                        <p>Quantity</p>
                        <input type="text" defaultValue={type==="Edit Holding" ? amount : undefined} name="amount" />
                    </div>
                    <div>
                        <p>Share Price</p>
                        <input type="text" defaultValue={type==="Edit Holding" ? price : undefined} name="price" />
                    </div>
                </div>
                }
                {type !== "Edit Transaction" && type !== "Edit Holding" && type !== "Add Holding Two"&&
                <div>
                    <p>Thesis</p>
                    <textarea name="thesis" defaultValue={type === "Edit Thesis" ? thesis : undefined}></textarea>
                </div>}
                <input type="submit" className={styles.holdingButton} value={type === "Add Holding Two" ? "Add Holding" : type} />
                </div>
            </form>
        </div>
    )
}

export default Form
