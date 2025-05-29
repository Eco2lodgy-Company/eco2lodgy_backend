// Controllers/imageController.js
import pool from '../database/db.js';

export const createProject = async (req, res) => {
  try {
    const files = req.files; // changement ici
    const { title, description, projectType, user_id } = req.body;

    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'Aucune image fournie.' });
    }

    if (!title || !user_id) {
      return res.status(400).json({ error: 'Certains champs requis sont manquants.' });
    }

    // Crée un tableau d'URLs
    const image_url = files.map(file => `/uploads/${file.filename}`);

    const result = await pool.query(
      `INSERT INTO projects (title, description, image_url, project_type, user_id)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [title, description, image_url, projectType, user_id]
    );

    res.status(201).json({
      message: 'Images et données enregistrées.',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Erreur upload images :', error);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
};




export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const file = req.file;
    const { title, description, projectType, user_id } = req.body;

    if (!title || !user_id) {
      return res.status(400).json({ error: 'Certains champs requis sont manquants.' });
    }

    // Préparer les champs à mettre à jour
    const updates = {
      title,
      description: description || null,
      project_type: projectType || null,
      user_id
    };

    // Si un nouveau fichier est fourni, mettre à jour l'URL de l'image
    if (file) {
      updates.image_url = `/uploads/${file.filename}`;
    }

    // Construire la requête SQL dynamiquement
    const fields = Object.keys(updates).map((key, index) => `${key} = $${index + 1}`);
    const values = Object.values(updates);

    const result = await pool.query(
      `UPDATE projects SET ${fields.join(', ')} WHERE id = $${fields.length + 1} RETURNING *`,
      [...values, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Projet non trouvé.' });
    }

    res.status(200).json({
      message: 'Projet mis à jour avec succès.',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour du projet :', error);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
};


// recuperation de tout les projets

export const getProjects = async (req, res) => {
    try {
      const result = await pool.query('SELECT * from projects');
  
      return res.status(200).json({
        projects: result.rows
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des projets :', error);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  };


  // recuperation d'un projet par son id

  export const projectById = async (req, res) => {
    const { id } = req.params;
  
    if (!id) {
      return res.status(400).json({ error: 'id requis.' });
    }
  
    try {
      const result = await pool.query(
        'SELECT * from projects WHERE id = $1',
        [id]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'projet non trouvé.' });
      }
  
      return res.status(200).json({ projet: result.rows[0] });
  
    } catch (error) {
      console.error('Erreur lors de la récupération du projet :', error);
      return res.status(500).json({ error: 'Erreur serveur.' });
    }
  };


  // Suppression d'un projet par son id

  export const deleteById = async (req, res) => {
    const { id } = req.params;
  
    if (!id) {
      return res.status(400).json({ error: 'id requis.' });
    }
  
    try {
      const result = await pool.query('DELETE FROM projects WHERE id = $1 RETURNING *', [id]);
  
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'projet non trouvé.' });
      }
  
      return res.status(200).json({ message: 'projet supprimé avec succès.', user: result.rows[0] });
  
    } catch (error) {
      console.error('Erreur lors de la suppression du projet :', error);
      return res.status(500).json({ error: 'Erreur serveur.' });
    }
  };
  
  
