const { Client } = require('pg')
const cron = require('node-cron')
const axios = require('axios')

const client = new Client({
  host: 'db',
  port: 5431,
  user: 'postgres',
  password: 'postgres',
  database: 'postgres',
})

client
  .connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch((err: any) => console.error('Connection error', err.stack))

const sendRequest = async () => {
  const response = await axios.get(
    `https://newsdata.io/api/1/latest?apikey=${process.env.API_KEY}&q=pizza`
  )

  const responseArticles = response.data.results
  return responseArticles.map(
    ({ title, creator = [], description, content }: ResponseArticle) => ({
      title,
      author: creator?.length ? creator[0] : 'unknown',
      content: `${description ? description : ''}
        ${content ? content : ''}`,
    })
  )
}

interface ResponseArticle {
  title: string
  creator: string[]
  description: string
  content: string
}

interface Article {
  title: string
  author: string
  content: string
}

// res.data.results[].title, creator[0], description + content

const insertData = async (responseArticle: Article[]) => {
  console.log('length = ', responseArticle.length)
  try {
    responseArticle.forEach(async (element) => {
      const query = `INSERT INTO public."Article"(title, content, author, "updatedAt", "createdAt") VALUES($1, $2, $3, $4, $5)`
      const values = [
        element.title,
        element.content,
        element.author,
        new Date().toLocaleDateString(),
        new Date().toLocaleDateString(),
      ]
      await client.query(query, values)
    })

    console.log('Data inserted successfully')
  } catch (err: any) {
    console.error('Error inserting data', err.stack)
  }
}

const run = async () => {
  // retrieve and map data from API
  const data = await sendRequest()
  // save to database
  await insertData(data)
}

cron.schedule('*/30 * * * * *', async () => {
  console.log('Running cron job...')
  run()
})
