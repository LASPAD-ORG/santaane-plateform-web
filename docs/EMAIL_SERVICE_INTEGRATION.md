# Intégration d'un service d'email pour la production

## Option 1 : SendGrid (Recommandé)

### Installation

```bash
npm install @sendgrid/mail
```

### Configuration

1. **Créer un compte SendGrid**
   - Allez sur https://sendgrid.com
   - Créez un compte gratuit (100 emails/jour)
   - Générez une API Key dans Settings → API Keys

2. **Ajouter les variables d'environnement**

Dans `.env.local` :
```env
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=noreply@votredomaine.com
SENDGRID_FROM_NAME=Santaane Platform
```

3. **Modifier la route API**

Créez le fichier `src/lib/email/sendgrid.ts` :

```typescript
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function sendEmail(
  to: string,
  subject: string,
  html: string,
  text: string
) {
  const msg = {
    to,
    from: {
      email: process.env.SENDGRID_FROM_EMAIL!,
      name: process.env.SENDGRID_FROM_NAME || 'Santaane',
    },
    subject,
    text,
    html,
  };

  try {
    await sgMail.send(msg);
    console.log('Email sent successfully to:', to);
    return { success: true };
  } catch (error: any) {
    console.error('SendGrid error:', error);
    if (error.response) {
      console.error('Error details:', error.response.body);
    }
    throw error;
  }
}
```

4. **Mettre à jour la route send-welcome-email**

Dans `src/app/api/users/send-welcome-email/route.ts`, remplacez la section try/catch par :

```typescript
import { sendEmail } from '@/lib/email/sendgrid';

// ... dans la fonction POST, après la génération du contenu

try {
  // Utiliser SendGrid au lieu de l'API backend
  await sendEmail(
    email,
    'Bienvenue sur Santaane - Vos identifiants de connexion',
    htmlContent,
    textContent
  );

  console.log('Welcome email sent successfully to:', email);
  return NextResponse.json(
    { message: 'Email de bienvenue envoyé avec succès' },
    { status: 200 }
  );
} catch (emailError) {
  console.error('Error sending email:', emailError);
  return NextResponse.json(
    { 
      error: 'Erreur lors de l\'envoi de l\'email',
      details: emailError instanceof Error ? emailError.message : 'Unknown error'
    },
    { status: 500 }
  );
}
```

### Test

```bash
# Créer un utilisateur avec votre propre email
# Vérifier votre boîte de réception
```

---

## Option 2 : Resend (Moderne et simple)

### Installation

```bash
npm install resend
```

### Configuration

1. **Créer un compte Resend**
   - Allez sur https://resend.com
   - Créez un compte (3000 emails/mois gratuits)
   - Générez une API Key

2. **Variables d'environnement**

```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL=onboarding@resend.dev
```

3. **Code d'intégration**

Créez `src/lib/email/resend.ts` :

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(
  to: string,
  subject: string,
  html: string,
  text: string
) {
  try {
    const data = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to,
      subject,
      html,
      text,
    });

    console.log('Email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Resend error:', error);
    throw error;
  }
}
```

---

## Option 3 : Nodemailer (SMTP personnalisé)

### Installation

```bash
npm install nodemailer
npm install -D @types/nodemailer
```

### Configuration

1. **Variables d'environnement**

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre-email@gmail.com
SMTP_PASSWORD=votre-mot-de-passe-app
SMTP_FROM=noreply@votredomaine.com
```

2. **Code d'intégration**

Créez `src/lib/email/nodemailer.ts` :

```typescript
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendEmail(
  to: string,
  subject: string,
  html: string,
  text: string
) {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject,
      text,
      html,
    });

    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('SMTP error:', error);
    throw error;
  }
}
```

---

## Option 4 : AWS SES (Pour grande échelle)

### Installation

```bash
npm install @aws-sdk/client-ses
```

### Configuration

1. **Variables d'environnement**

```env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_SES_FROM_EMAIL=noreply@votredomaine.com
```

2. **Code d'intégration**

Créez `src/lib/email/aws-ses.ts` :

```typescript
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const sesClient = new SESClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function sendEmail(
  to: string,
  subject: string,
  html: string,
  text: string
) {
  const command = new SendEmailCommand({
    Source: process.env.AWS_SES_FROM_EMAIL,
    Destination: {
      ToAddresses: [to],
    },
    Message: {
      Subject: {
        Data: subject,
        Charset: 'UTF-8',
      },
      Body: {
        Text: {
          Data: text,
          Charset: 'UTF-8',
        },
        Html: {
          Data: html,
          Charset: 'UTF-8',
        },
      },
    },
  });

  try {
    const response = await sesClient.send(command);
    console.log('Email sent via SES:', response.MessageId);
    return { success: true, messageId: response.MessageId };
  } catch (error) {
    console.error('SES error:', error);
    throw error;
  }
}
```

---

## Comparaison des services

| Service | Prix gratuit | Facilité | Recommandé pour |
|---------|-------------|----------|-----------------|
| **SendGrid** | 100/jour | ⭐⭐⭐⭐⭐ | Débutants, PME |
| **Resend** | 3000/mois | ⭐⭐⭐⭐⭐ | Développeurs modernes |
| **Nodemailer** | Illimité* | ⭐⭐⭐ | SMTP existant |
| **AWS SES** | 62000/mois | ⭐⭐ | Grande échelle |

*Dépend de votre serveur SMTP

---

## Mode développement : MailHog (Recommandé pour tests locaux)

MailHog capture tous les emails envoyés localement sans les envoyer réellement.

### Installation avec Docker

```bash
docker run -d -p 1025:1025 -p 8025:8025 mailhog/mailhog
```

### Configuration

```env
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_USER=
SMTP_PASSWORD=
```

### Accès

- Interface web : http://localhost:8025
- Tous les emails envoyés apparaîtront ici

---

## Recommandation finale

Pour commencer rapidement :
1. **Développement** : MailHog (voir les emails sans les envoyer)
2. **Production** : SendGrid ou Resend (faciles à configurer, gratuits pour commencer)

Voulez-vous que je vous aide à intégrer l'un de ces services ?
