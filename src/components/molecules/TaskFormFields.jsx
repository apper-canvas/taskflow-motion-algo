import Input from "@/components/atoms/Input"
import Select from "@/components/atoms/Select"

const TaskFormFields = ({ 
  formData, 
  onFormChange, 
  categories, 
  errors = {} 
}) => {
  const priorityOptions = [
    { value: "low", label: "Low Priority" },
    { value: "medium", label: "Medium Priority" },
    { value: "high", label: "High Priority" }
  ]

  const categoryOptions = categories.map(cat => ({
    value: cat.Id,
    label: cat.name
  }))

  const handleChange = (field, value) => {
    onFormChange({ ...formData, [field]: value })
  }

  return (
    <div className="space-y-4">
      <Input
        label="Task Title"
        value={formData.title || ""}
        onChange={(e) => handleChange("title", e.target.value)}
        placeholder="Enter task title..."
        error={errors.title}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={formData.description || ""}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Add task description (optional)..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 resize-none"
        />
      </div>

      <Select
        label="Category"
        value={formData.category || ""}
        onChange={(e) => handleChange("category", e.target.value)}
        options={categoryOptions}
        placeholder="Select category..."
        error={errors.category}
      />

      <Select
        label="Priority"
        value={formData.priority || ""}
        onChange={(e) => handleChange("priority", e.target.value)}
        options={priorityOptions}
        placeholder="Select priority..."
        error={errors.priority}
      />

      <Input
        type="date"
        label="Due Date"
        value={formData.dueDate || ""}
        onChange={(e) => handleChange("dueDate", e.target.value)}
        error={errors.dueDate}
      />
    </div>
  )
}

export default TaskFormFields