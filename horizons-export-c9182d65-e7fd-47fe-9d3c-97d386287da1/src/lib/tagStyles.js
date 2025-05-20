export const getTagStyles = (type) => {
    switch (type) {
      case 'person': 
        return { 
          bgColor: 'bg-blue-200', textColor: 'text-blue-900', borderColor: 'border-blue-400', hoverBgColor: 'hover:bg-blue-300',
          darkBgColor: 'dark:bg-blue-800/60', darkTextColor: 'dark:text-blue-100', darkBorderColor: 'dark:border-blue-600', darkHoverBgColor: 'dark:hover:bg-blue-700/60'
        };
      case 'place':
        return { 
          bgColor: 'bg-green-200', textColor: 'text-green-900', borderColor: 'border-green-400', hoverBgColor: 'hover:bg-green-300',
          darkBgColor: 'dark:bg-green-800/60', darkTextColor: 'dark:text-green-100', darkBorderColor: 'dark:border-green-600', darkHoverBgColor: 'dark:hover:bg-green-700/60'
        };
      case 'event':
        return { 
          bgColor: 'bg-purple-200', textColor: 'text-purple-900', borderColor: 'border-purple-400', hoverBgColor: 'hover:bg-purple-300',
          darkBgColor: 'dark:bg-purple-800/60', darkTextColor: 'dark:text-purple-100', darkBorderColor: 'dark:border-purple-600', darkHoverBgColor: 'dark:hover:bg-purple-700/60'
        };
      case 'time':
        return { 
          bgColor: 'bg-amber-200', textColor: 'text-amber-900', borderColor: 'border-amber-400', hoverBgColor: 'hover:bg-amber-300',
          darkBgColor: 'dark:bg-amber-800/60', darkTextColor: 'dark:text-amber-100', darkBorderColor: 'dark:border-amber-600', darkHoverBgColor: 'dark:hover:bg-amber-700/60'
        };
      case 'concept':
        return { 
          bgColor: 'bg-pink-200', textColor: 'text-pink-900', borderColor: 'border-pink-400', hoverBgColor: 'hover:bg-pink-300',
          darkBgColor: 'dark:bg-pink-800/60', darkTextColor: 'dark:text-pink-100', darkBorderColor: 'dark:border-pink-600', darkHoverBgColor: 'dark:hover:bg-pink-700/60'
        };
      case 'element':
        return { 
          bgColor: 'bg-teal-200', textColor: 'text-teal-900', borderColor: 'border-teal-400', hoverBgColor: 'hover:bg-teal-300',
          darkBgColor: 'dark:bg-teal-800/60', darkTextColor: 'dark:text-teal-100', darkBorderColor: 'dark:border-teal-600', darkHoverBgColor: 'dark:hover:bg-teal-700/60'
        };
      case 'divine-act':
        return { 
          bgColor: 'bg-indigo-200', textColor: 'text-indigo-900', borderColor: 'border-indigo-400', hoverBgColor: 'hover:bg-indigo-300',
          darkBgColor: 'dark:bg-indigo-800/60', darkTextColor: 'dark:text-indigo-100', darkBorderColor: 'dark:border-indigo-600', darkHoverBgColor: 'dark:hover:bg-indigo-700/60'
        };
      case 'attribute':
        return { 
          bgColor: 'bg-rose-200', textColor: 'text-rose-900', borderColor: 'border-rose-400', hoverBgColor: 'hover:bg-rose-300',
          darkBgColor: 'dark:bg-rose-800/60', darkTextColor: 'dark:text-rose-100', darkBorderColor: 'dark:border-rose-600', darkHoverBgColor: 'dark:hover:bg-rose-700/60'
        };
      case 'state':
        return { 
          bgColor: 'bg-cyan-200', textColor: 'text-cyan-900', borderColor: 'border-cyan-400', hoverBgColor: 'hover:bg-cyan-300',
          darkBgColor: 'dark:bg-cyan-800/60', darkTextColor: 'dark:text-cyan-100', darkBorderColor: 'dark:border-cyan-600', darkHoverBgColor: 'dark:hover:bg-cyan-700/60'
        };
      case 'action':
        return { 
          bgColor: 'bg-lime-200', textColor: 'text-lime-900', borderColor: 'border-lime-400', hoverBgColor: 'hover:bg-lime-300',
          darkBgColor: 'dark:bg-lime-800/60', darkTextColor: 'dark:text-lime-100', darkBorderColor: 'dark:border-lime-600', darkHoverBgColor: 'dark:hover:bg-lime-700/60'
        };
      case 'creature':
        return {
          bgColor: 'bg-orange-200', textColor: 'text-orange-900', borderColor: 'border-orange-400', hoverBgColor: 'hover:bg-orange-300',
          darkBgColor: 'dark:bg-orange-800/60', darkTextColor: 'dark:text-orange-100', darkBorderColor: 'dark:border-orange-600', darkHoverBgColor: 'dark:hover:bg-orange-700/60'
        };
      case 'celestial':
        return {
          bgColor: 'bg-violet-200', textColor: 'text-violet-900', borderColor: 'border-violet-400', hoverBgColor: 'hover:bg-violet-300',
          darkBgColor: 'dark:bg-violet-800/60', darkTextColor: 'dark:text-violet-100', darkBorderColor: 'dark:border-violet-600', darkHoverBgColor: 'dark:hover:bg-violet-700/60'
        };
      default:
        return { 
          bgColor: 'bg-slate-300', textColor: 'text-slate-800', borderColor: 'border-slate-400', hoverBgColor: 'hover:bg-slate-400',
          darkBgColor: 'dark:bg-sky-900/70', darkTextColor: 'dark:text-sky-100', darkBorderColor: 'dark:border-sky-700', darkHoverBgColor: 'dark:hover:bg-sky-800/70'
        };
    }
  };