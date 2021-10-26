import React from 'react';
import styles from './Table.module.css'
const Table = ({ headers, data, father }) => {
    return (
        <div className={styles.tableWrapper}>
            <table className={`${styles.stockTable} ${styles[father + 'Table']}`}>
                <thead>
                    <tr>
                        {headers.map((header, index) => <th key={index}>{header}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {data}
                </tbody>
            </table>
        </div>
    )
}

export default Table
