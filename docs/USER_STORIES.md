# User stories — Pawrise

Stories alignées sur le prototype de démonstration. Rôle par défaut : **propriétaire du chien**.

## Santé

**US-01 — Lire l’état de santé en un coup d’œil**  
En tant que propriétaire, je veux voir l’identité du chien, le score de bien-être et les pastilles d’indicateurs dès l’ouverture, sans faire défiler, afin de savoir si mon chien va bien.

**US-02 — Comprendre un indicateur**  
En tant que propriétaire, je veux ouvrir le détail d’un indicateur (rythme cardiaque, fibrillation atriale, activité, sommeil, température) et changer de période (aujourd’hui, 7 jours, 30 jours), afin de comprendre l’évolution.

**US-03 — Demander à Pawrise depuis une alerte**  
En tant que propriétaire, je veux demander à Pawrise depuis un indicateur en alerte, afin d’obtenir une explication dans le chat déjà contextualisé.

**US-04 — Changer de chien**  
En tant que propriétaire de plusieurs chiens, je veux sélectionner le chien actif et modifier ses informations depuis la même liste, afin de consulter sa santé, sa position et sa conversation avec un dossier à jour.

## Localisation

**US-05 — Voir où est mon chien**  
En tant que propriétaire, je veux une carte avec la position, la photo, l’état du collier et la fraîcheur de la dernière localisation, afin de le retrouver rapidement.

**US-06 — Explorer la carte**  
En tant que propriétaire, je veux zoomer, déplacer la carte, recentrer et actualiser, afin de suivre le trajet.

**US-07 — Gérer les zones de sécurité**  
En tant que propriétaire, je veux ajouter, renommer, redimensionner, afficher et supprimer des zones, et activer leurs alertes, afin d’être prévenu si le chien sort d’un lieu habituel.

## Chat IA

**US-08 — Poser une question à Pawrise**  
En tant que propriétaire, je veux ouvrir le chat, utiliser les suggestions ou écrire librement, afin d’obtenir un point sur mon chien.

**US-09 — Continuer après une alerte collier**  
En tant que propriétaire, je veux toucher la bannière d’alerte sur la carte, afin d’arriver dans le chat avec le contexte déjà posé.

**US-10 — Contacter un vétérinaire depuis le chat**  
En tant que propriétaire, je veux passer aux rendez-vous depuis la conversation, afin de réserver sans quitter le fil d’alerte.

## Collier et chiens

**US-11 — Ajouter un chien**  
En tant que propriétaire, je veux ajouter un chien (photo, nom, naissance, sexe, race, poids, taille, infos médicales), afin de suivre plusieurs animaux.

**US-12 — Associer le collier**  
En tant que propriétaire, je veux scanner le QR code ou saisir le code `PW-XXXXXX`, afin d’associer le collier au bon chien.

**US-13 — Consulter et remplacer le collier**  
En tant que propriétaire, je veux voir la batterie, le signal et le code, et remplacer le collier, afin de rester connecté.

**US-14 — Modifier le profil du chien**  
En tant que propriétaire, je veux éditer les informations du chien depuis la liste « Mes chiens », afin de garder un dossier à jour.

## Soins et alertes

**US-15 — Gérer les rappels de soins**  
En tant que propriétaire, je veux créer, modifier, marquer effectué et supprimer un rappel, afin de ne pas manquer un vaccin ou un traitement.

**US-16 — Être prévenu d’une échéance proche**  
En tant que propriétaire, je veux qu’une échéance à moins de 24 h apparaisse dans les alertes, afin d’agir à temps.

**US-17 — Parcourir les notifications**  
En tant que propriétaire, je veux ouvrir les notifications, les marquer lues et rejoindre l’écran concerné, afin de traiter chaque alerte.

## Vétérinaire

**US-18 — Trouver un vétérinaire**  
En tant que propriétaire, je veux voir mes rendez-vous en haut de l’écran, puis filtrer les cliniques (tous ou partenaires Pawrise, habilités urgence) et trier par distance ou prochain créneau, afin de choisir rapidement.

**US-19 — Réserver un créneau chez un partenaire**  
En tant que propriétaire, je veux parcourir les jours en carrousel, voir les horaires libres et déjà pris, relire le récapitulatif, transmettre les données du collier si je le souhaite et confirmer, afin d’avoir un rendez-vous pour mon chien.

