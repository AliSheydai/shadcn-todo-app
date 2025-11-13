// Quick node test to call route handlers directly (no server)
import { GET as getList } from '../src/app/api/todos/route.js'
import { GET as getById } from '../src/app/api/todos/[id]/route.js'

async function run() {
  const listResp = await getList()
  console.log('GET /api/todos ->', await listResp.json())

  const idResp1 = await getById(null, { params: { id: '1' } })
  console.log('GET /api/todos/1 ->', await idResp1.json())

  const idResp2 = await getById(null, { params: { id: '2' } })
  console.log('GET /api/todos/2 ->', await idResp2.json())
}

run().catch(err => {
  console.error(err)
  process.exit(1)
})
