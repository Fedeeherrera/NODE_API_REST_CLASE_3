const express = require('express') // -> Require porque usamos CommonJS Import es de EcmascriptModules
const crypto = require('node:crypto')
const movies = require('./movies.json')
const { validateMovie, validatePartialMovie } = require('./schemas/movies')

const app = express()
app.use(express.json())
const PORT = process.env.PORT ?? 1234

app.disable('x-powered-by')

app.listen(PORT, () => {
  console.log(`Servidor escuchando en ${PORT}`)
})

app.get('/', (req, res) => {
  res.json({ message: 'Hola Mundo' })
})

//Devuelve todas las peliculas
app.get('/movies', (req, res) => {
  const { genre } = req.query
  if (genre) {
    const filteredMovies = movies.filter((movie) =>
      movie.genre.some((g) => g.toLowerCase() === genre.toLowerCase())
    )
    return res.json(filteredMovies)
  }
  res.json(movies)
})

//Devuelve las peliculas por id
app.get('/movies/:id', (req, res) => {
  const { id } = req.params
  const movie = movies.find((movie) => movie.id === id)
  if (movie) return res.json(movie)

  res.status(404).json({ message: 'Movie not found' })
})

app.post('/movies', (req, res) => {
  const result = validateMovie(req.body)

  if (result.error) {
    return res.status(400).json({ message: JSON.parse(result.error.message) })
  }

  //En Base de Datos
  const newMovie = {
    id: crypto.randomUUID(), //UUID v4
    ...result.data
  }
  movies.push(newMovie)
  res.status(201).json(newMovie)
})
