# Pawrise — User stories et critères d’acceptation

Version de travail · 5 octobre 2026

[Fichier Figma](https://www.figma.com/design/oSH1BWg8ek3AtXc4DJ2LBx) · [Fiches user stories dans Figma](https://www.figma.com/design/oSH1BWg8ek3AtXc4DJ2LBx?node-id=11-951)

Périmètre : prototype de démonstration React existant. Les 36 identifiants du dépôt sont conservés. Les priorités et critères ci-dessous sont proposés pour la recette ; ils ne constituent pas un rapport de tests. Les données et actions sont locales au navigateur : aucun envoi réel, diagnostic médical ou service serveur n’est revendiqué.

P0 : parcours central de démonstration. P1 : parcours complémentaire. Les références S01–S26 désignent les écrans Figma ; les variantes S02n (état normal) et S15b (rendez-vous confirmé) complètent ce repérage. Les étapes de découverte S21b à S21e portent le total à 32 écrans.

## US-01 — Lire l’état de santé en un coup d’œil

En tant que propriétaire, je veux voir l’identité du chien, le score de bien-être et les pastilles d’indicateurs dès l’ouverture, sans faire défiler, afin de savoir si mon chien va bien.

**Priorité proposée : P0 · Écran(s) : S01 Santé**

**Critères d’acceptation**

- Le chien actif, son score et ses indicateurs sont visibles au premier écran.
- Les états bon, à surveiller et alerte sont distingués par un libellé et une couleur.
- Un collier déconnecté est signalé avec les dernières mesures reçues.

## US-02 — Comprendre un indicateur

En tant que propriétaire, je veux ouvrir le détail d’un indicateur (rythme cardiaque, fibrillation atriale, activité, sommeil, température) et changer de période (aujourd’hui, 7 jours, 30 jours), afin de comprendre l’évolution.

**Priorité proposée : P0 · Écran(s) : S02 Détail indicateur**

**Critères d’acceptation**

- Toucher un indicateur ouvre son détail.
- Les périodes aujourd’hui, 7 jours et 30 jours sont accessibles pour les indicateurs qui les proposent ; la fibrillation atriale reste sur sa vue dédiée.
- Fermer le détail ramène à la santé du même chien.

## US-03 — Demander à Pawrise depuis une alerte

En tant que propriétaire, je veux demander à Pawrise depuis un indicateur en alerte, afin d’obtenir une explication dans le chat déjà contextualisé.

**Priorité proposée : P0 · Écran(s) : S03 Santé en alerte → S04 Chat**

**Critères d’acceptation**

- Depuis un indicateur en alerte, Demander à Pawrise ouvre le chat.
- Le contexte concerne le chien et l’indicateur sélectionnés.
- La conversation ne se mélange pas à celle des autres chiens.

## US-04 — Changer de chien

En tant que propriétaire de plusieurs chiens, je veux sélectionner le chien actif et modifier ses informations depuis la même liste, afin de consulter sa santé, sa position et sa conversation avec un dossier à jour.

**Priorité proposée : P0 · Écran(s) : S05 Mes chiens**

**Critères d’acceptation**

- La liste identifie le chien actif.
- Sélectionner un autre chien actualise santé, position et conversation.
- Le profil de chaque chien est modifiable depuis la liste.

## US-05 — Voir où est mon chien

En tant que propriétaire, je veux une carte avec la position, la photo, l’état du collier et la fraîcheur de la dernière localisation, afin de le retrouver rapidement.

**Priorité proposée : P0 · Écran(s) : S06 Localisation**

**Critères d’acceptation**

- La carte montre le chien actif et sa photo.
- L’état du collier et la fraîcheur de la position sont lisibles.
- Le changement de chien actualise la position affichée.

## US-06 — Explorer la carte

En tant que propriétaire, je veux zoomer, déplacer la carte, recentrer et actualiser, afin de suivre le trajet.

**Priorité proposée : P1 · Écran(s) : S06 Localisation**

**Critères d’acceptation**

- Déplacer et zoomer modifie la vue.
- Recentrer ramène au chien actif.
- Actualiser met à jour la vue et le trajet est consultable.

## US-07 — Gérer les zones de sécurité

En tant que propriétaire, je veux ajouter, renommer, redimensionner, afficher et supprimer des zones, et activer leurs alertes, afin d’être prévenu si le chien sort d’un lieu habituel.

**Priorité proposée : P1 · Écran(s) : S07 Zones de sécurité**

**Critères d’acceptation**

- Une zone peut être ajoutée, nommée et redimensionnée.
- Sa visibilité et ses alertes sont contrôlables.
- Supprimer une zone la retire de la liste du chien concerné.

## US-08 — Poser une question à Pawrise

En tant que propriétaire, je veux ouvrir le chat, utiliser les suggestions ou écrire librement, afin d’obtenir un point sur mon chien.

**Priorité proposée : P0 · Écran(s) : S04 Chat**

**Critères d’acceptation**

- Une suggestion peut démarrer la conversation.
- Un message libre non vide peut être envoyé.
- Changer de chien affiche sa propre conversation.

## US-09 — Continuer après une alerte collier

En tant que propriétaire, je veux toucher la bannière d’alerte sur la carte, afin d’arriver dans le chat avec le contexte déjà posé.

**Priorité proposée : P0 · Écran(s) : S06 Localisation en alerte → S04 Chat**

**Critères d’acceptation**

- La bannière est visible lorsque le scénario alerte est actif.
- Le scénario alerte montre le chien hors d’une zone de sécurité.
- La toucher ouvre le chat avec le contexte du chien.
- Le retour à la carte conserve le chien sélectionné.

## US-10 — Contacter un vétérinaire depuis le chat

En tant que propriétaire, je veux passer aux rendez-vous depuis la conversation, afin de réserver sans quitter le fil d’alerte.

**Priorité proposée : P0 · Écran(s) : S04 Chat → S08 Vétérinaires**

**Critères d’acceptation**

- L’action vétérinaire ouvre les rendez-vous.
- Le chien concerné reste identifiable.
- Le parcours permet de choisir une clinique.

## US-11 — Ajouter un chien

En tant que propriétaire, je veux ajouter un chien (photo, nom, naissance, sexe, race, poids, taille, infos médicales), afin de suivre plusieurs animaux.

**Priorité proposée : P0 · Écran(s) : S09 Ajouter un chien**

**Critères d’acceptation**

- Le parcours propose photo, identité et informations médicales.
- Les champs requis sont contrôlés avant validation.
- Le chien ajouté apparaît dans Mes chiens.

## US-12 — Associer le collier

En tant que propriétaire, je veux scanner le QR code ou saisir le code `PW-XXXXXX`, afin d’associer le collier au bon chien.

**Priorité proposée : P0 · Écran(s) : S10 Associer un collier**

**Critères d’acceptation**

- Les voies QR et code sont accessibles.
- Un code invalide produit une erreur lisible.
- Une association valide rattache le collier au bon chien.

## US-13 — Consulter et remplacer le collier

En tant que propriétaire, je veux voir la batterie, le signal et le code, et remplacer le collier, afin de rester connecté.

**Priorité proposée : P1 · Écran(s) : S11 Mon collier**

**Critères d’acceptation**

- Batterie, signal et code sont affichés.
- Le remplacement contrôle le code saisi.
- Fermer sans valider conserve l’association existante.

## US-14 — Modifier le profil du chien

En tant que propriétaire, je veux éditer les informations du chien depuis la liste « Mes chiens », afin de garder un dossier à jour.

**Priorité proposée : P1 · Écran(s) : S05 Mes chiens / Édition**

**Critères d’acceptation**

- L’édition reprend les valeurs du chien choisi.
- Enregistrer met à jour ce chien.
- Annuler conserve les valeurs précédentes.

## US-15 — Gérer les rappels de soins

En tant que propriétaire, je veux créer, modifier, marquer effectué et supprimer un rappel, afin de ne pas manquer un vaccin ou un traitement.

**Priorité proposée : P1 · Écran(s) : S12 Rappels**

**Critères d’acceptation**

- Un rappel peut être créé et modifié.
- Marquer effectué change son état.
- Supprimer le retire de la liste.

## US-16 — Être prévenu d’une échéance proche

En tant que propriétaire, je veux qu’une échéance à moins de 24 h apparaisse dans les alertes, afin d’agir à temps.

**Priorité proposée : P1 · Écran(s) : S12 Rappels → S13 Notifications**

**Critères d’acceptation**

- Une échéance à moins de 24 h est signalée dans les alertes.
- L’alerte permet d’identifier le soin et le chien.
- Un soin effectué ne reste pas présenté comme restant à faire.

## US-17 — Parcourir les notifications

En tant que propriétaire, je veux ouvrir les notifications, les marquer lues et rejoindre l’écran concerné, afin de traiter chaque alerte.

**Priorité proposée : P1 · Écran(s) : S13 Notifications**

**Critères d’acceptation**

- Les notifications lues et non lues se distinguent.
- Ouvrir une notification permet de la marquer lue.
- Le lien mène au chien et à l’écran concernés.

## US-18 — Trouver un vétérinaire

En tant que propriétaire, je veux voir mes rendez-vous en haut de l’écran, puis filtrer les cliniques (tous ou partenaires Pawrise, habilités urgence) et trier par distance ou prochain créneau, afin de choisir rapidement.

**Priorité proposée : P0 · Écran(s) : S08 Vétérinaires**

**Critères d’acceptation**

- Les rendez-vous existants précèdent les cliniques.
- Les filtres partenaires et urgence modifient les résultats.
- Les tris distance et prochain créneau sont proposés.

## US-19 — Réserver un créneau chez un partenaire

En tant que propriétaire, je veux parcourir les jours en carrousel, voir les horaires libres et déjà pris, relire le récapitulatif, transmettre les données du collier si je le souhaite et confirmer, afin d’avoir un rendez-vous pour mon chien.

**Priorité proposée : P0 · Écran(s) : S14 Créneaux → S15 Confirmation**

**Critères d’acceptation**

- Les jours et les créneaux libres ou occupés se distinguent.
- Un créneau occupé ne peut pas être confirmé.
- Le récapitulatif précise chien, clinique, date et choix de transmission avant confirmation.

## US-20 — Annuler un rendez-vous

En tant que propriétaire, je veux annuler un rendez-vous confirmé, afin de libérer le créneau.

**Priorité proposée : P1 · Écran(s) : S15 Rendez-vous confirmé**

**Critères d’acceptation**

- L’action annuler cible le rendez-vous choisi.
- Après annulation il n’apparaît plus comme confirmé.
- Les autres rendez-vous sont conservés.

## US-21 — Contacter un vétérinaire hors réseau

En tant que propriétaire, je veux voir le lieu et le téléphone d’une clinique non partenaire, et comprendre que les mesures du collier ne peuvent pas lui être transmises, afin de prendre rendez-vous par moi-même.

**Priorité proposée : P1 · Écran(s) : S16 Clinique hors réseau**

**Critères d’acceptation**

- Adresse et téléphone sont accessibles.
- L’absence de transmission des mesures est expliquée.
- Le propriétaire comprend qu’il doit contacter lui-même la clinique.

## US-22 — Gérer mon profil

En tant que propriétaire, je veux modifier nom, e-mail et téléphone, afin que mes informations soient justes.

**Priorité proposée : P1 · Écran(s) : S17 Paramètres / Profil**

**Critères d’acceptation**

- Nom, e-mail et téléphone sont modifiables.
- Les champs invalides empêchent l’enregistrement.
- Annuler conserve les données précédentes.

## US-23 — Inviter un copropriétaire

En tant que propriétaire, je veux inviter une personne par e-mail sur un chien, afin de partager la localisation et la santé. La personne invitée est propriétaire second.

**Priorité proposée : P1 · Écran(s) : S18 Partage / Invitation**

**Critères d’acceptation**

- Le chien à partager est sélectionnable.
- Une adresse invalide ou déjà associée empêche la validation.
- Le résultat indique le rôle de propriétaire second.

## US-24 — Régler la confidentialité

En tant que propriétaire, je veux activer ou désactiver le partage de localisation, les notifications santé et les données anonymisées, afin de contrôler ce qui est partagé.

**Priorité proposée : P1 · Écran(s) : S17 Paramètres / Confidentialité**

**Critères d’acceptation**

- Les trois préférences ont un état explicite.
- Chaque préférence peut être modifiée indépendamment.
- Les choix sont retrouvés après réouverture du prototype.

## US-25 — Basculer Tout va bien / Alerte

En tant que présentateur, je veux un unique bouton sur l’écran Santé pour passer de Tout va bien à Alerte (et l’inverse), afin de montrer le parcours incident pendant une démonstration.

**Priorité proposée : P0 · Écran(s) : S01 Santé ↔ S03 Santé en alerte**

**Critères d’acceptation**

- Un seul contrôle de démonstration déclenche le changement de scénario.
- Le scénario alerte affiche 64/100 et actualise les indicateurs.
- Le retour à Tout va bien restaure le scénario normal.

## US-26 — Se déconnecter

En tant que propriétaire, je veux me déconnecter depuis Paramètres, afin de fermer ma session sur cet appareil.

**Priorité proposée : P1 · Écran(s) : S17 Paramètres → S19 Connexion**

**Critères d’acceptation**

- Se déconnecter présente une confirmation.
- Confirmer ferme la session sur cet appareil.
- Annuler conserve la session.

## US-27 — Se connecter

En tant que propriétaire, je veux me connecter avec mon e-mail et mon mot de passe, afin de retrouver mes chiens et leur suivi.

**Priorité proposée : P0 · Écran(s) : S19 Connexion**

**Critères d’acceptation**

- L’écran permet de saisir e-mail et mot de passe.
- Une saisie incorrecte ne donne pas accès au suivi.
- Une connexion valide ouvre le parcours du propriétaire.

## US-28 — Créer un compte

En tant que nouveau propriétaire, je veux m'inscrire avec mon nom, mon e-mail, mon téléphone et un mot de passe, afin d'utiliser Pawrise.

**Priorité proposée : P0 · Écran(s) : S20 Inscription**

**Critères d’acceptation**

- Nom, e-mail, téléphone et mot de passe sont demandés.
- Les champs requis sont validés.
- Une inscription valide ouvre la découverte Pawrise.

## US-29 — Découvrir Pawrise

En tant que nouveau propriétaire, après l'inscription, je veux suivre un fil d'étapes très simple — à quoi sert l'app, allumer le collier, recevoir les mesures, prendre rendez-vous en cas de danger, suivre la position — afin de comprendre l'essentiel avant de connecter le collier.

**Priorité proposée : P1 · Écran(s) : S21 Découverte**

**Critères d’acceptation**

- Le fil explique utilité, allumage, mesures, rendez-vous et position.
- La progression et l’action suivante sont compréhensibles.
- La fin conduit à l’ajout du premier chien.

## US-30 — Connecter le collier après l'inscription

En tant que nouveau propriétaire, je veux, à la fin de ce parcours, ajouter mon chien et associer son collier exactement comme lorsque j'ajoute un chien plus tard, afin que mon premier animal soit suivi.

**Priorité proposée : P0 · Écran(s) : S21 Découverte → S09 → S10**

**Critères d’acceptation**

- Le premier chien suit le même parcours d’ajout que les suivants.
- Le collier est associé au chien saisi.
- La fin du parcours donne accès au suivi de ce chien.

## US-31 — Distinguer le propriétaire chef et les seconds

En tant que propriétaire, je veux voir qui est le propriétaire chef et qui sont les propriétaires seconds d'un collier, afin de savoir qui peut décider pour les données du chien.

**Priorité proposée : P1 · Écran(s) : S18 Propriétaires & partage**

**Critères d’acceptation**

- Chaque propriétaire possède un rôle lisible.
- Nala présente Camille comme chef et Léa comme second dans la démonstration initiale.
- Le rôle du propriétaire courant est identifiable.

## US-32 — Donner le rôle de chef

En tant que propriétaire chef, je veux donner le rôle de chef à un autre propriétaire, afin de lui confier le collier. Je deviens alors propriétaire second. Un propriétaire second ne peut pas transmettre ce rôle.

**Priorité proposée : P1 · Écran(s) : S22 Transfert du rôle de chef**

**Critères d’acceptation**

- Seul le chef peut initier le transfert vers un propriétaire second actif.
- La confirmation explique les deux changements de rôle.
- Après validation, l’ancien chef devient second.

## US-33 — Lire les conditions et la confidentialité

En tant que propriétaire, je veux ouvrir les conditions d'utilisation et la politique de confidentialité sur une page, avec un retour, afin de les consulter.

**Priorité proposée : P1 · Écran(s) : S23 Informations légales**

**Critères d’acceptation**

- Les conditions et la confidentialité ouvrent des pages distinctes.
- Le contenu est consultable avec défilement.
- Un retour ramène aux paramètres.

## US-34 — Comprendre les données exportées vers un vétérinaire

En tant que propriétaire, je veux lire ce qui est transmis à une clinique, qui le reçoit, et ce qui reste archivé, afin de comprendre la confidentialité d'un dossier exporté.

**Priorité proposée : P1 · Écran(s) : S24 Données vétérinaires**

**Critères d’acceptation**

- La page explique quelles données sont transmises.
- Le destinataire et les informations archivées sont identifiables.
- Le retour aux paramètres reste accessible.

## US-35 — Détruire le compte en tant que chef

En tant que propriétaire chef, je veux détruire mon compte en voyant que les données du collier sont détruites, que le collier est réinitialisé, et que les rendez-vous ainsi que les dossiers déjà transmis à un vétérinaire sont archivés.

**Priorité proposée : P1 · Écran(s) : S25 Suppression / Chef**

**Critères d’acceptation**

- Les conséquences sur données, collier et archives sont présentées avant validation.
- Annuler ne modifie rien.
- Le parcours décrit la destruction des données du collier et sa réinitialisation pour le chef.

## US-36 — Détruire le compte en tant que second

En tant que propriétaire second, je veux détruire uniquement mon compte. Les données du collier restent chez le propriétaire chef, et le collier n'est pas réinitialisé.

**Priorité proposée : P1 · Écran(s) : S26 Suppression / Second**

**Critères d’acceptation**

- Le texte précise que seul le compte du second est détruit.
- Les données du chef et le collier sont conservés.
- Annuler ne modifie rien.

## Points à arbitrer avant un produit connecté

- Documents légaux : les pages de conditions et de confidentialité du dépôt contiennent encore du texte de remplissage. Le visuel S23 représente leur point d’entrée ; leur contenu final reste à rédiger.
- Invitation : le code ajoute directement un propriétaire second alors que le message annonce une invitation envoyée. Définir le futur état en attente et son acceptation.
- Authentification, QR, GPS, messages et rendez-vous : conserver la distinction entre la démonstration locale et de futurs services réels.
- Suppression et archivage : les textes du prototype expriment un comportement cible ; la validation juridique et l’implémentation serveur ne sont pas couvertes ici.
- Définir les futurs états sans données, hors réseau, erreur de synchronisation et autorisations refusées.

## Parcours de présentation

1. S01 Santé → S02 Indicateur → S03 Alerte → S04 Chat → S08 Vétérinaires → S14 Créneau → S15 Confirmation.
2. S06 Localisation → S07 Zones → S13 Notification → S04 Chat.
3. S20 Inscription → S21 Découverte → S09 Ajout du chien → S10 Association → S01 Santé.
4. S17 Paramètres → S18 Partage → S22 Transfert ; variantes S25 Chef et S26 Second pour la suppression.
