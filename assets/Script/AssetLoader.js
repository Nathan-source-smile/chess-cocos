import GlobalData from "./Common/GlobalData";

export const loadImgAtlas = () => {
  return new Promise((resolve, reject) => {    
    cc.resources.load(
      "Images/Sprites",
      cc.SpriteAtlas,
      function (err, imgAtlas) {
        if (err) {
          console.log("Error loading image atlas", err);
          reject();
          return;
        }
        console.log("Loaded image atlas successfully!");
        GlobalData.imgAtlas = imgAtlas;
        resolve();
      }
    );
  });
};
