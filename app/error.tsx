export default function ErrorBoundary({ error }: { error: Error }) {
  return (
    <div>
      <h1>에러 발생</h1>
      <p>{error.message}</p>
    </div>
  );
}
