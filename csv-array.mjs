import fs from 'fs'
import path from 'path'

const fileName = 'Planilha IAS V06 - gabaritos.csv'

const pathFile = path.resolve(process.cwd(), fileName)
const read = fs.createReadStream(pathFile, 'utf-8')

const CNAES = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U']

read.on('data', chunk => {
    const array = chunk.split('\r')  

    const parse1 = array
        .filter((value, index) => index > 4)
        .join(',')
        .split('\n')
        .filter(value => value !== '' )
        .map(value => value.split(',,'))
        
    const parse2 = parse1.map(value => 
        value
            .join(',')
            .split(',')
            .filter(value => value !== '')
            .join(',')
    )

    
    const questions = parse2.map((value, index) => value.split(',').filter((value, index) => index === 0)[0])
    
    
    const obj = {}
    
    CNAES.forEach(value => obj[value] = [])
    


    const parse3 = parse2.map(value => value.split(',').filter((value, index) => index !== 0))    

    parse3.forEach((parseValue, parseIndex) => {

        CNAES.forEach((cnaeValue, indexCnae) => {
            const value = parse3[parseIndex][indexCnae]
            if (+value === 0) return;

            const setObj = [...obj[cnaeValue], questions[parseIndex]]
            obj[cnaeValue] = setObj
        })

    })
    
    
    


    const data = JSON.stringify(obj)

    fs.writeFileSync('relatorio.json', data)
})
