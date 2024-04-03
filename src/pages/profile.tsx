import { useState, useEffect, useContext } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "shadcn/components/card";
import { Button } from "shadcn/components/button";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../component/userContext.tsx"
import { differenceInYears } from "date-fns"


export default function Profile() {
  const [db, setDb] = useState<IDBDatabase | null>(null); // Add setDb
  const [username, setUsername] = useState("");
  const [age, setAge] = useState(0);
  const { userId, setUserId } = useContext(UserContext);
  const navigate = useNavigate();

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
          setDb(database) // Update db
        }

      } catch (error) {
        console.error("IndexedDB initialization error:", error)
      }
    }

    initializeDB()
  }, [])

  useEffect(() => {
    if (!db || !userId) return;
    const transaction = db.transaction(["users"], "readonly");
    const store = transaction.objectStore("users");
    const request = store.get(Number(userId));

    request.onsuccess = (event: any) => {
      const user = event.target.result;
      if (user) {
        setUsername(user ? user.username : "");
        const age = differenceInYears(new Date(), new Date(user.birthdate));
        setAge(age);
      }
    };
  }, [db, userId]);

  const deleteAccount = () => {
    if (!db || !userId) return;
    const transaction = db.transaction(["users"], "readwrite");
    const store = transaction.objectStore("users");
    const index = store.index("username");
    const request = index.get(username);

    request.onsuccess = (event: any) => {
      const user = event.target.result;
      if (user) {
        const deleteRequest = store.delete(user.id);
        deleteRequest.onsuccess = () => {
          setUserId("");
          navigate("/auth");
        };
      }
    };
  };

  const disconnectAccount = () => {
    setUserId("");
    localStorage.removeItem("userId");
    navigate("/auth");
  };

  return (
    <div className="flex justify-center items-center mt-40">
      <Card className="mx-auto px-5 py-5">
        <CardHeader>
          <CardTitle>Profil de {username}</CardTitle>
        </CardHeader>
        <CardContent className="items-start">
          <CardDescription>
            Nom d'utilisateur : {username}
          </CardDescription>
          <CardDescription>
            Âge : {age} ans
          </CardDescription>
          <div className="flex justify-center items-center mt-8">
            <Button onClick={disconnectAccount}>
              Se deconnecter
            </Button>
          </div>
        </CardContent>
        <CardFooter className="justify-center">
          <Button variant="destructive" onClick={deleteAccount}>
            Supprimer le compte
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}