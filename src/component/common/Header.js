import Image from 'next/image';
import Link from 'next/link';
import HeaderClient from './header-client';

export default function Header() { 

  return (
    <div className="px-10 flex flex-auto justify-between items-center border-b-[1px] border-[#6d3078]">
      <div className="logo-wrap">
        <Link href="/dashboard">
          <Image 
            src="/images/AU-Bank-logo.png"
            alt="AU Bank Logo"
            width={80}
            height={50}
            priority
          />
        </Link>
      </div>      
      <HeaderClient />
    </div>
  );
}

