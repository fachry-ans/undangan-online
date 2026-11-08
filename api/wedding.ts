interface ApiRequest {
  method?: string;
  query?: Record<string, string | string[] | undefined>;
}

interface ApiResponse {
  status: (code: number) => ApiResponse;
  setHeader: (name: string, value: string) => void;
  json: (body: unknown) => void;
}

const APPS_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbywaWuBk3Xp-uIQXv1hsn7_YjiKeUJLKf8FAkn1x8cGYkDm-ZYsY_aWj27npOC4OQ5YFQ/exec';

export default async function handler(req: ApiRequest, res: ApiResponse) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    res.status(405).json({ ok: false, error: 'Metode tidak didukung.' });
    return;
  }

  const action = req.query?.action;
  const weddingId = req.query?.weddingId;
  if (
    action !== 'snapshot' ||
    typeof weddingId !== 'string' ||
    !['abdi-lula', 'wed-abdi-lula'].includes(weddingId)
  ) {
    res.status(400).json({ ok: false, error: 'Permintaan snapshot tidak valid.' });
    return;
  }

  const url = new URL(APPS_SCRIPT_URL);
  url.searchParams.set('action', action);
  url.searchParams.set('weddingId', weddingId);

  try {
    const upstream = await fetch(url, { signal: AbortSignal.timeout(20000) });
    if (!upstream.ok) {
      res.status(502).json({ ok: false, error: 'Google Apps Script gagal merespons.' });
      return;
    }

    const contentType = upstream.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      res.status(502).json({ ok: false, error: 'Google Apps Script mengirim respons yang tidak valid.' });
      return;
    }

    const result: unknown = await upstream.json();
    res.status(200).json(result);
  } catch (error) {
    console.error('Unable to fetch wedding snapshot:', error);
    res.status(502).json({ ok: false, error: 'Google Sheets tidak dapat dijangkau. Coba lagi.' });
  }
}
