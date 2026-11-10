import type { SVGProps } from "react";

/**
 * Collection d'icônes & stickers au trait fin, partageant la même identité :
 * trait 1.3, extrémités arrondies, couleur héritée (currentColor) + accents dorés/sauge.
 */
type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Svg({ size = 24, children, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.3}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

export const RingsIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="9" cy="14.5" r="5.5" />
    <circle cx="15" cy="14.5" r="5.5" />
    <path d="M7.5 5.5 9 3.5l1.5 2L9 7.2z" fill="var(--gold-soft)" />
  </Svg>
);

export const HeartIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.4a4.3 4.3 0 0 1 7.5 2.4C19.5 15.4 12 20 12 20Z" />
  </Svg>
);

export const DoveIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 13c3.5 0 5-1.6 6.5-4.2C11 6 13 4.5 16 4.5c-1 1.2-1.4 2.4-1.2 3.8L21 9.5l-4.6 1.4c-.6 4.4-4 7.6-8.9 7.6-1.6 0-3-.4-4.5-1.2 1.8-.4 3-1.1 3.9-2.2C5 15 3.8 14.2 3 13Z" />
    <path d="M10.5 12.5c1.4 1 3 1.2 4.5.4" />
    <circle cx="17.2" cy="7.4" r=".4" fill="currentColor" />
  </Svg>
);

export const ChampagneIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6.5 3.5h5l-.4 5a2.3 2.3 0 0 1-4.2 0z" />
    <path d="M9 10v7.5M6.5 20.5h5M9 17.5l-2.5 3M9 17.5l2.5 3" />
    <path d="M12.5 3.5h5l.4 5a2.3 2.3 0 0 1-4.2 0z" transform="rotate(12 15 6)" />
    <path d="M16 10.4v7M13.6 20.4h5" transform="rotate(12 15 6)" />
    <path d="M12 1v1.2M14 1.6l-.6 1M10 1.6l.6 1" stroke="var(--gold)" />
  </Svg>
);

export const StarIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 2.5c.6 4.6 2.9 6.9 7.5 7.5-4.6.6-6.9 2.9-7.5 7.5-.6-4.6-2.9-6.9-7.5-7.5 4.6-.6 6.9-2.9 7.5-7.5Z" fill="currentColor" stroke="none" />
    <path d="M19 16.5c.2 1.6 1 2.4 2.5 2.5-1.6.2-2.4 1-2.5 2.5-.2-1.6-1-2.4-2.5-2.5 1.6-.2 2.4-1 2.5-2.5Z" fill="currentColor" stroke="none" opacity=".6" />
  </Svg>
);

export const EnvelopeIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="6" width="18" height="13" rx="1.5" />
    <path d="m3.5 7 8.5 6.5L20.5 7" />
    <path d="M12 12.4s-1.8-1.1-1.8-2.3a1 1 0 0 1 1.8-.6 1 1 0 0 1 1.8.6c0 1.2-1.8 2.3-1.8 2.3Z" fill="var(--gold-soft)" />
  </Svg>
);

export const LeafIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 19C5 10 10 5 19.5 4.5 19 14 14 19 5 19Z" />
    <path d="M5 19 14 10M9.5 14.5h3.5M12 12V8.8" />
  </Svg>
);

export const QuillIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M20 3.4c-5.2.8-9 3.4-11.6 7.4C6 14.6 5 17.6 4.2 20.4" />
    <path d="M20 3.4C17.2 8.6 14 12 9.6 14.2" />
    <path d="M14.4 6.4c-1.5 1.6-2.5 3.5-3.1 5.6M11.8 8.6c-1.1 1.3-1.8 2.9-2.2 4.6" />
    <path d="m4.2 20.4 3.2-3.6M4.2 20.4l2.3.5" />
  </Svg>
);

export const FlowerIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="2.2" fill="var(--gold-soft)" />
    <path d="M12 9.8C10 6.5 10.8 3.5 12 3c1.2.5 2 3.5 0 6.8ZM12 14.2c2 3.3 1.2 6.3 0 6.8-1.2-.5-2-3.5 0-6.8ZM9.8 12C6.5 14 3.5 13.2 3 12c.5-1.2 3.5-2 6.8 0ZM14.2 12c3.3-2 6.3-1.2 6.8 0-.5 1.2-3.5 2-6.8 0Z" />
  </Svg>
);

