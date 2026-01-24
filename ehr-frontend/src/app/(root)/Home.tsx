import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import {
  ShieldCheckIcon,
  ArrowRightIcon,
} from 'lucide-react';

const Home = () => {
  return (
    <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden">
      {/* Header */}
      <header className="container mx-auto px-6 py-6 border-b border-border/40 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <ShieldCheckIcon className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xl font-bold tracking-tight">EHR System</span>
          </div>
          <div className="flex gap-3">
            <Link to="/auth/login">
              <Button variant="ghost" className="hover:bg-secondary/80">
                Login
              </Button>
            </Link>
            <Link to="/auth/register">
              <Button className="font-semibold shadow-sm hover:shadow-md transition-shadow">
                Register
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 flex-1 flex flex-col justify-center items-center relative">
        <div className="text-center max-w-4xl mx-auto -mt-20">
          <div className="inline-flex items-center justify-center p-4 bg-primary/5 rounded-full mb-8 ring-1 ring-primary/20">
            <ShieldCheckIcon className="w-12 h-12 text-primary" />
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold mb-8 tracking-tight text-foreground">
            Blockchain Based with <span className="text-primary">AES-encryption</span>
            <br />
            for Decentralized EHR System
          </h1>

          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Secure, transparent, and patient-controlled healthcare records on the blockchain.
            Take control of your medical data with state-of-the-art encryption and decentralized storage.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/auth/register">
              <Button size="lg" className="h-12 px-8 text-lg shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 transition-all">
                Get Started
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/auth/login">
              <Button size="lg" variant="outline" className="h-12 px-8 text-lg border-primary/20 hover:bg-primary/5 hover:text-primary hover:primary/40 transition-all">
                Login to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
