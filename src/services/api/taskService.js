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
      completedAt: null,
      isRecurring: taskData.isRecurring || false,
      recurringFrequency: taskData.recurringFrequency || null,
      recurringStartDate: taskData.recurringStartDate || null,
      recurringEndDate: taskData.recurringEndDate || null,
      recurringEnabled: taskData.recurringEnabled || false,
      parentTaskId: taskData.parentTaskId || null
    }
    
    // Generate recurring tasks if this is a recurring task
    const createdTasks = [newTask]
    if (newTask.isRecurring && newTask.recurringEnabled && newTask.recurringStartDate) {
      const recurringTasks = this.generateRecurringTasks(newTask)
      createdTasks.push(...recurringTasks)
    }
    
    // Add all tasks to the collection
    createdTasks.forEach(task => {
      this.tasks.unshift(task)
    })
    
    return { ...newTask }
  }

  generateRecurringTasks(parentTask) {
    const tasks = []
    const startDate = new Date(parentTask.recurringStartDate)
    const endDate = parentTask.recurringEndDate ? new Date(parentTask.recurringEndDate) : null
    let currentDate = new Date(startDate)
    let taskCounter = 1
    
    // Generate tasks for the next 6 months or until end date
    const maxDate = endDate || new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000)
    
    while (currentDate <= maxDate && taskCounter <= 50) { // Limit to 50 instances
      let nextDate = new Date(currentDate)
      
      switch (parentTask.recurringFrequency) {
        case 'daily':
          nextDate.setDate(nextDate.getDate() + 1)
          break
        case 'weekly':
          nextDate.setDate(nextDate.getDate() + 7)
          break
        case 'monthly':
          nextDate.setMonth(nextDate.getMonth() + 1)
          break
        default:
          return tasks
      }
      
      if (nextDate > maxDate) break
      
      const recurringTask = {
        ...parentTask,
        Id: Math.max(...this.tasks.map(t => t.Id), 0) + taskCounter + 1,
        dueDate: nextDate.toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        completed: false,
        completedAt: null,
        parentTaskId: parentTask.Id
      }
      
      tasks.push(recurringTask)
      currentDate = new Date(nextDate)
      taskCounter++
    }
    
    return tasks
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

  async toggleRecurring(id, enabled) {
    await this.delay()
    const taskIndex = this.tasks.findIndex(t => t.Id === parseInt(id))
    if (taskIndex === -1) {
      throw new Error("Task not found")
    }
    
    const task = this.tasks[taskIndex]
    if (!task.isRecurring) {
      throw new Error("Task is not recurring")
    }
    
    // Update the parent task
    this.tasks[taskIndex].recurringEnabled = enabled
    
    // Handle child tasks
    if (!enabled) {
      // Remove future recurring instances
      this.tasks = this.tasks.filter(t => t.parentTaskId !== parseInt(id) || t.completed)
    } else {
      // Regenerate recurring tasks
      const recurringTasks = this.generateRecurringTasks(this.tasks[taskIndex])
      recurringTasks.forEach(task => {
        this.tasks.unshift(task)
      })
    }
    
    return { ...this.tasks[taskIndex] }
  }

  async getRecurringTasks() {
    await this.delay()
    return this.tasks.filter(t => t.isRecurring && !t.parentTaskId)
  }
}

export const taskService = new TaskService()