const express = require("express");
const app = express();

app.use(express.json());


app.get('/', async (req, res) => {
   res.send('<h1>Server is running successfully</h1>');
});
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
