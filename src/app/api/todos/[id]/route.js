import { NextResponse } from "next/server"
import { store } from "../store"

// GET: گرفتن یک todo با id
export async function GET(req, { params }) {
  const { id } = params
  console.log('[API] GET /api/todos/' + id)
  const todo = store.todos.find((t) => t.id === Number(id))
  if (!todo) {
    console.log('[API] GET /api/todos/' + id + ' - NOT FOUND')
    return NextResponse.json({ error: "Not Found!" }, { status: 404 })
  }
  console.log('[API] GET /api/todos/' + id + ' - found')
  return NextResponse.json(todo)
}
