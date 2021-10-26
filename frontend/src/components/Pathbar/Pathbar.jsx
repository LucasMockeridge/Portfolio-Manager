import React from 'react';
import styles from './Pathbar.module.css'

const Pathbar = ({path, current, date}) => {
    return (
        <div className={styles.pathbar}>
            <p className={styles.path}><span>{path}</span>{current}</p>
            {date && <p className={styles.lastUpdate}>Data last updated at {date}</p>}
        </div>
    )
}

export default Pathbar;
