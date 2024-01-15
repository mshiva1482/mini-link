const express = require('express')
const mongoose = require('mongoose')
const ShortUrl = require('./models/shortUrl.js')

const app = express()
const port = 3000

mongoose.connect('mongodb://127.0.0.1:27017/urlShortener')
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err))

app.use(express.urlencoded({ extended: false }))
app.set('view engine', 'ejs')

app.get('/', async (req, res) => {
  const shortUrls = await ShortUrl.find()
  res.render('index', { shortUrls: shortUrls })
})

app.post('/shortUrls', async (req, res) => {
  await ShortUrl.create({
    full: req.body.fullUrl
  })
  res.redirect('/')
})
app.get('/:shortUrl', async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })

  if (shortUrl == null) return res.sendStatus(404)

  shortUrl.clicks++
  shortUrl.save()

  res.redirect(shortUrl.full)
})

app.listen(port, () => {
  console.log(`mini-link app listening on port ${port}`)
})
