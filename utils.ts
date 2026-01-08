
import { FB_MARKERS } from './constants';

export interface TrafficSourceInfo {
  isFacebook: boolean;
  referrer: string;
  hasFbclid: boolean;
  userAgent: string;
}

/**
 * Detects if the current visitor is coming from Facebook
 * based on Referrer, URL parameters, and User Agent.
 */
export const detectTrafficSource = (): TrafficSourceInfo => {
  const referrer = document.referrer.toLowerCase();
  const urlParams = new URLSearchParams(window.location.search);
  const userAgent = navigator.userAgent.toLowerCase();
  
  // Check 1: Referrer analysis
  const hasFbReferrer = FB_MARKERS.some(marker => referrer.includes(marker));
  
  // Check 2: Facebook Click ID (fbclid) - Strong indicator of FB Ads traffic
  const hasFbclid = urlParams.has('fbclid');
  
  // Check 3: User Agent markers (FB internal browsers)
  const isFbInApp = userAgent.includes('fban') || userAgent.includes('fbav');

  // Logic: If any FB marker is present, treat as Facebook traffic
  const isFacebook = hasFbReferrer || hasFbclid || isFbInApp;

  return {
    isFacebook,
    referrer: document.referrer || 'Direct/Unknown',
    hasFbclid,
    userAgent: navigator.userAgent
  };
};

/**
 * Generates a random delay between min and max
 */
export const getRandomDelay = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};
