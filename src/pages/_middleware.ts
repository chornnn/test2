import type { NextFetchEvent, NextRequest } from 'next/server';

export default function middleware(req: NextRequest, event: NextFetchEvent) {
    console.log(req.geo.country);
    if (req.geo?.country === 'KE') {
        return new Response('Blocked for legal reasons', { status: 451 });
    }
    return;
}