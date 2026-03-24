import { useState } from 'react'
import { MessageSquare } from 'lucide-react'
import { analysisService } from '../../api/analysisService'

function InterviewPrepGenerator({ jobId }) {
  const [prep, setPrep] = useState(null)
  const [loading, setLoading] = useState(false)

  const generatePrep = async () => {
    try {
      setLoading(true)
      const prepResponse = await analysisService.generateInterviewPrep(jobId)
      setPrep(prepResponse)
    } catch (err) {
      console.error('Failed to generate interview prep:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <MessageSquare className="h-6 w-6 text-primary-600" />
          <h2 className="text-xl font-semibold text-gray-900">Interview Prep</h2>
        </div>
        {!prep && (
          <button
            onClick={generatePrep}
            disabled={loading}
            className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Generating...' : 'Generate Prep Sheet'}
          </button>
        )}
      </div>

      {prep && (
        <div className="space-y-6">
          {prep.behavioral_questions && prep.behavioral_questions.length > 0 && (
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Likely Behavioral Questions</h3>
              <ul className="space-y-2">
                {prep.behavioral_questions.map((q, idx) => (
                  <li key={idx} className="text-gray-700 pl-4 border-l-2 border-primary-200">
                    {q}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {prep.star_answers && prep.star_answers.length > 0 && (
            <div>
              <h3 className="font-medium text-gray-900 mb-3">STAR-Ready Answers</h3>
              <div className="space-y-3">
                {prep.star_answers.map((answer, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-800">{answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {prep.technical_topics && prep.technical_topics.length > 0 && (
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Technical Topics to Review</h3>
              <ul className="list-disc list-inside space-y-1">
                {prep.technical_topics.map((topic, idx) => (
                  <li key={idx} className="text-gray-700">{topic}</li>
                ))}
              </ul>
            </div>
          )}

          {prep.questions_to_ask && prep.questions_to_ask.length > 0 && (
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Questions to Ask</h3>
              <ul className="space-y-2">
                {prep.questions_to_ask.map((q, idx) => (
                  <li key={idx} className="text-gray-700 pl-4 border-l-2 border-green-200">
                    {q}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default InterviewPrepGenerator
