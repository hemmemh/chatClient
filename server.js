import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = 8040
const app = express()
app.use(express.static(path.resolve(__dirname, 'build')))
app.use(express.static(__dirname))
app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname,"build",'index.html'))
})

app.listen(PORT)