import { configDotenv } from 'dotenv'
import express, { type Application } from 'express'

configDotenv()
const app:Application = express()
const port = Number(process.env.APP_PORT)
const host: string = (process.env.APP_HOST) || 'localhost'

app.use(express.json())
app.get('/', (_, res)=> res.json("yoi") )

app.listen(port, host, ()=>{
    console.log(`Server Run at: http://${host}:${port}`)
})