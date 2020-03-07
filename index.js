const express = require('express');
const path = require('path');
const rateCalc = require('getPostRate');
const PORT = process.env.PORT || 5000;

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/prove9', (req, res) => res.render('staticpages/prove9'))
  .get('/computePostage', computePostage)
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

function computePostage(req, res) {
  const parcelType = req.query.postType;
  const weight = Number(req.query.weight);

  let rate = getRate(parcelType, weight);

  const params = {parcelType: parcelType, weight: weight, rate: rate};

  res.render('pages/prove9', params);
}

