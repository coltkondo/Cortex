import PipelineBoard from '../components/pipeline/PipelineBoard'

function PipelinePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Application Pipeline
        </h1>
        <p className="text-gray-600">
          Track all your job applications through every stage
        </p>
      </div>

      <PipelineBoard />
    </div>
  )
}

export default PipelinePage
