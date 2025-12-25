import { NextResponse } from 'next/server';

const SUMUP_API_BASE_URL = 'https://api.sumup.com';
export async function POST(request: Request) {
    const EXTERNAL_API_URL = process.env.NEXT_PUBLIC_API_URL;

    try {
        const body = await request.json();
        const { amount, currency, checkout_reference, description, return_url } = body;

        console.log('Proxying SumUp Checkout to External Backend:', { amount, currency, checkout_reference });

        if (!EXTERNAL_API_URL) {
            console.error('MISSING NEXT_PUBLIC_API_URL');
            return NextResponse.json(
                { error: 'External API URL is not configured' },
                { status: 500 }
            );
        }

        // The external backend already has /api in its URL usually, 
        // and server.js defines /api/sumup/create-payment-link
        // We need to be careful with double /api/
        const targetUrl = `${EXTERNAL_API_URL}/sumup/create-payment-link`.replace(/\/api\/api\//, '/api/');

        const response = await fetch(targetUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount,
                currency,
                checkout_reference,
                description,
                return_url,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('External API Response Error:', data);
            return NextResponse.json({
                error: 'External API rejected the request',
                details: data
            }, { status: response.status });
        }

        // Transform response if needed (Backend returns checkout_url as payment_link)
        return NextResponse.json({
            ...data,
            checkout_url: data.payment_link || data.checkout_url
        });
    } catch (error: any) {
        console.error('Server Internal Error during Proxy call:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', message: error.message },
            { status: 500 }
        );
    }
}
