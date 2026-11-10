import { ensurePuterLoaded } from './client';
import { PuterUser } from '../types';

export async function isPuterSignedIn(): Promise<boolean> {
  const loaded = await ensurePuterLoaded();
  if (!loaded || !window.puter?.auth) return false;
  try {
    return window.puter.auth.isSignedIn();
  } catch (err) {
    console.error('Error checking Puter auth status:', err);
    return false;
  }
}

export async function getPuterUser(): Promise<PuterUser | null> {
  const loaded = await ensurePuterLoaded();
  if (!loaded || !window.puter?.auth) return null;
  try {
    if (!window.puter.auth.isSignedIn()) return null;
    const user = await window.puter.auth.getUser();
    return {
      username: user.username,
      uuid: user.uuid,
      email: user.email,
    };
  } catch (err) {
    console.error('Error getting Puter user:', err);
    return null;
  }
}

export async function signInWithPuter(): Promise<PuterUser | null> {
  const loaded = await ensurePuterLoaded();
  if (!loaded || !window.puter?.auth) {
    throw new Error('Puter SDK is not available. Please check your internet connection.');
  }

  try {
    await window.puter.auth.signIn({ attempt_temp_user_creation: true });
    return await getPuterUser();
  } catch (err: any) {
    console.error('Puter signIn error:', err);
    throw err;
  }
}

export async function signOutPuter(): Promise<void> {
  const loaded = await ensurePuterLoaded();
  if (!loaded || !window.puter?.auth) return;
  try {
    await window.puter.auth.signOut();
  } catch (err) {
    console.error('Puter signOut error:', err);
  }
}

