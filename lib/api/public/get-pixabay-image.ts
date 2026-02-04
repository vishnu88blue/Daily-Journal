export async function getPixabayImage({ query }: { query: string }) {
  try {
    const res = await fetch(
      `https://pixabay.com/api/?q=${query}&key=${process.env.PIXABAY_API_KEY}&min_width=1280&min_height=720&image_type=illustration&category=feelings`,
    );
    const data = await res.json();

    return data.hits[0]?.largeImageURL || null;
  } catch (error) {
    console.error('Error fetching Pixabay image:', JSON.stringify(error));
    return null;
  }
}
