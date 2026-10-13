import Link from "next/link";

export function Brand({ compact = false }: { compact?: boolean }) {
  return <Link className="brand" href="/" aria-label="Voxora home"><span className="brand-mark">V</span>{!compact && <span>Voxora</span>}</Link>;
}
