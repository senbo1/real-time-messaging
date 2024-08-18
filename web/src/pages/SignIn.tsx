import { FC } from 'react';
import { Button } from '@/components/ui/button';
import { FaGoogle } from 'react-icons/fa';

const SignIn: FC = () => {
  const GoogleSignIn = async () => {
    const path = `${import.meta.env.VITE_SERVER_URL}/auth/google`;
    window.open(path, '_self');
  };

  return (
    <section className="min-h-screen flex justify-center items-center">
      <Button onClick={GoogleSignIn}>
        <FaGoogle className="mr-2" />
        Sign In with Google
      </Button>
    </section>
  );
};

export default SignIn;
