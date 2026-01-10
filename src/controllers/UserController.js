import { User } from "../models/User.js"; 

export class UserController {
  
  static async getAllUsers(req, res) {
    try {
      const users = await User.findAll();
      const safeUsers = users.map(u => {
          const { hashedPassword, ...rest } = u;
          return rest;
      });
      res.json(safeUsers);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Récupérer un utilisateur par ID
  static async getUserById(req, res) {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ error: "Utilisateur introuvable" });
      
      const { hashedPassword, ...safeUser } = user;
      res.json(safeUser);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Supprimer un utilisateur
  static async deleteUser(req, res) {
    try {
      await User.delete(req.params.id);
      res.json({ message: "Utilisateur supprimé" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}