import { Logo } from "@/components/ui/logo";
import { footer, nav, site } from "@/content/site";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] pb-28 pt-14 md:pb-14">
      <div className="container flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-fog-500">{footer.tagline}</p>
        </div>
        <nav aria-label="Rodapé">
          <ul className="grid grid-cols-2 gap-x-12 gap-y-1 text-sm">
            {nav.links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="inline-flex min-h-8 items-center text-fog-400 transition-colors hover:text-white">
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <a href={`mailto:${site.email}`} className="inline-flex min-h-8 items-center text-fog-400 transition-colors hover:text-white">
                Contato
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <div className="container mt-12">
        <p className="text-xs text-fog-500">{footer.copyright}</p>
      </div>
    </footer>
  );
}
