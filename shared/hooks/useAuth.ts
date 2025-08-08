"use client";

import type { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

import { createClientSupabaseClient } from "@/libs";

function useAuth() {
	const [user, setUser] = useState<User | null | undefined>(undefined);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const supabase = createClientSupabaseClient();

		const checkUser = async () => {
			try {
				const {
					data: { user },
				} = await supabase.auth.getUser();

				setUser(user);
				setIsLoading(false);
			} catch (error) {
				console.error("Auth check error:", error);
				setUser(null);
				setIsLoading(false);
			}
		};

		checkUser();

		const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
			setUser(session?.user ?? null);
			setIsLoading(false);
		});

		return () => {
			listener.subscription.unsubscribe();
		};
	}, []);

	return {
		user,
		isLoading,
		isSignedIn: !!user,
	};
}

export default useAuth;
