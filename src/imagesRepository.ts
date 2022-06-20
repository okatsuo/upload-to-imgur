import { prisma } from './prisma'

type ImageInput = {
  title: string
  description?: string,
  deletehash: string,
  link: string,
  imgurDetails: string
}

export class ImagesRepository {
  create (data: ImageInput) {
    const { imgurDetails, ...imageData } = data
    return prisma.images.create({
      data: {
        ...imageData,
        ImagesImgurDetail: {
          create: { detail: imgurDetails }
        }
      }
    })
  }

  getAllImages () {
    return prisma.images.findMany()
  }

  findById (id: string) {
    return prisma.images.findFirst({ where: { id } })
  }

  deleteById (id: string) {
    return prisma.images.delete({ where: { id } })
  }
}
