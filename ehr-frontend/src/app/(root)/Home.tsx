import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import {
  ArrowRightIcon,
  ShieldIcon,
  LockIcon,
  DatabaseIcon,
  ZapIcon,
  CheckCircle2Icon,
} from 'lucide-react';
import { Logo } from '@/components/brand/Logo';
import { cn } from '@/lib/utils';

const Home = () => {
  const features = [
    { icon: ShieldIcon, label: 'End-to-End Encryption' },
    { icon: DatabaseIcon, label: 'Decentralized Storage' },
    { icon: LockIcon, label: 'Patient-Controlled' },
    { icon: ZapIcon, label: 'Real-time Access' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground overflow-hidden relative">
      {/* Background Effects */}
      <div className="fixed inset-0 mesh-gradient z-0 pointer-events-none" />
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] z-0 pointer-events-none" />
      
      {/* Floating Orbs */}
      <div className="fixed top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-[120px] animate-pulse-glow z-0" />
      <div className="fixed bottom-20 right-10 w-96 h-96 bg-orange-400/15 rounded-full blur-[150px] z-0" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[200px] z-0" />

      {/* Header */}
      <header className="relative z-10 container mx-auto px-6 py-6 shrink-0">
        <div className="flex items-center justify-between">
          <Logo size="md" />
          <div className="flex gap-3">
            <Link to="/auth/login">
              <Button variant="ghost" className="rounded-full px-5 hover:bg-primary/5">
                Login
              </Button>
            </Link>
            <Link to="/auth/register">
              <Button className="rounded-full px-6 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-200">
                Get Started
                <ArrowRightIcon className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 container mx-auto px-6 flex-1 flex flex-col justify-center items-center">
        <div className="text-center max-w-5xl mx-auto -mt-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 ring-1 ring-primary/20">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            Secure Healthcare Records
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-8 tracking-tight leading-[1.1]">
            <span className="text-foreground">Secure Your Health</span>
            <br />
            <span className="gradient-text">Records Forever</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            A secure Electronic Health Record system with{' '}
            <span className="text-foreground font-medium">end-to-end encryption</span>.
            You own your data.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link to="/auth/register">
              <Button 
                size="lg" 
                className="h-14 px-8 text-lg rounded-full shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-300 group"
              >
                Start Free Today
                <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/auth/login">
              <Button 
                size="lg" 
                variant="outline" 
                className="h-14 px-8 text-lg rounded-full border-2 hover:bg-primary/5 hover:border-primary/40 transition-all duration-300"
              >
                Login to Dashboard
              </Button>
            </Link>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-full",
                  "bg-card/80 backdrop-blur-sm border border-border/50",
                  "hover:border-primary/30 hover:bg-primary/5 transition-all duration-300",
                  "group cursor-default"
                )}
              >
                <feature.icon className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-foreground/80">{feature.label}</span>
              </div>
            ))}
          </div>

          {/* Trust Indicators */}
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2Icon className="w-4 h-4 text-emerald-500" />
              <span>HIPAA Compliant</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-border" />
            <div className="flex items-center gap-2">
              <CheckCircle2Icon className="w-4 h-4 text-emerald-500" />
              <span>Secure Storage</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-border" />
            <div className="flex items-center gap-2">
              <CheckCircle2Icon className="w-4 h-4 text-emerald-500" />
              <span>Data Privacy</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 container mx-auto px-6 py-6 text-center text-sm text-muted-foreground/60">
        © 2026 EHR System. Secure Healthcare Records.
      </footer>
    </div>
  );
};

export default Home;
