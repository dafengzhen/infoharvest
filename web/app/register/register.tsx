'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import RegisterAction, {
  type IRegisterActionVariables,
} from '@/app/actions/register-action';
import useSWRMutation from 'swr/mutation';
import { useEffect } from 'react';

const formSchema = z.object({
  username: z.string().min(1, {
    message: 'Username cannot be empty.',
  }),
  password: z.string().min(1, {
    message: 'Password cannot be empty.',
  }),
});

export default function Register() {
  const searchParams = useSearchParams();
  const usernameParam = searchParams.get('username');
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });
  const { trigger, isMutating } = useSWRMutation(
    ['RegisterAction', '/users'],
    (_, { arg }: { arg: IRegisterActionVariables }) => RegisterAction(arg),
  );

  useEffect(() => {
    form.setValue('username', usernameParam ?? '');
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { username, password } = values;
    const response = await trigger({ username, password });
    if (response.ok) {
      toast.success(`Registration successful, welcome ${username}`);
      router.push('/');
    } else {
      const message = response.error.message;
      toast.error(message);
      if (message.includes('exists')) {
        router.push(`/login?username=${username}`);
      }
    }
  }

  return (
    <div className="min-h-[90vh] flex items-center justify-center">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Register</CardTitle>
              <CardDescription>
                Enter your username and password to register.
              </CardDescription>
              <CardDescription>
                If you already have an account, please&nbsp;
                <Link href="/login" className="underline font-bold">
                  login
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
                      <Input autoFocus {...field} />
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
                Register
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}
