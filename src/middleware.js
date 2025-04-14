import { NextResponse } from 'next/server';

const allowedMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
const validApiPrefixes = ['auth', 'cardholders', 'expenses'];

export function middleware(request) {
  const { pathname } = request.nextUrl;

  const apiMatch = pathname.match(/^\/api\/(auth|cardholders|expenses)\/(.+)/);

  if (!apiMatch) {
    return NextResponse.next(); 
  }

  const [, prefix, endpointRest] = apiMatch;
  const apiEndpoint = `api/${prefix}/${endpointRest}`;
  const apiMethod = request.method.toUpperCase();

  if (!allowedMethods.includes(apiMethod)) {
    return new NextResponse('Method not allowed', { status: 405 });
  }

  const response = NextResponse.next();

  console.log("middleware response >>>>>>>>>>>", response)

  response.cookies.set('apiEndpoint', encodeURIComponent(apiEndpoint), {
    httpOnly: true,
    sameSite: 'strict',
    path: '/',
  });

  response.cookies.set('apiMethod', apiMethod, {
    httpOnly: true,
    sameSite: 'strict',
    path: '/',
  });

  return response;
}

export const config = {
  matcher: ['/api/:path*'],
};
