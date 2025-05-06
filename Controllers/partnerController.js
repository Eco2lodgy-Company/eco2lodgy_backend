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


export const updatePartner = async (req, res) => {
  try {
    const { id } = req.params;
    const file = req.file;
    const { name, description, website, user_id } = req.body;

    if (!name || !user_id) {
      return res.status(400).json({ error: 'Certains champs requis sont manquants.' });
    }

    // Préparer les champs à mettre à jour
    const updates = {
      name,
      description: description || null,
      website_url: website || null,
      user_id
    };

    // Si un nouveau fichier est fourni, mettre à jour l'URL du logo
    if (file) {
      updates.logo_url = `/uploads/${file.filename}`;
    }

    // Construire la requête SQL dynamiquement
    const fields = Object.keys(updates).map((key, index) => `${key} = $${index + 1}`);
    const values = Object.values(updates);

    const result = await pool.query(
      `UPDATE partners SET ${fields.join(', ')} WHERE id = $${fields.length + 1} RETURNING *`,
      [...values, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Partenaire non trouvé.' });
    }

    res.status(200).json({
      message: 'Partenaire mis à jour avec succès.',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour du partenaire :', error);
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


  // recuperation d'un partenaire par son id

  export const partnerById = async (req, res) => {
    const { id } = req.params;
  
    if (!id) {
      return res.status(400).json({ error: 'id requis.' });
    }
  
    try {
      const result = await pool.query(
        'SELECT * from partners WHERE id = $1',
        [id]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Utilisateur non trouvé.' });
      }
  
      return res.status(200).json({ partener: result.rows[0] });
  
    } catch (error) {
      console.error('Erreur lors de la récupération de l’utilisateur :', error);
      return res.status(500).json({ error: 'Erreur serveur.' });
    }
  };


  // Suppression d'un partenaire par son id

  export const deleteById = async (req, res) => {
    const { id } = req.params;
  
    if (!id) {
      return res.status(400).json({ error: 'id requis.' });
    }
  
    try {
      const result = await pool.query('DELETE FROM partners WHERE id = $1 RETURNING *', [id]);
  
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'partenaire non trouvé.' });
      }
  
      return res.status(200).json({ message: 'partenaire supprimé avec succès.', user: result.rows[0] });
  
    } catch (error) {
      console.error('Erreur lors de la suppression du patenaire :', error);
      return res.status(500).json({ error: 'Erreur serveur.' });
    }
  };
  
  
