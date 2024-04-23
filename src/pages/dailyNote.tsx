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
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { useLocation, useNavigate } from "react-router-dom"
import { Loader2 } from "lucide-react"
import { getDayTextColor } from "../utils/utils.ts"
import { Badge } from "shadcn/components/badge.tsx"
import { Separator } from "shadcn/components/separator.tsx"
import { Skeleton } from "shadcn/components/skeleton.tsx"
import { createJournalEntry, deleteDay, JournalEntry, listJournalEntries } from "../utils/api.ts"
import { UserContext } from "../component/userContext.tsx"

function DailyNote() {
  const { userName } = useContext(UserContext)
  const [text, setText] = useState("")
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [canSubmit, setCanSubmit] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<JournalEntry | undefined>()
  const [userNotes, setUserNotes] = useState<JournalEntry>()
  const location = useLocation()
  const [currentDate] = useState<Date>((location.state?.selectedDate) || new Date())

  useEffect(() => {
    setIsLoadingData(true)
    listJournalEntries()
      .then(entries => {
        if (!userName) return
        if (entries) {
          const userNote = entries.find(entry => format(entry.date, "yyyy-MM-dd") === format(currentDate, "yyyy-MM-dd"))
          if (userNote) {
            setUserNotes(userNote)
            setCanSubmit(false)
          } else {
            setCanSubmit(true)
          }
          setIsLoadingData(false)
        } else {
          setIsLoadingData(false)
          setCanSubmit(true)
        }
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des données:", error)
        setIsLoadingData(false)
      })
  }, [currentDate])

  const handleChange = (event: any) => {
    setText(event.target.value)
  }

  const handleCloseClick = () => {
    setIsDialogOpen(false)
  }


  const handleSubmitDelete = (event: any) => {
    event.preventDefault()
    if (canSubmit) {
      alert("Vous n'avez pas encore fait de résumé pour cette journée.")
      return
    }

    setIsLoading(true)

    // Créer l'objet à envoyer au serveur
    const dataSent = {
      date: currentDate
    }

    // Effectuer l'appel au backend
    deleteDay(dataSent.date)
      .then(response => {
        if (response && response.ok) {
          setCanSubmit(true)
          setUserNotes(undefined)
        } else {
          console.error("La requête n'a pas abouti avec le statut:", response?.status)
        }
      })
      .catch(error => {
        console.error("Erreur lors de l'appel au backend:", error)
      })
      .finally(() => {
        setIsLoading(false)
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
      name: userName,
      summary: text,
      date: currentDate
    }

    // Effectuer l'appel au backend
    createJournalEntry(dataSent.name, dataSent.summary, dataSent.date)
      .then(data => {
        // Ouvrir le Dialog
        setIsDialogOpen(true)
        setAnalysisResult(data)
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
                    placeholder={userNotes?.short_summary || "Aujourd'hui, j'ai..."}
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
                    {canSubmit ? "Analyse en cours" : "Suppression en cours"}
                  </Button>
                ) : (
                  canSubmit ? (
                    <Button onClick={handleSubmit} disabled={!canSubmit || text.length === 0}>
                      🔬 Analyser la journée
                    </Button>
                  ) : (
                    <Button onClick={handleSubmitDelete} className="bg-red-500 text-white hover:bg-red-600">
                      🗑️ Supprimer la journée
                    </Button>
                  )
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
                  du {format(analysisResult.date || "", "EEEE d MMMM yyyy", { locale: fr })}</DialogDescription>
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