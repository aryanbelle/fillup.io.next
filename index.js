// This file is just a placeholder to redirect to the src/app directory
// The actual application is in the src/app directory
import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/');
} 