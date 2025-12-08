# Guide d'Initialisation de la Base de Données

## 🎯 Vue d'ensemble

MongoDB Atlas **ne crée pas automatiquement** les bases de données. Vous devez les créer manuellement ou via un script.

## ✅ Solution 1 : Initialisation Automatique (Recommandée)

### Étape 1 : Exécuter le script d'initialisation

```bash
npm run init:db
```

Ce script va :

- ✅ Se connecter à MongoDB Atlas
- ✅ Créer la base de données `joelle`
- ✅ Créer les 6 collections requises
- ✅ Ajouter les validateurs de schéma
- ✅ Créer les indexes pour les performances

### Résultat attendu

```
✓ Connected to MongoDB
✓ Using database: joelle
✓ Created collection: users
✓ Created collection: practitioners
✓ Created collection: availability_slots
✓ Created collection: appointments
✓ Created collection: notifications
✓ Created collection: audit_logs
✓ Created index on users: {"email":1}
✓ Created index on practitioners: {"user_id":1}
...
✅ Database initialization completed successfully!
📊 Database: joelle
📦 Collections created: users, practitioners, availability_slots, appointments, notifications, audit_logs
✓ Connection closed
```

## 📋 Collections Créées

### 1. **users**

Stocke les informations des utilisateurs (patients, praticiens, administrateurs)

- Index : `email` (unique)

### 2. **practitioners**

Profils des praticiens

- Index : `user_id` (unique), `specialty`

### 3. **availability_slots**

Créneaux de disponibilité des praticiens

- Index : `practitioner_id`

### 4. **appointments**

Rendez-vous programmés

- Index : `patient_id`, `practitioner_id`, `start_datetime`, `end_datetime`

### 5. **notifications**

Notifications pour les rendez-vous

- Index : `appointment_id`, `status`

### 6. **audit_logs**

Journaux d'audit pour la conformité

- Index : `user_id`, `timestamp`

## 🔍 Vérifier la Création

### Via MongoDB Atlas Dashboard

1. Connectez-vous à [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Allez dans votre cluster **joellehospitaldb**
3. Cliquez sur **Browse Collections**
4. Vous devriez voir la base `joelle` avec toutes les collections

### Via MongoDB Shell (mongosh)

```bash
# Connexion
mongosh mongodb+srv://joelle:hospital@joellehospitaldb.gc8z4xz.mongodb.net/joelle

# Lister les collections
show collections

# Voir les détails d'une collection
db.users.getFullyQualifiedName()
```

## 🚀 Démarrer l'Application

Une fois la base de données initialisée, vous pouvez lancer l'application :

```bash
npm start
```

ou en mode développement avec watch :

```bash
npm run dev
```

## ❌ Solution 2 : Création Manuelle via MongoDB Atlas

Si vous préférez créer manuellement :

1. Allez dans [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Cliquez sur **Browse Collections**
3. Cliquez sur **+ Create Database**
4. Nom : `joelle`
5. Créez les collections manuellement :

   ```
   - users
   - practitioners
   - availability_slots
   - appointments
   - notifications
   - audit_logs
   ```

## 🔧 Variables d'Environnement

Assurez-vous que votre `.env` contient :

```env
MONGO_URI = mongodb+srv://joelle:hospital@joellehospitaldb.gc8z4xz.mongodb.net/joelle?retryWrites=true&w=majority&authSource=admin
PORT = 3000
NODE_ENV = development
```

## 📊 Schémas des Collections

### Users

```javascript
{
  _id: ObjectId,
  first_name: String,
  last_name: String,
  email: String (unique),
  phone: String,
  hashed_password: String,
  role: "patient" | "practitioner" | "admin" | "staff",
  created_at: Date,
  updated_at: Date
}
```

### Practitioners

```javascript
{
  _id: ObjectId,
  user_id: ObjectId (unique),
  specialty: String,
  title: String,
  default_duration: Integer,
  description: String,
  created_at: Date,
  updated_at: Date
}
```

### Availability Slots

```javascript
{
  _id: ObjectId,
  practitioner_id: ObjectId,
  start_datetime: Date,
  end_datetime: Date,
  recurrence_rule: String,
  is_exception: Boolean,
  created_at: Date,
  updated_at: Date
}
```

### Appointments

```javascript
{
  _id: ObjectId,
  patient_id: ObjectId,
  practitioner_id: ObjectId,
  start_datetime: Date,
  end_datetime: Date,
  status: "booked" | "confirmed" | "cancelled" | "no-show",
  created_by: ObjectId,
  created_at: Date,
  updated_at: Date
}
```

### Notifications

```javascript
{
  _id: ObjectId,
  appointment_id: ObjectId,
  type: "confirmation" | "reminder" | "cancellation",
  status: "pending" | "sent" | "failed",
  sent_at: Date,
  created_at: Date,
  updated_at: Date
}
```

### Audit Logs

```javascript
{
  _id: ObjectId,
  user_id: ObjectId,
  action: String,
  details: String,
  timestamp: Date
}
```

## ⚠️ Dépannage

### Erreur : "Connection refused"

- Vérifiez votre adresse IP est whitelistée dans MongoDB Atlas
- Assurez-vous que vos identifiants sont corrects

### Erreur : "Authentication failed"

- Vérifiez le nom d'utilisateur et le mot de passe dans le MONGO_URI
- Assurez-vous que `authSource=admin` est présent

### La base de données existe déjà

- Le script détecte automatiquement si les collections existent
- Il crée uniquement celles qui manquent

## 📚 Ressources

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [MongoDB Driver for Node.js](https://www.mongodb.com/docs/drivers/node/)
- [MongoDB Schema Validation](https://docs.mongodb.com/manual/core/schema-validation/)
