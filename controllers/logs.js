const { readLogs } =require("../lib/helpers");
module.exports= {
    logsController:function(req,res,next){
        try{
            readLogs(
                function(err,str){
                    if (err){
                        res.status(500).send("Unable to read logs")
                    }
                    else{
                        res.set({
                            "Content-Type":"text/plain"
                        });
                        res.status(200).send(str);
                    }
                }
            )
        }
        catch(err){
            console.log(err);
        }
        
    }
}