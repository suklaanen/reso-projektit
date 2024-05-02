const groupModel = require('./groupModel');


const getNewestGroup = async (req, res) => {
    try {
        const newestGroup = await groupModel.getNewestGroup();
        res.json(newestGroup);
    } catch (error) {
        console.error('Error fetching newest group:', error);
        res.status(500).send('Error fetching newest group');
    }
};

const getPopularGroup = async (req, res) => {
    try {
        const popularGroup = await groupModel.getPopularGroup();
        res.json(popularGroup);
    } catch (error) {
        console.error('Error fetching popular group:', error);
        res.status(500).send('Error fetching popular group');
    }
};

async function getAllGroups(req, res) {
    try {
        const groups = await groupModel.getAllGroups();
        res.json(groups);
    } catch (error) {
        console.error('Virhe haettaessa ryhmiä:', error);
        res.status(500).send('Virhe haettaessa ryhmiä');
    }
}

async function getGroupNameById(req, res) {
    const groupid = req.params.groupid;
    try {
        const groupName = await groupModel.getGroupNameById(groupid);
        res.json(groupName);
    } catch (error) {
        console.error('Virhe haettaessa ryhmän nimeä:', error);
        res.status(500).send('Virhe haettaessa ryhmän nimeä');
    }
}

async function getGroupIdByName(req, res) {
    const groupname = req.params.groupname;
    try {
        const groupId = await groupModel.getGroupIdByName(groupname);
        res.json(groupId);
    } catch (error) {
        console.error('Virhe haettaessa ryhmän id:tä:', error);
        res.status(500).send('Virhe haettaessa ryhmän id:tä');
    }
}

async function getGroupById(req, res) {
    const groupid = req.params.groupid;
    try {
        const group = await groupModel.getGroupById(groupid);
        res.json(group);
    } catch (error) {
        console.error('Virhe haettaessa ryhmää:', error);
        res.status(500).send('Virhe haettaessa ryhmää');
    }
}

async function deleteGroupById(req, res) {
    const groupid = req.params.groupid;
    try {
        await groupModel.deleteGroupById(groupid);
        res.send('Ryhmä poistettu onnistuneesti');
    } catch (error) {
        console.error('Virhe poistettaessa ryhmää:', error);
        res.status(500).send('Virhe poistettaessa ryhmää');
    }
}

async function updateGroupById(req, res) {
    const groupid = req.params.groupid;
    const { grouppicurl, groupexplanation } = req.body;
    try {
        await groupModel.updateGroupById(groupid, grouppicurl, groupexplanation);
        res.send('Ryhmän tiedot päivitetty onnistuneesti');
    } catch (error) {
        console.error('Virhe päivitettäessä ryhmää:', error);
        res.status(500).send('Virhe päivitettäessä ryhmää' + error);
    }
}

async function createGroup(req, res) {
    const groupname = req.body.groupname;
    try {
        const groupid = await groupModel.createGroup(groupname);
        res.send(groupid);
    } catch (error) {
        console.error('Virhe luotaessa ryhmää:', error);
        res.status(500).send('Virhe luotaessa ryhmää');
    }
}

async function createMember(req, res) {
    const groupid = req.params.groupid;
    const mainuser = req.params.mainuser;
    const profileid = req.params.profileid;
    const pending = req.params.pending;
    try {
        await groupModel.createMember(groupid, mainuser, profileid, pending);
        res.send('Uusi jäsen lisätty onnistuneesti ryhmään');
    } catch (error) {
        console.error('Virhe lisätessä jäsentä ryhmään:', error);
        res.status(500).send('Virhe lisätessä jäsentä ryhmään');
    }
}

async function updateMemberStatus(req, res) {
    const memberlistid = req.params.memberlistid;
    const pending = req.params.pending;
    try {
        await groupModel.updateMemberStatus(memberlistid, pending);
        res.send('Jäsenen tila päivitetty onnistuneesti');
    } catch (error) {
        console.error('Virhe päivitettäessä jäsenen tilaa:', error);
        res.status(500).send('Virhe päivitettäessä jäsenen tilaa');
    }
}

async function updateMemberRank(req, res) {
    const memberlistid = req.params.memberlistid;
    const mainuser = req.params.mainuser;
    try {
        await groupModel.updateMemberRank(memberlistid, mainuser);
        res.send('Jäsenen tila päivitetty onnistuneesti');
    } catch (error) {
        console.error('Virhe päivitettäessä jäsenen tilaa:', error);
        res.status(500).send('Virhe päivitettäessä jäsenen tilaa');
    }
}

