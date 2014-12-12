module.exports = {
    get_index:function(req,res){
        if(req.getUser()){
            res.render('restricted');
        }else{
            res.send('ACCESS DENIED!!!');
        }
    }
}