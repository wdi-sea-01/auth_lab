module.exports = {
    //app.get('/movies')
    get_index:function(req,res){
        res.send('this is a list of movies... really.');
    },
    //app.get('/movies/:id')
    get_index_id:function(req,res,id){
        res.send('you got to the movie routes.. id: '+id);
    },
    //app.get('/movies/something/:id/other/:taco')
    get_something_id_other_taco:function(req,res,id,taco){
        res.send('weird route... id: '+id+' taco: '+taco);
    }
}