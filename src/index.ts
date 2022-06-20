import 'dotenv/config'
import express from 'express'
import { multerUpload } from './multer'
import { ImgurClient } from 'imgur'
import fs from 'fs'
import { ImagesRepository } from './imagesRepository'

const app = express()
app.use(express.json())

const imgurClient = new ImgurClient({ clientId: process.env.IMGUR_CLIENT_ID })
const imageRepository = new ImagesRepository()

app.get('/images', async (_req, res) => {
  const images = await imageRepository.getAllImages()

  return res.json({ data: images })
})

app.delete('/images/:id', async (req, res) => {
  const { id } = req.params
  const image = await imageRepository.findById(id)

  if (!image) return res.status(400).json({ error: 'Image not exist' })

  await Promise.all([
    imageRepository.deleteById(id),
    imgurClient.deleteImage(image.deletehash)
  ])

  return res.send()
})

app.post('/upload', multerUpload.single('file'), async (req, res) => {
  const { title, description } = req.body
  const file = req.file

  if (!title) return res.status(400).json({ error: 'The title is required' })
  if (!file) return res.status(400).json({ error: 'The file is required' })

  const { data: imgUploaded } = await imgurClient.upload({
    // @ts-expect-error
    image: fs.createReadStream(file.path),
    title,
    name: title,
    description
  })

  await fs.promises.unlink(file.path)

  await imageRepository.create({
    title,
    description,
    deletehash: imgUploaded.deletehash || '',
    link: imgUploaded.link,
    imgurDetails: JSON.stringify(imgUploaded)
  })

  return res.status(204).send()
})

const port = process.env.PORT || 8899
app.listen(port, () => console.log(`server running at http://localhost:${port}`))
