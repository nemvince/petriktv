import { Icon } from '@iconify/react';

const AnimatedPlaceholder = ({ title }: { title: string }) => {
    return (
      <div className="h-full w-full justify-center items-center flex flex-col">
        <div className="flex items-center gap-2">
          <Icon 
            icon="tabler:pacman" 
            className="text-4xl -mr-3 text-petrik-1" 
          />
          {[1, 2, 3, 4, 5].map((dot) => (
            <span 
              key={dot} 
              className="w-2 h-2 bg-petrik-1 rounded-full animate-pulse"
              style={{
                animationDelay: `${dot * 0.1}s`,
                animationDuration: '2s'
              }}
            />
          ))}
        </div>
        <span className="text-xl font-semibold mt-2 animate-fade-in">
          {title}
        </span>
      </div>
    );
};

export default AnimatedPlaceholder;