import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }
    
    const { filename, content } = body;
    
    if (!filename || !content) {
      return NextResponse.json({ error: 'Missing filename or content' }, { status: 400 });
    }

    const owner = process.env.GITHUB_USERNAME || process.env.NEXT_PUBLIC_GITHUB_USERNAME || 'SROff23712';
    const repo = process.env.GITHUB_REPO_NAME || process.env.NEXT_PUBLIC_GITHUB_REPO_NAME || 'image2';
    const token = process.env.GITHUB_TOKEN;

    if (!token) {
      console.error('Missing GITHUB_TOKEN environment variable');
      return NextResponse.json({ 
        error: 'Missing GitHub configuration on server',
        details: 'GITHUB_TOKEN is not set. Please configure it in Vercel environment variables.'
      }, { status: 500 });
    }

    if (!owner || !repo) {
      console.error('Missing GitHub owner or repo:', { owner, repo });
      return NextResponse.json({ 
        error: 'Missing GitHub configuration on server',
        details: `GITHUB_USERNAME or GITHUB_REPO_NAME is not set. Current values: owner=${owner}, repo=${repo}`
      }, { status: 500 });
    }

    const date = new Date().toISOString().replace(/[:.]/g, '-');
    const path = `uploads/${date}-${filename}`;

    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
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
