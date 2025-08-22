import taskData from "@/services/mockData/tasks.json"

class TaskService {
  constructor() {
    this.tasks = [...taskData]
  }

  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async getAll() {
    await this.delay()
    return [...this.tasks]
  }

  async getById(id) {
    await this.delay()
    const task = this.tasks.find(t => t.Id === parseInt(id))
    if (!task) {
      throw new Error("Task not found")
    }
    return { ...task }
  }

  async create(taskData) {
    await this.delay()
    const newId = Math.max(...this.tasks.map(t => t.Id), 0) + 1
    const newTask = {
      Id: newId,
      ...taskData,
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null
    }
    this.tasks.unshift(newTask)
    return { ...newTask }
  }

  async update(id, taskData) {
    await this.delay()
    const taskIndex = this.tasks.findIndex(t => t.Id === parseInt(id))
    if (taskIndex === -1) {
      throw new Error("Task not found")
    }
    
    this.tasks[taskIndex] = {
      ...this.tasks[taskIndex],
      ...taskData
    }
    return { ...this.tasks[taskIndex] }
  }

  async delete(id) {
    await this.delay()
    const taskIndex = this.tasks.findIndex(t => t.Id === parseInt(id))
    if (taskIndex === -1) {
      throw new Error("Task not found")
    }
    
    this.tasks.splice(taskIndex, 1)
    return true
  }

  async getByCategory(categoryId) {
    await this.delay()
    return this.tasks.filter(t => t.category === parseInt(categoryId))
  }

  async getByPriority(priority) {
    await this.delay()
    return this.tasks.filter(t => t.priority === priority)
  }

  async getCompleted() {
    await this.delay()
    return this.tasks.filter(t => t.completed)
  }

  async getPending() {
    await this.delay()
    return this.tasks.filter(t => !t.completed)
  }
}

export const taskService = new TaskService()