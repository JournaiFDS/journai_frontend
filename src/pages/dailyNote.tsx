import { SetStateAction, useState } from "react";

function DailyNote() {
  // Utiliser useState pour gérer la valeur du champ de texte
  const [texte, setTexte] = useState("")

  // Fonction pour gérer le changement de texte
  const handleChange = (event: { target: { value: SetStateAction<string>; }; }) => {
    setTexte(event.target.value);
  };

  // Fonction pour gérer la soumission
  const handleSubmit = (event: { preventDefault: () => void; }) => {
    event.preventDefault(); // Empêcher le rechargement de la page
    alert('Texte soumis : ' + texte);
    // Ajoutez ici la logique pour ce que vous voulez faire avec le texte
  };

  return (
    <div className="App">
      <header className="App-header">
        <h2>Page d'accueil</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            value={texte}
            onChange={handleChange}
            style={{ width: '80%', height: '150px', margin: '20px 0' }}
          />
          <br />
          <button type="submit">Submit</button>
        </form>
      </header>
    </div>
  );
}

export default DailyNote;
