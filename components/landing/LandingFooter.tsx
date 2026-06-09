export default function LandingFooter() {
  return (
    <footer className="border-t border-white/[0.08] py-8 px-8 md:px-20 flex items-center justify-between bg-black">
      <span className="font-heading italic text-white/55 text-sm">Ingegno</span>
      <div className="flex items-center gap-6">
        <a href="#features" className="text-xs font-body text-white/45 hover:text-white/75 transition-colors">Features</a>
        <a href="#pricing" className="text-xs font-body text-white/45 hover:text-white/75 transition-colors">Pricing</a>
        <a href="/terms" className="text-xs font-body text-white/45 hover:text-white/75 transition-colors">Terms</a>
        <a href="/privacy" className="text-xs font-body text-white/45 hover:text-white/75 transition-colors">Privacy</a>
        <span className="text-xs font-body text-white/35">© 2026 Ingegno</span>
      </div>
    </footer>
  )
}
