import React, { useState } from 'react';
import Icon, { iconCategories, getIconsByCategory, searchIcons } from './Icon';

const IconDemo: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof iconCategories>('mapMarkers');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = Object.keys(iconCategories) as Array<keyof typeof iconCategories>;
  const iconsToShow = searchTerm
    ? searchIcons(searchTerm)
    : getIconsByCategory(selectedCategory);

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="text-2xl terminal-value mb-6 text-center">
        FALLOUT ICON SYSTEM - DEMONSTRATION
      </div>

      {/* Controls */}
      <div className="crt-box p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Category Selector */}
          <div>
            <label className="block text-sm terminal-value mb-2">ICON CATEGORY:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as keyof typeof iconCategories)}
              className="w-full p-2 bg-black border border-green-400 text-green-400 font-mono"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div>
            <label className="block text-sm terminal-value mb-2">SEARCH ICONS:</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="e.g., weapon, quest, health..."
              className="w-full p-2 bg-black border border-green-400 text-green-400 font-mono placeholder-green-600"
            />
          </div>
        </div>
      </div>

      {/* Usage Examples */}
      <div className="crt-box p-4 mb-6">
        <div className="text-lg terminal-value mb-3">USAGE EXAMPLES:</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm font-mono">
          <div className="bg-gray-900 p-3 rounded border border-green-400">
            <div className="text-green-400 mb-2">Basic Usage:</div>
            <code className="text-green-300">
              {'<Icon name="quest-main" size={32} />'}
            </code>
          </div>
          <div className="bg-gray-900 p-3 rounded border border-green-400">
            <div className="text-green-400 mb-2">With Click Handler:</div>
            <code className="text-green-300">
              {'<Icon name="weapon-pistol" onClick={handleClick} />'}
            </code>
          </div>
          <div className="bg-gray-900 p-3 rounded border border-green-400">
            <div className="text-green-400 mb-2">Custom Styling:</div>
            <code className="text-green-300">
              {'<Icon name="health-critical" className="pulse" />'}
            </code>
          </div>
        </div>
      </div>

      {/* Icon Grid */}
      <div className="crt-box p-4">
        <div className="text-lg terminal-value mb-3">
          {searchTerm ? `SEARCH RESULTS (${iconsToShow.length})` : `${selectedCategory.toUpperCase()} ICONS (${iconsToShow.length})`}
        </div>

        {iconsToShow.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No icons found matching your search.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {iconsToShow.map((iconName) => (
              <div
                key={iconName}
                className="flex flex-col items-center p-3 border border-green-400 bg-gray-900 hover:bg-gray-800 transition-colors cursor-pointer"
                title={iconName}
              >
                <Icon
                  name={iconName}
                  size={32}
                  className="mb-2"
                />
                <div className="text-xs text-green-400 text-center font-mono break-all">
                  {iconName}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Icon Categories Overview */}
      <div className="crt-box p-4 mt-6">
        <div className="text-lg terminal-value mb-3">AVAILABLE CATEGORIES:</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {categories.map(category => (
            <div
              key={category}
              className={`p-3 border cursor-pointer transition-colors ${
                selectedCategory === category
                  ? 'border-green-400 bg-gray-800'
                  : 'border-gray-600 bg-gray-900 hover:border-green-500'
              }`}
              onClick={() => {
                setSelectedCategory(category);
                setSearchTerm('');
              }}
            >
              <div className="text-green-400 font-mono text-sm font-bold">
                {category.toUpperCase()}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {getIconsByCategory(category).length} icons
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IconDemo;
