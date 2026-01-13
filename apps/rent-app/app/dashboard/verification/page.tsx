import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import VerificationPage from './VerificationPage';
import { getVerificationStatusAction } from '@/actions/trust';

export default async function Verification() {
  const session = await auth();
  if (!session?.user) {
    redirect('/auth/login');
  }

  const result = await getVerificationStatusAction();

  return (
    <VerificationPage
      initialStatus={result.success ? result.data : undefined}
      userEmail={session.user.email || ''}
    />
  );
}
