import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { supabase } from '../../lib/supabaseClient';
import { toast } from 'sonner';

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Mode = 'sign_in' | 'sign_up';

export function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
  const [mode, setMode] = useState<Mode>('sign_in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      setMode('sign_in');
      setPassword('');
    }
  }, [open]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (mode === 'sign_in') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;

        toast.success('Successfully signed in');
        onOpenChange(false);
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;

      if (data.session) {
        toast.success('Account created and signed in');
        onOpenChange(false);
      } else {
        toast.success('Account created', {
          description: 'Check your email to confirm your account, then sign in.',
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Authentication failed';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1e293b] border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-blue-400 font-serif text-2xl">
            {mode === 'sign_in' ? 'Sign In' : 'Create Account'}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {mode === 'sign_in'
              ? 'Sign in to view listings, report items, and claim your belongings.'
              : 'Create your account to start using Findr.'}
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2">
          <Button
            type="button"
            variant={mode === 'sign_in' ? 'default' : 'outline'}
            className={mode === 'sign_in'
              ? 'flex-1 bg-blue-600 hover:bg-blue-700 text-white border-0'
              : 'flex-1 border-white/20 text-white hover:bg-white/10 bg-transparent'}
            onClick={() => setMode('sign_in')}
          >
            Sign In
          </Button>
          <Button
            type="button"
            variant={mode === 'sign_up' ? 'default' : 'outline'}
            className={mode === 'sign_up'
              ? 'flex-1 bg-blue-600 hover:bg-blue-700 text-white border-0'
              : 'flex-1 border-white/20 text-white hover:bg-white/10 bg-transparent'}
            onClick={() => setMode('sign_up')}
          >
            Sign Up
          </Button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {mode === 'sign_up' && (
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-white font-medium">
                Full Name
              </Label>
              <Input
                id="fullName"
                placeholder="e.g., Alex Johnson"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-white font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@school.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-white font-medium">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white border-0"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? (mode === 'sign_in' ? 'Signing in...' : 'Creating account...')
              : (mode === 'sign_in' ? 'Sign In' : 'Create Account')}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
