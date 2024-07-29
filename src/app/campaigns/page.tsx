import React from 'react';
import { ShootingStarsAndStarsBackgroundDemo } from '@/components/Background/shootingbg';
import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";
import Navbar  from '@/components/Common/Header';
import { ShootingStarsAndStarsBackgroundDemoCampaign } from '@/components/Campaign/campaignMain';
const page = () => {
  return (
    <div>
      <Navbar />
      <ShootingStarsAndStarsBackgroundDemoCampaign />
    
    </div>
  );
}

export default page;
