const userModel = require("../models/user");

exports.acceptRequest= async function(req,res)
{
 await userModel.findOneAndUpdate({_id:req.params.myid},{$push:{friendlist:{name:req.body.friendname,title:req.body.friendtitle,iduser:req.params.friendid,imageFriend:req.body.FriendImage}}})
 await userModel.findOneAndUpdate({_id:req.params.friendid},{$push:{friendlist:{name:req.body.myname,title:req.body.mytitle,iduser:req.params.myid,imageFriend:req.body.MyImage}}})
 await userModel.findOneAndUpdate({_id:req.params.friendid},{$pull:{ReceivedRequests:{name:req.body.myname,title:req.body.mytitle,iduser:req.params.myid,imageFriend:req.body.MyImage}}})
 await userModel.findOneAndUpdate({_id:req.params.myid},{$pull:{SentRequests:{name:req.body.friendname,title:req.body.friendtitle,iduser:req.params.friendid,imageFriend:req.body.FriendImage}}})
 return res.status(200).json({message:'request accepted'});
}
exports.deleteFriend=async function(req,res)
{
    await userModel.findOneAndUpdate({_id:req.params.friendid},{$pull:{friendlist:{name:req.body.myname}}})
    await userModel.findOneAndUpdate({_id:req.params.myid},{$pull:{friendlist:{name:req.body.friendname}}})
    return res.status(200).json({message:"friend deleted"});
}

exports.rejectRequest=async function(req,res)
{
    await userModel.findOneAndUpdate({_id:req.params.friendid},{$pull:{ReceivedRequests:{name:req.body.myname,title:req.body.mytitle,iduser:req.params.myid,imageFriend:req.body.MyImage}}})
    await userModel.findOneAndUpdate({_id:req.params.myid},{$pull:{SentRequests:{name:req.body.friendname,title:req.body.friendtitle,iduser:req.params.friendid,imageFriend:req.body.FriendImage}}})
    return res.status(200).json({message:'request Rejected'});

}


exports.sendRequest=async function(req,res)
{   
    await userModel.findOneAndUpdate({_id:req.params.friendid},{$push:{ReceivedRequests:{name:req.body.myname,title:req.body.mytitle,iduser:req.params.myid,imageFriend:req.body.MyImage}}})
    await userModel.findOneAndUpdate({_id:req.params.myid},{$push:{SentRequests:{name:req.body.friendname,title:req.body.friendtitle,iduser:req.params.friendid,imageFriend:req.body.FriendImage}}})
    return res.status(200).json({message:'request sent successfully'});
}




