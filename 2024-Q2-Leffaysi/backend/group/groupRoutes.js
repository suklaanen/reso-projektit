const express = require('express');
const router = express.Router();
const groupService = require('./groupService')
const { auth, optionalAuth } = require('../middleware/auth');

//router.use(express.json());

// kaikki nämä ovat käytössä
router.get('/group', groupService.getAllGroups);
router.get('/group/groupid/:groupname', groupService.getGroupIdByName);
router.get('/group/:groupid', groupService.getGroupById);
router.put('/group/:groupid', groupService.updateGroupById);
router.post('/group', auth, groupService.createGroup);
router.delete('/group/:groupid', auth, groupService.deleteGroupById);
router.get('/grouplist/profile/:profilename/:pending', groupService.getGroupsByProfilename);
router.get('/memberlist/group/:groupid/:pending', groupService.GetMemberList);
router.get('/messages/:groupid', groupService.getMessagesById);
router.post('/messages', auth, groupService.createMessage);
router.delete('/messages/:messageid', auth, groupService.deleteMessage);
router.get('/memberstatus/:profileid/:groupid', groupService.getMemberStatus);
router.post('/memberstatus/:profileid/:mainuser/:groupid/:pending', auth, groupService.createMember);
router.put('/memberstatus/:memberlistid/:pending', auth, groupService.updateMemberStatus);
router.put('/memberrank/:memberlistid/:mainuser', auth, groupService.updateMemberRank);
router.delete('/memberstatus/:memberlistid', auth, groupService.deleteMember);
router.delete('/memberlist/:groupid', auth, groupService.deleteMemberlist);
router.get('/groups/getnewest', groupService.getNewestGroup);
router.get('/groups/getpopular', groupService.getPopularGroup);
router.get('/group/groupname/:groupid', groupService.getGroupNameById);
router.post('/memberlist', auth, groupService.createMemberList);
router.get('/grouplist', auth, groupService.getUserGroups);

module.exports = router;
