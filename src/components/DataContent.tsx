import React from 'react';
import type { Quest } from '../types';
import { useSoundEffects } from '../hooks/useSoundEffects';
import Content from './Content';

interface DataContentProps {
  quests: Quest[];
  onQuestToggle: (questIndex: number) => void;
}

const DataContent: React.FC<DataContentProps> = ({ quests, onQuestToggle }) => {
  const { playQuestSound, playHoverSound } = useSoundEffects();
  const handleQuestClick = (questIndex: number) => {
    const quest = quests[questIndex];
    
    // Only allow tracking of IN PROGRESS quests
    if (quest.status !== 'IN PROGRESS') {
      return;
    }
    
    const willBeTracked = !quest.tracked;
    playQuestSound(willBeTracked);
    onQuestToggle(questIndex);
  };

  return (
    <Content>
      <div className="crt-text p-6 max-w-4xl mx-auto space-y-5">
        <div className="text-center mb-8 p-4 border border-green-500 border-opacity-30 bg-black bg-opacity-40">
          <div className="terminal-label text-sm mb-2">QUEST TRACKING</div>
          <div className="text-xs crt-dim">Only IN PROGRESS quests can be tracked for objective monitoring</div>
        </div>
      {quests.map((quest, index) => (
        <div 
          key={index} 
          className={`crt-box p-5 ${quest.status === 'IN PROGRESS' ? 'cursor-pointer crt-hover' : 'cursor-not-allowed opacity-75'} ${quest.tracked ? 'crt-box-active' : ''}`}
          onMouseEnter={() => quest.status === 'IN PROGRESS' && playHoverSound()}
          onClick={() => handleQuestClick(index)}
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-base sm:text-xl terminal-value">{quest.name}</h3>
            <div className="flex items-center gap-3">
              {quest.tracked && (
                <span className="text-green-400 text-sm terminal-label">TRACKED</span>
              )}
              <span className="crt-badge">
                {quest.status}
              </span>
            </div>
          </div>
          <div className="crt-dim mb-3">{quest.company} | {quest.period}</div>
          <p className="mb-4">{quest.description}</p>
          <div className="space-y-1">
            {quest.achievements.map((achievement, i) => (
              <div key={i} className="ml-5 text-sm crt-dim">▸ {achievement}</div>
            ))}
          </div>
        </div>
      ))}
      </div>
    </Content>
  );
};

export default DataContent; 