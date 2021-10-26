const express = require('express');
const cors = require('cors')
const mongoose = require('mongoose');
const querystring = require('querystring')
const axios = require('axios')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')

mongoose.connect('CONNECTION_STRING', { useUnifiedTopology: true, useNewUrlParser: true })
const app = express()
app.use(cors({origin: 'https://thethesis.netlify.app', credentials: true}))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

const CLIENT_ID = "CLIENT_ID" 
const CLIENT_SECRET = "CLIENT_SECRET"
const SERVER_URI = 'https://thethesisapi.herokuapp.com'
const CLIENT_URI = "https://thethesis.netlify.app"
const JWT_SECRET = "JWT_SECRET"
const COOKIE_NAME = "auth_token"
const REDIRECT_URI = "auth/google"

const getGoogleAuthURL = () => {
    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth"
    const options = {
    redirect_uri: `${SERVER_URI}/${REDIRECT_URI}`,
    client_id: CLIENT_ID,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
  };
    return `${rootUrl}?${querystring.stringify(options)}`;
}

const getTokens = (code, clientId, clientSecret, redirectUri) => {
    const url = 'https://oauth2.googleapis.com/token';
    const values = {
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code"
    }

    return axios.post(url, querystring.stringify(values), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
    .then((res) => res.data)
    .catch((error) => {
      console.error(`Failed to fetch auth tokens`);
      throw new Error(error.message);
    })
}

app.get('/auth/google/url', (req, res) => {
    return res.send(getGoogleAuthURL())
})

app.get('/auth/google', async (req, res) => {
    const code = req.query.code

    const { id_token, access_token } = await getTokens(code, CLIENT_ID, CLIENT_SECRET, `${SERVER_URI}/${REDIRECT_URI}`)

    const googleUser = await axios
    .get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
      {
        headers: {
          Authorization: `Bearer ${id_token}`,
        },
      }
    )
        .then((res) => res.data)
    .catch((error) => {
      console.error(`Failed to fetch user`);
      throw new Error(error.message);
    })

const token = jwt.sign(googleUser, JWT_SECRET);

  res.cookie(COOKIE_NAME, token, {sameSite: 'none', secure: true, maxAge: 365 * 24 * 60 * 60 * 1000});

  res.redirect(CLIENT_URI);
})

app.get("/auth/me", (req, res) => {
  try {
    const decoded = jwt.verify(req.cookies[COOKIE_NAME], JWT_SECRET);
    return res.send(decoded);
  } catch (err) {
    res.send(null);
  }
});

app.delete("/signout", (req, res) => {
	res.clearCookie(COOKIE_NAME, {sameSite: 'none', secure: true})
	res.send("Signed Out");
});

let stockSchema = new mongoose.Schema({
    _id: String,
    portfolio: [{_id: String, name: String, holdings: [{_id: String, date: String, price: Number, amount: Number}], thesis: String}],
    watchlist: [{_id: String, name: String, thesis: String}]
})

const Stock = mongoose.model('Stock', stockSchema)

const getDate = () => {
    let date = new Date(Date.now())
    return date.toLocaleTimeString().slice(0,-6) + " " + date.toLocaleDateString()
}

app.get('/api/get/data/:id', (req, res) => {
    Stock.findOne({_id: req.params.id}, (err, users) => {
        if(users){
            res.send(users)
        } else{
            Stock.create({_id: req.params.id }, (err, users) => {
                res.send(users)
            })
        }
    })
})

app.get('/api/get/portfolio', (req, res) => {
    Stock.findOne({_id: req.body._id}, (err, users) => {
        if(users){
            res.send(users.portfolio)
        }
    })
})

app.get('/api/get/watchlist', (req, res) => {
    Stock.findOne({_id: req.body._id}, (err, users) => {
        if(users){
            res.send(users.watchlist)
        }
    })
})

app.get('/api/get/holdings', (req, res) => {
    const { _id, name } = req.body
    Stock.findOne({_id: _id, portfolio : { $elemMatch: {
        name: name
    } }}, (err, users) => {
        if(users){
            const index = users.portfolio.map(stocks => stocks.name).indexOf(name)
            res.send(users.portfolio[index].holdings)
        }
    })
})

app.post('/api/add/user', (req, res) => {
    Stock.create({_id: new mongoose.Types.ObjectId().toHexString(), portfolio: [], watchlist: []}, (err) => {
        if(err){
            console.log(err)
        } else {
            res.send('Created')
        }
    })
})

