import { ShootingStarsAndStarsBackgroundDemo } from '@/components/Background/shootingbg';
import Navbar  from '@/components/Common/Header';
//import { FloatingNavDemo } from '@/components/Common/Header';
import React from 'react';

const page = () => {
  return (
    <div>
      <Navbar />
            <ShootingStarsAndStarsBackgroundDemo />
    </div>
  );
}

export default page;
