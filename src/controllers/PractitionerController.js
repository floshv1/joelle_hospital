import { Practitioner } from "../models/Practitioner.js";

export class PractitionerController {
  
  // --- CRÉATION (C'est ici que tu avais l'erreur 400) ---
  static async createPractitioner(req, res) {
    try {
      const { user_id, specialty, title, description, address } = req.body;

      // Validation simple : on vérifie juste l'essentiel
      if (!user_id || !specialty) {
        return res.status(400).json({ error: "Champs obligatoires manquants (user_id ou specialty)" });
      }

      // On appelle le Modèle pour créer (l'ID sera stocké en texte, c'est OK)
      const practitioner = await Practitioner.create({ 
        user_id, 
        specialty, 
        title, 
        description, 
        address 
      });

      res.status(201).json(practitioner);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // --- LECTURE (C'est ici que la conversion magique du Modèle va servir) ---
  static async getAllPractitioners(req, res) {
    try {
      const { specialty } = req.query;
      
      // On récupère la liste complète (avec les noms grâce au $lookup du Modèle)
      let practitioners = await Practitioner.findAll();

      // Petit filtre si demandé par le frontend
      if (specialty) {
        practitioners = practitioners.filter(p => p.specialty === specialty);
      }

      res.json(practitioners);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // --- SUPPRESSION ---
  static async deletePractitioner(req, res) {
    try {
      const { id } = req.params;
      const success = await Practitioner.delete(id);
      
      if (!success) {
        return res.status(404).json({ error: "Praticien introuvable" });
      }
      
      res.json({ message: "Praticien supprimé avec succès" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
  // --- LECTURE PAR ID ---
  static async getPractitionerById(req, res) {
     try {
      const { id } = req.params;
      const practitioner = await Practitioner.findById(id);
      if (!practitioner) return res.status(404).json({ error: "Not found" });
      res.json(practitioner);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}