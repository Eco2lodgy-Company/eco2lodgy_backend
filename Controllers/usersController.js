import pool from '../database/db.js'; // assure-toi que db.js exporte correctement le pool
import bcrypt from 'bcrypt';

export const login = async (req, res) => {
  const { email, password } = req.body;

  // Vérification des champs requis
  if (!email || !password) {
    return res.status(400).json({ error: "Email et mot de passe requis." });
  }

  try {
    // Requête SQL pour trouver l'utilisateur par email
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Identifiants invalides." });
    }

    const user = result.rows[0];

    // Vérification du mot de passe avec bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Identifiants invalides." });
    }

    // Si tout est ok : connexion réussie
    return res.status(200).json({
      message: "Connexion réussie.",
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        // tu peux ajouter d'autres champs ici
      }
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erreur lors de la connexion." });
  }
};
