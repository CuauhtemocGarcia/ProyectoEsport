const usersModel = {
    getUsers: `
    SELECT 
    * 
    FROM 
    esports`,
    
    getbyid:`
    SELECT
    *
    FROM
    esports
    WHERE
    id= ?
    `,
    addrow:`
    INSERT INTO
       esports(
        Nombre,
        Ciudad,
        password,
        Equipo,
        Juegos,
        Carrera,
        is_active

       ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    getByusername:`
    SELECT 
         *
     FROM
     esports
     WHERE
     Nombre = ?
    `,

    updateUser: `
         UPDATE esports
         SET 
             Nombre = ?,
             Ciudad = ?,
             password = ?,
             Equipo = ?,
             Juegos = ?,
             Carrera = ?,
             is_active = ?
         WHERE
             id = ?
  `,

    deleteRow:`
       UPDATE
          esports
       SET
            is_active = 0
       WHERE
          id = ?
    `,
}

module.exports = usersModel;