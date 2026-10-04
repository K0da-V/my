interface AuraPriveLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export function AuraPriveLogo({ size = 'md', showSubtitle = false }: AuraPriveLogoProps) {
  const iconBox =
    size === 'sm'
      ? 'w-8 h-8 rounded-xl'
      : size === 'lg'
      ? 'w-11 h-11 rounded-2xl'
      : 'w-9 h-9 rounded-xl';

  const svgSize = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5';

  const textSize =
    size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-lg';

  return (
    <div className="inline-flex items-center gap-2.5 select-none">
      {/* Clean, minimalist human-designed brand mark: intertwined flame & heart curve */}
      <div
        className={`${iconBox} bg-gradient-to-br from-[#E11D48] to-[#9F1239] flex items-center justify-center shadow-sm border border-white/15 shrink-0`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className={`${svgSize} text-white`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            fill="currentColor"
            fillOpacity="0.22"
          />
          <path
            d="M12 2.75C12 2.75 7.5 7.1 7.5 11.25C7.5 13.85 9.51 15.95 12 15.95C14.49 15.95 16.5 13.85 16.5 11.25C16.5 9.4 15.45 7.6 14.2 6.1C14.05 7.55 13.1 8.6 12.1 8.85C13.15 6.85 12.85 4.4 12 2.75Z"
            fill="currentColor"
          />
          <path
            d="M12 20.5C6.4 15.6 3.25 12.6 3.25 8.65C3.25 6.05 5.25 4 7.8 4C9.4 4 10.95 4.8 12 6.1C13.05 4.8 14.6 4 16.2 4C18.75 4 20.75 6.05 20.75 8.65C20.75 12.6 17.6 15.6 12 20.5Z"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="flex flex-col leading-none">
        <div className="flex items-baseline gap-1">
          <span className={`${textSize} font-bold tracking-tight text-white`}>
            aura
          </span>
          <span className={`${textSize} font-light tracking-tight text-[#FB7185]`}>
            privé
          </span>
        </div>
        {showSubtitle && (
          <span className="text-[10px] text-white/45 font-medium tracking-wide mt-0.5">
            encontros & conexões +18
          </span>
        )}
      </div>
    </div>
  );
}
