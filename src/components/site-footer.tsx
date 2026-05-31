export function SiteFooter() {
  return (
    <footer className="w-full bg-[#1b1c18] py-14 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
        <div className="text-center md:text-left">
          <span className="text-xl font-display italic text-white font-bold block mb-2">
            ClickConverte
          </span>
          <p className="text-xs text-white/30 uppercase tracking-widest mb-3">
            Belo Horizonte · 100% online
          </p>
          <p className="text-xs text-white/20 font-body">
            © 2024 ClickConverte. Todos os direitos reservados.
          </p>
          <p className="text-[10px] text-white/15 font-body mt-1 tracking-wide">
            Fundadora: Isabella Melilo
          </p>
        </div>

        <div className="flex gap-10">
          <a
            href="/#servicos"
            className="text-xs uppercase tracking-widest text-white/40 hover:text-accent transition-colors font-headline"
          >
            Serviços
          </a>
          <a
            href="/sobre"
            className="text-xs uppercase tracking-widest text-white/40 hover:text-accent transition-colors font-headline"
          >
            Sobre
          </a>
          <a
            href="/#contato"
            className="text-xs uppercase tracking-widest text-white/40 hover:text-accent transition-colors font-headline"
          >
            Contato
          </a>
        </div>

        <div className="flex flex-col gap-1 text-right">
          <a
            href="mailto:contato@clickconverte.com.br"
            className="text-xs text-white/40 hover:text-accent transition-colors font-body"
          >
            contato@clickconverte.com.br
          </a>
          <span className="text-xs text-white/20 font-body">@clickconverte</span>
        </div>
      </div>
    </footer>
  )
}
