import React, { useEffect, useRef, useState } from 'react';
import styles from './Kebab.module.css'

export const useClickOutside = (action) => {
    const domNodeRef = useRef()
    useEffect(()=>{
        let handler = (e) => {
            if(domNodeRef.current && !domNodeRef.current.contains(e.target)){
                action()
            }
        }
        document.addEventListener('click', handler)
        return () => {
            document.removeEventListener('click', handler)
        }
    }, [action])
    return domNodeRef
}

const Kebab = ({ stock, options }) => {
    const [clicked, setClicked] = useState(false) 

    return (
        <div ref={useClickOutside(()=> setClicked(false))} className={styles.kebabWrapper} onClick={() => setClicked(!clicked)}>
            {clicked ? <div className={styles.kebabMenu}>
                    {options}
                </div> : undefined}
            <svg className={styles.kebab} enableBackground="new 0 0 515.555 515.555" viewBox="0 0 515.555 515.555" xmlns="http://www.w3.org/2000/svg"><path d="m303.347 18.875c25.167 25.167 25.167 65.971 0 91.138s-65.971 25.167-91.138 0-25.167-65.971 0-91.138c25.166-25.167 65.97-25.167 91.138 0"/><path d="m303.347 212.209c25.167 25.167 25.167 65.971 0 91.138s-65.971 25.167-91.138 0-25.167-65.971 0-91.138c25.166-25.167 65.97-25.167 91.138 0"/><path d="m303.347 405.541c25.167 25.167 25.167 65.971 0 91.138s-65.971 25.167-91.138 0-25.167-65.971 0-91.138c25.166-25.167 65.97-25.167 91.138 0"/></svg>
        </div>
    )
}

export default Kebab