app.post('/api/add/holding', (req, res) => {

    const { _id, name, price, amount, thesis } = req.body;

    Stock.findOne({_id: _id, portfolio : { $elemMatch: {
        name: name
    } }}, (err, users) => {
        if(users){
            const newHoldingId = new mongoose.Types.ObjectId().toHexString()
            const date = getDate()
            const index = users.portfolio.map(stocks => stocks.name).indexOf(name)
            if(thesis && users.portfolio[index].thesis !== thesis){
                users.portfolio[index].thesis = thesis
            }
            users.portfolio[index].holdings.push({"_id": newHoldingId, "date": date, "price": price, "amount": amount})
            users.save((err) => {
                if(err){
                    console.log(err)
                } else{
                    res.send({"_id": newHoldingId, "date":date})
                }
            })
        }
        else{
            const newStockId = new mongoose.Types.ObjectId().toHexString()
            const newHoldingId = new mongoose.Types.ObjectId().toHexString()
            const date = getDate()
            Stock.updateOne(
                {_id: _id}, 
                { $push: {"portfolio": {"_id": newStockId, "name": name, "holdings": [{"_id": newHoldingId, "date": date, "price" : price, "amount": amount}], "thesis": thesis} }}
                , (err)=>{
                    if(err){
                        console.log(err)
                    } else{
                        res.send({"_id": newStockId, "holdingId": newHoldingId, "date": date})
                    }
                })
        }
            
    }
)
})

app.post('/api/add/stock', (req, res) => {
    const { _id, name, thesis } = req.body;
    Stock.findOne({_id: _id}, (err, users) => {
        if(users){
            let newStockId = new mongoose.Types.ObjectId().toHexString()
            users.watchlist.push({"_id": newStockId, "name": name, "thesis": thesis})
            users.save((err) => {
                if(err){
                    console.log(err)
                } else{
                    res.send({"_id" : newStockId})
                }
            })
        }
    })

})

app.delete('/api/delete/stock', (req, res) => {
    const { _id, list, name, stockId } = req.body
    Stock.findOne({_id, _id}, (err, users) => {
        if(users){
            if(list === "watchlist"){
                const newList = users.watchlist.filter(stock => stock._id !== stockId)
                users.watchlist = newList
            } else if(list === "portfolio"){
                const newList = users.portfolio.filter(stock => stock._id !== stockId)
                users.portfolio = newList
            }
            users.save((err) => {
                if(err){
                    console.log(err)
                } else{
                    res.send('Deleted')
                }
            })
        }
    })
})

app.delete('/api/delete/user', (req, res) => {
    const { _id } = req.body
    Stock.deleteOne({_id: _id}, (err, users) => {
        if(err){
            console.log(err)
        } else{
            res.send('Deleted')
        }
    })
})


app.delete('/api/delete/holding', (req, res) => {
    const { _id, name, holdingId } = req.body
    Stock.findOne({_id: _id, portfolio : { $elemMatch : {
        name: name
    } }}, (err, users) => {
        if(users){
            const stockIndex = users.portfolio.map(stock => stock.name).indexOf(name);
            const newHoldings = users.portfolio[stockIndex].holdings.filter(holding => holding._id !== holdingId)
            if(newHoldings.length === 0){
                users.portfolio.splice(stockIndex, 1)
            }
            else {
            users.portfolio[stockIndex].holdings = newHoldings
            }
            users.save((err)=>{
                if(err){
                    console.log(err)
                } else{
                    res.send('Deleted')
                }
            })
    }})
})

app.patch('/api/update/holding', (req, res) => {
    const { _id, name, holdingId, price, amount } = req.body
Stock.findOne({_id: _id, portfolio : { $elemMatch : {
        name: name
    } }}, (err, users) => {
        if(users){
            const stockIndex = users.portfolio.map(stock => stock.name).indexOf(name);
            const newHoldings = users.portfolio[stockIndex].holdings.map(holding => holding._id == holdingId ? {...holding.toObject(), price: price, amount, amount} : {...holding.toObject()})
            users.portfolio[stockIndex].holdings = newHoldings
            users.save((err) => {
                if(err){
                    console.log(err)
                } else{
                    res.send('Updated')
                }
            })
    }})
})

app.patch('/api/update/thesis', (req, res) => {
    const { _id, list, name, stockId, thesis  } = req.body
    Stock.findOne({_id: _id}, (err, users) => {
        if(users){
            if(list === "watchlist"){
                const newList = users.watchlist.map(stock => stock._id === stockId ? {...stock.toObject(), thesis: thesis} : {...stock.toObject()})
                users.watchlist = newList
            } else if(list === "portfolio") {
                const newList = users.portfolio.map(stock => stock._id === stockId ? {...stock.toObject(), thesis: thesis} : {...stock.toObject()})
                users.portfolio = newList
            }
            users.save((err) => {
                if(err){
                    console.log(err)
                } else{
                    res.send('Updated')
                }
            })
        }
    })
})
app.listen(process.env.PORT || 80);
