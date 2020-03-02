const userModel = require("../models/user");

exports.acceptRequest= async function(req,res)
{
 
 await userModel.findOneAndUpdate({_id:req.body.myid},{$push:{friendlist:{name:req.body.friendname,id:req.body.friendid,imageFriend:req.body.friendImage}}})
 await userModel.findOneAndUpdate({_id:req.body.friendid},{$push:{friendlist:{name:req.body.Myname,id:req.body.Myid,imageFriend:req.body.MyImage}}})
 await userModel.findOneAndUpdate({_id:req.body.friendId},{$pull:{ReceivedRequests:{name:req.body.friendname,id:req.body.friendid,imageFriend:req.body.MyImage}}})
 await userModel.findOneAndUpdate({_id:req.body.myid},{$pull:{SentRequests:{name:req.body.friendname,id:req.body.friendid,imageFriend:req.body.FriendImage}}})
 return res.status(200).json({message:'request accepted'});

}

exports.rejectRequest=async function(req,res)
{

    await userModel.findOneAndUpdate({_id:req.body.friendId},{$pull:{ReceivedRequests:{name:req.body.MyName,id:req.body.Myid,imageFriend:req.body.MyImage}}})
    await userModel.findOneAndUpdate({_id:req.body.myid},{$pull:{SentRequests:{name:req.body.friendname,id:req.body.friendid,imageFriend:req.body.FriendImage}}})
    return res.status(200).json({message:'request Rejected'});

}

exports.sendRequest=async function(req,res)
{
    await userModel.findOneAndUpdate({_id:req.body.friendId},{$push:{ReceivedRequests:{name:req.body.Myname,id:req.body.Myid,imageFriend:req.body.MyImage}}})
    await userModel.findOneAndUpdate({_id:req.body.myid},{$push:{SentRequests:{name:req.body.friendname,id:req.body.friendid,imageFriend:req.body.friendImage}}})
    return res.status(200).json({message:'request sent successfully'});

}




