import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from '@clerk/nextjs';
import Link from 'next/link';
import { Button } from '../ui/button';
import { FolderOpen, PenBox } from 'lucide-react';
import UserMenu from '../user-menu/UserMenu';
import { checkUser } from '@/lib/checkUser';

const Header = async () => {
  await checkUser();
  return (
    <header className="container mx-auto">
      <nav className="py-6 px-4 flex justify-between items-center">
        <Link href="/">Logo</Link>

        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="loginButton">
              <PenBox size={18} className="flex items-center gap-2" />
              <span className="hidden md:inline">Write New</span>
            </Button>
          </Link>

          <SignedOut>
            <SignUpButton forceRedirectUrl="/dashboard">
              <Button variant="outline">Sign Up</Button>
            </SignUpButton>
          </SignedOut>

          <SignedIn>
            <Link href="/dashboard#collections">
              <Button variant="outline">
                <FolderOpen size={18} className="flex items-center gap-2" />
                <span className="hidden md:inline">Collections</span>
              </Button>
            </Link>
          </SignedIn>
          <SignedIn>
            <UserMenu />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
};

export default Header;
