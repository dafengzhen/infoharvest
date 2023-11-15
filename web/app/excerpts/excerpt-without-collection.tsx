import { type IExcerpt } from '@/app/interfaces/excerpt';
import Excerpts from '@/app/excerpts/excerpts';

export default function ExcerptWithoutCollection({
  data,
}: {
  data: IExcerpt[];
}) {
  return (
    <div className="px-2 py-4">
      <div className="card bg-base-100 border shadow">
        <div className="card-body">
          <Excerpts data={data} />
        </div>
      </div>
    </div>
  );
}