export const ClockIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </Svg>
);

export const PinIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 21s6.5-6.1 6.5-11.2a6.5 6.5 0 0 0-13 0C5.5 14.9 12 21 12 21Z" />
    <circle cx="12" cy="9.8" r="2.3" />
  </Svg>
);

export const CalendarIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
    <path d="M3.5 9.5h17M8 3v4M16 3v4" />
    <path d="M12 17.2s-2.2-1.3-2.2-2.8a1.2 1.2 0 0 1 2.2-.7 1.2 1.2 0 0 1 2.2.7c0 1.5-2.2 2.8-2.2 2.8Z" fill="var(--gold-soft)" />
  </Svg>
);

export const ArrowIcon = ({ direction = "right", ...p }: IconProps & { direction?: "left" | "right" | "up" | "up-right" | "down" }) => {
  const rotate = { right: 0, left: 180, up: -90, "up-right": -45, down: 90 }[direction];
  return (
    <Svg {...p} style={{ transform: `rotate(${rotate}deg)`, ...p.style }}>
      <path d="M4 12h15M14 7l5 5-5 5" />
    </Svg>
  );
};

export const PlayIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M8 5.5v13l10.5-6.5z" fill="currentColor" />
  </Svg>
);

export const PauseIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M8.5 5.5v13M15.5 5.5v13" strokeWidth={2.4} />
  </Svg>
);

export const VolumeIcon = ({ muted, ...p }: IconProps & { muted?: boolean }) => (
  <Svg {...p}>
    <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" />
    {muted ? <path d="m16 9.5 5 5M21 9.5l-5 5" /> : <path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" />}
  </Svg>
);

export const MusicIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M9 18V5.5l11-2V16" />
    <circle cx="6.5" cy="18" r="2.5" />
    <circle cx="17.5" cy="16" r="2.5" />
  </Svg>
);

export const CheckIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </Svg>
);

export const PhoneIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6.5 3.5h3l1.5 4-2 1.5a10.5 10.5 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2 2A16.5 16.5 0 0 1 4.5 5.5a2 2 0 0 1 2-2Z" />
  </Svg>
);

export const UserIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="8" r="3.8" />
    <path d="M4.5 20.5c1-4 4-6 7.5-6s6.5 2 7.5 6" />
  </Svg>
);

/** Branche florale décorative (plus grande, deux tons). */
export function FloralBranch({ className, ...p }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 220 120" fill="none" className={className} aria-hidden="true" focusable="false" {...p}>
      <path d="M6 112C50 96 92 70 128 42c20-16 44-30 86-36" stroke="var(--sage)" strokeWidth="1.4" strokeLinecap="round" />
      {[
        [40, 98, -30], [64, 86, 20], [86, 72, -40], [104, 60, 25], [130, 40, -35], [150, 28, 15], [176, 16, -25],
      ].map(([x, y, r], i) => (
        <path
          key={i}
          d="M0 0c6-10 18-12 26-8C20 2 8 6 0 0Z"
          transform={`translate(${x} ${y}) rotate(${r + (i % 2 ? 180 : 0)})`}
          fill={i % 3 === 0 ? "var(--sage-soft)" : "none"}
          stroke="var(--sage)"
          strokeWidth="1.1"
        />
      ))}
      {[
        [118, 52], [196, 10], [72, 82],
      ].map(([x, y], i) => (
        <g key={`f${i}`} transform={`translate(${x} ${y})`}>
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse key={a} cx="0" cy="-5" rx="3.2" ry="5.2" transform={`rotate(${a})`} fill="#fff" stroke="var(--gold)" strokeWidth="1" />
          ))}
          <circle r="2.4" fill="var(--gold-soft)" stroke="var(--gold)" strokeWidth=".8" />
        </g>
      ))}
    </svg>
  );
}
