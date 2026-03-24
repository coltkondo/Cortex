import { useState, useEffect } from 'react'
import { useStore } from '../../store/useStore'

const STAGES = ['saved', 'applied', 'screen', 'interview', 'offer']
const STAGE_LABELS = {
  saved: 'Saved',
  applied: 'Applied',
  screen: 'Phone Screen',
  interview: 'Interview',
  offer: 'Offer',
}

function PipelineBoard() {
  const { applications } = useStore()
  const [applicationsByStage, setApplicationsByStage] = useState({})

  useEffect(() => {
    const grouped = STAGES.reduce((acc, stage) => {
      acc[stage] = applications.filter(app => app.stage === stage)
      return acc
    }, {})
    setApplicationsByStage(grouped)
  }, [applications])

  return (
    <div className="flex space-x-4 overflow-x-auto pb-4">
      {STAGES.map(stage => (
        <div key={stage} className="flex-shrink-0 w-80">
          <div className="bg-gray-100 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">{STAGE_LABELS[stage]}</h3>
              <span className="bg-white px-2 py-1 rounded text-sm text-gray-600">
                {applicationsByStage[stage]?.length || 0}
              </span>
            </div>
            <div className="space-y-3">
              {applicationsByStage[stage]?.map(app => (
                <div key={app.id} className="bg-white rounded-lg p-4 shadow-sm">
                  <h4 className="font-medium text-gray-900">{app.role}</h4>
                  <p className="text-sm text-gray-600">{app.company}</p>
                  {app.applied_date && (
                    <p className="text-xs text-gray-500 mt-2">
                      Applied {new Date(app.applied_date).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default PipelineBoard
