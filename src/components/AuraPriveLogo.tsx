interface AuraPriveLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  firstName?: string;
  secondName?: string;
  subtitleText?: string;
  showFlameOnE?: boolean;
}

export function AuraPriveLogo({
  size = 'md',
  showSubtitle = false,
  firstName = 'Aura',
  secondName = 'Privé',
  subtitleText = 'Encontros & Lifestyle +18',
  showFlameOnE = true
}: AuraPriveLogoProps) {
  const textSize =
    size === 'sm'
      ? 'text-xl sm:text-2xl'
      : size === 'lg'
      ? 'text-3xl sm:text-4xl'
      : 'text-2xl sm:text-3xl';

  const flameSize =
    size === 'sm'
      ? 'w-3 h-3.5 -top-2'
      : size === 'lg'
      ? 'w-4 h-5 -top-3'
      : 'w-3.5 h-4 -top-2.5';

  // Render the flame accent on the final 'e'/'é' of the second word
  const cleanSecond = secondName.trim() || 'Privé';
  const endsWithE =
    cleanSecond.toLowerCase().endsWith('é') || cleanSecond.toLowerCase().endsWith('e');
  const prefixSecond = endsWithE ? cleanSecond.slice(0, -1) : cleanSecond;

  return (
    <div className="inline-flex flex-col select-none">
      <div
        className={`${textSize} font-bold tracking-tight leading-none flex items-baseline font-serif`}
      >
        <span className="text-white font-bold">{firstName}</span>
        <span className="ml-1.5 text-[#FB7185] italic font-semibold inline-flex items-baseline">
          <span>{prefixSecond}</span>
          {endsWithE && (
            <span className="relative inline-block not-italic font-serif">
              <span>{showFlameOnE ? 'e' : 'é'}</span>
              {showFlameOnE && (
                /* Foguinho no lugar do acento agudo da letra é */
                <svg
                  viewBox="0 0 24 28"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  className={`absolute left-1/2 -translate-x-1/3 ${flameSize} rotate-[14deg] drop-shadow-[0_0_6px_rgba(244,63,94,0.75)] pointer-events-none`}
                >
                  <path
                    d="M13.5 1.5C13.8 5.2 10.2 7.8 9.2 11.2C8.4 13.8 9.8 16.2 9.8 16.2C9.8 16.2 7.4 15.1 6.9 12.4C4.2 15.3 4.5 20.1 7.6 23.1C10.5 25.9 15.4 25.8 18.1 22.6C20.9 19.3 20.6 13.9 17.8 9.8C16.2 7.4 13.3 4.8 13.5 1.5Z"
                    fill="url(#auraFlameGrad)"
                  />
                  <path
                    d="M12.6 12.2C12.8 14.3 11.1 15.8 10.8 17.6C10.5 19.6 11.8 21.5 13.6 21.5C15.5 21.5 16.8 19.4 16.2 17.1C15.7 15.1 13.5 13.8 12.6 12.2Z"
                    fill="#FDE68A"
                  />
                  <defs>
                    <linearGradient
                      id="auraFlameGrad"
                      x1="12"
                      y1="1.5"
                      x2="12"
                      y2="25.5"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#FBBF24" />
                      <stop offset="0.5" stopColor="#F43F5E" />
                      <stop offset="1" stopColor="#E11D48" />
                    </linearGradient>
                  </defs>
                </svg>
              )}
            </span>
          )}
        </span>
      </div>
      {showSubtitle && (
        <span className="text-[10px] text-white/45 tracking-widest uppercase font-medium mt-1 font-sans">
          {subtitleText}
        </span>
      )}
    </div>
  );
}
