"use client";

import { useRouter } from "next/navigation";

import { createClientSupabaseClient } from "@/libs";

function useLogin() {
	const router = useRouter();

	const login = async (email: string, password: string) => {
		const { error } = await createClientSupabaseClient().auth.signInWithPassword({
			email,
			password,
		});

		if (error) {
			return { error };
		} else {
			router.push("/");
			return { error: null };
		}
	};

	return { login };
}

export default useLogin;
