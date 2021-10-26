import React, {useState} from 'react';
import { Tablebar, Pathbar, Header, Stats, Container, Form, Table, Kebab } from '../../components';
import { deleteStock, addHolding, getQuote, editThesis } from '../../api'
import { useGlobalContext } from '../../context'
import {Link} from 'react-router-dom';

const Portfolio = () => {
    const [form, setForm] = useState(false);
    const { user, loading, setUserData, userData, formatNum } = useGlobalContext()
    const [type, setType] = useState(null)
    const [symbol, setSymbol] = useState(null)
    const [id, setId] = useState(null)
    const [thesis, setThesis] = useState(null)

    const revealForm = (type, name, id, thesis) => {
        if(type === "Edit Thesis"){
            setSymbol(name)
            setId(id)
            setThesis(thesis)
        }
        setType(type)
        setForm(true)
    }

    if(!loading){
        const { portfolio, quotes } = userData
        let positions = 0
        let value = 0
        let previousValue = 0
        let change = 0
        let totalChange = 0
        if(portfolio.length !== 0){
            positions = portfolio.map((stock, index)=>{
            let position = 0
            if(stock.holdings.length !== 0){
                position = stock.holdings.map(holding => holding.price*holding.amount).reduce((a, b)=> a + b, 0)
            }
            return position
        }).reduce((a,b)=> a+b, 0)
            value = portfolio.map((stock, index)=>{
            let price = quotes.filter(item => item.name === stock.name)[0].price
            let holdings = 0
            if(stock.holdings.length !== 0){
                holdings = stock.holdings.map(holding => holding.amount).reduce((total, amount) => amount + total)             
            }
            return price * holdings
            }).reduce((a, b)=> a+b, 0)
            previousValue = portfolio.map((stock, index)=>{
            let close = quotes.filter(item => item.name === stock.name)[0].close
            let holdings = 0
            if(stock.holdings.length !== 0){
                holdings = stock.holdings.map(holding => holding.amount).reduce((total, amount) => amount + total)
            }
            return close * holdings
            }).reduce((a, b)=> a+b, 0)
        
            change = (value - previousValue) / previousValue * 100
            totalChange = (value - positions) / positions * 100
        }

        const tableHeaders = ["Name", "Price", "Change", "Total Change", "Average", "Holdings", "Thesis"] 
        const options = (name, id, thesis) => {
            return (
                <>
                    <Link to={'/holding/' + name}> <div>View Holdings</div> </Link>
                    <div onClick={()=> revealForm("Edit Thesis", name, id, thesis)}>Edit Thesis</div>
                    <div onClick={()=> removeStock(name, id)}>Delete</div>
                </>
            )
        }

        const removeStock = async (name, id) => {
            const body = { 
                _id: user.id,
                list: "portfolio",
                name: name,
                stockId: id
            }
            await deleteStock(body)
            const data = JSON.parse(JSON.stringify(userData))
            const newPortfolio = data.portfolio.filter(stock => stock._id !== id)
            data.portfolio = newPortfolio
            setUserData(data)
        }

        const patchThesis = async (e, text) => {
            e.preventDefault()
            const body = {_id: user.id, list: "portfolio", ...text}
            await editThesis(body)
            const data = JSON.parse(JSON.stringify(userData))
            data.portfolio.find(stock => stock._id === text.stockId).thesis = text.thesis
            setUserData(data)
            setForm(false)
        }

        const postHolding = async (e, text) => {
            e.preventDefault()
            const body = {_id: user.id, ...text}
            const data = JSON.parse(JSON.stringify(userData))
            const index = data.portfolio.findIndex(stock => stock.name === text.name)
            if(index >= 0){
                const { _id, date } = await addHolding(body)
                const stock = data.portfolio[index] 
                if(text.thesis && text.thesis !== stock.thesis){
                    stock.thesis = text.thesis
                }
                stock.holdings.push({_id, date, price: Number(text.price), amount: Number(text.amount)})
                setUserData(data)
                setForm(false)
            } else{
                const { _id, holdingId, date } = await addHolding(body)
                if(!quotes.find(quote => quote.name === text.name)){
                    const quote = await getQuote(text.name)
                    data.quotes.push(quote)
                }
                data.portfolio.push({_id, name: text.name, holdings:[{_id: holdingId, date, price: Number(text.price), amount: Number(text.amount)}], thesis: text.thesis})
                setUserData(data)
                setForm(false)
            }
        }

        const tableData = portfolio.map((stock) => {
            const { _id, name, thesis } = stock 
            const quote = quotes.filter(quote => quote.name === name)[0] 
            let holdings = 0
            let position = 0
            let averagePrice = 0
            let totalChange = 0
            const { price, change} = quote 
            if(stock.holdings.length !== 0){
                holdings = stock.holdings.map(holding => holding.amount).reduce((total, amount) => amount + total)
                position = stock.holdings.map(holding => holding.price*holding.amount).reduce((a, b)=> a + b, 0)
                averagePrice = position/holdings
                totalChange = ((price * holdings)-position) / position * 100
            }
            return (
                <tr key={_id}>
                <td>{name}</td>
                <td>{formatNum(price)}</td>
                <td className={change[0] === '+' ? 'green' : 'red'}>{change[0] + formatNum(change.slice(1,change.length)) + '%'}</td>
                <td className={totalChange >= 0 ? 'green' : 'red'}>{totalChange >=0 && '+'}{formatNum(totalChange) + "%"}</td>
                <td>{formatNum(averagePrice)}</td>
                <td>{formatNum(holdings)}</td>
                <td>{thesis}</td>
                    <td><Kebab options={options(name, _id, thesis)} /></td>
                </tr>
                )
            })
        
        return (
            <Container children={
                <>
                    {form && <Form setForm={setForm} id={type==="Edit Thesis" ? id : undefined} name={type==="Edit Thesis"? symbol: undefined} thesis ={type==="Edit Thesis" ? thesis : undefined} handler={type==="Add Holding" ? postHolding : patchThesis} type={type} />}
                    <Pathbar path='Home > ' current='Portfolio' date={quotes.length > 0 && portfolio.length > 0 ? quotes[0].time : null} />
                    <Header value="Your Portfolio" />
                    {(portfolio.length !== 0) && (previousValue !== 0) && (positions !== 0)?
                        <Stats value={value} change={change} totalChange={totalChange}/>
                        : null
                    }
                    <Tablebar value="Assets" handler={()=>revealForm("Add Holding")} text="+ Add Holding" />
                    <Table headers={tableHeaders} data={tableData} father="portfolio"/>
                </>
            } />
        )
    }
    return null
}       

export default Portfolio;
