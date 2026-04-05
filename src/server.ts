import { buildApp } from './app'
import 'dotenv/config'

const app = buildApp()

const start = async () => {
  try {
    await app.listen({ port: Number(process.env.PORT) || 3001 })
    console.log('🚀 Backend running')
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
