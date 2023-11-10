
import { zodResolver } from "@hookform/resolvers/zod"

import { useToast } from "../../components/ui/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../components/ui/form"
import { Input } from "../../components/ui/input"

import { Button } from "../../components/ui/button";
import { useForm } from "react-hook-form";
import { SigninValidation } from "../../lib/validation";
import { z } from "zod";
import Loader from "../../components/shared/Loader";
import { Link, useNavigate } from "react-router-dom";
import { useSignInAccount } from "../../lib/react-query/queriesAndMutations";
import { useUserContext } from "../../context/AuthContext";



const SingInForm = () => {
  const { toast } = useToast();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();
  const navigate = useNavigate();


  const { mutateAsync: signInAccount } = useSignInAccount();

  const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(values: z.infer<typeof SigninValidation>) {
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

        <div className="flex items-end">
          <img src="/assets/icons/logo.svg" height={64} width={64} alt="logo" />
          <span className="h3-bold md:h2-bold pt-0 sm:pt-0 text-orange-2">Ink</span>
        </div>

        <h2 className="h3-bold md:h2-bold pt-0 sm:pt-0">Sign in to your account</h2>
        <p
          className="text-orange-1 small-medium md:base-regular mt-2">
          Welcome back! Please, enter your details
        </p>


        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
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
            {isUserLoading ? (
              <div className="flex center gap-2 items-center">
                <Loader /> Loading...
              </div>
            ) : "Sign in"}
          </Button>

          <p className="text-small-regular text-light-2 text-center mt-2">
            Don't have an account?
            <Link to='/sign-up' className="text-orange-2 text-small-semibold ml-1">Sign up</Link>
          </p>
        </form>
      </div>
    </Form>
  )
}

export default SingInForm