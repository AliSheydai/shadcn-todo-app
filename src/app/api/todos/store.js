// Shared in-memory store for todos so all API routes see the same data
export const store = {
  todos: [
    {
      id: 1,
      title: "shadcn/ui",
      description: "Study document and create and simple form",
      status: "todo",
      priority: "medium",
      date: new Date().toISOString(),
    },
    {
      id: 2,
      title: "تمرین React Query",
      description: "پیاده‌سازی GET و POST",
      status: "done",
      priority: "high",
      date: new Date().toISOString(),
    },
  ],
}
