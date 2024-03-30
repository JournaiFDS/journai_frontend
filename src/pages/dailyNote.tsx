import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "shadcn/components/card"
import { Textarea } from "shadcn/components/textarea";
import { Button } from "shadcn/components/button";

function DailyNote() {
  const [text, setText] = useState("");

  const handleChange = (event: any) => {
    setText(event.target.value);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    alert('Texte soumis : ' + text);
    // Ajoutez ici la logique pour ce que vous voulez faire avec le texte
  };

  return (
    <div className="flex justify-center items-center mt-40">
      <Card className="mx-auto px-5 py-5">
        <CardHeader>
          <CardTitle>Résumé de votre journée</CardTitle>
          <CardDescription>
            Écrivez ce que vous avez fait aujourd'hui en ajoutant le plus de détails pertinents possible.
          </CardDescription>
        </CardHeader>
        <CardContent className="items-start">
          <form onSubmit={handleSubmit}>
            <Textarea
              value={text}
              onChange={handleChange}
              style={{ width: '100%', height: '150px', margin: '20px 0' }}
            />
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <Button onClick={handleSubmit}>
            🔬 Analyser la journée
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default DailyNote;