async function createMessage(req, res) {
    const { profileid, groupid, message } = req.body;
    try {
        await groupModel.createMessage(profileid, groupid, message);
        res.send('Uusi viesti lisätty onnistuneesti ryhmään');
    } catch (error) {
        console.error('Virhe lisättäessä viestiä ryhmään:', error);
        res.status(500).send('Virhe lisättäessä viestiä ryhmään');
    }
}

async function deleteMessage(req, res) {
    const messageid = req.params.messageid;
    try {
        await groupModel.deleteMessage(messageid);
        res.send('viesti poistettu onnistuneesti');
    } catch (error) {
        console.error('Virhe poistettaessa viestiä:', error);
        res.status(500).send('Virhe poistettaessa viestiä');
    }
}

async function getUserGroups(req, res) {
    const profileid = res.locals.profileid;
    try {
        const groups = await groupModel.getUserGroups(profileid);
        res.json(groups);
    } catch (error) {
        console.error('Virhe haettaessa käyttäjän ryhmiä:', error);
        res.status(500).send('Virhe haettaessa käyttäjän ryhmiä');
    }
}

async function getGroupsByProfilename(req, res) {
    const profilename = req.params.profilename;
    const pending = req.params.pending;
    try {
        const groups = await groupModel.getGroupsByProfilename(profilename, pending);
        res.json(groups);
    } catch (error) {
        console.error('Virhe haettaessa käyttäjän ryhmiä profilenimen perusteella:', error);
        res.status(500).send('Virhe haettaessa käyttäjän ryhmiä profilenimen perusteella');
    }
}

async function GetMemberList(req, res) {
    const groupid = req.params.groupid;
    const pending = req.params.pending;
    try {
        const memberList = await groupModel.GetMemberList(groupid, pending);
        res.json(memberList);
    } catch (error) {
        console.error('Virhe haettaessa jäsenluetteloa:', error);
        res.status(500).send('Virhe haettaessa jäsenluetteloa');
    }
}

async function getMemberStatus(req, res) {
    const profileid = req.params.profileid;
    const groupid = req.params.groupid;
    try {
        const memberStatus = await groupModel.getMemberStatus(profileid, groupid);
        res.json(memberStatus[0]);
    } catch (error) {
        console.error('Virhe haettaessa jäsenen tilaa:', error);
        res.status(500).send('Virhe haettaessa jäsenen tilaa');
    }
}

async function deleteMember(req, res) {
    const memberlistid = req.params.memberlistid;
    try {
        await groupModel.deleteMember(memberlistid);
        res.send('Jäsen poistettu onnistuneesti');
    } catch (error) {
        console.error('Virhe poistettaessa jäsenyyttä:', error);
        res.status(500).send('Virhe poistettaessa jäsenyyttä');
    }
}

async function deleteMemberlist(req, res) {
    const groupid = req.params.groupid;
    try {
        await groupModel.deleteMemberlist(groupid);
        res.send('Jäsenlista poistettu onnistuneesti');
    } catch (error) {
        console.error('Virhe poistettaessa jäsenlistaa:', error);
        res.status(500).send('Virhe poistettaessa jäsenlistaa');
    }
}

async function createMemberList(req, res) {
    const { profileid, mainuser, groupid, pending } = req.body;
    try {
        await groupModel.createMemberList(profileid, mainuser, groupid, pending);
        res.status(201).send('Jäsen lisätty onnistuneesti ryhmään');
    } catch (error) {
        console.error('Virhe lisättäessä jäsentä ryhmään:', error);
        res.status(500).send('Virhe lisättäessä jäsentä ryhmään');
    }
}

async function getMessagesById(req, res) {
    const groupid = req.params.groupid;

    try {
        const messages = await groupModel.getMessagesById(groupid);
        res.json(messages);
    } catch (error) {
        console.error('Virhe haettaessa viestejä:', error);
        res.status(500).send('Virhe haettaessa viestejä');
    }
}


module.exports = {
    getAllGroups,
    getGroupNameById,
    getGroupIdByName,
    getGroupById,
    deleteGroupById,
    updateGroupById,
    createGroup,
    createMember,
    updateMemberStatus,
    updateMemberRank,
    getMessagesById,
    createMessage,
    deleteMessage,
    getUserGroups,
    getGroupsByProfilename,
    GetMemberList,
    getMemberStatus,
    deleteMember,
    deleteMemberlist,
    createMemberList,
    getNewestGroup,
    getPopularGroup,
};