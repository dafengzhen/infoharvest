import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function NoData({
  placeholder,
  clickFn,
}: {
  placeholder?: string;
  clickFn?: () => void;
}) {
  return (
    <div className="grid container mx-auto p-4">
      <Card className="border-dashed border-2 rounded-md py-20 text-center">
        <CardContent>
          <p className="text-xl mb-2 uppercase font-bold">No Data</p>
          <span className="text-m text-muted-foreground block mb-10">
            {placeholder}
          </span>
          {clickFn && <Button onClick={clickFn}>Create</Button>}
        </CardContent>
      </Card>
    </div>
  );
}
