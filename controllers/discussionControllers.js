const Comment = require("../models/comment.js");
const Discussion   = require("../models/discussion.js");
const jwt = require("jsonwebtoken");
const JWT_SECRET = 'NEWTONSCHOOL';


/*

modify getAllDiscussion

will return all discussion whose creator (user refernce through creator_id) name contain a substring as name.

/api/v1/discussion/?name=jain
than return all discussion whose creator name contain jain as substring, case insensetive.

/api/v1/discussion
than return all the discussion.

/api/v1/discussion/?heading=theory
than return all discussion whose heading contain theory as substring, case insensetive.

/api/v1/discussion/?name=jain&heading=theory
than return all discussion whose heading contain theory as substring and creator name contain jain as substring, case insensetive.

just write need to update allDiscussion value. you can also modify more codes but don't modify response .

*/

const getAllDiscussion = async (req, res) => {
    const name = req.query.name;
    const heading = req.query.heading;
    
    //Write your code here.
    /* ...  */
    
    const allDiscussion = /* ...  */
    
    res.status(200).json({
      status: "success",
      data: allDiscussion
    });
  };


const createDiscussion = async (req, res) => {

    const {heading, body, token } = req.body;

    try{
        if(!token){
            res.status(401).json({
                status: 'fail',
                message: 'Missing token'
            });
        }
        let decodedToken;
        try{
            decodedToken = jwt.verify(token, JWT_SECRET);
        }catch(err){
            res.status(401).json({
                status: 'fail',
                message: 'Invalid token'
            });
        }
        const newDiscussion = {
            heading,
            body,
            creator_id : decodedToken.userId
        };
        const discussion = await Discussion.create(newDiscussion);
        res.status(200).json({
            message: 'Discussion added successfully',
            discussion_id: discussion._id,
            status: 'success'
        });
    }catch(err){
        res.status(500).json({
            status: 'fail',
            message: err.message
        });
    }
}

const deleteDiscussion = async (req, res) => {

    const id = req.params.id;

    const discussion = await Discussion.findById(id);
    if(!discussion)
    {
        res.status(404).json({
            status: 'fail',
            message: "Given Discussion doesn't exist"
        })
    }

    try{
        await Discussion.findByIdAndDelete(id);
        const comments = await Comment.find({discussionId : id});
        for(let i=0;i<comments.length;i++){
            await Comment.findByIdAndDelete(comments[i]._id);
        }
        res.status(200).json({
            status: 'success',
            message: 'Discussion deleted successfully'
        });
    }catch(err){
        res.status(500).json({
            status: 'fail',
            message: err.message
        })
    }
}

const updateDiscussion = async (req, res) => {

    const id = req.params.id;

    const discussion = await Discussion.findById(id);

    if(!discussion)
    {
        res.status(404).json({
            status: 'fail',
            message: "Given Discussion doesn't exist"
        })
    }

    try{
        await Discussion.findByIdAndUpdate(id, req.body);
        res.status(200).json({
            status: 'success',
            message: 'Discussion updated successfully'
        });
    } catch(err){
        res.status(500).json({
            status: 'fail',
            message: err.message
        })
    };

}

const getDiscussion = async (req, res) => {

    const id = req.params.id;

    try{
        var discussion = await Discussion.findById(id);
        if(!discussion)
        {
            res.status(404).json({
                status: 'fail',
                message: "Given Discussion doesn't exist"
            })
        }
        const comments = await Comment.find({discussionId : id});
        discussion = discussion.toObject();
        discussion['comments'] = comments;
        res.status(200).json({
            status: 'success',
            data: discussion
        })
    }catch(err){
        res.status(500).json({
            status: 'fail',
            message: "Something went Wrong"
        })
    }

}

module.exports = { getAllDiscussion, getDiscussion, createDiscussion, deleteDiscussion, updateDiscussion };
