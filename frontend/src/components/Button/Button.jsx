import React from 'react';
import styles from './Button.module.css'

const Button = ({handler, value}) => {
    return (
        <button onClick={handler} className={styles.button}>{value}</button>
    )
}

export default Button;
