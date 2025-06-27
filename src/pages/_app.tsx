import '@/styles/globals.css'; // Import global styles
import 'swagger-ui/dist/swagger-ui.css'; // Import Swagger UI CSS globally
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
