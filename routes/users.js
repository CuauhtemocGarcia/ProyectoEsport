const {Router} = require('express');
const {listplayers, 
    listplayersbyid, 
    addplayer, deleteplayer, 
    updateplayer, signinplayer} = require('../directorio/users')

const router = Router();

//http://localhost:3000/api/v1/esports/
router.get('/', listplayers);
router.get('/:id', listplayersbyid);
router.post('/', signinplayer);
router.put('/', addplayer);
router.patch('/:id', updateplayer);
router.delete('/:id',deleteplayer)

module.exports = router;