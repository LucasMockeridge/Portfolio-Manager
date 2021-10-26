import React, {useState} from 'react';
import { Tablebar, Pathbar, Header, Container, Table, Form, Kebab } from '../../components';
import { deleteStock, addStock, editThesis, getQuote } from '../../api'
import { useGlobalContext } from '../../context.js'

const Watchlist = () => {
    const [form, setForm] = useState(false);
    const [type, setType] = useState(null)
    const [symbol, setSymbol] = useState(null)
    const [id, setId] = useState(null)
    const [thesis, setThesis] = useState(null)
    const { user, loading, setUserData, userData, formatNum} = useGlobalContext()

    const revealForm = (type, name, id, thesis) => {
        setType(type)
        setSymbol(name)
        setId(id)
        setThesis(thesis)
        setForm(true)
    }

    if(!loading){
        const { watchlist, quotes } = userData
        const tableHeaders = ["Name", "Price", "Change", "Thesis"]
        const options = (name, id, thesis) => {
            return (
                <>
                    <div onClick={() => revealForm("Edit Thesis", name, id, thesis)}>Edit Thesis</div>
                    <div onClick={() => removeStock(name, id)}>Delete</div>
                </>
            )
        }
        const tableData = watchlist.map((stock) => {
            const { _id, name, thesis } = stock
            const quote = quotes.filter(quote => quote.name === name)[0] 
            const { price, change} = quote 

            return(
                    <tr key={_id}>
                        <td>{name}</td>
                        <td>{formatNum(price)}</td>
                        <td className={change[0] === '+' ? 'green' : 'red'}>{change[0] + formatNum(change.slice(1,change.length-1)) + '%'}</td>
                        <td>{thesis}</td>
                        <td><Kebab options={options(name, _id, thesis)} /></td>
                    </tr>
                )
            })

        const removeStock = async (name, id) => {
            const body = { 
                _id: user.id,
                list: "watchlist",
                name: name,
                stockId: id
            }
            await deleteStock(body)
            const data = JSON.parse(JSON.stringify(userData))
            const newWatchlist = data.watchlist.filter(stock => stock._id !== id)
            data.watchlist = newWatchlist
            setUserData(data)
        }

        const postStock = async (e, text) => {
            e.preventDefault()
            const body = {_id: user.id, ...text}
            if(!watchlist.find(stock => stock.name === text.name)){
                const { _id } = await addStock(body)
                const data = JSON.parse(JSON.stringify(userData)) 
                if(!quotes.find(quote => quote.name === text.name)){
                    const quote = await getQuote(text.name)
                    data.quotes.push(quote)
                }
                data.watchlist.push({_id, ...text})
                setUserData(data)
                setForm(false)
            } else{
                setForm(false)
            }
        } 

        const patchThesis = async (e, text) => {
            e.preventDefault()
            const body = {_id: user.id, list: "watchlist", ...text}
            await editThesis(body)
            const data = JSON.parse(JSON.stringify(userData))
            data.watchlist.find(stock => stock._id === text.stockId).thesis = text.thesis
            setUserData(data)
            setForm(false)
        }

        return (
            <Container children={
                <>
                    {form && <Form setForm={setForm} id={type==="Edit Thesis" ? id : undefined} handler={type === "Add Stock" ? postStock : patchThesis} type={type} name={type === "Edit Thesis" ? symbol : null} thesis={type==="Edit Thesis" ? thesis : null} />}
                    <Pathbar path="Home > " current="Watchlist" date={quotes.length > 0 && watchlist.length > 0 ? quotes[0].time : null}/>
                    <Header value="Your Watchlist"/>
                    <Tablebar value="Stocks" handler={()=> revealForm("Add Stock")} text="+ Add Stock"/>
                    <Table headers={tableHeaders} data={tableData} father="watchlist"/>
                </>
            } />
        )
    }
    return null
}

export default Watchlist;
