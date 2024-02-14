// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

var global = require("global");
cc.Class({
    extends: cc.Component,

    properties: {
        messageNode: {
            default: null,
            type: cc.Node
        },        
        messageBackgroundNode: {
            default: null,
            type: cc.Node
        },        
        mobileMessageBackgroundNode: {
            default: null,
            type: cc.Node
        },        
        avatarNode: {
            default: null,
            type: cc.Node
        },        
        avatarBackgroundNode: {
            default: null,
            type: cc.Node
        },        
        avatarImage: {
            default: null,
            type: cc.Sprite
        },        
        usernameNode: {
            default: null,
            type: cc.Node
        },        
        textNode: {
            default: null,
            type: cc.Node
        },     
        chatMessageBackgroundBorderWidth: 0,
        usernameLabelTopPadding: 0,
        usernameLabelSidesPadding: 24,
        textLabelTopPadding: 10,
        textLabelSidesPadding: 24,
        textLabelBottonPadding: 12,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    formatSelfMessage(){
        let avatarNodeSize = this.avatarNode.getContentSize();
        let newMessagePosition = new cc.Vec2(avatarNodeSize.width / 2,0);
        this.messageNode.setPosition(newMessagePosition);
        this.formatAvatarPosition(true);
        var usernameLabel = this.usernameNode.getComponent(cc.Label);
        usernameLabel.horizontalAlign = cc.Label.HorizontalAlign.LEFT;
        this.avatarBackgroundNode.scaleX = -1;
        this.messageBackgroundNode.scaleX = -1;
    },

    getNodeSize (node){
        return {width: node.width, height:node.height};
    },
    setNodeSize (node, size){
        node.width = size.width;
        node.height = size.height;
    },
    setNodeWidth (node, size){
        node.width = size.width;
    },
    setNodeHeigth (node, size){
        node.height = size.height;
    },

    formatAvatarPosition(isSelf){
        let parentSize = this.getNodeSize(this.node.getParent());
        let avatarNodeSize = this.getNodeSize(this.avatarNode);
        let messageNodeSize = this.getNodeSize(this.messageNode);
        let newAvatarNodePosition = null;
        if (isSelf){
            newAvatarNodePosition = new cc.Vec2((avatarNodeSize.width / 2) - (parentSize.width/2),((messageNodeSize.height/2) - (avatarNodeSize.height/2)));
        }
        else {
            newAvatarNodePosition = new cc.Vec2((parentSize.width/2) - (avatarNodeSize.width / 2),((messageNodeSize.height/2) - (avatarNodeSize.height/2)));
        }
        this.avatarNode.setPosition(newAvatarNodePosition);
    },

    formatInitialMessage (isMobile){
        //if mobile change background to avoid deformation
        if (isMobile){
            this.messageBackgroundNode.active = false;
            this.mobileMessageBackgroundNode.active = true;
            this.messageBackgroundNode = this.mobileMessageBackgroundNode;
        }
        let parentSize = this.getNodeSize(this.node.getParent());
        let avatarNodeSize = this.getNodeSize(this.avatarNode);
        let messageNodeSize = this.getNodeSize(this.messageNode);
        let newmessageNodeSize = new cc.Size (parentSize.width - avatarNodeSize.width, messageNodeSize.height);
        this.setNodeWidth (this.messageNode,newmessageNodeSize);
        this.setNodeWidth (this.messageBackgroundNode,newmessageNodeSize);
        let newMessageNodePosition = new cc.Vec2(0-avatarNodeSize.width / 2,0);
        messageNodeSize = this.getNodeSize(this.messageNode);
        this.messageNode.setPosition(newMessageNodePosition);
        if (isMobile){
            this.usernameLabelTopPadding += 5;
            this.formatLabelMobileFonts();
        }
        let isSelf = false;
        this.formatAvatarPosition(isSelf);
        this.formatLabelsSizes (isSelf);
        this.formatLabelsPositions();        
        this.node.height = messageNodeSize.height;
    },

    formatLabelMobileFonts(){
        var usernameLabel = this.usernameNode.getComponent (cc.Label);
        usernameLabel.fontSize = 26;
        usernameLabel.lineHeight = 28;
        var textLabel = this.textNode.getComponent (cc.Label);
        textLabel.fontSize = 26;
        textLabel.lineHeight = 28;
    },

    getTextHeight(){
        let textNodeLabel = this.textNode.getComponent (cc.Label);
        let lineHeight = textNodeLabel.lineHeight;
    },

    formatLabelsSizes(isSelf){
        let messageNodeSize = this.getNodeSize(this.messageNode);
        let usernameNodeSize = this.getNodeSize(this.usernameNode);
        let textNodeSize = this.getNodeSize(this.textNode);
        this.getTextHeight();
        if (usernameNodeSize.height + this.usernameLabelTopPadding + textNodeSize.height + this.textLabelBottonPadding > messageNodeSize.height){
            let newMessageNodeSize = new cc.Size (messageNodeSize.width, usernameNodeSize.height + this.usernameLabelTopPadding + textNodeSize.height + this.textLabelBottonPadding);
            this.setNodeSize(this.messageNode, newMessageNodeSize);
            this.setNodeSize(this.messageBackgroundNode, newMessageNodeSize);
            messageNodeSize = newMessageNodeSize;
            this.formatAvatarPosition(isSelf);
        }
        let newUsernameNodeSize = new cc.Size (messageNodeSize.width - (this.usernameLabelSidesPadding * 2), usernameNodeSize.height);
        this.setNodeSize(this.usernameNode, newUsernameNodeSize);
        let newTextNodeSize = new cc.Size (messageNodeSize.width - (this.textLabelSidesPadding * 2), textNodeSize.height);
        this.setNodeSize(this.textNode,newTextNodeSize);
    },

    formatLabelsPositions (){
        let messageNodeSize = this.getNodeSize(this.messageNode);
        let usernameNodeSize = this.getNodeSize(this.usernameNode);
        let textNodeSize = this.getNodeSize(this.textNode);
        let newUsernameNodePosition = new cc.Vec2 (0, (messageNodeSize.height / 2 - usernameNodeSize.height / 2) - this.usernameLabelTopPadding);
        this.usernameNode.setPosition(newUsernameNodePosition);
        let newTextNodePosition = new cc.Vec2 (0, (this.usernameNode.y - Math.round(this.usernameNode.getContentSize().height)/2) - this.textLabelTopPadding);
        this.textNode.setPosition(newTextNodePosition);
    },

    start () {
    },

    getSlicedAvatar (avatarImage){
        //var slicedAvatar = new cc.Sprite(avatarImage.spriteFrame);
        //slicedAvatar.initWithSpriteFrame (avatarImage.spriteFrame);
        var slicedAvatar = avatarImage;
        return slicedAvatar;

    },



    setMessage (username, text, avatarSprite, color, isSelf){
        var usernameLabel = this.usernameNode.getComponent (cc.Label);
        usernameLabel.string = username + ":";
        this.usernameNode.color = (new cc.Color()).fromHEX(color);
        if (avatarSprite != null){
            //var spriteFrame = new cc.SpriteFrame(avatarTexture);
            //spriteFrame.setRect (this.getAvatarHeadRect(spriteFrame.getRect()));
            //this.avatarImage.spriteFrame = spriteFrame;    
            this.avatarImage.spriteFrame = avatarSprite;
        }
        //this.avatarImage.spriteFrame.setRect (new cc.Rect(0,0,200,220));
        if (isSelf){
            this.formatSelfMessage ();
        }
        let textNodeSize = this.getNodeSize (this.textNode);
        var textLabel = this.textNode.getComponent (cc.Label);
        textLabel.string = text;
        textLabel._forceUpdateRenderData();
        this.formatLabelsSizes (isSelf);
        this.formatLabelsPositions();
        this.node.height = this.messageNode.height;
    },

    formatMessage (messageText){
        let parentSize = this.node.getParent().getContentSize();
        let messageNodeSize = this.messageNode.getContentSize();
        var textLabel = this.textNode.getComponent (cc.Label);
        textLabel.string = messageText;        
    },

    // update (dt) {},
});
