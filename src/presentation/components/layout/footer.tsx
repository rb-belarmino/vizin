export function Footer() {
  return (
    <footer className="bg-slate-100 py-8 border-t border-slate-200">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm text-slate-500 mb-2">
          &copy; {new Date().getFullYear()} Viz
          <span className="text-indigo-600">in</span>. Todos os direitos
          reservados.
        </p>
      </div>
    </footer>
  )
}
