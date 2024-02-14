// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const global = require("./global");

cc.Class({
    extends: cc.Component,

    properties: {
        chatMessagePrefab: {
            default: null,
            type: cc.Prefab
        },
        chatMessagesContainer: {
            default: null,
            type: cc.Node
        },
        chatUserData: [],
        assignedColors: [],
        numUsers: 0,
        lastXPosition: 0,
        maxLineCharacters: 50,
        maxMessages: 50,
        maxMessagesContentHeight: 2000,
        
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
    },

    hex2RgbA(hex){
        var c;
        if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
            c= hex.substring(1).split('');
            if(c.length== 3){
                c= [c[0], c[0], c[1], c[1], c[2], c[2]];
            }
            c= '0x'+c.join('');
            return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',1)';
        }
        throw new Error('Invalid Hex ' + hex);
    },

    rgb2Xyz(r, g, b, a = 1) {
		if (r > 255) {
			// console.warn("Red value was higher than 255. It has been set to 255.");
			r = 255;
		} else if (r < 0) {
			// console.warn("Red value was smaller than 0. It has been set to 0.");
			r = 0;
		}
		if (g > 255) {
			// console.warn("Green value was higher than 255. It has been set to 255.");
			g = 255;
		} else if (g < 0) {
			// console.warn("Green value was smaller than 0. It has been set to 0.");
			g = 0;
		}
		if (b > 255) {
			// console.warn("Blue value was higher than 255. It has been set to 255.");
			b = 255;
		} else if (b < 0) {
			// console.warn("Blue value was smaller than 0. It has been set to 0.");
			b = 0;
		}
		if (a > 1) {
			// console.warn("Obacity value was higher than 1. It has been set to 1.");
			a = 1;
		} else if (a < 0) {
			// console.warn("Obacity value was smaller than 0. It has been set to 0.");
			a = 0;
		}
		r = r / 255;
		g = g / 255;
		b = b / 255;
		// step 1
		if (r > 0.04045) {
			r = Math.pow(((r + 0.055) / 1.055), 2.4);
		} else {
			r = r / 12.92;
		}
		if (g > 0.04045) {
			g = Math.pow(((g + 0.055) / 1.055), 2.4);
		} else {
			g = g / 12.92;
		}
		if (b > 0.04045) {
			b = Math.pow(((b + 0.055) / 1.055), 2.4);
		} else {
			b = b / 12.92;
		}
		// step 2
		r = r * 100;
		g = g * 100;
		b = b * 100;
		// step 3
		const x = (r * 0.4124564) + (g * 0.3575761) + (b * 0.1804375);
		const y = (r * 0.2126729) + (g * 0.7151522) + (b * 0.0721750);
		const z = (r * 0.0193339) + (g * 0.1191920) + (b * 0.9503041);
		return [x, y, z];
	},

    hex2lab(hex) {
		const [r, g, b, a] = hex2RgbA(hex);
		const [x, y, z] = rgb2Xyz(r, g, b, a);
		return xyz2lab(x, y, z); // [l, a, b]
	},

    xyz2lab(x, y, z) {
		// using 10o Observer (CIE 1964)
		// CIE10_D65 = {94.811f, 100f, 107.304f} => Daylight
		const referenceX = 94.811;
		const referenceY = 100;
		const referenceZ = 107.304;
		// step 1
		x = x / referenceX;
		y = y / referenceY;
		z = z / referenceZ;
		// step 2
		if (x > 0.008856) {
			x = Math.pow(x, (1 / 3));
		} else {
			x = (7.787 * x) + (16 / 116);
		}
		if (y > 0.008856) {
			y = Math.pow(y, (1 / 3));
		} else {
			y = (7.787 * y) + (16 / 116);
		}
		if (z > 0.008856) {
			z = Math.pow(z, (1 / 3));
		} else {
			z = (7.787 * z) + (16 / 116);
		}
		// step 3
		const l = (116 * y) - 16;
		const a = 500 * (x - y);
		const b = 200 * (y - z);
		return [l, a, b];
	},

    deltaE00(l1, a1, b1, l2, a2, b2) {
		// Utility functions added to Math Object
		Math.rad2deg = function(rad) {
			return 360 * rad / (2 * Math.PI);
		};
		Math.deg2rad = function(deg) {
			return (2 * Math.PI * deg) / 360;
		};
		// Start Equation
		// Equation exist on the following URL http://www.brucelindbloom.com/index.html?Eqn_DeltaE_CIE2000.html
		const avgL = (l1 + l2) / 2;
		const c1 = Math.sqrt(Math.pow(a1, 2) + Math.pow(b1, 2));
		const c2 = Math.sqrt(Math.pow(a2, 2) + Math.pow(b2, 2));
		const avgC = (c1 + c2) / 2;
		const g = (1 - Math.sqrt(Math.pow(avgC, 7) / (Math.pow(avgC, 7) + Math.pow(25, 7)))) / 2;

		const a1p = a1 * (1 + g);
		const a2p = a2 * (1 + g);

		const c1p = Math.sqrt(Math.pow(a1p, 2) + Math.pow(b1, 2));
		const c2p = Math.sqrt(Math.pow(a2p, 2) + Math.pow(b2, 2));

		const avgCp = (c1p + c2p) / 2;

		let h1p = Math.rad2deg(Math.atan2(b1, a1p));
		if (h1p < 0) {
			h1p = h1p + 360;
		}

		let h2p = Math.rad2deg(Math.atan2(b2, a2p));
		if (h2p < 0) {
			h2p = h2p + 360;
		}

		const avghp = Math.abs(h1p - h2p) > 180 ? (h1p + h2p + 360) / 2 : (h1p + h2p) / 2;

		const t = 1 - 0.17 * Math.cos(Math.deg2rad(avghp - 30)) + 0.24 * Math.cos(Math.deg2rad(2 * avghp)) + 0.32 * Math.cos(Math.deg2rad(3 * avghp + 6)) - 0.2 * Math.cos(Math.deg2rad(4 * avghp - 63));

		let deltahp = h2p - h1p;
		if (Math.abs(deltahp) > 180) {
			if (h2p <= h1p) {
				deltahp += 360;
			} else {
				deltahp -= 360;
			}
		}

		const deltalp = l2 - l1;
		const deltacp = c2p - c1p;

		deltahp = 2 * Math.sqrt(c1p * c2p) * Math.sin(Math.deg2rad(deltahp) / 2);

		const sl = 1 + ((0.015 * Math.pow(avgL - 50, 2)) / Math.sqrt(20 + Math.pow(avgL - 50, 2)));
		const sc = 1 + 0.045 * avgCp;
		const sh = 1 + 0.015 * avgCp * t;

		const deltaro = 30 * Math.exp(-(Math.pow((avghp - 275) / 25, 2)));
		const rc = 2 * Math.sqrt(Math.pow(avgCp, 7) / (Math.pow(avgCp, 7) + Math.pow(25, 7)));
		const rt = -rc * Math.sin(2 * Math.deg2rad(deltaro));

		const kl = 1;
		const kc = 1;
		const kh = 1;

		const deltaE = Math.sqrt(Math.pow(deltalp / (kl * sl), 2) + Math.pow(deltacp / (kc * sc), 2) + Math.pow(deltahp / (kh * sh), 2) + rt * (deltacp / (kc * sc)) * (deltahp / (kh * sh)));

		return deltaE;
	},

    //DeltaE
    //<=    1.0 Not perceptible.
    //1-2   Hardly Perceptible
    //2-10  Easily Perceptible
    //11-49 Alike colors
    //100   Opposite colors
    colorDifferenceRange(hexColor1, hexColor2) {
        const [L1, A1, B1] = this.hex2lab(hexColor1, 1);
        const [L2, A2, B2] = this.hex2lab(hexColor2, 2);
        const deltaE = this.deltaE00(L1, A1, B1, L2, A2, B2);
    },
    
    randDarkColor() {
        var lum = -0.25;
        var hex = String('#' + Math.random().toString(16).slice(2, 8).toUpperCase()).replace(/[^0-9a-f]/gi, '');
        if (hex.length < 6) {
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }
        var rgb = "#",
            c, i;
        for (i = 0; i < 3; i++) {
            c = parseInt(hex.substr(i * 2, 2), 16);
            c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
            rgb += ("00" + c).substr(c.length);
        }
        return rgb;
    },

    //used two avoid two similar colors in chat
    getNewDifferentColor (){
        let defaultColor = "#000000";
        let newColor = defaultColor;
        let differentColorFound = true;
        let numUsers = this.chatUserData.length;
        if (numUsers == 0){
            newColor = "#63280a";
        }
        else if (numUsers == 1){
            newColor = "#5a4536";
        }
        else if (numUsers == 2){
            newColor = "#7b3f3c";
        }
        else if (numUsers == 3){
            newColor = "#642a27";
        }
        else if (numUsers == 4){
            newColor = "#842c00";
        }
        else if (numUsers == 5){
            newColor = "#433328";
        }
        else if (numUsers == 6){
            newColor = "#484564";
        }
        else if (numUsers == 7){
            newColor = "#963e3a";
        }
        else{
            do{
                let auxColor = this.randDarkColor ();
                differentColorFound = true;
                for (let i=0;i++;i<this.assignedColors.length){
                    differenceRange = this.colorDifferenceRange(auxColor,assignedColors[i]);
                    if (differenceRange > 2){
                        differentColorFound = false;
                        break;
                    }
                }
                if (differentColorFound){
                    newColor = auxColor;
                }
            } while (!differentColorFound);    
        }
        if (this.assignedColors.findIndex(x=>x==newColor)<0){
            this.assignedColors.push(newColor);
        }
        return newColor;
    },

    getUserColor (username){
        let userDataIndex = this.chatUserData.findIndex (x=>x.username == username);
        if (userDataIndex < 0){
            let color = this.getNewDifferentColor ();
            return color;
        }
        else {
            return this.chatUserData[userDataIndex].color;
        }
    },

    formatMessage (user, text){
        let formattedMessage = user + ": " + text;
        let color = this.getUserColor (user);
        formattedMessage = "<img src='" + user + "' /> <color=" + color + ">" + formattedMessage + "</color>";
        return formattedMessage;
    },

    newChatMessage (user, text, isMobile){
        if (this.chatMessagePrefab == null){
            console.log ("Chat message prefab is not initialized in chat script.")
            return;
        }
        let userData = this.getUserData (user);
        let chatMessagePrefab = cc.instantiate(this.chatMessagePrefab);
        let chatMessage = chatMessagePrefab.getComponent("ChatMessage");
        
        this.chatMessagesContainer.addChild(chatMessagePrefab);    
        chatMessage.formatInitialMessage(isMobile);
        chatMessage.setMessage (userData.username, text, userData.spriteContent,userData.color, userData.isSelf);
        //this.chatMessagesContainer._forceUpdateRenderData();

        var messagesScrollView = this.chatMessagesContainer.getParent().getParent().getComponent(cc.ScrollView);
        let numRemoved = 0;
        while (this.chatMessagesContainer.getChildrenCount() > this.maxMessages && numRemoved < 3){
            numRemoved++;
            this.removeFirstChatMessage();
        }        
        messagesScrollView.scrollToBottom();

        //chatMessagePrefab.setPosition(cc.v2(this.currentChatMessagePosition.x, this.currentChatMessagePosition.y));

        //chatMessagePrefab.setPosition(cc.v2(this.currentChatMessagePosition.x, this.currentChatMessagePosition.y - chatMessagePrefab.height / 2 - this.chatMessagePaddingY));
        //console.log ("CHAT MESSAGE POSITION", this.currentChatMessagePosition,chatMessagePrefab.height);
        //this.currentChatMessagePosition.y -= (this.chatMessagePaddingY + chatMessagePrefab.height);
        //console.log (this.currentChatMessagePosition);
    },

    removeFirstChatMessage (){
        this.chatMessagesContainer.getChildren()[0].removeFromParent()
    },


    getUserData(username){
        let userDataIndex = this.chatUserData.findIndex (x=>x.username == username);
        if (userDataIndex >= 0){
            return this.chatUserData[userDataIndex];
        }
        else {
            let userData = {username:username,color:"#000000",spriteContent:null ,isSelf: false};
            return userData;
        }
    },

    newChatUser (username, spriteContent){
        let chatUserIndex = this.chatUserData.findIndex (x=>x.username == username);
        let isSelf = false;
        if (username == global.cookie_userName){
            isSelf = true;
        }
        if (chatUserIndex < 0){
            let color = this.getUserColor (username);
            let userData = {username:username,color: color,spriteContent: spriteContent, isSelf: isSelf};
            this.chatUserData.push(userData);
            return true;
        }
        return false;
    },

    newMessage(user,text){
        let message = this.formatMessage (user,text) + "\n";
        //message = "<color=#aaaaaa>user test</color>\n"
        let richText = this.getComponent (cc.RichText);
        richText.string = richText.string + message;
        this.repositionRichText(richText);
    },

    changeColorNode (node){
        let nodeColor = this.getNewDifferentColor();
        if (nodeColor != null){
            node.color = (new cc.Color()).fromHEX(nodeColor);
        }
    },

    createColorNode (){
        var node = new cc.Node();
        let nodeColor = this.getNewDifferentColor();
        if (nodeColor != null){
            node.color = (new cc.Color()).fromHEX(nodeColor);
        }
        this.node.setContentSize(50,50);
        //this.node.getBoundingBox ().size.width = 50;
        this.lastXPosition = this.lastXPosition + Math.abs (node.getContentSize().width / 2);

        node.setPosition = (0, 0, 0);
        node.addComponent(cc.Sprite);
        let self = this;
        cc.loader.loadRes("Images/test", cc.SpriteFrame, null, function (err, spriteFrame) {
            imageSprite = node.getComponent(cc.Sprite);
            imageSprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
            imageSprite.spriteFrame = spriteFrame;
            self.node.addChild(node);
        });
    },

    getMethods (obj) {
        let properties = new Set()
        let currentObj = obj
        do {
          Object.getOwnPropertyNames(currentObj).map(item => properties.add(item))
        } while ((currentObj = Object.getPrototypeOf(currentObj)))
        return [...properties.keys()].filter(item => typeof obj[item] === 'function')
    },

    repositionRichText(richText){
        let parentSize = richText.node.getParent().getContentSize();
        let richTextSize = richText.node.getContentSize();
        let i = 0;
        while (richTextSize.height > parentSize.height){
                i ++;
            if (i>5){
                return;
            }
            richText.string = richText.string.substring(richText.string.indexOf("\n") + 1);
            parentSize = richText.node.getParent().getContentSize();
            richTextSize = richText.node.getContentSize();
        }
        richText.node.setPosition ((richTextSize.width / 2) - (parentSize.width / 2),   (parentSize.height / 2) - (richTextSize.height / 2));
    },

    setPlayerAvatarsAtlas (avatarsAtlas){
        let richText = this.getComponent (cc.RichText);
        richText.imageAtlas = avatarsAtlas;
    },
      
    // update (dt) {},

    onLoad (){
        //richText.ignoreContentAdaptWithSize (false);        
    },
});
