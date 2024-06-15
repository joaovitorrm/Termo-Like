const express = require("express");
const axios = require("axios");

const router = express.Router();

// Get 3 random words from the API and send them
router.get("/getRandomWords", async (req, res) => {    
    try {
        const [data1, data2, data3]  = await axios.all([
            axios.get('https://api.dicionario-aberto.net/random'),
            axios.get('https://api.dicionario-aberto.net/random'),
            axios.get('https://api.dicionario-aberto.net/random'),
        ]);
        res.send([{...data1.data}, {...data2.data}, {...data3.data}]);
    } catch (error) {
        console.log(error);
    }
});

// Check if the word exists in the API requesting only the head because it's faster
// If the word doesn't exist, it returns 204
router.get("/getWord/:word", async (req, res) => {    
    try {
        const { data } = await axios.head(`https://www.dicio.com.br/${req.params.word}`);        
        res.sendStatus(200);
    } catch (error) {
        if (error.response.status == 404) {
            res.sendStatus(204);
        } else {
            console.log(error);
        }
    }
});

module.exports = router;
