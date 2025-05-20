"use client"

interface SuggestionLabelsProps {
  onSuggestionClick: (suggestion: string) => void
}

const suggestions = [
  "Create a TODO app for management daily tasks and review done tasks",
  "Create a React component for a responsive navigation bar with dropdown menus",
  "Generate a Node.js API endpoint for user authentication with JWT",
  "Build a data table component with sorting and filtering capabilities",
  "Create a form validation utility using Zod and React Hook Form",
]

export default function SuggestionLabels({ onSuggestionClick }: SuggestionLabelsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-3 mt-8 mb-4 px-4">
      {suggestions.map((suggestion, index) => (
        <button key={index} className="suggestion-btn" onClick={() => onSuggestionClick(suggestion)}>
          {suggestion}
        </button>
      ))}
    </div>
  )
}
