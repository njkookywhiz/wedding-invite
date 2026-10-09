import Hero from "@/components/Hero";
import Countdown from "@/components/Countdown";
import Events from "@/components/Events";
import Venue from "@/components/Venue";
import RSVP from "@/components/RSVP";
import { Toaster } from 'sonner';

export default function Home() {
  return (
    <main className="min-h-screen font-sans bg-[#fff9f2] text-orange-950">
      <Toaster position="bottom-center" />
      <Hero />
      <Countdown />
      <Events />
      <Venue />
      <RSVP />
      
      <footer className="bg-orange-900 text-orange-100 py-12 text-center">
        <p className="font-serif italic text-2xl mb-4">We can't wait to celebrate with you!</p>
        <p className="text-sm text-orange-300 opacity-80 font-medium tracking-widest uppercase">© 2026 Ankita & Neeraj</p>
      </footer>
    </main>
  );
}
