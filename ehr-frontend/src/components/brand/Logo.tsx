import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  variant?: 'default' | 'white' | 'dark';
}

export const Logo = ({ 
  className, 
  size = 'md', 
  showText = true,
  variant = 'default' 
}: LogoProps) => {
  const sizes = {
    sm: { icon: 'w-8 h-8', text: 'text-lg', gap: 'gap-2' },
    md: { icon: 'w-10 h-10', text: 'text-xl', gap: 'gap-3' },
    lg: { icon: 'w-12 h-12', text: 'text-2xl', gap: 'gap-3' },
    xl: { icon: 'w-16 h-16', text: 'text-3xl', gap: 'gap-4' },
  };

  const colors = {
    default: {
      primary: 'text-primary',
      secondary: 'text-foreground',
      bg: 'bg-primary',
    },
    white: {
      primary: 'text-white',
      secondary: 'text-white',
      bg: 'bg-white/20',
    },
    dark: {
      primary: 'text-primary',
      secondary: 'text-zinc-900',
      bg: 'bg-primary',
    },
  };

  return (
    <div className={cn('flex items-center', sizes[size].gap, className)}>
      {/* Custom Logo Icon - Medical Shield with Blockchain Nodes */}
      <div className={cn(
        'relative flex items-center justify-center rounded-xl shadow-lg',
        sizes[size].icon,
        colors[variant].bg,
        variant === 'default' && 'shadow-primary/30'
      )}>
        <svg 
          viewBox="0 0 40 40" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-[65%] h-[65%]"
        >
          {/* Shield Base */}
          <path 
            d="M20 2L4 8V18C4 28 11.5 36.5 20 38C28.5 36.5 36 28 36 18V8L20 2Z" 
            fill="currentColor"
            className={variant === 'default' || variant === 'dark' ? 'text-white' : 'text-primary'}
            opacity="0.9"
          />
          
          {/* Cross/Plus Symbol - Medical */}
          <path 
            d="M17 12H23V17H28V23H23V28H17V23H12V17H17V12Z" 
            fill="currentColor"
            className={variant === 'default' || variant === 'dark' ? 'text-primary' : 'text-white'}
          />
          
          {/* Blockchain Nodes - Small circles */}
          <circle cx="10" cy="14" r="2" fill="currentColor" className={variant === 'default' || variant === 'dark' ? 'text-white/60' : 'text-primary/60'} />
          <circle cx="30" cy="14" r="2" fill="currentColor" className={variant === 'default' || variant === 'dark' ? 'text-white/60' : 'text-primary/60'} />
          <circle cx="20" cy="34" r="2" fill="currentColor" className={variant === 'default' || variant === 'dark' ? 'text-white/60' : 'text-primary/60'} />
          
          {/* Connection lines */}
          <path 
            d="M12 14L17 17M28 14L23 17M20 28L20 32" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round"
            className={variant === 'default' || variant === 'dark' ? 'text-white/40' : 'text-primary/40'}
          />
        </svg>
        
        {/* Subtle glow effect */}
        <div className="absolute inset-0 rounded-xl bg-white/10 blur-sm -z-10 scale-110" />
      </div>

      {showText && (
        <div className="flex flex-col leading-tight">
          <span className={cn(
            'font-bold tracking-tight',
            sizes[size].text,
            colors[variant].secondary
          )}>
            EHR<span className={colors[variant].primary}>Chain</span>
          </span>
          <span className={cn(
            'text-[10px] tracking-widest uppercase font-medium opacity-60',
            colors[variant].secondary
          )}>
            Secure Health Records
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
