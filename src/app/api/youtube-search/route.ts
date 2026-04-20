import { NextRequest, NextResponse } from "next/server";

interface YouTubeVideo {
  videoId: string;
  title: string;
  author: string;
  thumbnail: string;
  duration: string;
}

function decodeUnicode(str: string): string {
  return str.replace(/\\u[\dA-F]{4}/gi, (match) => String.fromCharCode(parseInt(match.replace(/\\u/gi, ''), 16)))
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

async function searchYouTube(query: string): Promise<YouTubeVideo[]> {
  const queryEncoded = encodeURIComponent(query);
  const url = `https://www.youtube.com/results?search_query=${queryEncoded}`;

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();

    const results: YouTubeVideo[] = [];

    const videoIdRegex = /"videoId":"([a-zA-Z0-9_-]{11})"/g;
    const titleRegex = /"title":\s*\{[^}]*?"runs":\s*\[(.*?)\]/g;
    const channelRegex = /"longBylineText":\s*\{[^}]*?"runs":\s*\[(.*?)\]/g;

    const videoIdMatches = [...html.matchAll(videoIdRegex)];
    const titleMatches = [...html.matchAll(titleRegex)];
    const channelMatches = [...html.matchAll(channelRegex)];

    const seenIds = new Set<string>();

    for (let i = 0; i < videoIdMatches.length && results.length < 15; i++) {
      const videoId = videoIdMatches[i]?.[1] || "";
      if (!videoId || seenIds.has(videoId) || videoId.length < 5) continue;
      seenIds.add(videoId);

      let title = `Video ${videoId}`;
      if (titleMatches[i] && titleMatches[i][1]) {
        const textMatch = titleMatches[i][1].match(/"text"\s*:\s*"([^"]+)"/);
        if (textMatch && textMatch[1]) {
          title = decodeUnicode(textMatch[1]);
        }
      }

      let author = "Unknown";
      if (channelMatches[i] && channelMatches[i][1]) {
        const textMatch = channelMatches[i][1].match(/"text"\s*:\s*"([^"]+)"/);
        if (textMatch && textMatch[1]) {
          author = decodeUnicode(textMatch[1]);
        }
      }

      if (title && !title.includes('feedback') && !title.includes('Submit') && title.length > 3) {
        results.push({
          videoId,
          title,
          author,
          thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
          duration: "",
        });
      }
    }

    return results;
  } catch (error) {
    console.error("YouTube scrape error:", error);
    return [];
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  try {
    const results = await searchYouTube(query);
    return NextResponse.json({ results });
  } catch (error) {
    console.error("YouTube search error:", error);
    return NextResponse.json({ results: [] });
  }
}