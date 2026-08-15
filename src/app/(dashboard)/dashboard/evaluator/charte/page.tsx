'use client';

import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import RoleGuard from '@/components/guards/RoleGuard';
import { UserRole } from '@/types/auth';
import PageHeader from '@/components/ui/PageHeader';

type Lang = 'fr' | 'en';

export default function ChartePage() {
  const [lang, setLang] = useState<Lang>('fr');

  const handleLang = (_: unknown, value: Lang | null) => {
    if (value) setLang(value);
  };

  return (
    <RoleGuard allowedRoles={[UserRole.EVALUATOR, UserRole.INTERNAL_EVALUATOR]}>
      <Box>
        <PageHeader
          title={lang === 'fr' ? 'Charte des évaluateurs' : 'Charter of Evaluators'}
          subtitle="Global Africa Journal"
        />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <ToggleButtonGroup value={lang} exclusive onChange={handleLang} size="small" color="primary">
            <ToggleButton value="fr">Français</ToggleButton>
            <ToggleButton value="en">English</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Paper
          elevation={0}
          sx={{ p: { xs: 3, md: 5 }, border: '1px solid', borderColor: 'divider', borderRadius: 2, maxWidth: 900, mx: 'auto' }}
        >
          {lang === 'fr' ? <CharteFR /> : <CharterEN />}
        </Paper>
      </Box>
    </RoleGuard>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <Typography variant="h6" fontWeight={700} sx={{ mt: 4, mb: 1.5, color: 'primary.main' }}>
      {children}
    </Typography>
  );
}

function Para({ children }: { children: React.ReactNode }) {
  return (
    <Typography variant="body1" sx={{ mb: 1.5, lineHeight: 1.7, textAlign: 'justify' }}>
      {children}
    </Typography>
  );
}

function Bullets({ items }: { items: React.ReactNode[] }) {
  return (
    <List dense sx={{ listStyleType: 'disc', pl: 4, mb: 1.5 }}>
      {items.map((it, i) => (
        <ListItem key={i} sx={{ display: 'list-item', py: 0.25 }} disableGutters>
          <ListItemText primary={it} primaryTypographyProps={{ variant: 'body1', sx: { lineHeight: 1.6 } }} />
        </ListItem>
      ))}
    </List>
  );
}

