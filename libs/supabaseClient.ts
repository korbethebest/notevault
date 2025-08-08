import { createBrowserClient, createServerClient } from "@supabase/ssr";

/**
 * Client-side Supabase client for Client Components
 *
 * 사용처:
 * - React Client Components (use client 지시어가 있는 컴포넌트)
 * - 브라우저에서 실행되는 모든 코드
 * - useState, useEffect 등 React hooks와 함께 사용
 *
 * 예시: 로그인 폼, 실시간 데이터 구독, 클라이언트 사이드 인증
 */
export function createClientSupabaseClient() {
	return createBrowserClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
	);
}

/**
 * Route Handler용 Supabase client (API Routes 전용)
 *
 * 사용처:
 * - /app/api/ 폴더의 route.ts 파일들
 * - API 엔드포인트에서 서버 사이드 데이터베이스 작업
 * - Request 객체로부터 쿠키 정보를 읽어 인증 처리
 *
 * 예시: /api/user/favorites/route.ts, /api/auth/callback/route.ts
 */
export function createRouteHandlerClient(request: Request) {
	return createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				getAll() {
					const cookieHeader = request.headers.get("cookie");
					if (!cookieHeader) return [];

					return cookieHeader
						.split(";")
						.map((cookie) => {
							const [name, ...rest] = cookie.trim().split("=");
							const value = rest.join("=");
							return { name, value };
						})
						.filter((cookie) => cookie.name && cookie.value);
				},
			},
		},
	);
}
