import React from 'react';
import { MessageSquare } from 'lucide-react';
import { PresetQuestion, UserPreferences } from '../types';

interface PresetQuestionsProps {
  preferences: UserPreferences;
  onQuestionClick: (question: PresetQuestion) => void;
}

const allPresetQuestions: PresetQuestion[] = [
  {
    id: '1',
    text: 'How do I apply for a work permit?',
    category: 'Work Authorization',
    visaStatuses: ['Student Visa', 'Asylum Seeker', 'Refugee Status']
  },
  {
    id: '2',
    text: 'What documents do I need for green card application?',
    category: 'Permanent Residence',
    visaStatuses: ['Work Visa', 'Student Visa', 'Asylum Seeker']
  },
  {
    id: '3',
    text: 'How long does the citizenship process take?',
    category: 'Citizenship',
    visaStatuses: ['Permanent Resident']
  },
  {
    id: '4',
    text: 'Can I travel outside the country with my current status?',
    category: 'Travel',
    visaStatuses: ['Student Visa', 'Work Visa', 'Asylum Seeker', 'Permanent Resident']
  },
  {
    id: '5',
    text: 'How do I extend my visa?',
    category: 'Visa Extension',
    visaStatuses: ['Student Visa', 'Work Visa', 'Tourist Visa']
  },
  {
    id: '6',
    text: 'What are my rights as a refugee?',
    category: 'Rights',
    visaStatuses: ['Refugee Status', 'Asylum Seeker']
  },
  {
    id: '7',
    text: 'How do I change my visa status?',
    category: 'Status Change',
    visaStatuses: ['Student Visa', 'Tourist Visa', 'Work Visa']
  },
  {
    id: '8',
    text: 'What healthcare benefits am I eligible for?',
    category: 'Benefits',
    visaStatuses: ['Permanent Resident', 'Refugee Status', 'Asylum Seeker']
  }
];

const PresetQuestions: React.FC<PresetQuestionsProps> = ({ preferences, onQuestionClick }) => {
  const relevantQuestions = allPresetQuestions.filter(question => 
    !preferences.visaStatus || question.visaStatuses.includes(preferences.visaStatus)
  );

  if (relevantQuestions.length === 0) {
    return null;
  }

  return (
    <div className="p-6 border-t border-slate-700/50">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="w-4 h-4 text-blue-400" />
        <h3 className="text-sm font-medium text-slate-300">
          {preferences.visaStatus ? `Common questions for ${preferences.visaStatus}` : 'Frequently Asked Questions'}
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {relevantQuestions.slice(0, 4).map((question) => (
          <button
            key={question.id}
            onClick={() => onQuestionClick(question)}
            className="p-3 text-left bg-slate-700/30 hover:bg-slate-600/50 rounded-lg transition-colors text-sm text-slate-300 hover:text-white border border-slate-600/30 hover:border-slate-500"
          >
            {question.text}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PresetQuestions;