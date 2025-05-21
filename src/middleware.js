import { NextResponse } from 'next/server';

const allowedMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
const validApiPrefixes = ['auth', 'cardholders', 'expenses'];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const method = request.method.toUpperCase();
  const apiMatch = pathname.match(/^\/api\/(auth|cardholders|expenses)\/(.+)/);

  if (apiMatch) {
    const [, prefix, endpointRest] = apiMatch;
    const apiEndpoint = `api/${prefix}/${endpointRest}`;
    if (!allowedMethods.includes(method)) {
      return new NextResponse('Method not allowed', { status: 405 });
    }

    const response = NextResponse.next();
    response.cookies.set('apiEndpoint', encodeURIComponent(apiEndpoint), {
      httpOnly: true,
      sameSite: 'strict',
      path: '/',
    });

    response.cookies.set('apiMethod', method, {
      httpOnly: true,
      sameSite: 'strict',
      path: '/',
    });

    return response;
  }


  if (pathname.startsWith('/dashboard')) {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      const loginUrl = new URL('/', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}


export const config = {
  matcher: ['/api/:path*', '/dashboard/:path*'],
};
