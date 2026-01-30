import './src/styles/tailwind.css';
import { redirect } from 'next/navigation';

export default function Home() {
  return redirect('/home');
}
