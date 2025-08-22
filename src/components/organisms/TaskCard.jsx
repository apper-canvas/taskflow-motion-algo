import { useState } from "react"
import { format, isToday, isPast, parseISO } from "date-fns"
import Card from "@/components/atoms/Card"
import Checkbox from "@/components/atoms/Checkbox"
import Button from "@/components/atoms/Button"
import PriorityBadge from "@/components/molecules/PriorityBadge"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const TaskCard = ({ task, onToggleComplete, onEdit, onDelete }) => {
  const [isCompleting, setIsCompleting] = useState(false)

  const handleToggleComplete = () => {
    setIsCompleting(true)
    setTimeout(() => {
      onToggleComplete()
      setIsCompleting(false)
    }, 300)
  }

  const isOverdue = task.dueDate && isPast(parseISO(task.dueDate)) && !task.completed
  const isDueToday = task.dueDate && isToday(parseISO(task.dueDate))

  return (
    <Card className={cn(
      "task-card p-4",
      task.completed && "task-completed",
      isCompleting && "animate-fade-out"
    )}>
      <div className="flex items-start space-x-4">
        <Checkbox
          checked={task.completed}
          onChange={handleToggleComplete}
          animated={true}
          className="mt-1"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className={cn(
                "font-medium text-gray-900 truncate",
                task.completed && "line-through text-gray-500"
              )}>
                {task.title}
              </h3>
              
              {task.description && (
                <p className={cn(
                  "text-sm text-gray-600 mt-1 line-clamp-2",
                  task.completed && "text-gray-400"
                )}>
                  {task.description}
                </p>
              )}

<div className="flex items-center space-x-3 mt-3">
                <PriorityBadge priority={task.priority} />
                
                {task.isRecurring && (
                  <div className="flex items-center space-x-1 text-xs text-primary-600 bg-primary-50 px-2 py-1 rounded-full">
                    <ApperIcon name="Repeat" size={12} />
                    <span className="capitalize">{task.recurringFrequency}</span>
                  </div>
                )}
                
                {task.dueDate && (
                  <div className={cn(
                    "flex items-center space-x-1 text-xs",
                    isOverdue ? "text-error" : isDueToday ? "text-warning" : "text-gray-500"
                  )}>
                    <ApperIcon 
                      name="Calendar" 
                      size={12} 
                    />
                    <span>
                      {format(parseISO(task.dueDate), "MMM d")}
                      {isOverdue && " (Overdue)"}
                      {isDueToday && " (Today)"}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2 ml-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onEdit}
                className="p-2"
              >
                <ApperIcon name="Edit" size={16} />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={onDelete}
                className="p-2 text-gray-400 hover:text-error"
              >
                <ApperIcon name="Trash2" size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default TaskCard