**US-20 — Annuler un rendez-vous**  
En tant que propriétaire, je veux annuler un rendez-vous confirmé, afin de libérer le créneau.

**US-21 — Contacter un vétérinaire hors réseau**  
En tant que propriétaire, je veux voir le lieu et le téléphone d’une clinique non partenaire, et comprendre que les mesures du collier ne peuvent pas lui être transmises, afin de prendre rendez-vous par moi-même.

## Compte et partage

**US-22 — Gérer mon profil**  
En tant que propriétaire, je veux modifier nom, e-mail et téléphone, afin que mes informations soient justes.

**US-23 — Inviter un copropriétaire**  
En tant que propriétaire, je veux inviter une personne par e-mail sur un chien, afin de partager la localisation et la santé. La personne invitée est propriétaire second.

**US-24 — Régler la confidentialité**  
En tant que propriétaire, je veux activer ou désactiver le partage de localisation, les notifications santé et les données anonymisées, afin de contrôler ce qui est partagé.

**US-31 — Distinguer le propriétaire chef et les seconds**  
En tant que propriétaire, je veux voir qui est le propriétaire chef et qui sont les propriétaires seconds d'un collier, afin de savoir qui peut décider pour les données du chien.

Nala est déjà partagée : Camille Laurent est propriétaire chef, Léa Moreau est propriétaire second.

**US-32 — Donner le rôle de chef**  
En tant que propriétaire chef, je veux donner le rôle de chef à un autre propriétaire, afin de lui confier le collier. Je deviens alors propriétaire second. Un propriétaire second ne peut pas transmettre ce rôle.

**US-33 — Lire les conditions et la confidentialité**  
En tant que propriétaire, je veux ouvrir les conditions d'utilisation et la politique de confidentialité sur une page, avec un retour, afin de les consulter.

**US-34 — Comprendre les données exportées vers un vétérinaire**  
En tant que propriétaire, je veux lire ce qui est transmis à une clinique, qui le reçoit, et ce qui reste archivé, afin de comprendre la confidentialité d'un dossier exporté.

**US-35 — Détruire le compte en tant que chef**  
En tant que propriétaire chef, je veux détruire mon compte en voyant que les données du collier sont détruites, que le collier est réinitialisé, et que les rendez-vous ainsi que les dossiers déjà transmis à un vétérinaire sont archivés.

**US-36 — Détruire le compte en tant que second**  
En tant que propriétaire second, je veux détruire uniquement mon compte. Les données du collier restent chez le propriétaire chef, et le collier n'est pas réinitialisé.

## Authentification

**US-26 — Se déconnecter**  
En tant que propriétaire, je veux me déconnecter depuis Paramètres, afin de fermer ma session sur cet appareil.

**US-27 — Se connecter**  
En tant que propriétaire, je veux me connecter avec mon e-mail et mon mot de passe, afin de retrouver mes chiens et leur suivi.

Le compte déjà ouvert au lancement est Camille Laurent (`camille.laurent@email.com`, mot de passe `pawrise`).

**US-28 — Créer un compte**  
En tant que nouveau propriétaire, je veux m'inscrire avec mon nom, mon e-mail, mon téléphone et un mot de passe, afin d'utiliser Pawrise.

**US-29 — Découvrir Pawrise**  
En tant que nouveau propriétaire, après l'inscription, je veux suivre un fil d'étapes très simple — à quoi sert l'app, allumer le collier, recevoir les mesures, prendre rendez-vous en cas de danger, suivre la position — afin de comprendre l'essentiel avant de connecter le collier.

**US-30 — Connecter le collier après l'inscription**  
En tant que nouveau propriétaire, je veux, à la fin de ce parcours, ajouter mon chien et associer son collier exactement comme lorsque j'ajoute un chien plus tard, afin que mon premier animal soit suivi.

## Démonstration

**US-25 — Basculer Tout va bien / Alerte**  
En tant que présentateur, je veux un unique bouton sur l’écran Santé pour passer de Tout va bien à Alerte (et l’inverse), afin de montrer le parcours incident pendant une démonstration.
