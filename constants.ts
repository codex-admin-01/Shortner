
/**
 * REDIRECT TARGETS
 * Update these URLs for your production environment.
 */
export const TARGET_CONFIG = {
  // The URL optimized for users coming from Facebook (e.g., your sales page)
  FACEBOOK_LANDING: 'https://your-facebook-landing-page.com',
  
  // The fallback URL (e.g., your Telegram channel invite)
  FALLBACK_TARGET: 'https://t.me/your_channel_invite',
  
  // Delay configuration in milliseconds
  REDIRECT_DELAY_MIN: 500,
  REDIRECT_DELAY_MAX: 800,
};

/**
 * Facebook Detection Markers
 */
export const FB_MARKERS = [
  'facebook.com',
  'm.facebook.com',
  'l.facebook.com',
  'lm.facebook.com',
  'web.facebook.com'
];
