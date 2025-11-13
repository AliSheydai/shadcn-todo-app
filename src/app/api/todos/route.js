// app/api/todos/route.js

import { NextResponse } from "next/server"
import { store } from "./store"

// 🟢 GET - دریافت همه Todos
export async function GET() {
  console.log('[API] GET /api/todos - returning', store.todos.length, 'items')
  return NextResponse.json(store.todos)
}

// 🟡 POST - افزودن Todo جدید
export async function POST(req) {
  const body = await req.json()
  const newTodo = {
    id: Date.now(),
    title: body.title,
    description: body.description || "",
    priority: body.priority || "medium",
    status: body.status || "todo",
    completed: false,
    date: new Date().toISOString(),
  }
  store.todos.push(newTodo)
  console.log('[API] POST /api/todos - added', newTodo.id)
  return NextResponse.json(newTodo, { status: 201 })
}


// 🟠 PUT - ویرایش Todo
export async function PUT(req) {
  const body = await req.json()

  let updatedTodo = null
  store.todos = store.todos.map((todo) => {
    if (todo.id === body.id) {
      updatedTodo = { ...todo, ...body }
      return updatedTodo
    }
    return todo
  })

  if (!updatedTodo) {
    return NextResponse.json({ error: 'Not Found' }, { status: 404 })
  }

  return NextResponse.json(updatedTodo)
}

// 🔴 DELETE - حذف Todo
export async function DELETE(req) {
  const body = await req.json()
  store.todos = store.todos.filter((todo) => todo.id !== body.id)
  return NextResponse.json({ success: true })
}
