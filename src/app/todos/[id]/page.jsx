"use client"

import { useState, useEffect } from "react"
import useTheme from "@/lib/useTheme"
import ThemeToggle from "@/components/ui/ThemeToggle"
import { useParams, useRouter } from "next/navigation"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { updateTodo, deleteTodo, getTodoById } from "@/lib/api"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DialogClose } from "@radix-ui/react-dialog"
import { Loader2, ArrowLeft } from "lucide-react"


import { motion, AnimatePresence } from "framer-motion"
import { Eye, Moon, Sun, Trash, Trash2, AlertTriangle, Edit, Calendar, Notebook, Text, Flag, Hash, InfoIcon, Ham, CheckCircle2 } from "lucide-react"

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

export default function TodoDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const queryClient = useQueryClient()
  console.log('[UI] TodoDetailPage mounted id=', id)

  const { data: todo, isLoading, isError } = useQuery({
    queryKey: ["todo", id],
    queryFn: () => getTodoById(id),
    enabled: !!id,
  })

  // debug when todo loads
  useEffect(() => {
    if (todo) console.log('[UI] Todo loaded:', todo)
  }, [todo])

  const [isBlinking, setIsBlinking] = useState(false)
  useEffect(() => {
    const interval = setInterval(() => {
      setIsBlinking(true)
      setTimeout(() => setIsBlinking(false), 200) // duration of the blink
    }, 3000) // blink every 3 seconds

    return () => clearInterval(interval)
  }, [])

  const { dark, setDark, toggle } = useTheme()

  const [editTodo, setEditTodo] = useState(null)

  // Delete Todo Id
  const [deleteTodoId, setDeleteTodoId] = useState(null)

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
      // update both the list cache and the single todo cache (support numeric/string id keys)
      queryClient.setQueryData(["todos"], (old = []) =>
        old.map((t) => (t.id === updatedTodo.id ? updatedTodo : t))
      )
      queryClient.setQueryData(["todo", updatedTodo.id], updatedTodo)
      queryClient.setQueryData(["todo", String(updatedTodo.id)], updatedTodo)
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
    onSuccess: () => {
      // invalidate relevant caches and navigate back to list
      queryClient.invalidateQueries(["todos"])
      queryClient.invalidateQueries(["todo"])
      toast.success("Task Deleted 🗑️")
      router.push('/todos')
    },
  })

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin text-violet-600" size={40} />
      </div>
    )
  }

  if (isError || !todo) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <p className="text-red-500 text-lg font-bold">Error In Loading Data</p>
        <Button onClick={() => router.back()} className="bg-gradient-to-r from-[#8D36EA] to-[#2A60EB] text-white hover:scale-110 hover:shadow-lg hover:shadow-white/50">
          <ArrowLeft /> Back To Task
        </Button>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-[#F1F6FF] to-[#E2E8FF] relative min-h-screen dark:from-[#181830] dark:to-[#4D1C92] mx-auto p-6 md:px-16 lg:px-32 xl:px-64">
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

      <div className="flex items-center justify-between mb-6 bg-gradient-to-br from-gray-50 to-white dark:from-[#282440] dark:to-[#5F278B] rounded-lg shadow py-4 px-5 hover:shadow-xl transition-shadow duration-500">

        <div className="flex items-center gap-4">
          {/* Back Button */}
          <Button
            onClick={() => router.push("/todos")}
            className="flex items-center gap-2 bg-gradient-to-r from-[#8D36EA] to-[#2A60EB] text-white hover:scale-105"
          >
            <ArrowLeft size={16} />
            Back To Tasks
          </Button>

          {/* Title + Blinking Eye */}
          <div className="flex items-center gap-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={isBlinking ? "closed" : "open"}
                initial={{ scaleY: 1 }}
                animate={{ scaleY: isBlinking ? 0.1 : 1 }}
                exit={{ scaleY: 1 }}
                transition={{ duration: 0.15 }}
                className="w-8 h-8 lg:w-10 lg:h-10 origin-center"
              >
                <Eye className="text-violet-600 w-full h-full" />
              </motion.div>
            </AnimatePresence>

            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#2A60EB] to-[#8D36EA] bg-clip-text text-transparent md:text-3xl lg:text-4xl">
              Task Flow
            </h1>
          </div>
        </div>

        {/* Dark Mode Toggle */}
        <ThemeToggle className={`flex items-center gap-2 bg-gradient-to-r from-[#8D36EA] to-[#2A60EB] text-white transition-transform duration-300 hover:scale-110 hover:shadow-md hover:shadow-[#d034ff] dark:from-[#FAC718] dark:to-[#FB963A]`} />
      </div>

      <Card className="w-full p-6 space-y-4 shadow-lg dark:border-gray-800/60 bg-white/60 dark:bg-[#453063]/30 backdrop-blur-md rounded-xl">

        <div className="absolute right-5 top-5 flex flex-row-reverse gap-4 mt-2 md:group-hover:translate-y-0 transition-all duration-300">
          {/* Delete Confirmation Dialog */}
          <Dialog open={deleteTodoId === todo.id} onOpenChange={(isOpen) => setDeleteTodoId(isOpen ? todo.id : null)}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-gradient-to-r from-[#EE444A] to-[#EC4895] w-32 hover:scale-110 dark:text-white"><Trash /> Delete Task</Button>
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
              <Button size="sm" className="bg-gradient-to-r from-[#3E80F6] to-[#6168F2] w-32 text-white hover:scale-110  hover:text-white" variant="outline"><Edit /> Edit Task</Button>
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
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black mt-16 dark:text-white">
              {todo.title}
            </h1>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-gray-800 text-[14px] mr-2 dark:text-gray-300">Status: </span>
                <div className={`px-3 py-1 w-fit rounded-[5px] text-white font-medium bg-gradient-to-r ${todo.status === "todo" ? "from-[#3D80F5] to-[#6268F2]" :
                  todo.status === "inprogress" ? "from-[#A755F7] to-[#8D5BF6]" :
                    "from-[#1FC363] to-[#11B97F] text-white"
                  }`}> {todo.status || "todo"}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-800 text-[14px] mr-2 dark:text-gray-300">Prioprity: </span>
                <div className={`px-3 py-1 rounded-[5px] text-white font-medium bg-gradient-to-r ${todo.priority === "high" ? "from-[#EE444D] to-[#EC4893]" :
                  todo.priority === "medium" ? "from-[#EBAD09] to-[#F87615]" :
                    "from-[#1FC363] to-[#11B97F] text-white"
                  }`}>
                  {todo.priority || "low"}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={14} />
              <span className="font-medium text-xs">Created on {new Date(todo.date).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}</span>
            </div>
          </div>
        </div>

        <Card className="relative p-5 pt-12 bg-white/40 dark:bg-[#453063]/30 backdrop-blur-md">
          {/* Header */}
          <div className="flex items-center gap-2 absolute left-5 top-5">
            <Text />
            <span className="font-bold text-xl">Description</span>
          </div>

          {/* Content */}
          {todo.description && todo.description.trim() !== "" 
          ? <p className="mt-2 text-gray-700 dark:text-gray-300">{todo.description}</p>
          : <div className="my-10 flex items-center gap-4 flex-col">
            <Notebook className="text-gray-400"/>
            <p className="text-gray-400 text-[14px]">No description provided for this task.</p>
          </div>
          }
        </Card>


        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 flex-wrap">
          <Card className="flex flex-col justify-center items-center gap-4 py-10 px-15 bg-white/40 dark:bg-[#453063]/30 backdrop-blur-md">
            <Flag className={`${todo.priority === "high" ? "text-red-600" :
              todo.priority === "medium" ? "text-yellow-600" : "text-green-600"
            }`}/>
            <strong>Prioprity Level</strong>
            <span>{todo.priority}</span>
          </Card>

          <Card className="flex flex-col justify-center items-center gap-4 py-10 px-15 bg-white/40 dark:bg-[#453063]/30 backdrop-blur-md">
            <div className={`rounded-full w-5 h-5 ${todo.status === "todo" ? "bg-blue-600" :
              todo.status === "inprogress" ? "bg-purple-600" : "bg-green-600"
            }`}></div>
            <strong>Current Status</strong>
            <span>{todo.status}</span>
          </Card>

          <Card className="flex flex-col justify-center items-center gap-4 py-10 px-15 bg-white/40 dark:bg-[#453063]/30 backdrop-blur-md">
            <Hash className="text-gray-600"/>
            <strong>Task ID</strong>
            <span>{todo.id}</span>
          </Card>
        </div> 
        <Card className="p-5 bg-white/40 dark:bg-[#453063]/30 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <InfoIcon />  
          <span className="text-xl font-bold">Task Information</span>
        </div>
        <div className="flex justify-around items-center">
          <div className="flex flex-col gap-4">
            <span className="font-medium text-gray-600 dark:text-gray-300">Created</span>
            <span>{todo.date}</span>
          </div>
          <div className="flex flex-col gap-4">
            <span className="font-medium text-gray-600 dark:text-gray-300">Time Elapsed</span>
            <span>{todo.date}</span>
          </div>
        </div>
        </Card> 
      </Card>
    </div>
  )
}
