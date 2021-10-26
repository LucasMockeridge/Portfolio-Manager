import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router';
import { Container, Header, Pathbar, Stats } from '../../components'
import { useGlobalContext } from '../../context'
import { getQuote } from '../../api'
import styles from './Quote.module.css'

const Quote = () => {
    const { name } = useParams()
    const [displayName, setDisplayName] = useState(null)
    const { loading, userData, setUserData } = useGlobalContext()
    const [quote, setQuote] = useState(null)

    useEffect(()=>{
        const searchQuote = async () => {
            const search = userData.quotes.find(stock => stock.name === name)
            setQuote(search)
            if(!search){
                const data = await getQuote(name)
                const cloneData = JSON.parse(JSON.stringify(userData))
                cloneData.quotes.push(data)
                setUserData(cloneData)
                setQuote(data)
                setDisplayName(name)
            }
        }
        if(!loading){
            searchQuote()
        }
    },[loading, name, setUserData])

    if(!loading){
        return (
            <Container children={
                <>
                <Pathbar path="Home > Quote > " current={name}/>
                <Header value={quote ? name : displayName}/>
                {quote?.price && <Stats value={quote?.price} change={quote?.change} />}
                <div className={styles.frameWrapper}>
                    <iframe title="chart" style={{height: '40vw'}} src={'https://widget.finnhub.io/widgets/stocks/chart?symbol=' + name + '&textColor=black'}></iframe>
                </div>
                </>
            }/>
        )
        
    }
    return null
}

export default Quote
