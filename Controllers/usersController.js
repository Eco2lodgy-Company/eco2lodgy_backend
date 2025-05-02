import pool from '../database/db.js'; // assure-toi que db.js exporte correctement le pool
import bcrypt from 'bcrypt';


export const createUser = async (req, res) => {
    const { username, email, password } = req.body;
  
    // Vérification des champs requis
    if (!username || !email || !password) {
      return res.status(400).json({ error: "Tous les champs sont requis." });
    }
  
    try {
      // Vérifie si l'email existe déjà
      const emailCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      if (emailCheck.rows.length > 0) {
        return res.status(400).json({ error: "Cet email est déjà utilisé." });
      }
  
      // Hash du mot de passe
      const saltRounds = 10;
      const password_hash = await bcrypt.hash(password, saltRounds);
  
      // Insertion dans la base
      const result = await pool.query(
        'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email',
        [username, email, password_hash]
      );
  
      const newUser = result.rows[0];
  
      return res.status(201).json({
        message: "Utilisateur créé avec succès.",
        user: newUser
      });
  
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erreur lors de la création de l'utilisateur." });
    }
  };

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
        username: user.username,
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



export const getUsers = async (req, res) => {
    try {
      const result = await pool.query('SELECT id, username, email, role FROM users');
  
      return res.status(200).json({
        users: result.rows
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs :', error);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  };



  export const getUserByEmail = async (req, res) => {
    const { email } = req.params;
  
    if (!email) {
      return res.status(400).json({ error: 'Email requis.' });
    }
  
    try {
      const result = await pool.query(
        'SELECT id, username, email, role FROM users WHERE email = $1',
        [email]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Utilisateur non trouvé.' });
      }
  
      return res.status(200).json({ user: result.rows[0] });
  
    } catch (error) {
      console.error('Erreur lors de la récupération de l’utilisateur :', error);
      return res.status(500).json({ error: 'Erreur serveur.' });
    }
  };
  


  export const deleteUserByEmail = async (req, res) => {
    const { email } = req.params;
  
    if (!email) {
      return res.status(400).json({ error: 'Email requis.' });
    }
  
    try {
      const result = await pool.query('DELETE FROM users WHERE email = $1 RETURNING *', [email]);
  
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Utilisateur non trouvé.' });
      }
  
      return res.status(200).json({ message: 'Utilisateur supprimé avec succès.', user: result.rows[0] });
  
    } catch (error) {
      console.error('Erreur lors de la suppression de l’utilisateur :', error);
      return res.status(500).json({ error: 'Erreur serveur.' });
    }
  };
  