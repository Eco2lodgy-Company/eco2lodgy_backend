// Controllers/imageController.js
import pool from '../database/db.js';

export const createPost = async (req, res) => {
  try {
    const file = req.file;
    const { title,content,author,user_id } = req.body;

    if (!file) {
      return res.status(400).json({ error: 'Aucune image fournie.' });
    }

    if (!title || !user_id) {
      return res.status(400).json({ error: 'Certains champs requis sont manquants.' });
    }

    const thumbnail_url = `/uploads/${file.filename}`;

    const result = await pool.query(
      `INSERT INTO blog_posts (title,content,thumbnail_url,author, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [title,content,thumbnail_url,author, user_id]
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


export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const file = req.file;
    const { title, content, author, user_id } = req.body;

    if (!title || !user_id) {
      return res.status(400).json({ error: 'Certains champs requis sont manquants.' });
    }

    // Préparer les champs à mettre à jour
    const updates = {
      title,
      content: content || null,
      author: author || null,
      user_id
    };

    // Si un nouveau fichier est fourni, mettre à jour l'URL de la miniature
    if (file) {
      updates.thumbnail_url = `/uploads/${file.filename}`;
    }

    // Construire la requête SQL dynamiquement
    const fields = Object.keys(updates).map((key, index) => `${key} = $${index + 1}`);
    const values = Object.values(updates);

    const result = await pool.query(
      `UPDATE blog_posts SET ${fields.join(', ')} WHERE id = $${fields.length + 1} RETURNING *`,
      [...values, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Article non trouvé.' });
    }

    res.status(200).json({
      message: 'Article mis à jour avec succès.',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'article :', error);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
};


// recuperation de tout les posts

export const getPosts = async (req, res) => {
    try {
      const result = await pool.query('SELECT * from blog_posts');
  
      return res.status(200).json({
        posts: result.rows
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des posts :', error);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  };


  // recuperation d'un post par son id

  export const postById = async (req, res) => {
    const { id } = req.params;
  
    if (!id) {
      return res.status(400).json({ error: 'id requis.' });
    }
  
    try {
      const result = await pool.query(
        'SELECT * from blog_posts WHERE id = $1',
        [id]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'post non trouvé.' });
      }
  
      return res.status(200).json({ post: result.rows[0] });
  
    } catch (error) {
      console.error('Erreur lors de la récupération du post :', error);
      return res.status(500).json({ error: 'Erreur serveur.' });
    }
  };


  // Suppression d'un post par son id

  export const deleteById = async (req, res) => {
    const { id } = req.params;
  
    if (!id) {
      return res.status(400).json({ error: 'id requis.' });
    }
  
    try {
      const result = await pool.query('DELETE FROM blog_posts WHERE id = $1 RETURNING *', [id]);
  
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'post non trouvé.' });
      }
  
      return res.status(200).json({ message: 'post supprimé avec succès.', user: result.rows[0] });
  
    } catch (error) {
      console.error('Erreur lors de la suppression du post :', error);
      return res.status(500).json({ error: 'Erreur serveur.' });
    }
  };
  
  
