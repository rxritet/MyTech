interface SkillBadgeProps {
  label: string;
}

export default function SkillBadge({ label }: Readonly<SkillBadgeProps>) {
  return (
    <span className="px-2.5 py-0.5 bg-gray-800 border border-gray-700 rounded-full text-xs font-mono text-gray-300">
      {label}
    </span>
  );
}
