import React, {useState} from 'react'
import {useHistory} from 'react-router'
import styles from './Searchbar.module.css'


const Searchbar = () => {
    const [search, setSearch] = useState("")
    const history = useHistory()

    const searchHandler = async (e) => {
        e.preventDefault()
        history.push('/search?=' + search)
    }

    return (
        <div className={styles.searchWrapper}>
            <svg className={styles.searchIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 13"><g strokeWidth="1.5" stroke="#a8a8a8" fill="none"><path d="M11.29 11.71l-4-4"/><circle cx="5" cy="5" r="4"/></g></svg> 
            <form onSubmit={searchHandler}>
                <input onChange={(e)=> setSearch(e.target.value)} className={styles.searchField} type='text' placeholder='Search' value={search} />
            </form>
        </div>
    )
}

export default Searchbar
