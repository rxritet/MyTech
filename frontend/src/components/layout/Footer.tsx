export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-[rgba(0,255,136,0.08)] py-6 text-center font-mono text-xs text-[#5a5a7a]">
      © {year} rxritet · built with React + Go
    </footer>
  );
}
