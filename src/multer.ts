import multer from 'multer'

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (_req, file, callback) => callback(null, file.originalname)
})

export const multerUpload = multer({ storage })
