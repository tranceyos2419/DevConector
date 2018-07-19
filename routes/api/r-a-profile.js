const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//* Load Profile Model
const Profile = require('../../models/Profile');

//*Load User Profile
const User = require('../../models/User');

//* Load Input Validation
const validateProfileInput = require('../../validation/v-profile');
const validateExperienceInput = require('../../validation/v-experience');
const validateEducationInput = require('../../validation/v-education');


//* @Route  Get api/profile/test
//* @desc   Tests profile route
//* @access Public
router.get('/test', (req, res) => res.json({
    msg: `Profile works`
}));

//* @Route  Get api/profile/
//* @desc  Get Current User profile
//* @access Private
router.get('/', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    const errors = {};
    Profile.findOne({
            user: req.user.id
        })
        .populate("user", ['name', 'avatar'])
        .then(profile => {
            if (!profile) {
                errors.noprofile = 'There is no profile for this user';
                return res.status(404).json(errors)
            }
            res.json(profile);
        })
        .catch(err => res.status(404).json(err));
})

//* @Route Get api/profile/handle/:handle
//* @desc  Get Profile by handle
//* @access Public
router.get('/handle/:handle', (req, res) => {
    const errors = {};
    Profile.findOne({
            handle: req.params.handle
        })
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if (!profile) {
                errors.noprofile = 'There is no profile for tihs user';
                res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(err => res.status(404).json(err));
})

//* @Route Get api/profile/user/:user_id
//* @desc  Get profile by user ID
//* @access Public
router.get('/user/:user_id', (req, res) => {
    const errors = {};
    Profile.findOne({
            user: req.params.user_id
        })
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if (!profile) {
                errors.noprofile = 'There is no profile for this user';
                res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(err => res.status(404).json({
            profile: 'There is no profile for user'
        }));
})

//* @Route Get api/profile/all
//* @desc  Get all profiles
//* @access Public
router.get('/all', (req, res) => {
    const errors = {};
    Profile.find()
        .populate('user', ['name', 'avatar'])
        .then(profiles => {
            if (!profiles) {
                errors.noprofile = 'There are no profiles';
                return res.status(404).json(errors);
            }
            res.json(profiles);
        })
        .catch(err => res.status(404).json({
            profile: 'There are no profiles'
        }))
})

//* @Route Post api/profile/
//* @desc  Create and Update profile
//* @access Private
router.post('/', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    const {
        errors,
        isValid
    } = validateProfileInput(req.body);
    //Check Validation
    if (!isValid) {
        return res.status(400).json(errors);
    }
    // Get fields
    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubusername) profileFields.githubusername = req.body.githubusername;
    // Skills - Spilt into array
    if (typeof req.body.skills !== 'undefined') {
        profileFields.skills = req.body.skills.split(',');
    }
    // Social
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;
    // Add or Update new profile
    Profile.findOne({
            user: req.user.id
        })
        .then(profile => {
            if (profile) {
                // Update
                Profile.findOneAndUpdate({
                        user: req.user.id
                    }, {
                        $set: profileFields
                    }, {
                        new: true
                    })
                    .then(profile => res.json(profile));
            } else {
                // Create
                // Check if handle exists
                Profile.findOne({
                        handle: profileFields.handle
                    })
                    .then(profile => {
                        if (profile) {
                            errors.handle = 'That handle already exists';
                            res.status(400).json(errors);
                        } else {
                            new Profile(profileFields).save()
                                .then(profile => res.json(profile));
                        }
                    })
            }
        })

})

//* @Route POST api/profile/experience
//* @desc  Add experience
//* @access Private
router.post('/experience', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    const {
        errors,
        isValid
    } = validateExperienceInput(req.body);
    //Check Validation
    if (!isValid) {
        return res.status(400).json(errors);
    }
    Profile.findOne({
            user: req.user.id
        })
        .then(profile => {
            const newExp = {
                title: req.body.title,
                company: req.body.company,
                location: req.body.location,
                from: req.body.from,
                to: req.body.to,
                current: req.body.current,
                description: req.body.description
            }
            //Add to exp array
            profile.experience.unshift(newExp);

            profile.save().then(profile => res.json(profile));
        })
})

//* @Route POST api/profile/education
//* @desc  Add education
//* @access Private
router.post('/education', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    const {
        errors,
        isValid
    } = validateEducationInput(req.body);
    //Check Validation
    if (!isValid) {
        return res.status(400).json(errors);
    }
    Profile.findOne({
            user: req.user.id
        })
        .then(profile => {
            const newEdu = {
                school: req.body.school,
                degree: req.body.degree,
                fieldofstudy: req.body.fieldofstudy,
                from: req.body.from,
                to: req.body.to,
                current: req.body.current,
                description: req.body.description
            }
            //Add to Edu array
            profile.education.unshift(newEdu);

            profile.save().then(profile => res.json(profile));
        })
})

//* @Route DELETE api/profile/experience
//* @desc  Delete
//* @access Private
router.delete('/experience/:exp_id', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    Profile.findOne({
            user: req.user.id
        })
        .then(profile => {
            console.log("profile" + profile);
            // Get remove index
            const removeIndex = profile.experience
                .map(item => item.id)
                .indexOf(req.param.exp_id);

            //Splice out array
            profile.experience.splice(removeIndex, 1);

            //Save
            profile.save().then(profile => res.json(profile));
        })
        .catch(err => res.status(404).json(err));
})

//* @Route DELETE api/profile/education
//* @desc  Delete education
//* @access Private
router.delete('/education/:edu_id', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    Profile.findOne({
            user: req.user.id
        })
        .then(profile => {
            const removeIndex = profile.education
                .map(item => item.id)
                .indexOf(req.param.edu_id)
            profile.education.splice(removeIndex, 1);
            profile.save().then(profile => res.json(profile));
        })
        .catch(err => res.status(404).json(err));
})

//* @Route  DELETE api/profile
//* @desc   Delete user and profile
//* @access Private
router.delete('/', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    Profile.findOneAndRemove({
            user: req.user.id
        })
        .then(() => {
            User.findOneAndRemove({
                    _id: req.user.id
                })
                .then(() => {
                    res.json({
                        success: true
                    })
                })
        })
})


module.exports = router;
