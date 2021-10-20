const express = require('express')
const app = express()
const port = 3000
const path = require('path')
const router = express.Router()
// import { Pip } from "./dist/pip/pip";
// const pip = new Pip();
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/dist/electron/index.html'));
})

router.get('/pip', (req, res) => {
    // pip.setPOMToDisplay(req);
    res.sendFile(path.join(__dirname + '/dist/pip/pip.html'));
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
app.use('/', router);
app.use('/static', express.static(path.join(__dirname, '/dist/electron')))
app.use('/static', express.static(path.join(__dirname, '/dist/pip')))