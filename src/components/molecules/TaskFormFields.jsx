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
    label: cat.name_c || cat.name
  }))

  const recurringOptions = [
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" }
  ]

const handleChange = (field, value) => {
    onFormChange({ ...formData, [field]: value })
  }

  const handleRecurringToggle = (is_recurring_c) => {
    const updates = { is_recurring_c }
    if (!is_recurring_c) {
      // Clear recurring fields when disabling
      updates.recurring_frequency_c = ""
      updates.recurring_start_date_c = ""
      updates.recurring_end_date_c = ""
      updates.recurring_enabled_c = false
    } else {
      // Set default values when enabling
      updates.recurring_enabled_c = true
      updates.recurring_frequency_c = "weekly"
    }
    onFormChange({ ...formData, ...updates })
  }

  return (
    <div className="space-y-4">
<Input
        label="Task Title"
        value={formData.title_c || ""}
        onChange={(e) => handleChange("title_c", e.target.value)}
        placeholder="Enter task title..."
        error={errors.title_c}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
value={formData.description_c || ""}
          onChange={(e) => handleChange("description_c", e.target.value)}
          placeholder="Add task description (optional)..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 resize-none"
        />
      </div>

      <Select
label="Category"
        value={formData.category_c || ""}
        onChange={(e) => handleChange("category_c", e.target.value)}
        options={categoryOptions}
        placeholder="Select category..."
        error={errors.category_c}
      />

<Select
        label="Priority"
        value={formData.priority_c || ""}
        onChange={(e) => handleChange("priority_c", e.target.value)}
        options={priorityOptions}
        placeholder="Select priority..."
        error={errors.priority_c}
      />

<Input
        type="date"
        label="Due Date"
        value={formData.due_date_c || ""}
        onChange={(e) => handleChange("due_date_c", e.target.value)}
        error={errors.due_date_c}
      />

      {/* Recurring Task Section */}
      <div className="border-t pt-4 space-y-4">
        <div className="flex items-center space-x-3">
          <Checkbox
checked={formData.is_recurring_c || false}
            onChange={handleRecurringToggle}
          />
          <label className="text-sm font-medium text-gray-700">
            Make this a recurring task
          </label>
        </div>

{formData.is_recurring_c && (
          <div className="ml-9 space-y-4 bg-gray-50 p-4 rounded-lg">
            <Select
              label="Repeat Frequency"
value={formData.recurring_frequency_c || ""}
              onChange={(e) => handleChange("recurring_frequency_c", e.target.value)}
              options={recurringOptions}
              placeholder="Select frequency..."
              error={errors.recurring_frequency_c}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
type="date"
                label="Start Date"
                value={formData.recurring_start_date_c || formData.due_date_c || ""}
                onChange={(e) => handleChange("recurring_start_date_c", e.target.value)}
                error={errors.recurring_start_date_c}
              />

              <Input
type="date"
                label="End Date (Optional)"
                value={formData.recurring_end_date_c || ""}
                onChange={(e) => handleChange("recurring_end_date_c", e.target.value)}
                error={errors.recurring_end_date_c}
              />
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
checked={formData.recurring_enabled_c !== false}
                onChange={(enabled) => handleChange("recurring_enabled_c", enabled)}
              />
              <label className="text-sm text-gray-600">
                Enable recurring task generation
              </label>
            </div>

            <div className="text-xs text-gray-500">
{formData.recurring_frequency_c && (
                <p>
                  This task will repeat {formData.recurring_frequency_c} starting from{' '}
                  {formData.recurring_start_date_c || formData.due_date_c || 'the due date'}
                  {formData.recurring_end_date_c && ` until ${formData.recurring_end_date_c}`}.
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