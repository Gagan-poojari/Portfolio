import { NextResponse } from 'next/server';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function getEmailJsConfig() {
  return {
    serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || process.env.EMAILJS_SERVICE_ID,
    templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || process.env.EMAILJS_TEMPLATE_ID,
    publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || process.env.EMAILJS_PUBLIC_KEY,
  };
}

export async function POST(request) {
  try {
    const body = await request.json();
    const from_name = typeof body.from_name === 'string' ? body.from_name.trim() : '';
    const from_email = typeof body.from_email === 'string' ? body.from_email.trim() : '';
    const message = typeof body.message === 'string' ? body.message.trim() : '';

    if (!from_name || from_name.length < 2) {
      return NextResponse.json({ error: 'Name is required.' }, { status: 400 });
    }
    if (!from_email || !EMAIL_RE.test(from_email)) {
      return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 });
    }
    if (!message) {
      return NextResponse.json({ error: 'Message is required.' }, { status: 400 });
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

    const templateParams = {
      from_name,
      from_email,
      name: from_name,
      email: from_email,
      message,
      reply_to: from_email,
      title: `New message from ${from_name}`,
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

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json({ error: 'Failed to send message.' }, { status: 500 });
  }
}
