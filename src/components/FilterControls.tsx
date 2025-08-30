import React, = 'react';
import { Filter, Eye, EyeOff, ChevronDown } = 'lucide-react';
import { FilterMode } = '../types';

interface FilterControlsProps {
  filterMode: FilterMode;
  onFilterChange: (mode: FilterMode) => void;
  unavailableCount: number;
  totalCount: number;
}

export const FilterControls: React.FC<FilterControlsProps> = ({
  filterMode,
  onFilterChange,
  unavailableCount,
  totalCount,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // The complex useEffect for desktop layout is no longer needed and has been removed.
  // The refs for the desktop buttons are also no longer needed.

  if (unavailableCount === 0) return null;

  const availableCount = totalCount - unavailableCount;
  
  const filterOptions = [
    { mode: 'all' as FilterMode, label: 'All', count: totalCount, icon: Filter },
    { mode: 'available' as FilterMode, label: 'Available', count: availableCount, icon: Eye },
    { mode: 'unavailable' as FilterMode, label: 'Unavailable', count: unavailableCount, icon: EyeOff },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => { document.removeEventListener('mousedown', handleClickOutside); };
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsMobileMenuOpen(false);
    if (isMobileMenuOpen) {
      window.addEventListener('scroll', handleScroll, { passive: true });
    }
    return () => { window.removeEventListener('scroll', handleScroll); };
  }, [isMobileMenuOpen]);

  const handleFilterChange = (newMode: FilterMode) => {
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
    if (newMode === filterMode) return;
    
    const container = document.querySelector('[data-filter-container]') || document.querySelector('[data-view-container]');
    if (container) {
      container.classList.add('opacity-50', 'scale-95');
      setTimeout(() => {
        onFilterChange(newMode);
        setTimeout(() => { container.classList.remove('opacity-50', 'scale-95'); }, 150);
      }, 150);
    } else {
      onFilterChange(newMode);
    }
  };

  return (
    <>
      <div ref={dropdownRef} className={`relative w-full sm:w-auto ${isMobileMenuOpen ? 'z-20' : 'z-auto'}`}>
        {/* --- [MODIFIED] New Desktop View --- */}
        <div className="hidden sm:relative sm:flex items-center bg-white/30 dark:bg-black/40 backdrop-blur-heavy rounded-2xl p-1 shadow-xl border border-white/30 dark:border-white/20 animate-slide-in-left sm:w-[540px]">
          {/* Animated Selector Background */}
          <div 
            className={`absolute top-1 bottom-1 bg-primary/80 backdrop-blur-sm rounded-2xl transition-all duration-300 ease-out shadow-sm ${
              filterMode === 'all' 
                ? 'left-1 w-[calc(33.333%-4px)]' 
                : filterMode === 'available'
                ? 'left-[33.333%] w-[calc(33.333%-4px)]'
                : 'left-[66.666%] w-[calc(33.333%-4px)]'
            }`}
          />
          {filterOptions.map(option => (
            <button
              key={option.mode}
              onClick={() => handleFilterChange(option.mode)}
              className={`relative z-10 flex items-center justify-center gap-2 px-8 py-3 rounded-2xl font-medium transition-all duration-225 text-sm min-w-0 flex-1 ${
                filterMode === option.mode
                  ? 'text-white'
                  : 'text-gray-900 dark:text-white hover:text-primary hover:bg-white/10'
              }`}
            >
              <option.icon className={`w-4 h-4 transition-all duration-225 ${
                filterMode === option.mode ? 'scale-110' : 'hover:rotate-12'
              }`} />
              <span className={`transition-all duration-225 whitespace-nowrap ${
                filterMode === option.mode ? 'font-semibold' : ''
              }`}>
                {`${option.label} (${option.count})`}
              </span>
            </button>
          ))}
        </div>

        {/* --- Mobile View: Dropdown Filter (Unchanged) --- */}
        <div className="sm:hidden w-full animate-slide-in-left">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="flex items-center justify-between w-full bg-white/30 dark:bg-black/40 backdrop-blur-heavy rounded-xl p-3 shadow-xl border border-white/30 dark:border-white/20 text-gray-900 dark:text-white transition-transform duration-200 active:scale-95">
            <div className="grid items-center">
              {filterOptions.map(option => (
                <div key={option.mode} style={{ gridArea: '1 / 1' }} className={`flex items-center gap-2 transition-all duration-500 ease-out ${filterMode === option.mode ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
                  <option.icon className="w-4 h-4 text-primary" />
                  <span className="font-semibold text-sm pb-[1px]">{`${option.label} (${option.count})`}</span>
                </div>
              ))}
            </div>
            <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-180' : 'rotate-0'}`} />
          </button>
          
          <div className={`absolute top-full left-0 right-0 mt-2 w-full overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-xl rounded-xl border border-white/30 dark:border-white/20 p-2 space-y-1 shadow-2xl">
              {filterOptions.map(option => (
                <button key={option.mode} onClick={() => handleFilterChange(option.mode)} className={`group flex items-center gap-4 w-full px-4 py-3 rounded-lg transition-[color,background-color,box-shadow,transform] duration-200 text-left active:scale-95 ${option.mode === filterMode ? 'bg-primary/80 text-white font-semibold shadow-md' : 'text-gray-900 dark:text-white hover:bg-black/5 dark:hover:bg-white/5'}`}>
                  <option.icon className={`w-4 h-4 ${option.mode === filterMode ? 'text-white' : 'text-primary'}`} />
                  <span className="text-xs font-semibold">{`${option.label} (${option.count})`}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="sm:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-10 animate-fade-in" onClick={() => setIsMobileMenuOpen(false)} />
      )}
    </>
  );
};