import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { filename, content } = await request.json();

    const owner = process.env.GITHUB_USERNAME || process.env.NEXT_PUBLIC_GITHUB_USERNAME;
    const repo = process.env.GITHUB_REPO_NAME || process.env.NEXT_PUBLIC_GITHUB_REPO_NAME;
    const token = process.env.GITHUB_TOKEN;

    if (!owner || !repo || !token) {
      return NextResponse.json({ error: 'Missing GitHub configuration on server' }, { status: 500 });
    }

    const date = new Date().toISOString().replace(/[:.]/g, '-');
    const path = `uploads/${date}-${filename}`;

    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}`, {
      method: 'PUT',
      headers: {
        Authorization: `token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: `Upload image: ${filename}`, content }),
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: 'GitHub upload failed', details: text }, { status: res.status });
    }

    const json = await res.json();
    const download_url = json?.content?.download_url ?? null;
    return NextResponse.json({ download_url });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
