import { NextPageContext } from 'next';

interface ErrorProps {
  readonly statusCode?: number;
  readonly hasQA?: boolean;
}

function CustomError({ statusCode, hasQA }: ErrorProps) {
  // In QA mode, suppress the Next.js error overlay
  if (hasQA) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <h1>{statusCode ? `Error: ${statusCode}` : 'An error occurred'}</h1>
        <p>Something went wrong. Please try again.</p>
      </div>
    );
  }
  // Default Next.js error rendering (will show overlay in dev)
  return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <h1>{statusCode ? `Error: ${statusCode}` : 'An error occurred'}</h1>
      <p>Something went wrong. Please try again.</p>
    </div>
  );
}

CustomError.getInitialProps = ({ res, err, query }: NextPageContext) => {
  let statusCode;
  if (res) {
    statusCode = res.statusCode;
  } else if (err) {
    statusCode = err.statusCode;
  } else {
    statusCode = 404;
  }
  // Detect QA mode from env or query param
  const hasQA = process.env.NEXT_PUBLIC_QA === 'true' || query?.qa === 'true';
  return { statusCode, hasQA };
};

export default CustomError;
