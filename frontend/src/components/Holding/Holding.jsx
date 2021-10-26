import React, { useState } from 'react';
import { useParams } from 'react-router-dom'
import { addHolding, removeHolding, editHolding } from '../../api'
import { useGlobalContext } from '../../context'
import { Tablebar, Pathbar, Header, Stats, Container, Form, Table, Kebab } from '../../components';

const Holding = () => {
    const { user, loading, setUserData, userData, formatNum } = useGlobalContext()
    const { name } = useParams()
    const [form, setForm] = useState(false);
    const [type, setType] = useState(null)
    const [price, setPrice] = useState(null)
    const [amount, setAmount] = useState(null)
    const [id, setId] = useState(null)

    const revealForm = (type, price, amount, id) => {
        setType(type)
        setPrice(price)
        setAmount(amount)
        setId(id)
        setForm(true)
    }

    if(!loading){
        const { portfolio, quotes } = userData
        const stock = portfolio.find(item => item.name === name)
        if(stock){
            const holdings = stock.holdings
            const tableHeaders = ["Date", "Price", "Amount"]
            const options = (_id, price, amount) => {
                return (
                    <>
                        <div onClick={() => revealForm("Edit Holding", price, amount, _id)}>Edit Holding</div>
                        <div onClick={() => deleteHolding(_id)}>Delete</div>
                    </>
                )
            }
            const tableData = holdings.map((holding) => {
                const { _id, date, price, amount } = holding
                return (
                    <tr key={_id}>
                        <td>{date}</td>
                        <td>{formatNum(price)}</td>
                        <td>{formatNum(amount)}</td>
                        <td><Kebab options={options(_id, price, amount)} /></td>
                    </tr>
                )
            })

            const deleteHolding = async (id) => {
                const body = {_id: user.id, name, holdingId: id}
                await removeHolding(body)
                const data = JSON.parse(JSON.stringify(userData))
                const index = portfolio.findIndex(stock => stock.name === name) 
                const stock = data.portfolio[index]
                stock.holdings = stock.holdings.filter(holding => holding._id !== id)
                if(stock.holdings.length === 0){
                    data.portfolio = data.portfolio.filter(stock => stock.name !== name)
                }
                setUserData(data)
            }

            const postHolding = async (e, text) => {
                e.preventDefault()
                const body = {_id: user.id, name, ...text}
                const { _id, date } = await addHolding(body)
                const data = JSON.parse(JSON.stringify(userData))
                const index = portfolio.findIndex(stock => stock.name === name)
                const stock = data.portfolio[index]
                stock.holdings.push({_id, date, price: Number(text.price), amount: Number(text.amount)})
                setUserData(data)
                setForm(false)
            }

            const patchHolding = async (e, text) => {
                e.preventDefault()
                if(text){
                    const body = {_id: user.id, name, ...text}
                    await editHolding(body)
                    const data = JSON.parse(JSON.stringify(userData))
                    const index = portfolio.findIndex(stock => stock.name === name)
                    const stock = data.portfolio[index]
                    stock.holdings = stock.holdings.map(holding => holding._id === text.holdingId ? {...holding, price: Number(text.price), amount: Number(text.amount)} : {...holding})
                    setUserData(data)
                    setForm(false)
                }
            }

            const quote = quotes.find(quote => quote.name === name)
            const totalHoldings = stock.holdings.map(holding => holding.amount).reduce((total, amount) => amount + total)
            const position = stock.holdings.map(holding => holding.price*holding.amount).reduce((a, b)=> a + b, 0)
            const marketValue = quote.price * totalHoldings
            const totalChange = (marketValue-position) / position * 100

            return(
                <Container children={
                    <>
                        {form && <Form setForm={setForm} name={name} id={id} price={type==="Edit Holding" ? price : null} amount={type==="Edit Holding" ? amount : null} type={type} handler={type==="Add Holding Two" ? postHolding : patchHolding}/>}
                        <Pathbar path= 'Home > Holding > ' current={name} date={quotes[0].time}/>
                        <Header value={'Your ' + name + ' Holdings'}/>
                        <Stats value={marketValue} change={quote.change} totalChange={totalChange}/>
                        <Tablebar value="Holdings" handler={()=>revealForm("Add Holding Two")} text="+ Add Holding"/>
                        <Table headers={tableHeaders} data={tableData} father="holding"/>
                    </>
                } />
            )
        }
    }
    return null
}

export default Holding
