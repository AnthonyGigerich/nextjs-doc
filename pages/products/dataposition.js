import ProductPage from "../../components/nav/ProductPage"
import Layout from "../../components/Layout"

export default function Produit() {
  const produit = {
    nom: 'DataPosition',
    baseline: 'Évaluez vos connaissances et compétences sur le cycle de la donnée',
    description: `Dataposition est un test réalisé par Datactivist, qui permet d‘évaluer son niveau 
                  sur différents aspects de la donnée : présenter et expliquer, modéliser, réaliser 
                  une jointure, cartographier, cataloguer, animer une équipe...`,
    targets: ['👩‍🎓 Etudiants', '🧑‍💼 Agents publics', '🙋🏻‍♂️ Participants d‘un hackathon'],
    testimonials: [
      {text: "Ce test a permis de définir mon rôle dans l'équipe pour le hackathon de l'ADEME", author: "Participant d'un hackathon"},
      {text: "Dataposition nous a fait gagner beaucoup de temps pour organiser les équipe !", author: "Organisateur d'un hackathon"}
    ],
    liens: [
        {url: 'https://github.com/datactivist/fast-dataposition', texte: '🔎 Accéder au dépôt Github'},
        {url: 'mailto:hello@datactivist.coop', texte: '✉️ Nous contacter pour en savoir plus'},
      ]
  }

  return (
    <Layout>
    <br></br>
    <ProductPage {...produit} />
    </Layout>
  )
}
