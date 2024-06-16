'use client';

import { Chart } from 'chart.js/auto';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';

Chart.defaults.font = {
  ...Chart.defaults.font,
  size: 14,
};

export default function Dashboard() {
  return (
    <div className="grid container mx-auto p-4">
      <Card className="border-dashed border-2 rounded-md py-20 text-center">
        <CardContent>
          <div className="space-y-1">
            <h4 className="text-xl font-medium leading-none">Welcome back</h4>
            <p className="py-2 text-muted-foreground">
              How to get started quickly? You can choose to create a collection
              or a snippet to record bookmarks. It's that simple.
            </p>
          </div>
          <Separator className="my-4 mb-8" />
          <div className="flex h-5 items-center justify-center space-x-4">
            <div>
              <Link
                href="/collections"
                className="underline-offset-4 hover:underline"
              >
                Collections
              </Link>
            </div>
            <Separator orientation="vertical" />
            <div>
              <Link
                href="/excerpts"
                className="underline-offset-4 hover:underline"
              >
                Excerpts
              </Link>
            </div>
            <Separator orientation="vertical" />
            <div>
              <Link
                rel="noreferrer"
                target="_blank"
                href="https://github.com/dafengzhen/infoharvest"
                className="underline-offset-4 hover:underline"
              >
                Github
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
