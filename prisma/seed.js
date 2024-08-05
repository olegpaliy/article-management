const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')

const prisma = new PrismaClient()
async function main() {
  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash('admin', salt)

  return await prisma.user.create({
    data: { email: 'admin@padmin.io', password: hash },
  })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
