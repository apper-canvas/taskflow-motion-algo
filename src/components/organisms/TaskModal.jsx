import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Button from "@/components/atoms/Button"
import TaskFormFields from "@/components/molecules/TaskFormFields"
import ApperIcon from "@/components/ApperIcon"
import { taskService } from "@/services/api/taskService"
import { categoryService } from "@/services/api/categoryService"

const TaskModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData = null, 
  isEditing = false 
}) => {
const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: "medium",
    dueDate: "",
    isRecurring: false,
    recurringFrequency: "",
    recurringStartDate: "",
    recurringEndDate: "",
    recurringEnabled: true
  })
  const [categories, setCategories] = useState([])
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isOpen) {
      loadCategories()
      if (initialData) {
setFormData({
          title: initialData.title || "",
          description: initialData.description || "",
          category: initialData.category || "",
          priority: initialData.priority || "medium",
          dueDate: initialData.dueDate || "",
          isRecurring: initialData.isRecurring || false,
          recurringFrequency: initialData.recurringFrequency || "",
          recurringStartDate: initialData.recurringStartDate || "",
          recurringEndDate: initialData.recurringEndDate || "",
          recurringEnabled: initialData.recurringEnabled !== false
        })
      } else {
        setFormData({
          title: "",
          description: "",
          category: "",
          priority: "medium",
          dueDate: "",
          isRecurring: false,
          recurringFrequency: "",
          recurringStartDate: "",
          recurringEndDate: "",
          recurringEnabled: true
        })
      }
      setErrors({})
    }
  }, [isOpen, initialData])

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll()
      setCategories(data)
    } catch (error) {
      console.error("Error loading categories:", error)
    }
  }

const validateForm = () => {
    const newErrors = {}
    
    if (!formData.title.trim()) {
      newErrors.title = "Task title is required"
    }
    
    if (!formData.category) {
      newErrors.category = "Please select a category"
    }
    
    if (!formData.priority) {
      newErrors.priority = "Please select a priority"
    }
    
    // Recurring task validation
    if (formData.isRecurring) {
      if (!formData.recurringFrequency) {
        newErrors.recurringFrequency = "Please select a frequency"
      }
      
      if (!formData.recurringStartDate) {
        newErrors.recurringStartDate = "Start date is required for recurring tasks"
      }
      
      if (formData.recurringEndDate && formData.recurringStartDate) {
        const startDate = new Date(formData.recurringStartDate)
        const endDate = new Date(formData.recurringEndDate)
        if (endDate <= startDate) {
          newErrors.recurringEndDate = "End date must be after start date"
        }
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    
    try {
      const taskData = {
        ...formData,
        completed: initialData?.completed || false,
        createdAt: initialData?.createdAt || new Date().toISOString(),
        completedAt: initialData?.completedAt || null
      }
      
      onSubmit(taskData)
    } catch (error) {
      console.error("Error submitting task:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-surface rounded-xl shadow-2xl p-6 w-full max-w-md mx-4"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {isEditing ? "Edit Task" : "Create New Task"}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-2"
            >
              <ApperIcon name="X" size={20} />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <TaskFormFields
              formData={formData}
              onFormChange={setFormData}
              categories={categories}
              errors={errors}
            />

            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? (
                  <>
                    <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                    {isEditing ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  isEditing ? "Update Task" : "Create Task"
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default TaskModal