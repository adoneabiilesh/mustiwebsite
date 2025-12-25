import { SelectedAddon } from './types';

export interface SumUpPaymentLink {
    id: string;
    merchant_code: string;
    amount: number;
    currency: string;
    status: 'PENDING' | 'PAID' | 'FAILED' | 'EXPIRED';
    checkout_url: string;
    created_at?: string;
    updated_at?: string;
}

export async function createSumUpPaymentLink(params: {
    amount: number;
    currency: string;
    checkout_reference: string;
    description?: string;
    return_url?: string;
}) {
    const response = await fetch('/api/sumup/create-payment-link', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create payment link');
    }

    return response.json();
}
