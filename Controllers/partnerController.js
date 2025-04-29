// Controllers/imageController.js
import pool from '../database/db.js';

export const createPartner = async (req, res) => {
  try {
    const file = req.file;
    const { name, description,website, user_id } = req.body;

    if (!file) {
      return res.status(400).json({ error: 'Aucune image fournie.' });
    }

    if (!name || !user_id) {
      return res.status(400).json({ error: 'Certains champs requis sont manquants.' });
    }

    const logo_url = `/uploads/${file.filename}`;

    const result = await pool.query(
      `INSERT INTO partners (name, description,logo_url,website_url, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, description || null,logo_url,website ||null, user_id]
    );

    res.status(201).json({
      message: 'Image et données enregistrées.',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Erreur upload image :', error);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
};



// recuperation de tout les partenaires

export const getPartners = async (req, res) => {
    try {
      const result = await pool.query('SELECT * from partners');
  
      return res.status(200).json({
        partners: result.rows
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs :', error);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  };
