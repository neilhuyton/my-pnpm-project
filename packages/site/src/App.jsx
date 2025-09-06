import { Button } from '@my-pnpm-project/ui';
import { trpc } from './api/trpc';

export default function App() {
  const { data, isLoading } = trpc.hello.useQuery({ name: 'tRPC' });

  return (
    <div>
      <h1>My Site</h1>
      <Button />
      {isLoading ? <p>Loading...</p> : <p>{data?.greeting}</p>}
    </div>
  );
}