require('dotenv').config()
const express = require('express')
const mysql = require('mysql2')


if (process.env.SQL_USER != undefined && process.env.SQL_PASSWORD != undefined)
{
    console.log('Externe Parameter sind da...')
} else {
    console.log('Missing SQL_USER oder SQL_PASSWORD.\n' +
        'Erstelle in dem Projektverzeichnis ein .env Datai mit dem Inhalt\n' +
        'entsprechend dein MYSQL Server Konfiguration. zB:\n'+
        'SQL_USER=gyula\n' +
        'SQL_PASSWORD=8TN_haben+EinenApfelSaft#*?LADDEN'
    )
    process.exit(-1)
}   
    


const connection = mysql.createConnection({
    host: 'localhost',
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: 'mondial'
  })
connection.connect()
console.log('Benutzer ' + process.env.SQL_USER +  ' ist in MySQL angemeldet')


const app = express()
const port = 3000

app.use(express.static('public'))


app.get('/api/city', (req, res) => {
    let name = "%" + req.query.name + "%"
 
    let sqlQueryText = 'select * \
    from city where name like ?'
    connection.query(sqlQueryText, [name], (err, rows, fields) => {
        if (err) throw err

        let header = []
        fields.map((column) => {
            header.push({
                name: column.name,
                type: column.type,
                columnLenght: column.columnLength,
            })
        })
        res.json({
            header: header,
            rows: rows
        })
      })
})


app.listen(port, () => {
    console.log(`App listening on port ${port}`)
  })