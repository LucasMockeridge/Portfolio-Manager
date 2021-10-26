import React from 'react';
import { Button } from '../../components'
import styles from './Tablebar.module.css'

const Tablebar = ({handler, value, text}) => {
    return (
        <div className={styles.tablebar}>
            <h3>Your {value}</h3>
            <Button handler={handler} value={text} />
        </div>
    )
}

export default Tablebar;
