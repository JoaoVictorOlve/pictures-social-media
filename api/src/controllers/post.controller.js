const { Op } = require('sequelize');
const User = require('../database/models/user.model');
const Post = require('../database/models/post.model');
const omit = require('just-omit');

const countPosts = async () => {
  const count = await Post.count({
    where: {
      status: {
        [Op.ne]: 'deleted'
      }
    }
  });
  return count;
};

async function getAllPosts(req, res) {
  try {
    let {limit, offset} = req.query;

    limit = Number(limit);
    offset = Number(offset);

    if(!limit){
      limit = 16;
    }
    if(!offset){
      offset = 0;
    }

    console.log(limit, offset);

    const postsResult = await Post.findAndCountAll({
      include: [
        {
          model: User,
          attributes: { exclude: ['password'] }, // Exclude the 'password' field
        },
      ],
      where: {
        status: {
          [Op.ne]: 'deleted'
        }
      },
      order: [['id', 'DESC']],
      limit: limit,
      offset: offset
    });

    const next = offset + limit;
    const total = await countPosts()
    const currentUrl = req.baseUrl;
    console.log(currentUrl)

    const nextUrl = next < total ? `${currentUrl}+?limit=${limit}&offset=${next}` : null;

    const previous = offset - limit < 0 ? null : offset - limit;
    const previousUrl = previous != null ? `${currentUrl}+?limit=${limit}&offset=${previous}` : null;

    const posts = postsResult.rows;

        res.send({
          nextUrl,
          previousUrl,
          limit,
          offset,
          total,
          results: posts.map(postItem => ({
            id: postItem.id,
            description: postItem.description,
            image: postItem.image,
            user_id: postItem.user_id,
            User: postItem.User,
          }))
        });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
}

async function getPostById(req, res) {
  const { id } = req.params;
  try {
    const post = await Post.findByPk(id, {include: [
        {
          model: User,
          attributes: { exclude: ['password'] }, // Exclude the 'password' field
        },
      ]});
    if (post && post.status !== 'deleted') {
      res.status(200).json(post);
    } else {
      res.status(404).json({ error: 'Post não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
}

async function createPost(req, res) {
  let { user_id, description } = req.body;

  if(!user_id || !description ||
    typeof(user_id) !== 'number' || typeof(description) !== 'string'){
   return res.status(400).json({ error: 'Campo inválido' });
 }
  try {
    const image = "nodata";
    const newPost = await Post.create({ user_id, description , image});
    res.status(201).json(newPost);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
}

async function updatePost(req, res) {
  const { id } = req.params;
  const { description, image } = req.body;

  if(!description || !image ||
    typeof(description) !== 'string' || typeof(image) !== 'string'){
   return res.status(400).json({ error: 'Campo inválido' });
 }
  try {
    const post = await Post.findByPk(id);
    if (post && post.status !== 'deleted') {
      post.description = description;
      post.image = image;

      await post.save();
      res.json({message: 'Post atualizado com sucesso!'});
    } else {
      res.status(404).json({ error: 'Post não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
}

async function deletePost(req, res) {
  const { id } = req.params;
  try {
    const post = await Post.findByPk(id);
    if (post) {
      post.status = 'deleted';
      await post.save();
      res.json({ message: 'Post excluído com sucesso' });
    } else {
      res.status(404).json({ error: 'Post não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
}

async function uploadImage(req, res) {
  const imagePath = req.file ? req.file.path : null;
  const { id } = req.params;

  if (!imagePath) {
    return res.status(400).json({ error: 'No image uploaded' });
  }

  const post = await Post.findByPk(id);

  if (post) {
  const updatedPath = imagePath.replace(/\\/g, '/');
  post.image = updatedPath;
  post.save();
  res.json({ message: 'Upload realizado com sucesso!' });
  } else {
  res.status(404).json({ error: 'Usuário não encontrado' });
  }

}

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  uploadImage
};
