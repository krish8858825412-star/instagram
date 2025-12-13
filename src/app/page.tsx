
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { LogoIcon } from "@/components/icons";
import { Loader2, Mail, Lock, User as UserIcon } from "lucide-react";
import { SplashScreen } from "@/components/splash-screen";

const signUpSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
});

const signInSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

const ADMIN_SECRET_CODE = "99241%@8#₹₹1625";

export default function AuthPage() {
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const {
    user,
    loading: authLoading,
    signUp,
    signIn,
  } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      if (isAdminMode) {
        router.push("/admin");
      } else {
        router.push("/home");
      }
    }
  }, [user, authLoading, router, isAdminMode]);

  const form = useForm({
    resolver: zodResolver(isSigningUp ? signUpSchema : signInSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === ADMIN_SECRET_CODE) {
      setIsAdminMode(true);
    } else {
      if (isAdminMode) {
        setIsAdminMode(false);
      }
    }
  };

  const onSubmit = async (values: z.infer<typeof signUpSchema | typeof signInSchema>) => {
    setIsSubmitting(true);
    try {
      if (isSigningUp) {
        const { name, email, password } = values as z.infer<typeof signUpSchema>;
        await signUp(name, email, password);
        toast({
          title: "Success",
          description: "Account created successfully. Please sign in.",
        });
        setIsSigningUp(false);
        form.reset();
      } else {
        const { email, password } = values as z.infer<typeof signInSchema>;
        if (password === ADMIN_SECRET_CODE) {
            router.push('/admin');
            return;
        }
        await signIn(email, password);
        router.push("/home");
      }
    } catch (error: any) {
      let description = "An unexpected error occurred. Please try again.";
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        description = "Invalid email or password. If you don't have an account, please sign up.";
      } else if (error.code === 'auth/email-already-in-use') {
        description = "This email is already in use. Please sign in or use a different email.";
      } else if (error.message) {
        description = error.message;
      }
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: description,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const toggleForm = () => {
    setIsSigningUp(!isSigningUp);
    setIsAdminMode(false);
    form.reset();
  }

  if (authLoading || user) {
    return <SplashScreen />;
  }

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="text-center mb-8">
            <div className="inline-block animation-breathing mb-4">
                <LogoIcon className="h-20 w-20 text-primary" />
            </div>
          <h1 className="text-5xl font-bold tracking-tight text-foreground">
            Instagram
          </h1>
           <p className="text-muted-foreground mt-2">The best place to boost your social presence.</p>
        </div>
        <Card className="w-full max-w-md bg-card/10 backdrop-blur-lg border-border/20 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold tracking-tight">
              {isAdminMode ? "Admin Access" : isSigningUp ? "Create an Account" : "Welcome Back"}
            </CardTitle>
            <CardDescription>
              {isAdminMode
                ? "Enter the admin panel."
                : isSigningUp
                ? "Enter your details below to create your account."
                : "Sign in to continue to your dashboard."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isAdminMode ? (
              <Button className="w-full" onClick={() => router.push('/admin')}>
                Enter Admin Panel
              </Button>
            ) : (
              <>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    {isSigningUp && (
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input placeholder="Full Name" {...field} className="pl-10" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input placeholder="name@example.com" {...field} className="pl-10" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="••••••••"
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e);
                                  handlePasswordChange(e);
                                }}
                                className="pl-10"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {isSigningUp ? "Sign Up" : "Sign In"}
                    </Button>
                  </form>
                </Form>

                <p className="mt-6 text-center text-sm text-muted-foreground">
                  {isSigningUp
                    ? "Already have an account?"
                    : "Don't have an account?"}
                  <Button variant="link" onClick={toggleForm} className="font-semibold text-primary">
                    {isSigningUp ? "Sign In" : "Sign Up"}
                  </Button>
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </main>
    </>
  );
}
