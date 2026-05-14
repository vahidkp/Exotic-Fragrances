import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret');
  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
  }

  const { type, handle } = await req.json();

  if (type === 'product' && handle) {
    revalidatePath(`/shop/${handle}`);
    revalidatePath('/shop');
  } else if (type === 'collection') {
    revalidatePath('/shop');
  } else if (type === 'homepage') {
    revalidatePath('/');
  } else {
    revalidatePath('/');
    revalidatePath('/shop');
  }

  return NextResponse.json({ revalidated: true, type, handle });
}
