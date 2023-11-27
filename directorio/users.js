const {request, response} = require('express');
const bcrypt = require('bcrypt');
const usersModel = require('../models/users');
const pool = require('../db');

//EDPOINT MOSTRAR LISTAS DE JUGADORES
const listplayers = async(req = request, res = response) =>{
    let conn;
    
    try{
        conn = await pool.getConnection();
        const users = await conn.query(usersModel.getUsers, (err) => {
            if (err){
                throw err
            }
            
        });
        res.json(users);
     
    } catch (error){
        console.log(error);
        res.status(500).json(error);
    } finally{
        if (conn) conn.end();
    }
    
}

//EDPOINT MUESTRA UN JUGADOR EN ESPECIFICO
const listplayersbyid = async(req = request, res = response) =>{
    const {id} = req.params;
    if(isNaN(id)){
        res.status(400).json({msg: 'ID invalido'});
        return;
    }
    let conn;
    
    try{
        conn = await pool.getConnection();
        const [user] = await conn.query(usersModel.getbyid, [id],  (err) => {
            if (err){
                throw err
            }
            
        });
        if (!user){
            res.status(404).json({msg: 'Jugador no encontrado'});
            return;
        }


        res.json(user);
     
    } catch (error){
        console.log(error);
        res.status(500).json(error);
    } finally{
        if (conn) conn.end();
    }
}

//EDPOINT AGREGA UN JUGADOR
const addplayer = async(req = request, res = response) =>{
    

    const {
        Nombre,
        Ciudad,
        password,
        Equipo,
        Juegos,
        Carrera = ``,
        is_active = 1

    } = req.body;
    


    if (!Nombre || !Ciudad || !password || !Equipo || !Juegos){
        res.status(400).json({msg: 'Información faltante'});
        return;
    }
    
    let passwordHash
    if (password){
    const saltRounds = 10;
    passwordHash = await bcrypt.hash(password, saltRounds);
    }

    const user = [Nombre, Ciudad, passwordHash, Equipo, Juegos, Carrera, is_active]

    let conn;


    try{

        conn = await pool.getConnection();

        const [usernameuser] = await conn.query(
            usersModel.getByusername,
            [Nombre],
            (err) => {if (err) throw err;}
        );
        if (usernameuser){
            res.status(400).json({msg: `Jugador con nombre de usuario ${Nombre} ya existe`});
            return;
        }
      


        const playeradded = await conn.query(usersModel.addrow, 
            [...user], (err) =>{
            if (err) throw err;
        })

        

        if (playeradded.affectedRows == 0) throw new Error({message: 'Fallo al agregar jugador'});
        res.json({msg: 'Jugador agregrado con exito'});
    }catch(error){
        console.log(error);
        res.status(500).json(error);
    }finally{
        if(conn) conn.end();
    }

}


  //EDPOINT ACTUALIZAR JUGADOR
const updateplayer = async (req, res)=>{
  const {
      Nombre,
      Ciudad,
      password,
      Equipo,
      Juegos,
      Carrera,
      is_active ,
  } = req.body;

const {id} = req.params;
let newUserData=[
  Nombre,
  Ciudad,
  password,
  Equipo,
  Juegos,
  Carrera,
  is_active   
];
let conn;
try{
  conn = await pool.getConnection();
const [playerExists] = await conn.query(
  usersModel.getbyid,
  [id],
  (err) => {if (err) throw err;}
);
if (!playerExists || playerExists.id_active === 0){
  res.status(404).json({msg:'Jugador no encontrado'});
  return;
}
//24-10-2023//
const [usernameUser] = await conn.query(
  usersModel.getByusername,
  [Nombre],
  (err) => {if (err) throw err;}
);
if (usernameUser){
  res.status(409).json({msg:`Jugador con nombre de usuario ${Nombre} ya existe`});
  return;
}


const oldUserData = [
  playerExists.Nombre,
  playerExists.Ciudad,
  playerExists.password,
  playerExists.Equipo,
  playerExists.Juegos,
  playerExists.Carrera,
  playerExists.is_active  
];

newUserData.forEach((userData, index)=> {
  if (!userData){
      newUserData[index] = oldUserData[index];
  }
})

const playerUpdate = await conn.query(
  usersModel.updateUser,
  [...newUserData, id],
  (err) => {if (err) throw err;}
);
if(playerUpdate.affecteRows === 0){
  throw new Error ('Jugador no actualizado');
}
res.json({msg:'Jugador actualizado con éxito'})
}catch (error){
      console.log(error);
      res.status(500).json(error);
  } finally{
      if (conn) conn.end();
  }
};
//termina aqui

//EDPOINT ELMINACION
const deleteplayer = async(req = request, res = response) =>{
    let conn;
    const {id} = req.params;

   

    try{
        conn = await pool.getConnection();
        
        const [playerExist] = await conn.query(
            usersModel.getbyid,
            [id],
            (err) => {throw err; }
        )
        if (!playerExist || playerExist.is_active == 0){
            res.status(404).json({msg: 'JUGADOR NO ENCONTRADO'})
            return;
        }
    
        const playerDeleted = await conn.query(
            usersModel.deleteRow,
            [id],
            (err) => {if (err) throw err;}
        )
        if(playerDeleted.affectedRows == 0){
            throw new Error({msg: 'No se pudo eliminar aL jugador'})
        };
    
        res.json({msg: 'Estado del jugador eliminado con exito'});

    }catch(error){
        console.log(error);
        res.status(500).json(error);
    }finally{
        if (conn) conn.end();
    }
};

const signinplayer = async (req = request, res = response) =>{
  const { Nombre, password } = req.body;

  let conn;

  if (!Nombre || !password) {
    res.status(400).json({msg: 'Se requiere nombre y contraseña' });
    return;
  }

  try{
    conn = await pool.getConnection();

    const [user] = await  pool.query(
      usersModel.getByusername,
      [Nombre],
      (err) => {throw err;}
    );
    if (!user || user.password == 0){
      res.status(404).json({msg: 'Nombre de usuario o contraseña incorrectos'});
      return;
    }

    const passwordOk = await bcrypt.compare(password, user.password);
    if (!passwordOk){
      res.status(404).json({msg: 'Nombre de usuario o contraseña incorrectos'});
      return;
    }
    delete user.password;
    delete user.created_at;
    delete user.updated_at;
    res.json(user);


  }catch(error){
    console.log(error);
    res.status(500).json(error);
  }finally{
    if (conn) conn.release();
  }
};

module.exports = {
  listplayers, 
  listplayersbyid, 
  addplayer, 
  deleteplayer, 
  updateplayer, 
signinplayer};