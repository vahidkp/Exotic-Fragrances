'use client';
import { useState } from 'react';
import { useToast } from '@/components/shared/Toast';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { show } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    show('Welcome to the club. Watch your inbox.', 'success');
    setEmail('');
    setLoading(false);
  };

  return (
    <section className="bg-brand text-white">
      <div className="container-page py-8 sm:py-10 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-start md:items-center">
          {/* Join the Club */}
          <div className="md:col-span-5 min-w-0">
            <h3 className="font-sans-body text-[11px] sm:text-[12px] tracking-[0.18em] sm:tracking-[0.22em] uppercase font-semibold text-white mb-2">
              Join the Club — Get 10% Off
            </h3>
            <p className="text-[12px] sm:text-[13px] text-white/55 leading-relaxed max-w-md">
              Sign up for new arrivals, exclusive discounts and 10% off your first
              order.
            </p>
          </div>

          {/* Email form */}
          <form
            onSubmit={handleSubmit}
            className="md:col-span-7 flex flex-col sm:flex-row gap-2.5 sm:gap-2 items-stretch sm:items-center md:justify-end w-full"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              style={{ height: '64px', lineHeight: '64px' }}
              className="appearance-none flex-1 w-full md:max-w-md sm:!h-12 sm:!leading-normal px-5 sm:px-4 bg-white/10 border border-white/30 rounded-sm text-white placeholder:text-white/55 text-[16px] sm:text-[14px] focus:outline-none focus:border-gold transition-colors min-w-0 box-border m-0"
              required
            />
            <button
              type="submit"
              disabled={loading}
              style={{ height: '64px' }}
              className="sm:!h-12 px-6 sm:px-7 bg-gold text-brand font-semibold tracking-[0.18em] uppercase text-[12px] rounded-sm hover:bg-gold-light transition-colors disabled:opacity-60 whitespace-nowrap w-full sm:w-auto box-border flex-shrink-0"
            >
              {loading ? 'Sending…' : 'Sign Up'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
