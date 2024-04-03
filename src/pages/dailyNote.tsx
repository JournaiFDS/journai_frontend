import { useState, useEffect, useContext } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "shadcn/components/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "shadcn/components/dialog"
import { Textarea } from "shadcn/components/textarea"
import { Button } from "shadcn/components/button"
import { UserContext } from "../component/userContext.tsx"
import { format, parseISO } from "date-fns"
import { fr } from "date-fns/locale"
import { useLocation, useNavigate } from "react-router-dom"
import { Loader2 } from "lucide-react"
import { getDayTextColor } from "../utils/utils.tsx"
import { Badge } from "shadcn/components/badge.tsx"
import { Separator } from "shadcn/components/separator.tsx"
import { Skeleton } from "shadcn/components/skeleton.tsx"

interface AnalysisResult {
  date: string;
  day_summary: string;
  rate: number;
  tags: string[];
  short_summary: string;
}

function DailyNote() {
  const [text, setText] = useState("")
  const [db, setDb] = useState<IDBDatabase | null>(null)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [canSubmit, setCanSubmit] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const navigate = useNavigate()
  const { userId } = useContext(UserContext)
  const [isLoading, setIsLoading] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [userNotes, setUserNotes] = useState<AnalysisResult>()
  const location = useLocation()
  const [currentDate] = useState<Date>((location.state?.selectedDate) || new Date())

  useEffect(() => {
    const initializeDB = async () => {
      const request = indexedDB.open("myDatabase", 1)
      request.onsuccess = (event: any) => {
        setDb(event.target.result)
        if (userId !== "") {
          setIsLoadingData(false)
        }
      }
    }
    initializeDB()
  }, [userId])

  useEffect(() => {
    if (!db || !userId) return
    try {
      const transaction = db.transaction(["dailyNotes"], "readonly")
      const store = transaction.objectStore("dailyNotes")
      const index = store.index("userId")
      const request = index.getAll(userId)

      request.onsuccess = (event: any) => {
        const userNotesArray = event.target.result
        const userNote = userNotesArray.find(note => format(note.date, "yyyy-MM-dd") === format(currentDate, "yyyy-MM-dd"))
        if (userNote) {
          setUserNotes(userNote)
          setCanSubmit(false)
        } else {
          setCanSubmit(true)
        }
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données de l'utilisateur:", error)
    }
  }, [db, userId, currentDate])

  const handleChange = (event: any) => {
    setText(event.target.value)
  }

  const handleCloseClick = () => {
    setIsDialogOpen(false)
  }

  function simulateBackendCall() {
    return new Promise<AnalysisResult>((resolve) => {
      setTimeout(() => {
        const randomRate = Math.floor(Math.random() * 11)
        const tags = ["Sport", "Travail", "Loisirs", "Famille", "Amis"]
        const randomTags = Array.from({ length: (Math.floor(Math.random() * (tags.length + 1)) + 1) }, () => tags[Math.floor(Math.random() * tags.length)])
        const short_summary = "Ceci est un résumé généré aléatoirement."
        resolve({
          date: format(currentDate, "yyyy-MM-dd"),
          day_summary: text,
          rate: randomRate,
          tags: randomTags,
          short_summary: short_summary
        })
      }, 2000) // Simule un délai de 2 secondes
    })
  }

  const handleSubmit = (event: any) => {
    event.preventDefault()
    if (!canSubmit) {
      alert("Un résumé existe déjà pour cette journée.")
      return
    }

    setIsLoading(true)

    // Créer l'objet à envoyer au serveur
    const dataSent = {
      userId: userId,
      summary: text,
      date: currentDate
    }

// Effectuer l'appel au backend
    /*
    fetch("http://localhost:3000", {
    method: "POST",
      headers:{  "Content-Type":  "application/json"},body: JSON.stringify(data)})
      .then(response => response.json())
    .then(data => {
      // Si la requête a réussi, ajouter les données retournées à la base de données de l'utilisateur
      if (db && userId) {
        const transaction = db.transaction(["users"], "readwrite")
        const store = transaction.objectStore("users")
        const request = store.get(userId)
        request.onsuccess = (event: any) => {
          const user = event.target.result
          user.dailyData[format(currentDate, "yyyy-MM-dd")] = data
          store.put(user)
        }
        // Ouvrir le Dialog
        setIsDialogOpen(true)
        setAnalysisResult(data)
      }
    })
    */
    simulateBackendCall()
      .then(data => {
        // Si la requête a réussi, ajouter les données retournées à la base de données de l'utilisateur
        if (db && userId) {
          const transaction = db.transaction(["dailyNotes"], "readwrite")
          const store = transaction.objectStore("dailyNotes")
          const request = store.add({
            userId: userId,
            day_summary: data.day_summary,
            date: currentDate,
            rate: data.rate,
            tags: data.tags,
            short_summary: data.short_summary
          })

          request.onsuccess = () => {
            // Ouvrir le Dialog
            setIsDialogOpen(true)
            setAnalysisResult(data)
          }

          request.onerror = (event: any) => {
            console.error("Erreur lors de l'ajout de la note quotidienne:", event.target.error)
          }
        }
      })
      .catch(error => {
        console.error("Erreur lors de l'appel au backend:", error)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  return (
    <div className="flex justify-center items-center mt-40">
      <Dialog open={isDialogOpen} onOpenChange={handleCloseClick}>
        <Card className="mx-auto px-5 py-5">
          {isLoadingData ? (
            <>
              <CardHeader>
                <div className="flex space-x-10 justify-between">
                  <div>
                    <CardTitle>Résumé de votre journée du</CardTitle>
                  </div>
                  <div style={{ color: "#5d34a2" }}>
                    <CardTitle>{format(currentDate, "EEEE d MMMM yyyy", { locale: fr })}</CardTitle>
                  </div>
                </div>
                <CardDescription>
                  Chargement du résumé de votre journée...
                </CardDescription>
              </CardHeader>
              <CardContent className="items-start">
                <div className="flex flex-col space-y-3">
                  <Skeleton style={{ width: "100%", height: "150px", margin: "20px 0" }} />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[80%]" />
                    <Skeleton className="h-4 w-[60%]" />
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <>
              <CardHeader>
                <div className="flex justify-between">
                  <div>
                    <CardTitle>Résumé de votre journée du</CardTitle>
                  </div>
                  <div style={{ color: "#5d34a2" }}>
                    <CardTitle>{format(currentDate, "EEEE d MMMM yyyy", { locale: fr })}</CardTitle>
                  </div>
                </div>
                <CardDescription>
                  Écrivez ce que vous avez fait aujourd'hui en ajoutant le plus de détails pertinents possible.
                </CardDescription>
              </CardHeader>
              <CardContent className="items-start">
                <form onSubmit={handleSubmit}>
                  {!canSubmit &&
                    <label style={{ color: "red", fontStyle: "italic" }} htmlFor={"summary"}>Vous avez déjà renseigné
                      une
                      résumé pour cette
                      journée</label>}
                  <Textarea
                    value={text}
                    required={true}
                    id={"summary"}
                    placeholder={userNotes?.day_summary || "Aujourd'hui, j'ai..."}
                    disabled={!canSubmit || isLoading}
                    onChange={handleChange}
                    style={{ width: "100%", height: "150px", margin: "20px 0" }}
                  />
                </form>
              </CardContent>
              <CardFooter className="justify-center">
                {isLoading ? (
                  <Button disabled>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyse en cours
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} disabled={!canSubmit || text.length === 0}>
                    🔬 Analyser la journée
                  </Button>
                )}
              </CardFooter>
            </>
          )}
        </Card>
        <DialogContent>
          {analysisResult ? (
            <>
              <DialogHeader>
                <DialogTitle>Résumé de la journée</DialogTitle>
                <DialogDescription>Voici votre résumé de la journée
                  du {format(parseISO(analysisResult.date || ""), "EEEE d MMMM yyyy", { locale: fr })}</DialogDescription>
              </DialogHeader>
              <div id={"resume"} className={"flex justify-start flex-col "}>
                <div id={"infos"} className="flex justify-between items-center space-x-2 pr-4">
                  <div id={"tags"} className="flex gap-2 flex-wrap">
                    {analysisResult.tags.map((tag: string, index: number) => {
                      const hue = Math.floor(Math.random() * 361)
                      const backgroundColor = `hsl(${hue}, 80%, 80%)`
                      const textColor = `hsl(${hue}, 100%, 20%)`
                      return (
                        <Badge key={index} style={{
                          backgroundColor,
                          color: textColor,
                          fontSize: "medium",
                          padding: "4px 10px"
                        }}>{tag}</Badge>
                      )
                    })}
                  </div>
                  <Separator orientation="vertical" />
                  <div style={{
                    color: getDayTextColor(analysisResult.rate),
                    fontWeight: "bold",
                    fontSize: "large"
                  }}>{analysisResult.rate}/10
                  </div>
                </div>
                <Separator className="my-4" />
                {analysisResult.short_summary}
              </div>
              <DialogFooter>
                <Button onClick={() => navigate("/calendarView")}>Aller au calendrier</Button>
              </DialogFooter>
            </>
          ) : (
            <DialogTitle>Chargement...</DialogTitle>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default DailyNote