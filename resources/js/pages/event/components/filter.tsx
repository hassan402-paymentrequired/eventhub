import React from 'react';
import { Category } from '../types';

interface Props
{
  filters: any;
  setFilters: any;
  categories: Category[];
}

const FilterSidebar = ({ filters, setFilters, categories }: Props) => {

  const handleCategoryToggle = (category) => {
    setFilters(prev => ({
      ...prev,
      categories: prev?.categories?.includes(category)
        ? prev?.categories?.filter(c => c !== category)
        : [...prev?.categories, category]
    }));
  };

  const handlePriceChange = (value, index) => {
    const newRange = [...filters?.priceRange];
    newRange[index] = parseInt(value);
    setFilters(prev => ({ ...prev, priceRange: newRange }));
  };

  return (
    <div className="bg-card border-4 border-primary brutalist-shadow p-6 sticky top-24">
      <h3 className="text-xl font-black text-primary mb-6">Filters</h3>
     
      {/* Categories */}
      <div className="mb-6">
        <label className="block text-sm font-bold text-primary mb-3">
          Categories
        </label>
        <div className="flex flex-wrap gap-2">
          {categories?.map(category => (
            <button
              key={category}
              onClick={() => handleCategoryToggle(category)}
              className={`px-3 py-2 text-xs font-bold border-2 border-primary transition-all ${
                filters?.categories?.includes(category)
                  ? 'bg-accent text-accent-foreground brutalist-shadow'
                  : 'bg-card text-primary hover:bg-concrete'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
      {/* Price Range */}
      <div className="mb-6">
        <label className="block text-sm font-bold text-primary mb-3">
          Price Range: ${filters?.priceRange?.[0]} - ${filters?.priceRange?.[1]}
        </label>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground">Min Price</label>
            <input
              type="range"
              min="0"
              max="500"
              step="10"
              value={filters?.priceRange?.[0]}
              onChange={(e) => handlePriceChange(e?.target?.value, 0)}
              className="w-full h-2 bg-concrete border-2 border-primary appearance-none cursor-pointer"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Max Price</label>
            <input
              type="range"
              min="0"
              max="500"
              step="10"
              value={filters?.priceRange?.[1]}
              onChange={(e) => handlePriceChange(e?.target?.value, 1)}
              className="w-full h-2 bg-concrete border-2 border-primary appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>
      {/* Clear Filters */}
      <button
        onClick={() => setFilters({
          location: '',
          radius: 25,
          dateRange: { start: null, end: null },
          categories: [],
          priceRange: [0, 500]
        })}
        className="w-full px-4 py-3 bg-primary text-primary-foreground font-bold border-2 border-primary brutalist-shadow hover:shadow-brutalist-sm transition-all"
      >
        Clear All Filters
      </button>
    </div>
  );
};

export default FilterSidebar;