import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { findUserByEmail, createUser } from '../models/User.js'; // Vérifie bien la majuscule du fichier User.js
import dotenv from 'dotenv';

dotenv.config();

// --- LOGIN ---
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Vérif basique
    if (!email || !password) return res.status(400).json({ error: "Email et mot de passe requis" });

    // 2. Récupération de l'user
    const user = await findUserByEmail(email);
    if (!user) return res.status(401).json({ error: "Email incorrect" });

    // --- DEBUG LOG (Regarde ton terminal !) ---
    console.log(`🔍 Tentative de login pour ${email}`);
    console.log("   Mot de passe en base (hashedPassword) :", user.hashedPassword ? "PRÉSENT" : "ABSENT ❌");
    console.log("   Mot de passe en base (hashed_password) :", user.hashed_password ? "PRÉSENT (Mauvais format)" : "ABSENT");

    // 3. Vérification du mot de passe
    // On s'assure qu'on a bien quelque chose à comparer
    const storedHash = user.hashedPassword || user.hashed_password; // On tente les deux pour être gentil, mais on veut hashedPassword
    
    if (!storedHash) {
        console.error("❌ ERREUR FATALE : L'utilisateur en base n'a pas de mot de passe crypté !");
        return res.status(500).json({ error: "Compte corrompu (pas de mot de passe). Veuillez recréer le compte." });
    }

    const isMatch = await bcrypt.compare(password, storedHash);
    
    if (!isMatch) return res.status(401).json({ error: "Mot de passe incorrect" });

    // 4. Token
    const token = jwt.sign(
      { userId: user._id, role: user.role }, 
      process.env.JWT_SECRET || 'secret_temp',              
      { expiresIn: '24h' }                  
    );

    res.status(200).json({
      message: "Login successful",
      token: token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// --- REGISTER ---
export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password, role } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: "Tous les champs sont requis" });
    }

    const userExists = await findUserByEmail(email);
    if (userExists) return res.status(400).json({ error: "Email déjà utilisé" });

    // Hashage
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Création (On envoie bien hashedPassword en camelCase)
    const newUser = await createUser({
      role: role || 'patient',
      firstName,
      lastName,
      email,
      phone,
      hashedPassword // <--- C'est lui qui est important
    });

    res.status(201).json({
      message: "Compte créé",
      user: { id: newUser._id, email: newUser.email }
    });

  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};