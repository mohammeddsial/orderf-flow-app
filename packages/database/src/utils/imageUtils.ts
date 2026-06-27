// packages/database/src/utils/imageUtils.ts

/**
 * Generates a consistent placeholder image URL using picsum.photos
 * @param seed - A unique string to generate the same image for the same seed
 * @param width - Image width (default: 400)
 * @param height - Image height (default: 300)
 * @returns A valid image URL
 */
export const getPlaceholderImage = (
    seed: string,
    width: number = 400,
    height: number = 300
  ): string => {
    // Clean the seed – replace spaces and special chars
    const cleanSeed = seed.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    return `https://picsum.photos/seed/${cleanSeed}/${width}/${height}`;
  };
  
  /**
   * Generates a random placeholder image (different each call)
   */
  export const getRandomPlaceholderImage = (
    width: number = 400,
    height: number = 300
  ): string => {
    return `https://picsum.photos/${width}/${height}?random=${Date.now()}`;
  };