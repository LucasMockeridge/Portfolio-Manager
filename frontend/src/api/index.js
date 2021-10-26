import {useEffect} from 'react';

const API_KEY = 'API_KEY'
const url = 'https://finnhub.io/api/v1/quote?symbol='
const api = "&token=" + API_KEY
const SERVER = 'https://thethesisapi.herokuapp.com'

const getDBInfo = async (id) => { 
    const res = await fetch(SERVER + '/api/get/data/' + id)
    const data = res.json()
    return data
}

export const getSearch = async (search) => {
    const res = await fetch('https://finnhub.io/api/v1/search?q=' + search + api)
    const data = await res.json()
    return data
}

export const deleteUser = (body) => fetch(SERVER + '/api/delete/user', {
    method: 'DELETE',
    headers: {
            "Accept": 'application/json',
            "Content-Type": 'application/json'
        },
    body: JSON.stringify(body)
})

export const deleteStock = (body) => fetch(SERVER + '/api/delete/stock', {
        method: 'DELETE',
        headers: {
            "Accept": 'application/json',
            "Content-Type": 'application/json'
        },
        body: JSON.stringify(body)
    })

export const removeHolding = (body) => fetch(SERVER + '/api/delete/holding', {
        method: 'DELETE',
        headers: {
            "Accept": 'application/json',
            "Content-Type": 'application/json'
        },
        body: JSON.stringify(body)
    })

export const addHolding = (body) => fetch(SERVER + '/api/add/holding', {
        method: 'POST',
        headers: {
            "Accept": 'application/json',
            "Content-Type": 'application/json'
        },
        body: JSON.stringify(body)
    }).then(res => res.json())

export const addStock = (body) => fetch(SERVER + '/api/add/stock', {
        method: 'POST',
        headers: {
            "Accept": 'application/json',
            "Content-Type": 'application/json'
        },
        body: JSON.stringify(body)
    }).then((res) => res.json())

export const editThesis = (body) => fetch(SERVER + '/api/update/thesis', {
        method: 'PATCH',
        headers: {
            "Accept": 'application/json',
            "Content-Type": 'application/json'
        },
        body: JSON.stringify(body)
    })

export const editHolding = (body) => fetch(SERVER + '/api/update/holding', {
        method: 'PATCH',
        headers: {
            "Accept": 'application/json',
            "Content-Type": 'application/json'
        },
        body: JSON.stringify(body)
    })

export const getQuote = async (name) => {
    let res = await fetch(url + name + api)
    let data = await res.json()
    let change = (data.c - data.pc) / data.pc * 100
    let percentChange = change >= 0 ? "+" + change.toFixed(4) : change.toFixed(4)
    let date = new Date(data.t * 1000)
    let displayDate = date.toLocaleTimeString().slice(0,5) + " " + date.toLocaleDateString()
    return { name: name, price: data.c, change: percentChange, close: data.pc, time: displayDate}
}

const updateData = async (data) => {
    let userData = await data
    let portfolio = userData.portfolio.map(stock => stock.name)
    let watchlist = userData.watchlist.map(stock => stock.name)
    let stocks = portfolio.concat(watchlist)
    let quoteStocks = [...new Set(stocks)]
    let quotes = []
    for(var i=0; i<quoteStocks.length; i++){
        let quote = await getQuote(quoteStocks[i])
        quotes.push(quote)
    }
    return {...userData, quotes: quotes}
}

const useFetch = (getUser, setUser, setData, setLoading) => {
    const getData = async () => {
        setLoading(true)
        let data = await getUser()
        setUser(data)
        let user = await getDBInfo(data.id)
        let res = await updateData(user)
        setData(res)
        setLoading(false)
    }

    useEffect(() => {
        getData()
    }, [])
}

export default useFetch
