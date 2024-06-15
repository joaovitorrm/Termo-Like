const express = require("express");
const app = express();
const cors = require("cors");

const dicioRoute = require("./routes/Dicio");

const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use("/dicio", dicioRoute);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
