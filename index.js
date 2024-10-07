import app from './src/app.js'
import { init } from './src/database.js'

init()

const port = process.env.APP_PORT || 3000

app.listen(port, () => console.log(`Listening on port http://localhost:${port}`));
