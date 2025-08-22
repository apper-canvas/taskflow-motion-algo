import Input from "@/components/atoms/Input"
import Select from "@/components/atoms/Select"
import Checkbox from "@/components/atoms/Checkbox"

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

  const recurringOptions = [
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" }
  ]

  const handleChange = (field, value) => {
    onFormChange({ ...formData, [field]: value })
  }

  const handleRecurringToggle = (isRecurring) => {
    const updates = { isRecurring }
    if (!isRecurring) {
      // Clear recurring fields when disabling
      updates.recurringFrequency = ""
      updates.recurringStartDate = ""
      updates.recurringEndDate = ""
      updates.recurringEnabled = false
    } else {
      // Set default values when enabling
      updates.recurringEnabled = true
      updates.recurringFrequency = "weekly"
    }
    onFormChange({ ...formData, ...updates })
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

      {/* Recurring Task Section */}
      <div className="border-t pt-4 space-y-4">
        <div className="flex items-center space-x-3">
          <Checkbox
            checked={formData.isRecurring || false}
            onChange={handleRecurringToggle}
          />
          <label className="text-sm font-medium text-gray-700">
            Make this a recurring task
          </label>
        </div>

        {formData.isRecurring && (
          <div className="ml-9 space-y-4 bg-gray-50 p-4 rounded-lg">
            <Select
              label="Repeat Frequency"
              value={formData.recurringFrequency || ""}
              onChange={(e) => handleChange("recurringFrequency", e.target.value)}
              options={recurringOptions}
              placeholder="Select frequency..."
              error={errors.recurringFrequency}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                type="date"
                label="Start Date"
                value={formData.recurringStartDate || formData.dueDate || ""}
                onChange={(e) => handleChange("recurringStartDate", e.target.value)}
                error={errors.recurringStartDate}
              />

              <Input
                type="date"
                label="End Date (Optional)"
                value={formData.recurringEndDate || ""}
                onChange={(e) => handleChange("recurringEndDate", e.target.value)}
                error={errors.recurringEndDate}
              />
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                checked={formData.recurringEnabled !== false}
                onChange={(enabled) => handleChange("recurringEnabled", enabled)}
              />
              <label className="text-sm text-gray-600">
                Enable recurring task generation
              </label>
            </div>

            <div className="text-xs text-gray-500">
              {formData.recurringFrequency && (
                <p>
                  This task will repeat {formData.recurringFrequency} starting from{' '}
                  {formData.recurringStartDate || formData.dueDate || 'the due date'}
                  {formData.recurringEndDate && ` until ${formData.recurringEndDate}`}.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TaskFormFields