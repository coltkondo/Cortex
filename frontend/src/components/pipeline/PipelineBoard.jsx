import { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { useStore } from '../../store/useStore'
import { applicationService } from '../../api/applicationService'
import { Trash2, StickyNote } from 'lucide-react'

const STAGES = ['saved', 'applied', 'screen', 'interview', 'offer']
const STAGE_LABELS = {
  saved: 'Saved',
  applied: 'Applied',
  screen: 'Phone Screen',
  interview: 'Interview',
  offer: 'Offer',
}

function PipelineBoard() {
  const { applications, fetchApplications, updateApplication, removeApplication } = useStore()
  const [applicationsByStage, setApplicationsByStage] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadApplications()
  }, [])

  const loadApplications = async () => {
    setLoading(true)
    await fetchApplications()
    setLoading(false)
  }

  useEffect(() => {
    const grouped = STAGES.reduce((acc, stage) => {
      acc[stage] = applications.filter((app) => app.stage === stage)
      return acc
    }, {})
    setApplicationsByStage(grouped)
  }, [applications])

  const handleDragEnd = async (result) => {
    const { source, destination, draggableId } = result

    if (!destination) return
    if (source.droppableId === destination.droppableId) return

    const applicationId = parseInt(draggableId)
    const newStage = destination.droppableId

    try {
      // Optimistic update
      updateApplication(applicationId, { stage: newStage })

      // Persist to backend
      await applicationService.updateApplication(applicationId, { stage: newStage })
    } catch (error) {
      console.error('Failed to update stage:', error)
      // Revert on error
      await loadApplications()
    }
  }

  const handleDelete = async (applicationId, event) => {
    event.stopPropagation()

    if (!confirm('Delete this application?')) return

    try {
      removeApplication(applicationId)
      await applicationService.deleteApplication(applicationId)
    } catch (error) {
      console.error('Failed to delete application:', error)
      await loadApplications()
    }
  }

  if (loading) {
    return (
      <div className="flex space-x-4 overflow-x-auto pb-4">
        {STAGES.map((stage) => (
          <div key={stage} className="flex-shrink-0 w-80">
            <div className="premium-card p-4 animate-pulse">
              <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded mb-4" />
              <div className="space-y-3">
                <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded" />
                <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex space-x-4 overflow-x-auto pb-4">
        {STAGES.map((stage) => (
          <Droppable key={stage} droppableId={stage}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`flex-shrink-0 w-80 ${
                  snapshot.isDraggingOver ? 'bg-primary-50 dark:bg-primary-900/10' : ''
                } rounded-2xl transition-colors`}
              >
                <div className="premium-card p-4">
                  {/* Column Header */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                      {STAGE_LABELS[stage]}
                    </h3>
                    <span className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-sm text-gray-600 dark:text-gray-400 font-medium">
                      {applicationsByStage[stage]?.length || 0}
                    </span>
                  </div>

                  {/* Application Cards */}
                  <div className="space-y-3 min-h-[200px]">
                    {applicationsByStage[stage]?.length === 0 && (
                      <div className="text-center py-12 text-gray-400 dark:text-gray-600 text-sm">
                        No applications yet
                      </div>
                    )}

                    {applicationsByStage[stage]?.map((app, index) => (
                      <Draggable key={app.id} draggableId={app.id.toString()} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`
                              premium-card p-4 cursor-move
                              ${snapshot.isDragging ? 'shadow-2xl rotate-2 scale-105' : 'premium-hover'}
                              transition-all
                            `}
                          >
                            {/* Card Header */}
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1 pr-2">
                                <h4 className="font-medium text-gray-900 dark:text-gray-100 leading-tight">
                                  {app.job?.role || 'Unknown Role'}
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                  {app.job?.company || 'Unknown Company'}
                                </p>
                              </div>
                              <button
                                onClick={(e) => handleDelete(app.id, e)}
                                className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors flex-shrink-0"
                                title="Delete application"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Applied Date */}
                            {app.appliedDate && (
                              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                                Applied {new Date(app.appliedDate).toLocaleDateString()}
                              </p>
                            )}

                            {/* Notes Preview */}
                            {app.notes && (
                              <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-500">
                                <StickyNote className="w-3.5 h-3.5 flex-shrink-0" />
                                <span className="truncate">{app.notes}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  )
}

export default PipelineBoard
