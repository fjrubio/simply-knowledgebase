const fetch = require("node-fetch");

const URL = 'https://api.embedbase.xyz'
const DATASET_ID = 'test-amazon-product-reviews'
const API_KEY = 'b7278d6f-0be7-420b-9401-f6f499c380c2'
fetch(`${URL}/v1/${DATASET_ID}/clear`, {
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + API_KEY
  },
})