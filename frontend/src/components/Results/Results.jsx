import React, {useEffect, useState} from 'react'
import { Header, Container, Pathbar, Table} from '../../components'
import { getSearch } from '../../api'
import {useHistory, useLocation} from 'react-router'
import { useGlobalContext } from '../../context'
import styles from './Results.module.css'

const Results = () => {
    const { search } = useLocation()
    const history = useHistory()
    const [results, setResults] = useState(null)
    const { user } = useGlobalContext()
    const [displayQuery, setDisplayQuery] = useState(null) 
        useEffect(()=>{
        const getResults = async () => {
            const searchQuery = search.slice(2,search.length)
            const data = await getSearch(searchQuery)
            setResults(data)
            setDisplayQuery(searchQuery)
        }
        if(user){
            getResults()
        }
    }, [search, user])

    if(results){
        const { count, result } = results
        const tableData = result.map((stock, index)=>{
            const { symbol, description, type } = stock
            return(
                <tr onClick={()=> history.push('/quote/' + symbol)} className={styles.resultRow} key={index}>
                    <td>{symbol}</td>
                    <td>{description}</td>
                    <td>{type}</td>
                </tr>
            )
        })
        return (
            <Container children={
                <>
                    <Pathbar path='Home > Search > ' current={displayQuery}/>
                    <Header value={count + ' Results for ' + displayQuery}/>
                    <Table headers={['Symbol', 'Description', 'Type']} data={tableData}/>
                </>
            } />
        )
    }
    return null
}

export default Results
