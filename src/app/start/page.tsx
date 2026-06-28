import { redirect } from 'next/navigation';

// The guided "Start" path is merged into the single progressive Introduction.
// /intro now opens with the quick-start (read-these-first + explore) and
// continues into the deep dive.
export default function StartRedirect() {
  redirect('/intro');
}
