import React from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "shadcn/components/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "shadcn/components/tabs"
import { Button } from "shadcn/components/button"
import {
  Form,
  FormField,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormItem
} from "shadcn/components/form"
import { Input } from "shadcn/components/input"
import { useAuth } from "../component/useAuth"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Le nom d'utilisateur doit contenir au moins 2 caractères."
  }),
  password: z.string().min(6, {
    message: "Le mot de passe doit contenir au moins 6 caractères."
  })
})

export default function AuthCard() {
  const [authMode] = React.useState("login")
  const { login, register } = useAuth()
  const form = useForm<{ username: string; password: string; }>({
    resolver: zodResolver(formSchema)
  })

  const onSubmit = (data: { username: string; password: string; }) => {
    if (authMode === "login") {
      login(data.username, data.password)
    } else {
      register(data.username, data.password)
    }
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <Tabs defaultValue="login" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Connexion</TabsTrigger>
          <TabsTrigger value="register">Inscription</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Card className="mx-auto">
            <CardHeader>
              <CardTitle>Connection</CardTitle>
              <CardDescription>
                Connectez-vous pour accéder à votre compte pour pouvoir enregistrer et suivre vos notes.
              </CardDescription>
            </CardHeader>
            <CardContent className="items-start">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col items-start">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel>Nom d'utilisateur</FormLabel>
                        <FormControl>
                          <Input type="text" {...field} />
                        </FormControl>
                        <FormDescription>
                          C'est votre nom d'utilisateur public.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mot de passe</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormDescription>
                          Le mot de passe doit contenir au moins 6 caractères.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </CardContent>
            <CardFooter className="justify-center">
              <Button type="submit" onClick={form.handleSubmit(onSubmit)} disabled={!form.formState.isValid}>
                Se connecter
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="register">
          <Card className="mx-auto">
            <CardHeader>
              <CardTitle>Inscription</CardTitle>
              <CardDescription>
                Inscrivez-vous pour créer un compte et commencer à enregistrer et suivre vos notes.
              </CardDescription>
            </CardHeader>
            <CardContent className="items-start">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col items-start">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel>Nom d'utilisateur</FormLabel>
                        <FormControl>
                          <Input type="text" {...field} />
                        </FormControl>
                        <FormDescription>
                          C'est votre nom d'utilisateur public.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mot de passe</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormDescription>
                          Le mot de passe doit contenir au moins 6 caractères.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </CardContent>
            <CardFooter className="justify-center">
              <Button type="submit" onClick={form.handleSubmit(onSubmit)} disabled={!form.formState.isValid}>
                S'inscrire
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}