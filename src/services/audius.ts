const API_URL = "https://api.audius.co/v1";
const API_KEY = import.meta.env.VITE_AUDIUS_API_KEY;

export type AudiusTrack = {
  id: string;
  title: string;
  duration: number;
  genre: string;
  artwork: {
    "150x150"?: string;
    "480x480"?: string;
    "1000x1000"?: string;
  } | null;
  user: {
    name: string;
  };
};

type AudiusResponse<T> = {
  data: T;
};

export async function getTrendingTracks(): Promise<AudiusTrack[]> {
  if (!API_KEY) {
    throw new Error("Audius API key is missing");
  }

  const response = await fetch(`${API_URL}/tracks/trending?limit=8`, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Audius request failed: ${response.status}`);
  }

  const result = (await response.json()) as AudiusResponse<AudiusTrack[]>;

  return result.data;
}

export function getTrackStreamUrl(trackId: string): string {
  const encodedTrackId = encodeURIComponent(trackId);
  const encodedApiKey = encodeURIComponent(API_KEY);

  return `${API_URL}/tracks/${encodedTrackId}/stream?api_key=${encodedApiKey}`;
}