// lib/api.js
import axios from "axios"

// ساخت یک instance از axios برای درخواست‌ها
// Use environment variable when provided (e.g., for external API or preview),
// otherwise use relative path so client and server requests target the same origin
const baseURL = process.env.NEXT_PUBLIC_API_URL || "/api"
const api = axios.create({ baseURL })

// 🟢 دریافت همه‌ی Todos
export const getTodos = async () => {
  const res = await api.get("/todos")
  return res.data
}

// 🟡 افزودن Todo جدید
export const addTodo = async (todoData) => {
  const res = await api.post("/todos", todoData)
  return res.data
}

// 🟠 ویرایش Todo
export const updateTodo = async (todoData) => {
  const res = await api.put("/todos", todoData)
  return res.data
}

// 🔴 حذف Todo
export const deleteTodo = async (id) => {
  const res = await api.delete("/todos", { data: { id } })
  return res.data
}

// // 🔵 دریافت یک Todo خاص با id
// export const getTodoById = async (id) => {
//   const res = await api.get(`/todos/${id}`)
//   return res.data
// }

export async function getTodoById(id) {
  try {
    // use axios instance so baseURL is respected and behavior matches other api calls
    const res = await api.get(`/todos/${id}`)
    return res.data
  } catch (err) {
    // if server responded with data, log it for debugging
    if (err.response) {
      console.error(`[api] GET /api/todos/${id} failed:`, err.response.status, err.response.data)
    } else {
      console.error('[api] getTodoById network/error for id=' + id, err)
    }
    // Fallback: try fetching full list and find the todo locally. This handles
    // cases where the dynamic single-item route might not resolve but the list
    // contains the newly created item (in-memory store mismatch scenarios).
    try {
      const listRes = await api.get('/todos')
      const found = (listRes.data || []).find((t) => String(t.id) === String(id))
      if (found) return found
    } catch (e) {
      console.error('[api] fallback getTodos failed', e)
    }
    throw err
  }
}

export default api
