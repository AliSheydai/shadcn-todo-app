"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { DialogClose } from "@radix-ui/react-dialog"

/**
 * Reusable form component for adding/editing todos.
 * Props:
 * - form: react-hook-form instance
 * - onSubmit: submit handler
 * - isLoading: boolean for submit state
 * - showCancel: whether to render a cancel button
 */
export default function TodoForm({ form, onSubmit, isLoading = false, showCancel = true }) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
        <FormField control={form.control} name="title" render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs text-gray-600 dark:text-white">Task Title</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Enter Task Title..." className="bg-white focus:dark:bg-gray-700/50 transition-all duration-300 text-xs" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="description" render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs text-gray-600 dark:text-white">Description</FormLabel>
            <FormControl>
              <Textarea {...field} placeholder="Enter Task Description..." className="bg-white text-xs focus:dark:bg-gray-700/50 transition-all duration-300" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <div className="flex items-center w-full gap-4">
          <FormField control={form.control} name="priority" render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel className="text-xs text-gray-600 dark:text-white">Priority</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="bg-white w-full">
                    <SelectValue placeholder="Select Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )} />

          <FormField control={form.control} name="status" render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel className="text-xs text-gray-600 dark:text-white">Status</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="bg-white w-full">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">Todo</SelectItem>
                    <SelectItem value="inprogress">In Progress</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )} />
        </div>

        <div className="flex items-center gap-2 w-full">
          {showCancel && (
            <DialogClose asChild>
              <Button className="bg-gray-300 text-black shadow-lg hover:bg-gray-400/50 flex-1">Cancel</Button>
            </DialogClose>
          )}
          <Button className="bg-gradient-to-r from-[#8C36EA] to-[#2D60EB] text-white hover:scale-105 hover:opacity-90 flex-1" type="submit" disabled={isLoading}>{isLoading ? "Processing..." : "Submit"}</Button>
        </div>
      </form>
    </Form>
  )
}
