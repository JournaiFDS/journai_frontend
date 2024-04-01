import { useState, useEffect, useContext } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "shadcn/components/card"
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "shadcn/components/dialog"
import { Textarea } from "shadcn/components/textarea"
import { Button } from "shadcn/components/button"
import { UserContext } from "../component/userContext.tsx"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { useNavigate } from "react-router-dom"

type DailyNoteProps = {
  date?: Date;
};

function DailyNote({ date }: DailyNoteProps) {
  const [text, setText] = useState("")
  const [db, setDb] = useState<IDBDatabase | null>(null)
  const [canSubmit, setCanSubmit] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const navigate = useNavigate()
  const { userId } = useContext(UserContext)

  const currentDate = date || new Date()

  useEffect(() => {
    const request = indexedDB.open("myDatabase", 1)
    request.onsuccess = (event: any) => {
      setDb(event.target.result)
    }
  }, [])

  useEffect(() => {
    if (!db || !userId) return
    const transaction = db.transaction(["users"], "readonly")
    const store = transaction.objectStore("users")
    const request = store.get(userId)
    request.onsuccess = (event: any) => {
      const user = event.target.result
      const today = format(currentDate, "yyyy-MM-dd")
      setCanSubmit(!user.dailyData || !user.dailyData[today])
    }
  }, [db, userId, currentDate])

  const handleChange = (event: any) => {
    setText(event.target.value)
  }

  const handleCloseClick = () => {
    setIsDialogOpen(false)
  }

  const handleSubmit = (event: any) => {
    event.preventDefault()
    if (!canSubmit) {
      alert("Un résumé existe déjà pour cette journée.")
      return
    }

    // Créer l'objet à envoyer au serveur
    const data = {
      name: userId,
      summary: text
    }

    // Effectuer l'appel au backend
    fetch("http://localhost:3000", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
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
        }
      })
      .catch(error => {
        console.error("Erreur lors de l'appel au backend:", error)
      })
  }

  return (
    <div className="flex justify-center items-center mt-40">
      <Dialog open={isDialogOpen} onOpenChange={handleCloseClick}>
        <Card className="mx-auto px-5 py-5">
          <CardHeader>
            <div className="flex justify-between">
              <div>
                <CardTitle>Résumé de votre journée</CardTitle>
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
              <Textarea
                value={text}
                onChange={handleChange}
                style={{ width: "100%", height: "150px", margin: "20px 0" }}
              />
            </form>
          </CardContent>
          <CardFooter className="justify-center">
            <Button onClick={handleSubmit} disabled={!canSubmit}>
              🔬 Analyser la journée
            </Button>
          </CardFooter>
        </Card>
        <DialogContent>
          <DialogTitle>Résumé ajouté</DialogTitle>
          <DialogContent>Votre résumé a bien été ajouté.</DialogContent>
          <DialogFooter>
            <Button onClick={() => navigate("/calendar")}>Aller au calendrier</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default DailyNote