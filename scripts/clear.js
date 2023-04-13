const fetch = require("node-fetch");

const URL = 'https://api.embedbase.xyz'
const DATASET_ID = 'test-amazon-product-reviews'
const API_KEY = process.env.EMBEDBASE_API_KEY;
fetch(`${URL}/v1/${DATASET_ID}/clear`, {
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + API_KEY
  },
})