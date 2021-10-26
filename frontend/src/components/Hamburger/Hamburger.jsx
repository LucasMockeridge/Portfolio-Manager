import React from 'react';
import styles from './Hamburger.module.css'

const Hamburger = ({ clicked, setClicked }) => {
    return (
            <div className={styles.menu} onClick={() => setClicked(!clicked)}>
                <div className={clicked ? styles.rotate : undefined}></div>
                <div className={clicked ? styles.disappear : undefined}></div>
                <div className={clicked ? styles.rotate : undefined}></div>
            </div>
    )
}

export default Hamburger
