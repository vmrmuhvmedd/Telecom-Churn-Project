const axios = require('axios');

exports.predictChurn = async (req, res) => {
    const inputData = req.body;

    try {
        const response = await axios.post('http://localhost:8000/predict', inputData);
        res.json(response.data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Prediction failed.' });
    }
};
