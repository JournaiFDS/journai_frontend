import { useState, useEffect, useContext } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "shadcn/components/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "shadcn/components/tabs"
import { Calendar } from "shadcn/components/calendar"
import { CalendarIcon } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "shadcn/components/popover"
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
import { fr } from 'date-fns/locale';
import { Input } from "shadcn/components/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import { UserContext } from "../component/userContext.tsx"
import { cn } from "../../shadcn/lib.ts"
import { format } from "date-fns"


const formRegisterSchema = z.object({
  username: z.string().min(2, {
    message: "Le nom d'utilisateur doit contenir au moins 2 caractères."
  }),
  password: z.string().min(6, {
    message: "Le mot de passe doit contenir au moins 6 caractères."
  }),
  birthdate: z.date().refine(value => {
    const date = new Date()
    date.setFullYear(date.getFullYear() - 18)
    return value < date
  })
})

const formLoginSchema = z.object({
  username: z.string().min(2, {
    message: "Le nom d'utilisateur doit contenir au moins 2 caractères."
  }),
  password: z.string().min(6, {
    message: "Le mot de passe doit contenir au moins 6 caractères."
  })
})

export default function AuthCard() {
  const [db, setDb] = useState<IDBDatabase | null>(null);
  const [activeTab, setActiveTab] = useState('login');
  const navigate = useNavigate();
  const {  setUserId } = useContext(UserContext);


  useEffect(() => {
    const initializeDB = async () => {
      try {
        const indexedDB = window.indexedDB || (window as any).mozIndexedDB || (window as any).webkitIndexedDB || (window as any).msIndexedDB
        const request = indexedDB.open("myDatabase", 1)

        request.onerror = (event: any) => {
          console.error("Database error:", event.target.error)
        }

        request.onsuccess = (event: any) => {
          const database = event.target.result
          setDb(database)
        }

        request.onupgradeneeded = (event: any) => {
          const database = event.target.result
          const objectStore = database.createObjectStore("users", { keyPath: "id", autoIncrement: true })
          objectStore.createIndex("username", "username", { unique: true })
          objectStore.createIndex("password", "password", { unique: false })
          objectStore.createIndex("birthdate", "birthdate", { unique: false })
          objectStore.createIndex("dailyData", "dailyData", { unique: false })
        }
      } catch (error) {
        console.error("IndexedDB initialization error:", error)
      }
    }

    initializeDB()
  }, [])

  const register = (username: string, password: string, birthdate: Date, dailyData: Map<Date, { rate: number, short_summary: string, tags: string[] }>) => {
    if (!db) return;
    const transaction = db.transaction(["users"], "readwrite");
    const store = transaction.objectStore("users");
    // Convertir la Map en un objet JavaScript
    const dailyDataObj: { [key: string]: { rate: number, short_summary: string, tags: string[] } } = {};
    dailyData.forEach((value, key) => {
      dailyDataObj[key.toISOString()] = { rate: value.rate, short_summary: value.short_summary, tags: value.tags };
    });
    const newUser = {
      username,
      password,
      birthdate,
      dailyData: dailyDataObj
    };
    const request = store.add(newUser);

    request.onsuccess = () => {
      console.log("Utilisateur enregistré avec succès")
      toast("Utilisateur enregistré avec succès, veuillez vous connecter", {
        description: `Le ${new Date().toLocaleDateString()}, à ${new Date().toLocaleTimeString()}`,
        action: {
          label: "Valider",
          onClick: () => {
          }
        }
      })
      setActiveTab('login');
    }

    request.onerror = (event: any) => {
      console.error("Erreur lors de l'enregistrement de l'utilisateur:", event.target.error)
      toast("Erreur lors de l'enregistrement de l'utilisateur", {
        description: `Le ${new Date().toLocaleDateString()}, à ${new Date().toLocaleTimeString()}`,
        action: {
          label: "Valider",
          onClick: () => {
          }
        }
      })
    }

  }

  const login = (username: string, password: string) => {
    if (!db) return
    const transaction = db.transaction(["users"], "readonly")
    const store = transaction.objectStore("users")
    const index = store.index("username")
    const request = index.get(username)

    request.onsuccess = (event: any) => {
      const user = event.target.result
      if (user && user.password === password) {
        toast("Connexion réussie", {
          description: `Le ${new Date().toLocaleDateString()}, à ${new Date().toLocaleTimeString()}`,
          action: {
            label: "Valider",
            onClick: () => {
            }
          }
        })
        setUserId(user.id)
        navigate("/dailyNote");
      } else {
        console.log("Identifiants incorrects")
        toast("Identifiants incorrects", {
          description: `Le ${new Date().toLocaleDateString()}, à ${new Date().toLocaleTimeString()}`,
          action: {
            label: "Valider",
            onClick: () => {
            }
          }
        })
      }
    }

    request.onerror = (event: any) => {
      console.error("Erreur lors de la connexion:", event.target.errorCode)
      toast("Erreur lors de la connexion", {
        description: `Le ${new Date().toLocaleDateString()}, à ${new Date().toLocaleTimeString()}`,
        action: {
          label: "Valider",
          onClick: () => {
          }
        }
      })
    }
  }

  const formRegister = useForm<z.infer<typeof formRegisterSchema>>({
    resolver: zodResolver(formRegisterSchema),
  })

  const formLogin = useForm<z.infer<typeof formLoginSchema>>({
    resolver: zodResolver(formLoginSchema),
  })

  const handleLogin = (data: { username: string; password: string; }) => {
    login(data.username, data.password)
  }

  const handleRegister = (data: { username: string; password: string; birthdate: Date; }) => {
    const dailyData = new Map()
    register(data.username, data.password, data.birthdate, dailyData)
  }

  return (
    <div className="flex justify-center items-center mt-20">
      <Tabs value={activeTab} className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login" onClick={() => setActiveTab('login')}>Connexion</TabsTrigger>
          <TabsTrigger value="register" onClick={() => setActiveTab('register')}>Inscription</TabsTrigger>
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
              <Form {...formLogin}>
                <form onSubmit={formLogin.handleSubmit(handleLogin)} className="flex flex-col items-start">
                  <FormField
                    control={formLogin.control}
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
                    control={formLogin.control}
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
              <Button type="submit" onClick={formLogin.handleSubmit(handleLogin)} disabled={!formLogin.formState.isValid}>
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
              <Form {...formRegister}>
                <form onSubmit={formRegister.handleSubmit(handleRegister)} className="flex flex-col items-start">
                  <FormField
                    control={formRegister.control}
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
                    control={formRegister.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="mb-7">
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
                  <FormField
                    control={formRegister.control}
                    name="birthdate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date de naissance</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-[240px] pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP", { locale: fr })
                                ) : (
                                  <span>Choisissez une date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              locale={fr}
                              captionLayout="dropdown-buttons"
                              fromYear={1900} toYear={2025}
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() || date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormDescription>
                          Votre date de naissance sert à calculer votre âge. <br/>
                          (Vous devez avoir au moins 18 ans pour vous inscrire)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </CardContent>
            <CardFooter className="justify-center">
              <Button type="submit" onClick={formRegister.handleSubmit(handleRegister)} disabled={!formRegister.formState.isValid}>
                S'inscrire
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}