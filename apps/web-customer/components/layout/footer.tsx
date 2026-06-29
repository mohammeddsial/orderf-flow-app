import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-6 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="font-bold text-lg tracking-tight mb-3">
              <span className="text-primary">ored</span>
              <span>Flow</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Premium food delivery. Fresh ingredients, crafted with passion, delivered to your door.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Menu</h4>
            <div className="space-y-2">
              <Link href="/menu" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Burgers</Link>
              <Link href="/menu" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Sides</Link>
              <Link href="/menu" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Drinks</Link>
              <Link href="/menu" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Desserts</Link>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Company</h4>
            <div className="space-y-2">
              <span className="block text-sm text-muted-foreground">About Us</span>
              <span className="block text-sm text-muted-foreground">Careers</span>
              <span className="block text-sm text-muted-foreground">Press</span>
              <span className="block text-sm text-muted-foreground">Blog</span>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Support</h4>
            <div className="space-y-2">
              <span className="block text-sm text-muted-foreground">Help Center</span>
              <span className="block text-sm text-muted-foreground">Contact Us</span>
              <span className="block text-sm text-muted-foreground">Privacy Policy</span>
              <span className="block text-sm text-muted-foreground">Terms of Service</span>
            </div>
          </div>
        </div>
        <div className="border-t mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} oredFlow. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Accessibility</span>
          </div>
        </div>
      </div>
    </footer>
  )
}