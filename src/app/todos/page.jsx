"use client"

import { useState, useEffect } from "react"
import useTheme from "@/lib/useTheme"
import ThemeToggle from "@/components/ui/ThemeToggle"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getTodos, addTodo, updateTodo, deleteTodo, getTodoById } from "@/lib/api"
import { Card } from "@/components/ui/card"
import {
  Plus,
  Moon,
  Sun,
  Puzzle,
  ListChecks,
  CircleDashed,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Text,
  Ham,
  Edit,
  Trash,
  Trash2,
} from "lucide-react"
import { X } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button"
import TodosTabs from "@/components/todos/TodosTabs"
import { toast } from "sonner"
import Link from "next/link"

// Form
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import TodoForm from "@/components/todos/TodoForm"
import TodoCard from "@/components/todos/TodoCard"
import { DialogClose, DialogDescription } from "@radix-ui/react-dialog"

export default function TodosPage() {
  const queryClient = useQueryClient()
  const { data, isLoading, isError } = useQuery({
    queryKey: ["todos"],
    queryFn: getTodos,
  })

  const [editTodo, setEditTodo] = useState(null)
  const [filter, setFilter] = useState("all")

  // Delete Todo Id
  const [deleteTodoId, setDeleteTodoId] = useState(null)

  // 🟢 فرم افزودن
  const addFormSchema = z.object({
    title: z.string().min(3, "Enter Atleast 3 letter"),
    description: z.string().optional(),
    priority: z.string().optional(),
    status: z.string().optional(),
  })

  const addForm = useForm({ resolver: zodResolver(addFormSchema), defaultValues: { title: "" } })
  const addMutation = useMutation({
    mutationFn: addTodo,
    onMutate: () => toast.message("Adding..."),
    onSuccess: (newTodoItem) => {
      queryClient.setQueryData(["todos"], (old = []) => [...old, newTodoItem])
      addForm.reset()
      toast.success("✅ Task Add Successfully")
    },
    onError: () => toast.error("Error In Adding ❌"),
  })
  const onAddSubmit = (values) => addMutation.mutate(values)

  // 🟢 فرم ویرایش
  const editFormSchema = z.object({
    title: z.string().min(3, "Enter Atleast 3 letter"),
    description: z.string().optional(),
    priority: z.string().optional(),
    status: z.string().optional(),
  })

  const editForm = useForm({ resolver: zodResolver(editFormSchema), defaultValues: { title: "" } })
  useEffect(() => {
    if (editTodo)
      editForm.reset({
        title: editTodo.title || "",
        description: editTodo.description || "",
        priority: editTodo.priority || "medium",
        status: editTodo.status || "todo",
      })
  }, [editTodo])

  const editMutation = useMutation({
    mutationFn: updateTodo,
    onSuccess: (updatedTodo) => {
      queryClient.setQueryData(["todos"], (old = []) =>
        old.map((t) => (t.id === updatedTodo.id ? updatedTodo : t))
      )
      setEditTodo(null)
      toast.success("Changes Are Saved ✏️")
    },
    onError: () => toast.error("Error in Updating Data"),
  })
  const onEditSubmit = (values) =>
    editMutation.mutate({ ...editTodo, ...values })

  // حذف
  const deleteMutation = useMutation({
    mutationFn: deleteTodo,
    onMutate: async (id) => {
      await queryClient.cancelQueries(["todos"])
      const prevData = queryClient.getQueryData(["todos"])
      queryClient.setQueryData(["todos"], (old) => old.filter((t) => t.id !== id))
      toast.message("Deleting...")
      return { prevData }
    },
    onError: (_err, _id, context) => {
      queryClient.setQueryData(["todos"], context.prevData)
      toast.error("Error In Delete ❌")
    },
    onSuccess: () => toast.success("Task Deleted 🗑️"),
  })

  // prefetch
  const prefetchTodo = async (id) => {
    await queryClient.prefetchQuery({ queryKey: ["todo", id], queryFn: () => getTodoById(id) })
  }

  const { dark, setDark, toggle } = useTheme()

  if (isLoading) return <div className="p-6 space-y-4"><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-3/4" /><Skeleton className="h-10 w-2/4" /></div>
  if (isError) return <p className="p-6 text-red-500">❌ Error In Get Data</p>

  let filteredTodos = data || []
  if (filter === "todo") filteredTodos = data.filter((t) => t.status === "todo")
  else if (filter === "inprogress") filteredTodos = data.filter((t) => t.status === "inprogress")
  else if (filter === "done") filteredTodos = data.filter((t) => t.status === "done")

  return (
      <div className="bg-gradient-to-br from-[#F1F6FF] to-[#E2E8FF] relative min-h-screen dark:from-[#181830] dark:to-[#4D1C92] mx-auto px-0 md:px-16 lg:px-32 xl:px-64">
        <div
        className="absolute w-72 h-72 bg-gradient-to-br top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2
                from-violet-400 via-fuchsia-500 to-violet-600 
                  rounded-full blur-lg opacity-60 animate-pulse 
                  shadow-[0_0_60px_20px_rgba(168,85,247,0.3)]"
      ></div>
      <div
        className="absolute w-72 h-72 bg-gradient-to-br top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                from-purple-600 to-purple-800 
                  rounded-full blur-lg opacity-60 animate-pulse 
                  shadow-[0_0_60px_20px_rgba(168,85,247,0.3)]"
      ></div>
      <div
        className="absolute w-72 h-72 bg-gradient-to-br top-5/6 left-2/3 -translate-x-1/2 -translate-y-1/2
                  from-blue-40 to-blue-600 
                  rounded-full blur-lg opacity-60 animate-pulse 
                  shadow-[0_0_60px_20px_rgba(168,85,247,0.3)]"
      ></div>

      <div className="p-6">
        {/* Header + فرم افزودن */}
        <div className="flex items-center justify-between mb-6 bg-gradient-to-br from-gray-50 to-white rounded-lg shadow py-4 px-5 hover:shadow-xl transition-shadow duration-500 dark:from-[#282440] dark:to-[#5F278B]">

          <div className="flex items-center gap-4">
            <Puzzle className="text-violet-800" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#2A60EB] to-[#8D36EA] bg-clip-text text-transparent"> Task Flow</h1>
          </div>
          <Dialog>
            <div className="flex items-center gap-4">
              <ThemeToggle className={`bg-gradient-to-r from-[#8D36EA] to-[#2A60EB] hover:shadow-md hover:shadow-[#d034ff] hover:scale-110 dark:bg-gradient-to-r dark:from-[#FAC718] dark:to-[#FB963A]`} />
              <DialogTrigger asChild>
                <Button className={`bg-gradient-to-r from-[#8D36EA] to-[#2A60EB] hover:shadow-md hover:shadow-[#d034ff] hover:scale-110 dark:text-white`}><Plus /> Add Task</Button>
              </DialogTrigger>
            </div>

            <DialogContent className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-[#111725] dark:to-[#111726]">
              <DialogHeader className="flex items-center flex-row gap-2">
                <div className="w-5 h-5 rounded-full bg-violet-600 flex items-center justify-center text-white">
                  <Plus size={16} />
                </div>
                <DialogTitle className="bg-gradient-to-r from-[#8938EA] to-[#5849E2] bg-clip-text text-transparent font-bold self-start text-xl">Create New Task</DialogTitle>
              </DialogHeader>

              <TodoForm form={addForm} onSubmit={onAddSubmit} isLoading={addMutation.isLoading} showCancel={true} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Tabs */}
        <TodosTabs value={filter} onValueChange={setFilter} />

        {/* Task Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredTodos.map((todo) => (
            <TodoCard key={todo.id} todo={todo} prefetch={prefetchTodo} actions={(
              <>
                {/* Delete Confirmation Dialog */}
                <Dialog open={deleteTodoId === todo.id} onOpenChange={(isOpen) => setDeleteTodoId(isOpen ? todo.id : null)}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="bg-red-600 hover:scale-110 hover:bg-red-600/90 dark:text-white"><Trash /></Button>
                  </DialogTrigger>

                  <DialogContent className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-[#111725] dark:to-[#111726]">
                    <DialogHeader className="flex items-center flex-row gap-2">
                      <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center text-white">
                        <AlertTriangle size={16} />
                      </div>
                      <DialogTitle className="bg-gradient-to-r from-[#EB3838] to-[#EA5858] bg-clip-text text-transparent font-bold self-start text-xl">
                        Delete Task
                      </DialogTitle>
                    </DialogHeader>

                    <div className="flex flex-col justify-center items-center gap-4 mt-6">
                      <Trash2 size={36} className="text-red-600" />

                      <p className="text-lg text-center text-gray-900 font-medium dark:text-gray-300 mt-2">
                        Are you sure you want to delete this task?
                      </p>
                      <h6 className="text-red-600 font-medium">"{todo.title}"</h6>
                      <span className="text-xs text-gray-700 dark:text-gray-400">This action cannot be undone.</span>
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                      <DialogClose asChild>
                        <Button className="flex-1 hover:bg-gray-400/50" variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button
                        className="bg-[#DC262A] hover:scale-105 hover:bg-black hover:text-red-600 transition-all duration-300 text-white flex-1"
                        onClick={() => {
                          deleteMutation.mutate(todo.id)
                          setDeleteTodoId(null) // close dialog after deletion
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Edit Dialog using your Form */}
                <Dialog open={editTodo?.id === todo.id} onOpenChange={(isOpen) => setEditTodo(isOpen ? todo : null)}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="bg-blue-600 dark:bg-blue-600 text-white hover:scale-110 hover:bg-blue-600/90 dark:hover:bg-blue-600/90 hover:text-white" variant="outline"><Edit /></Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-[#111725] dark:to-[#111726]">
                    <DialogHeader className="flex items-center flex-row gap-2">
                      <div className="w-5 h-5 rounded-full bg-violet-600 flex items-center justify-center text-white">
                        <Edit size={12} />
                      </div>
                      <DialogTitle className="bg-gradient-to-r from-[#8938EA] to-[#5849E2] bg-clip-text text-transparent font-bold self-start text-xl">Edit Task</DialogTitle>
                    </DialogHeader>

                    {/* YOUR FORM */}
                    <TodoForm form={editForm} onSubmit={onEditSubmit} isLoading={editMutation.isLoading} showCancel={true} />
                  </DialogContent>
                </Dialog>
              </>
            )} />
          ))}
        </div>
      </div>
    </div>
  )
}
