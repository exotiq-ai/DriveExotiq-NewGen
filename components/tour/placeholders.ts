// 16px blur-up placeholders for the /tour hero stills, generated with the same
// ffmpeg pipeline as docs/redesign/storyboard/gen-placeholders.mjs (scale=16:-2,
// -q:v 8) so slow connections never paint a flat black hero — do not hand-edit.
export const TOUR_PLACEHOLDERS: Record<string, string> = {
  '/images/experience/poster/tour-hero-livery.jpg':
    'data:image/jpeg;base64,/9j//gAQTGF2YzYyLjExLjEwMAD/2wBDAAgQEBMQExYWFhYWFhoYGhsbGxoaGhobGxsdHR0iIiIdHR0bGx0dICAiIiUmJSMjIiMmJigoKDAwLi44ODpFRVP/xABrAAEBAAAAAAAAAAAAAAAAAAAFBAEBAQEAAAAAAAAAAAAAAAAABQQCEAACAQMCBgMBAAAAAAAAAAABAgMRABIxIQQVItFSYVEyQkERAAICAQMFAQAAAAAAAAAAAAECABGBITGRM1FxAxJD/8AAEQgADAAQAwESAAISAAMSAP/aAAwDAQACEQMRAD8AJ51NLTqEZY4hW310Oykj2dLVShBOKVB8R2s9B7rNvp3rXwBIGzzNsEOyDmKCQyNxZiqrJKxOOMcjuR+i31A+P7bIdkGxpdzH5/Vs1DaBkASx01xE9p//2Q==',
  '/images/experience/poster/tour-hero-hangar.jpg':
    'data:image/jpeg;base64,/9j//gAQTGF2YzYyLjExLjEwMAD/2wBDAAgQEBMQExYWFhYWFhoYGhsbGxoaGhobGxsdHR0iIiIdHR0bGx0dICAiIiUmJSMjIiMmJigoKDAwLi44ODpFRVP/xABkAAEAAwEAAAAAAAAAAAAAAAAHAAIDBgEBAQEBAAAAAAAAAAAAAAAAAQACAxAAAgEBBgcBAQAAAAAAAAAAAQIAAyEEETGRU9HBgVFxQeEUExEBAQAAAAAAAAAAAAAAAAAAAIH/wAARCAAWABADARIAAhIAAxIA/9oADAMBAAIRAxEAPwDuP23fdXqD8hVWr0UYD+yMT2DgDzZymi5mlgX67bo0PCFdKrQY2VwCM8Uc6HG2BZI0YkmQ+5pBNVZssZRc5IF//9k=',
};
