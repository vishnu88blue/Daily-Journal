import { unstable_cache } from 'next/cache';

export const getDailyPrompt = unstable_cache(
  async () => {
    try {
      const res = await fetch('https://zenquotes.io/api/quotes/today', {
        cache: 'no-store',
      });
      const data = await res.json();
      return data[0].q;
    } catch (error) {
      console.log(JSON.stringify(error));
      return "What's on your mind today?";
    }
  },
  ['daily-prompt'],
  { revalidate: 86400, tags: ['daily-prompt'] },
);
