module.exports = {
    get_index:function(req,res){
        var user = req.getUser();
        res.render('index',{user:user});
    }
}