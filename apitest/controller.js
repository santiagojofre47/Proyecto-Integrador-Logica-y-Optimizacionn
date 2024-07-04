const service = require('./service.js')
const express = require('express')

const app = express();
const port = 3000;


app.use(express.json());
app.use(express.static("public"))

app.get('/resultados',(req,res) =>{
    res.sendFile(__dirname+'/public/resultado.html')
})

app.post('/createTextFile', (req, res) => {
    let bucketName = req.body.bucketName;
    let itemName = req.body.itemName;
    let fileText = req.body.fileText;
    service.createTextFile(bucketName, itemName, fileText)
        .then(() => res.send('File created successfully'))
        .catch((error) => res.status(500).send(error))
})


app.get('/resolverProblema',(req,res)=>{
    service.resolverProblema().then((contents) => res.json(contents)).catch((error) => res.status(500).send(error))
})

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});

