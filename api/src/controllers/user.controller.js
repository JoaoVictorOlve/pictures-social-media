const User = require('../database/models/user.model');
const Post = require('../database/models/post.model');
const emailValidator = require('deep-email-validator');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const isStrongPassword = require('../middleware/isStrongPassword')

const countUsers = async () => {
  const count = await User.count({
    where: {
      status: {
        [Op.ne]: 'deleted'
      }
    }
  });
  return count;
};

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

async function registerUser(req, res) {
  const { name, email, password } = req.body;
  if(!name || !email || !password || 
    typeof(name) !== 'string' || typeof(email) !== 'string' ||
    typeof(password) !== 'string'){
   return res.status(400).json({ error: 'Campo inválido.' });
 }

  const {valid} = await emailValidator.validate(email);

  if (!valid) {
  return res.status(400).send({
    error: "Favor informar um e-mail válido."
  })
  }

  if(isStrongPassword(password) == false){
    return res.status(400).send({
      error: "Favor informar uma senha válida."
    })
  }

  const duplicatedEmail = await User.findOne({
    where: {
      email: {
        [Op.eq]: email // Use the Sequelize operator for equality
      }
    }
  });

  if(duplicatedEmail){
    return res.status(400).send({
      error: "Já existe um usuário com este e-mail."
    })
  }

  const salt = await bcrypt.genSalt(12)
  const encryptedPassword = await bcrypt.hash(password, salt)

  try {
    const newUser = await User.create({ name, email, password:encryptedPassword });

    const { id } = await newUser.toJSON();

    await newUser.save()

    res.status(201).json({msg: 'Usuário criado com sucesso!'})

  } catch (error) {
    res.status(500).json({ error: 'Erro interno no servidor.' });
  }
}

async function loginUser(req, res) {

  const { email, password } = req.body;

  const user = await User.findOne({
    where: {
      email: {
        [Op.eq]: email // Use the Sequelize operator for equality
      }
    }
  });

  if (!user || user.status == 'deleted') {
    res.status(404).json({ error: 'Usuário não encontrado!'});
  } 

  const checkPassword = await bcrypt.compare(password, user.password)

  if(!checkPassword){
      return res.status(404).json({ error : 'Senha inválida!'})
  }


  try{

    const secret = process.env.SECRET;

    user.password = undefined;

    const token = jwt.sign(
        {
        id: user.id
        },
        secret
        )
        res.cookie('authorization', token)
        res.status(200).json({ msg: 'Autenticação realizada com sucesso!', user:user})

} catch(error){
    console.log(error)
    res.status(500).json({ error :'Erro interno no servidor'})
}

}

async function searchUser(req, res) {
  const { key } = req.params;
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

    const postsResult = await User.findAndCountAll({
      where: {
        status: {
          [Op.ne]: 'deleted'
        },
        name:key
      },
      order: [['id', 'DESC']],
      limit: limit,
      offset: offset
    });

    const next = offset + limit;
    const total = await countUsers()
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
            name: postItem.name,
            email: postItem.email,
          }))
        });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
}

async function getId(req, res){
  const decodedId = req.userId;

  res.status(200).json({ id: decodedId })
}

async function getUserPosts(req,res){
  const { id } = req.params;
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
      where: {
        status: {
          [Op.ne]: 'deleted'
        },
        user_id: id
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

module.exports = {
  registerUser,
  loginUser,
  searchUser,
  getUserPosts,
  getId
};
