import React from 'react';
import styles from './Stats.module.css'
import {useGlobalContext} from '../../context'

const Stats = ({value, change, totalChange}) => {
    const { formatNum } = useGlobalContext()
    const displayChange = change >= 0 ? "+" + formatNum(change) : formatNum(change)
    let displayTotalChange = null
    if(totalChange){
        displayTotalChange = totalChange >= 0 ? formatNum(totalChange): formatNum(String(totalChange).slice(1,totalChange.length))
    }
    return (
        <>
            <div className={styles.statsWrapper}>
                <h1>${formatNum(value)}</h1>
                <div className={change >= 0 ? styles.bgGreen : styles.bgRed}>{displayChange}%</div>
            </div>
            {totalChange && <p className={styles.totalChange}><span className={totalChange >= 0 ? 'green' : 'red'}>{totalChange >= 0 ? "Up" : "Down"} by {displayTotalChange}%</span> since you began investing</p>}
        </>
    )
}

export default Stats
