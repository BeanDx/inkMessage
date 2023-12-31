
import { zodResolver } from "@hookform/resolvers/zod"

import { useToast } from "../../components/ui/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../components/ui/form"
import { Input } from "../../components/ui/input"

import { Button } from "../../components/ui/button";
import { useForm } from "react-hook-form";
import { SignupValidation } from "../../lib/validation";
import { z } from "zod";
import Loader from "../../components/shared/Loader";
import { Link, useNavigate } from "react-router-dom";
import { useCreateUserAccount, useSignInAccount } from "../../lib/react-query/queriesAndMutations";
import { useUserContext } from "../../context/AuthContext";



const SingUpForm = () => {
  const { toast } = useToast();
  // const { checkAuthUser, isLoading: isUserLoading } = useUserContext();
  const { checkAuthUser } = useUserContext();
  const navigate = useNavigate();

  const { mutateAsync: createUserAccount, isPending: isCreatingAccount } = useCreateUserAccount();

  // const { mutateAsync: signInAccount, isPending: isSignIn } = useSignInAccount();
  const { mutateAsync: signInAccount } = useSignInAccount();

  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      name: '',
      username: '',
      email: '',
      password: '',
    },
  })

  async function onSubmit(values: z.infer<typeof SignupValidation>) {
    // Create a user...
    const newUser = await createUserAccount(values);

    if (!newUser) {
      return toast({ title: 'Oops... Sign up failed. Please try again.' });
    }

    const session = await signInAccount({
      email: values.email,
      password: values.password,
    });

    if (!session) {
      return toast({ title: 'Oops... Sign in failed. Please, try again.' })
    }

    const isLoggedIn = await checkAuthUser();

    if (isLoggedIn) {
      form.reset();

      navigate('/');
    } else {
      return toast({ title: 'Oops...Sign up failed. Please, try again.' })
    }
  };

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">

        {/*To DO!*/}
        <div className="flex items-end"> 
          <img src="/assets/icons/logo.svg" height={64} width={64} alt="logo" />
          <span className="h3-bold md:h2-bold pt-0 sm:pt-0 text-orange-2">Ink</span>
        </div>
        <h2 className="h3-bold md:h2-bold pt-0 sm:pt-0">Create a new account</h2>
        <p
          className="text-orange-2 small-medium md:base-regular mt-2">
          To use <span className="text-orange-1">Ink</span>, please enter your accout enter your details
        </p>


        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" className="shad-input" {...field} />
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
                  <Input type="password" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="shad-button_primary" type="submit">
            {isCreatingAccount ? (
              <div className="flex center gap-2 items-center">
                <Loader /> Loading...
              </div>
            ) : "Sign up"}
          </Button>

          <p className="text-small-regular text-light-2 text-center mt-2">
            Already have an account?
            <Link to='/sign-in' className="text-orange-2 text-small-semibold ml-1">Sign in</Link>
          </p>
        </form>
      </div>
    </Form>
  )
}

export default SingUpForm