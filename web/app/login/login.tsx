'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import LoginAction, {
  type ILoginActionVariables,
} from '@/app/actions/login-action';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import useSWRMutation from 'swr/mutation';
import { useEffect } from 'react';

const publicPath = process.env.NEXT_PUBLIC_PUBLIC_PATH;

const formSchema = z.object({
  username: z.string().min(1, {
    message: 'Username cannot be empty.',
  }),
  password: z.string().min(1, {
    message: 'Password cannot be empty.',
  }),
});

export default function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const usernameParam = searchParams.get('username');
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });
  const { trigger, isMutating } = useSWRMutation(
    ['LoginAction', '/auth/login'],
    (_, { arg }: { arg: ILoginActionVariables }) => LoginAction(arg),
  );

  useEffect(() => {
    form.setValue('username', usernameParam ?? '');
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { username, password } = values;
    const response = await trigger({ username, password });
    if (response.ok) {
      toast.success(`Login successful, welcome ${username}`);
      location.assign(publicPath ?? '/');
    } else {
      const message = response.error.message;
      toast.error(message === 'Unauthorized' ? 'Login failed' : message);
    }
  }

  return (
    <div className="min-h-[90vh] flex items-center justify-center">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Login</CardTitle>
              <CardDescription>
                Enter your username and password to login.
              </CardDescription>
              <CardDescription>
                If you don't have an account, please&nbsp;
                <Link href="/register" className="underline font-bold">
                  register
                </Link>
                &nbsp;first.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input autoFocus={!usernameParam} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        autoFocus={!!usernameParam}
                        type="password"
                        autoComplete="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isMutating}>
                {isMutating && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Login
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}
