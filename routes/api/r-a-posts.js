const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const validatePostInput = require('../../validation/v-post');

//* @Route  Get api/posts/test
//* @desc   Tests posts route
//* @access Public
router.get('/test', (req, res) => res.json({
    msg: `Posts works`
}));

//* @Route  Get api/posts/
//* @desc   Get post
//* @access Public
router.get('/', (req, res) =>
    Post.find()
    .sort({
        date: -1
    })
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({
        nopostsfound: 'no posts found'
    }))
)

//* @Route  Get api/posts/:id
//* @desc   Get post by id
//* @access Public
router.get('/:id', (req, res) => {
    Post.findById(req.params.id)
        .then(posts => res.json(posts))
        .catch(err => res.status(404).json({
            nopostsfound: 'no posts found with that id'
        }));
})

//* @Route  POST api/posts/
//* @desc   Create post
//* @access Private
router.post('/', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    console.log(req.body);
    const {
        errors,
        isValid
    } = validatePostInput(req.body);

    // Check Validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    const newPost = new Post({
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.body.user
    });
    newPost.save().then(post => res.json(post));
});

//* @Route  DELETE api/posts/:id
//* @desc   Delete post
//* @access Private
router.delete('/:id', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    Profile.findOne({
            user: req.user.id
        })
        .then(profile => {
            console.log('req.params.id ' + req.params.id);
            //! This is how to remove an object from mongodb
            Post.findOneAndRemove({
                    _id: req.params.id
                })
                .then(() => {
                    res.json({
                        success: true
                    })
                }).catch(err => res.status(404).json({
                    postnotfound: 'no post found'
                }));
            //! not this
            //         post.remove().then(() => res.json({
            //             success: true
            //         }));
            //     })

        })
});

//* @Route  POST api/posts/like/:id
//* @desc   Like a post
//* @access Private
router.post('/like/:id', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    Profile.findOne({ //? why do I need to call Profile.fineOne[]
            user: req.user.id
        })
        .then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    if (
                        post.likes.filter(like => like.user.toString() === req.user.id)
                        .length > 0
                    ) {
                        return res.status(400).json({
                            alreadyliked: 'User already liked this post'
                        });
                    }
                    post.likes.unshift({
                        user: req.user.id
                    });
                    post.save().then(post => res.json(post));
                })
                .catch(err => res.status(404).json({
                    postnotfound: 'No post found'
                }));
        })
});

//* @Route  POST api/posts/unlike/:id
//* @desc   Unlike a post
//* @access Private
router.post('/unlike/:id', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    Profile.findOne({
            user: req.user.id
        })
        .then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    if (
                        post.likes.filter(like => like.user.toString() === req.user.id)
                        .length === 0
                    ) {
                        return res.status(400).json({
                            notliked: 'You have not yet liked the post'
                        });
                    }
                    const removeIndex = post.likes.map(item => item.user.toString())
                        .indexOf(req.user.id);
                    post.likes.splice(removeIndex, 1);
                    post.save().then(post => res.json(post));
                })
                .catch(err => res.status(404).json({
                    postnotfound: 'No post found'
                }));
        })
});

//* @Route  POST api/posts/comment/:id
//* @desc   Add comment to post
//* @access Private
router.post('/comment/:id', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    const {
        errors,
        isValid
    } = validatePostInput(req.body);

    // Check Validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    Post.findById(req.params.id)
        .then(post => {
            const newComment = {
                text: req.body.text,
                name: req.body.name,
                avatar: req.body.avatar,
                user: req.user.id
            }

            // Add to comments array
            post.comments.unshift(newComment);

            // Save
            post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({
            postnotfound: 'No post found'
        }));
});

//* @Route  Delete api/posts/comment/:id/:comment_id
//* @desc   remove comment to post
//* @access Private
router.delete('/comment/:id/:comment_id', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    Post.findById(req.params.id)
        .then(post => {
            if (post.comments.filter(comment => comment._id.toString() === req.params.comment_id).length === 0) {
                res.status(404).json({
                    commentnotexist: 'comment does not exist'
                });
            }
            const removeIndex = post.comments.map(item => item._id.toString()).indexOf(req.params.comment_id);
            // Splice comment out of array
            post.comments.splice(removeIndex, 1);
            post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({
            postnotfound: 'No post found'
        }));
});
module.exports = router;
