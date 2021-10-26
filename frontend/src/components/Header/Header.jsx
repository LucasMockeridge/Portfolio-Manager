import React from 'react';
import styles from './Header.module.css'

const Header = ({value}) => {
    return (
        <h2 className={styles.header}>{value}</h2>
    )
}

export default Header