function CharteFR() {
  return (
    <Box>
      <Typography variant="h5" fontWeight={800} gutterBottom>
        Charte des évaluateurs
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <SectionTitle>Processus d&apos;évaluation des articles soumis à la revue</SectionTitle>
      <Para>
        La rédaction de la revue assure la confidentialité du processus d&apos;évaluation par les pairs. Elle s&apos;engage à ne
        pas partager d&apos;information au sujet d&apos;un manuscrit en dehors de ce processus et du comité de rédaction.
      </Para>
      <Para>
        Les rédacteur·rice·s en chef peuvent rejeter un manuscrit soumis sans avoir recours à un examen formel par les pairs
        s&apos;ils·elles considèrent que le manuscrit n&apos;est pas conforme ou en dehors de la ligne éditoriale de la revue,
        s&apos;ils·elles sont informé·e·s que l&apos;article reçu est déjà soumis ailleurs ou a déjà été publié.
      </Para>
      <Para>
        La rédaction s&apos;engage à traiter les manuscrits présentés d&apos;une manière efficace et rapidement. Le délai moyen
        entre la réception et l&apos;acceptation d&apos;un article dans la revue est de 12 mois.
      </Para>
      <Para>Le processus d&apos;évaluation au sein de la revue s&apos;organise ainsi :</Para>
      <Bullets
        items={[
          'Examen de conformité avec la ligne éditoriale par le comité de rédaction',
          'Examen de pertinence par le comité de rédaction',
          "Évaluation par deux lecteur·rice·s externes en double-aveugle (les évaluateur·rice·s et les auteur·e·s n'ont pas connaissance de leurs identités réciproques) selon la proposition du comité de rédaction.",
        ]}
      />
      <Para>Sur la base des rapports d&apos;évaluation, le comité de rédaction prend l&apos;une des quatre décisions suivantes :</Para>
      <Bullets
        items={[
          "Accepté en l'état.",
          "Révisions mineures : acceptation sous réserve d'intégration de changements modestes.",
          "Révisions majeures : acceptation sous réserve de changements substantiels. La version révisée de l'article est à nouveau soumise au processus de double évaluation.",
          'Refusé.',
        ]}
      />
      <Para>
        En cas de doute, d&apos;avis négatifs et concordants de la part des évaluateur·rice·s ou d&apos;insuffisances constatées,
        le comité de rédaction émet un avis de rejet. Tout·e auteur·e dont le texte sera refusé se verra proposer un accompagnement
        pour la réécriture de son article ainsi que la possibilité de le publier, une fois les conditions réunies, dans un numéro
        varia.
      </Para>
      <Para>
        Tout texte accepté par le comité de rédaction au terme du processus d&apos;évaluation fait l&apos;objet d&apos;un travail de
        préparation éditoriale effectué en concertation avec l&apos;auteur·e.
      </Para>

      <SectionTitle>Mission des évaluateur·rice·s</SectionTitle>
      <Para>
        Les évaluateur·rice·s sont sélectionné·e·s pour leur expertise intellectuelle et scientifique. Ils·elles sont chargé·e·s
        d&apos;évaluer les manuscrits sur leur seul contenu, sans distinction de race, de sexe, d&apos;orientation sexuelle, de
        conviction religieuse, de nationalité, d&apos;affiliation universitaire ou de positionnement politique.
      </Para>
      <Para>Les avis rendus par les évaluateur·rice·s doivent être les plus impartiaux possibles.</Para>
      <Para>
        Les évaluateur·rice·s sont tenu·e·s de signaler tout autre article ayant un rapport de similitude avec l&apos;article
        soumis à la revue. Ils·elles doivent signaler toute publication significative en lien avec l&apos;article qui n&apos;aurait
        pas encore été citée.
      </Para>

      <SectionTitle>Conflit d&apos;intérêt</SectionTitle>
      <Para>
        Les membres du comité de rédaction et les évaluateur·rice·s doivent se récuser en cas de conflit d&apos;intérêt avec
        l&apos;un·e des auteur·e·s ou avec le contenu du manuscrit à évaluer.
      </Para>
      <Para>
        Par ailleurs, tout·e évaluateur·rice qui se sait non qualifié·e pour évaluer un manuscrit ou qui sait qu&apos;il·elle
        n&apos;est pas en mesure de le faire dans des délais raisonnables est tenu·e d&apos;en aviser le comité de rédaction et de
        se récuser.
      </Para>

      <SectionTitle>Confidentialité</SectionTitle>
      <Para>
        Les manuscrits reçus pour évaluation sont traités comme des documents confidentiels. Aucun renseignement sur un manuscrit
        soumis à la revue n&apos;est divulgué à d&apos;autres personnes que le·la ou les auteur·e·s, les évaluateur·rice·s
        potentiel·le·s et, éventuellement, l&apos;éditeur·rice.
      </Para>

      <SectionTitle>Utilisation des données</SectionTitle>
      <Para>
        Les données présentées dans les articles soumis ne doivent pas être utilisées avant leur éventuelle publication, dans les
        travaux de recherche d&apos;un membre du comité de rédaction ou d&apos;un·e évaluateur·rice, sans le consentement écrit et
        explicite de l&apos;auteur·e.
      </Para>

      <SectionTitle>Grille d&apos;évaluation</SectionTitle>
      <Para>La grille d&apos;évaluation de Global Africa est la suivante :</Para>
      <Bullets
        items={[
          "Titre de l'article",
          'Lecteur interne',
          "Conformité du contenu au titre de l'article",
          'Originalité des idées et des conclusions',
          'Pertinence et rigueur de la méthode, de la démarche et des références',
          'Recours à des études empiriques (etc.) et une approche théorique solide',
          "Soin dans la présentation et la structure du texte, clarté de l'expression",
          "Les conclusions et l'interprétation des données sont-elles solides, valides, fiables ?",
          'Points forts',
          'Points faibles',
          'Suggestions pour améliorer le texte',
        ]}
      />
      <Para>
        Les évaluateur·rice·s sont invité·e·s à arbitrer toutes les révisions d&apos;un article et sont informé·e·s des décisions
        prises par les rédacteur·rice·s.
      </Para>

      <SectionTitle>Comment soumettre un rapport ?</SectionTitle>
      <Para>
        Nous encourageons vivement les évaluateur·rice·s à soumettre leurs rapports via notre plateforme de soumission en ligne en
        suivant le lien fourni dans le courriel de l&apos;éditeur. Pour obtenir de l&apos;aide sur le système, veuillez contacter
        l&apos;assistante de rédaction de la revue.
      </Para>
    </Box>
  );
}

