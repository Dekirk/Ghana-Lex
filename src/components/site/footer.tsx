import { Scale, Mail, Phone, Globe, ShieldCheck } from "lucide-react";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto border-t border-border bg-sidebar/60">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground">
                <Scale className="h-4 w-4" />
              </span>
              <span className="font-semibold">GhanaLex AI</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              A proposed AI-powered legal-research and case-management platform
              for the Ghanaian legal fraternity. Built for counsel, litigants,
              firms and the bench.
            </p>
          </div>

          <div className="text-sm">
            <h3 className="font-semibold text-foreground">Contact</h3>
            <ul className="mt-2 space-y-1.5 text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" /> chambers@ghanalexai.com.gh
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" /> +233 30 222 1188
              </li>
              <li className="flex items-center gap-2">
                <Globe className="h-4 w-4" /> Accra · Kumasi · Takoradi
              </li>
            </ul>
          </div>

          <div className="text-sm">
            <h3 className="font-semibold text-foreground">Security &amp; Disclaimer</h3>
            <p className="mt-2 text-muted-foreground">
              All client files are protected by per-session Client Codes &amp;
              Case Codes. AI-generated answers are clearly marked as verified
              or unverified; they are not legal advice.
            </p>
            <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" /> Vercel-ready ·
              ISO 27001-aligned data handling
            </p>
          </div>
        </div>

        <div className="mt-6 border-t border-border pt-4 text-xs text-muted-foreground">
          <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
            <p>© {year} GhanaLex AI. A proposed platform — concept design.</p>
            <p className="text-[11px]">
              Built for the legal fraternity of the Republic of Ghana.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
