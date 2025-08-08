import type { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

import { createClientSupabaseClient } from "@/libs";

export function useCurrentUser() {
	const [currentUser, setCurrentUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const getCurrentUser = async () => {
			try {
				const {
					data: { user },
				} = await createClientSupabaseClient().auth.getUser();
				setCurrentUser(user);
			} catch (error) {
				console.error("사용자 정보 조회 오류:", error);
			} finally {
				setLoading(false);
			}
		};

		getCurrentUser();

		const {
			data: { subscription },
		} = createClientSupabaseClient().auth.onAuthStateChange((_event, session) => {
			setCurrentUser(session?.user || null);
		});

		return () => subscription.unsubscribe();
	}, []);

	return {
		currentUser,
		loading,
		isAuthenticated: !!currentUser,
	};
}
