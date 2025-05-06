// Controllers/imageController.js
import pool from '../database/db.js';

export const createMember = async (req, res) => {
  try {
    const file = req.file;
    const { name,role,departement, description, user_id } = req.body;

    if (!file) {
      return res.status(400).json({ error: 'Aucune image fournie.' });
    }

    if (!name || !user_id) {
      return res.status(400).json({ error: 'Certains champs requis sont manquants.' });
    }

    const photo_url = `/uploads/${file.filename}`;

    const result = await pool.query(
      `INSERT INTO team_members (name,role,departement,photo_url, description, user_id) VALUES ($1, $2, $3, $4, $5,$6) RETURNING *`,
      [name,role,departement,photo_url, description, user_id]
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


export const updateMember = async (req, res) => {
  try {
    const { id } = req.params;
    const file = req.file;
    const { name, role, departement, description, user_id } = req.body;

    if (!name || !user_id) {
      return res.status(400).json({ error: 'Certains champs requis sont manquants.' });
    }

    // Préparer les champs à mettre à jour
    const updates = {
      name,
      role: role || null,
      departement: departement || null,
      description: description || null,
      user_id
    };

    // Si un nouveau fichier est fourni, mettre à jour l'URL de la photo
    if (file) {
      updates.photo_url = `/uploads/${file.filename}`;
    }

    // Construire la requête SQL dynamiquement
    const fields = Object.keys(updates).map((key, index) => `${key} = $${index + 1}`);
    const values = Object.values(updates);

    const result = await pool.query(
      `UPDATE team_members SET ${fields.join(', ')} WHERE id = $${fields.length + 1} RETURNING *`,
      [...values, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Membre non trouvé.' });
    }

    res.status(200).json({
      message: 'Membre mis à jour avec succès.',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour du membre :', error);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
};



// recuperation de tout les membres

export const getMembers = async (req, res) => {
    try {
      const result = await pool.query('SELECT * from team_members');
  
      return res.status(200).json({
        members: result.rows
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des equipes :', error);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  };


  // recuperation d'un membre par son id

  export const memberById = async (req, res) => {
    const { id } = req.params;
  
    if (!id) {
      return res.status(400).json({ error: 'id requis.' });
    }
  
    try {
      const result = await pool.query(
        'SELECT * from team_members WHERE id = $1',
        [id]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'membre non trouvé.' });
      }
  
      return res.status(200).json({ member: result.rows[0] });
  
    } catch (error) {
      console.error('Erreur lors de la récupération du membre :', error);
      return res.status(500).json({ error: 'Erreur serveur.' });
    }
  };


  // Suppression d'un membre par son id

  export const deleteById = async (req, res) => {
    const { id } = req.params;
  
    if (!id) {
      return res.status(400).json({ error: 'id requis.' });
    }
  
    try {
      const result = await pool.query('DELETE FROM team_members WHERE id = $1 RETURNING *', [id]);
  
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'membre non trouvé.' });
      }
  
      return res.status(200).json({ message: 'membre supprimé avec succès.', user: result.rows[0] });
  
    } catch (error) {
      console.error('Erreur lors de la suppression du membre :', error);
      return res.status(500).json({ error: 'Erreur serveur.' });
    }
  };
  
  
