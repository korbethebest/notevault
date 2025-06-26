import { useRouter } from 'next/router';
import { supabase } from "@/shared/lib";

function useLogin() {
  const router = useRouter();

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return { error };
    } else {
      router.push('/');
      return { error: null };
    }
  }

  return { login };
}

export default useLogin;