function CharterEN() {
  return (
    <Box>
      <Typography variant="h5" fontWeight={800} gutterBottom>
        Charter of Evaluators
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <SectionTitle>Evaluation Process for Articles Submitted to the Journal</SectionTitle>
      <Para>
        The editorial staff of the journal ensures the confidentiality of the peer review process. It agrees not to share
        information about a manuscript outside of this process and the editorial board.
      </Para>
      <Para>
        Editors may reject a submitted manuscript without recourse to formal peer review if they consider the manuscript to be
        inconsistent or outside the editorial line of the journal, if they are informed that the article received has already been
        submitted elsewhere or has already been published.
      </Para>
      <Para>
        The editorial staff is committed to processing submitted manuscripts efficiently and quickly. The average time between
        receipt and acceptance of an article in the journal is 12 months.
      </Para>
      <Para>The evaluation process within the journal is organized as follows:</Para>
      <Bullets
        items={[
          'Review of compliance with the editorial line by the editorial board',
          'Review of relevance by the editorial board',
          "Evaluation by two double-blind external readers (the evaluators and the authors are not aware of each other's identities) according to the proposal of the editorial board.",
        ]}
      />
      <Para>Based on the evaluation reports, the editorial board makes one of four decisions:</Para>
      <Bullets
        items={[
          'Accepted as is;',
          'Minor revisions: acceptance subject to the integration of modest changes;',
          'Major revisions: acceptance subject to substantial changes. The revised version of the article is again subjected to the double evaluation process;',
          'Denied.',
        ]}
      />
      <Para>
        In case of doubt, negative and concordant opinions from the evaluators or insufficiencies noted, the editorial board issues
        a notice of rejection. Any author whose text is refused will be offered support for the rewriting of their article as well
        as the possibility of publishing it, once the conditions have been met, in a miscellaneous/varia issue.
      </Para>
      <Para>
        Any text accepted by the editorial board at the end of the evaluation process is subject to editorial preparation work
        carried out in consultation with the author.
      </Para>

      <SectionTitle>Mission of the Evaluators</SectionTitle>
      <Para>
        Reviewers are selected for their intellectual and scientific expertise. They are responsible for evaluating manuscripts on
        their content alone, without distinction of race, gender, sexual orientation, religious belief, nationality, academic
        affiliation or political positioning.
      </Para>
      <Para>The opinions given by the evaluators must be as impartial as possible.</Para>
      <Para>
        Reviewers are required to report any other article that has a similarity report with the article submitted to the journal.
        Reviewers should flag any significant publication related to the article that has not yet been cited.
      </Para>

      <SectionTitle>Conflict of Interest</SectionTitle>
      <Para>
        Editorial board members and reviewers must recuse themselves in the event of a conflict of interest with any of the authors
        or with the content of the manuscript to be reviewed.
      </Para>
      <Para>
        In addition, any reviewer who knows they are not qualified to review a manuscript or who knows that they are unable to do so
        within a reasonable time is required to notify the editorial and rewriting committee.
      </Para>

      <SectionTitle>Privacy</SectionTitle>
      <Para>
        Manuscripts received for review are treated as confidential documents. No information about a manuscript submitted to the
        journal is disclosed to anyone other than the author(s), potential reviewers and, possibly, the editor.
      </Para>

      <SectionTitle>Data Usage</SectionTitle>
      <Para>
        The data presented in the submitted articles must not be used before their possible publication, in the research work of a
        member of the editorial board or a reviewer, without the written and explicit consent of the author.
      </Para>

      <SectionTitle>Evaluation Grid</SectionTitle>
      <Para>The Global Africa evaluation grid is as follows:</Para>
      <Bullets
        items={[
          'Title of the article',
          'Internal reader',
          'Content compliance with the article title',
          'Originality of ideas and conclusions',
          'Relevance and rigor of the method, approach and references',
          'Use of empirical studies (etc.) and a solid theoretical approach',
          'Care in the presentation and structure of the text, clarity of expression',
          'Are the conclusions and interpretation of the data sound, valid, reliable?',
          'Highlights',
          'Weak points',
          'Suggestions for improving the text',
        ]}
      />
      <Para>
        Reviewers are invited to arbitrate all revisions of an article and are informed of the decisions made by the editors.
      </Para>
    </Box>
  );
}