/**
 * Template d'email de bienvenue pour les nouveaux utilisateurs
 */

interface WelcomeEmailData {
  prenom: string;
  nom: string;
  email: string;
  temporaryPassword: string;
  loginUrl: string;
}

export function generateWelcomeEmailHTML(data: WelcomeEmailData): string {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bienvenue sur Santaane</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f5f5f5;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #FF9C00 0%, #FF7A00 100%);
      color: white;
      padding: 40px 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 700;
    }
    .content {
      padding: 40px 30px;
    }
    .greeting {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 20px;
      color: #1a1a1a;
    }
    .credentials-box {
      background-color: #f8f9fa;
      border-left: 4px solid #FF9C00;
      padding: 20px;
      margin: 30px 0;
      border-radius: 4px;
    }
    .credentials-box h3 {
      margin-top: 0;
      color: #FF9C00;
      font-size: 16px;
    }
    .credential-item {
      margin: 15px 0;
    }
    .credential-label {
      font-weight: 600;
      color: #666;
      font-size: 14px;
    }
    .credential-value {
      font-family: 'Courier New', monospace;
      background-color: #fff;
      padding: 10px;
      border-radius: 4px;
      border: 1px solid #e0e0e0;
      margin-top: 5px;
      font-size: 14px;
      word-break: break-all;
    }
    .warning-box {
      background-color: #fff3cd;
      border-left: 4px solid #ffc107;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .warning-box p {
      margin: 0;
      color: #856404;
      font-size: 14px;
    }
    .cta-button {
      display: inline-block;
      background-color: #FF9C00;
      color: white;
      text-decoration: none;
      padding: 14px 32px;
      border-radius: 6px;
      font-weight: 600;
      margin: 20px 0;
      text-align: center;
    }
    .cta-button:hover {
      background-color: #FF7A00;
    }
    .footer {
      background-color: #f8f9fa;
      padding: 30px;
      text-align: center;
      color: #666;
      font-size: 14px;
      border-top: 1px solid #e0e0e0;
    }
    .footer p {
      margin: 5px 0;
    }
    .steps {
      margin: 30px 0;
    }
    .step {
      display: flex;
      align-items: flex-start;
      margin: 20px 0;
    }
    .step-number {
      background-color: #FF9C00;
      color: white;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      flex-shrink: 0;
      margin-right: 15px;
    }
    .step-content {
      flex: 1;
    }
    .step-title {
      font-weight: 600;
      margin-bottom: 5px;
      color: #1a1a1a;
    }
    .step-description {
      color: #666;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Bienvenue sur Santaane</h1>
    </div>
    
    <div class="content">
      <p class="greeting">Bonjour ${data.prenom} ${data.nom},</p>
      
      <p>
        Nous sommes ravis de vous accueillir sur la plateforme Santaane ! 
        Votre compte a été créé avec succès par l'administrateur de la plateforme.
      </p>

      <div class="credentials-box">
        <h3>📧 Vos identifiants de connexion</h3>
        
        <div class="credential-item">
          <div class="credential-label">Email :</div>
          <div class="credential-value">${data.email}</div>
        </div>
        
        <div class="credential-item">
          <div class="credential-label">Mot de passe temporaire :</div>
          <div class="credential-value">${data.temporaryPassword}</div>
        </div>
      </div>

      <div class="warning-box">
        <p>
          ⚠️ <strong>Important :</strong> Pour des raisons de sécurité, vous devrez changer ce mot de passe 
          temporaire lors de votre première connexion.
        </p>
      </div>

      <div class="steps">
        <h3 style="margin-bottom: 20px; color: #1a1a1a;">Comment commencer ?</h3>
        
        <div class="step">
          <div class="step-number">1</div>
          <div class="step-content">
            <div class="step-title">Connectez-vous à la plateforme</div>
            <div class="step-description">
              Cliquez sur le bouton ci-dessous pour accéder à la page de connexion
            </div>
          </div>
        </div>
        
        <div class="step">
          <div class="step-number">2</div>
          <div class="step-content">
            <div class="step-title">Utilisez vos identifiants</div>
            <div class="step-description">
              Saisissez votre email et le mot de passe temporaire fourni ci-dessus
            </div>
          </div>
        </div>
        
        <div class="step">
          <div class="step-number">3</div>
          <div class="step-content">
            <div class="step-title">Changez votre mot de passe</div>
            <div class="step-description">
              Créez un nouveau mot de passe sécurisé pour protéger votre compte
            </div>
          </div>
        </div>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${data.loginUrl}" class="cta-button">
          Se connecter maintenant
        </a>
      </div>

      <p style="color: #666; font-size: 14px; margin-top: 30px;">
        Si vous avez des questions ou besoin d'assistance, n'hésitez pas à contacter notre équipe support.
      </p>
    </div>
    
    <div class="footer">
      <p><strong>Santaane Platform</strong></p>
      <p>Plateforme de gestion scientifique</p>
      <p style="margin-top: 15px; font-size: 12px; color: #999;">
        Cet email a été envoyé automatiquement, merci de ne pas y répondre.
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

export function generateWelcomeEmailText(data: WelcomeEmailData): string {
  return `
Bienvenue sur Santaane !

Bonjour ${data.prenom} ${data.nom},

Nous sommes ravis de vous accueillir sur la plateforme Santaane !
Votre compte a été créé avec succès par l'administrateur de la plateforme.

VOS IDENTIFIANTS DE CONNEXION
==============================
Email : ${data.email}
Mot de passe temporaire : ${data.temporaryPassword}

⚠️ IMPORTANT : Pour des raisons de sécurité, vous devrez changer ce mot de passe 
temporaire lors de votre première connexion.

COMMENT COMMENCER ?
===================
1. Connectez-vous à la plateforme : ${data.loginUrl}
2. Utilisez vos identifiants fournis ci-dessus
3. Changez votre mot de passe pour un mot de passe sécurisé

Si vous avez des questions ou besoin d'assistance, n'hésitez pas à contacter notre équipe support.

Cordialement,
L'équipe Santaane

---
Cet email a été envoyé automatiquement, merci de ne pas y répondre.
  `;
}
