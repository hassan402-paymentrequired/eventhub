import React, { ReactNode } from 'react'
import { Container } from '@/components/container';
import { Footer } from '@/components/footer';
import { Gradient } from '@/components/gradient';
import { Navbar } from '@/components/navbar';
import { Link } from '@/components/link';
import { ChevronRightIcon } from 'lucide-react';

const AppLayout = ({children}: {children: ReactNode}) => {
  return (
    <div className="relative">
               <Gradient className="absolute inset-2 bottom-0 rounded-4xl ring-1 ring-black/5 ring-inset" />
               <Container className="relative">
                   <Navbar
                       banner={
                           <Link
                               href="/blog/radiant-raises-100m-series-a-from-tailwind-ventures"
                               className="flex items-center gap-1 rounded-full bg-fuchsia-950/35 px-3 py-0.5 text-sm/6 font-medium text-white data-hover:bg-fuchsia-950/30"
                           >
                               Browse your favorite events and conference
                               <ChevronRightIcon className="size-4" />
                           </Link>
                       }
                   />
                                {children}

                                  <Footer />
                     </Container>
                           </div>
  )
}

export default AppLayout