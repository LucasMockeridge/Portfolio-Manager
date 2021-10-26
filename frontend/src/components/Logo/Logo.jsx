import React from 'react'
import styles from './Logo.module.css'

const Logo = () => {
    return (
        <div className={styles.logoWrapper}>
            <div className={styles.logo}>$</div> 
            <h1 className={styles.thesis}>Thesis</h1>
        </div>
    )
}

export default Logo
