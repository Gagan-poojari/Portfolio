import { NextResponse } from 'next/server';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function getEmailJsConfig() {
  return {
    serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || process.env.EMAILJS_SERVICE_ID,
    templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || process.env.EMAILJS_TEMPLATE_ID,
    publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || process.env.EMAILJS_PUBLIC_KEY,
  };
}

// Upload base64 sketch to a reliable image host so the recipient gets a clean direct image link
// instead of pages of unreadable raw base64 characters.
async function uploadSketchImage(base64Data) {
  try {
    const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let mimeType = 'image/png';
    let rawBase64 = base64Data;
    if (matches && matches.length === 3) {
      mimeType = matches[1];
      rawBase64 = matches[2];
    }

    const buffer = Buffer.from(rawBase64, 'base64');
    const ext = mimeType.includes('jpeg') || mimeType.includes('jpg') ? 'jpg' : 'png';
    const filename = `sketch-${Date.now()}.${ext}`;

    // Primary: uguu.se
    try {
      const formData = new FormData();
      const blob = new Blob([buffer], { type: mimeType });
      formData.append('files[]', blob, filename);

      const res = await fetch('https://uguu.se/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'User-Agent': 'Portfolio-App/1.0',
        },
      });

      if (res.ok) {
        const json = await res.json();
        if (json?.files?.[0]?.url) {
          return json.files[0].url;
        }
      }
    } catch (e) {
      console.warn('Uguu upload failed, trying fallback host:', e);
    }

    // Fallback: tmpfiles.org
    try {
      const formData = new FormData();
      const blob = new Blob([buffer], { type: mimeType });
      formData.append('file', blob, filename);

      const res = await fetch('https://tmpfiles.org/api/v1/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const json = await res.json();
        if (json?.data?.url) {
          return json.data.url;
        }
      }
    } catch (e) {
      console.warn('Fallback upload failed:', e);
    }
  } catch (err) {
    console.error('Error processing sketch image buffer:', err);
  }
  return null;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const from_name = typeof body.from_name === 'string' ? body.from_name.trim() : '';
    const from_email = typeof body.from_email === 'string' ? body.from_email.trim() : '';
    const message = typeof body.message === 'string' ? body.message.trim() : '';
    const sketch_data = typeof body.sketch_data === 'string' ? body.sketch_data.trim() : '';

    if (!from_name || from_name.length < 2) {
      return NextResponse.json({ error: 'Name is required.' }, { status: 400 });
    }
    if (!from_email || !EMAIL_RE.test(from_email)) {
      return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 });
    }
    if (!message && !sketch_data) {
      return NextResponse.json({ error: 'Message or sketch is required.' }, { status: 400 });
    }

    const { serviceId, templateId, publicKey } = getEmailJsConfig();
    if (!serviceId || !templateId || !publicKey) {
      console.error('EmailJS environment variables are missing.');
      return NextResponse.json({ error: 'Email service is not configured.' }, { status: 503 });
    }

    const time = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    let formattedMessage = message;
    let sketchUrl = null;

    if (sketch_data) {
      sketchUrl = await uploadSketchImage(sketch_data);

      if (sketchUrl) {
        formattedMessage = `${message ? message + '\n\n' : ''}──────────────────────────────\n🎨 VISITOR SKETCH ATTACHED:\n👉 View & Download Drawing: ${sketchUrl}\n──────────────────────────────`;
      } else {
        formattedMessage = `${message ? message + '\n\n' : ''}[Visitor drew a sketch on the Atelier canvas, but the remote image link could not be generated.]`;
      }
    }

    const templateParams = {
      from_name,
      from_email,
      name: from_name,
      email: from_email,
      message: formattedMessage,
      sketch_url: sketchUrl || '',
      sketch_link: sketchUrl || '',
      sketch_image: sketchUrl || '',
      reply_to: from_email,
      title: sketch_data ? `🎨 New Sketch & Note from ${from_name}` : `New message from ${from_name}`,
      time,
    };

    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        template_params: templateParams,
      }),
    });

    const responseText = await response.text();
    if (!response.ok) {
      console.error('EmailJS send failed:', response.status, responseText);
      return NextResponse.json({ error: 'Failed to send message.' }, { status: 502 });
    }

    return NextResponse.json({ ok: true, sketch_url: sketchUrl });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json({ error: 'Failed to send message.' }, { status: 500 });
  }
}
