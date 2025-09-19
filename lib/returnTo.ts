'use server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function setReturnTo(returnTo: string | null) {
  'use server';
  if (!returnTo) {
    return;
  }
  console.log(`Storing ${returnTo} as URL to come back to after login`);
  const cookieStore = await cookies();
  cookieStore.set('returnTo', returnTo);
}

export async function loginComplete() {
  const cookieStore = await cookies();
  const returnTo = cookieStore.get('returnTo')?.value;
  if (returnTo) {
    console.log('Returning to ', returnTo, ' after login');
  } else {
    console.log('Returning to default /cart location');
  }
  cookieStore.delete('returnTo');
  redirect(returnTo || '/cart');
}
