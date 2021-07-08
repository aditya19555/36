//Create variables here
var gameState=0, readState;
var dog,happydog,database,foodS,foodStoke;
var dogimg, happydog;
var feed, addFood;
var fedTime, lastFed,foodObj ;


function preload()
{
  
  dogimg = loadImage("images/dogImg.png");
  happyDog = loadImage("images/dogImg1.png");
  garden = loadImage("virtual pet images/Garden.png")
  washroom = loadImage("virtual pet images/Wash Room.png")
    bedroom = loadImage("virtual pet images/Bed Room.png")
    sadDog = loadImage("virtual pet images/deadDog.png")
}

function setup() {
  createCanvas(500, 500);
  foodObj = new Food();
  dog = createSprite(250,250);
  dog.addImage(dogimg);
  dog.scale = 0.2



  database = firebase.database();
  foodStock = database.ref("food");
  foodStock.on("value", readStock);

  
//read game state from database
readState=database.ref('gameState');
readState.on("value",function(data){
  gameState=data.val();
});
  
  feed = createButton("feed the dog");
  feed.position(500, 95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add food");
  addFood.position(700, 95);
  addFood.mousePressed(addFoods);
  
  

}


function draw() {
  currentTime=hour();
  if(currentTime==(lastFed+1)){
      update("Playing");
      foodObj.garden();
   }else if(currentTime==(lastFed+2)){
    update("Sleeping");
      foodObj.bedroom();
   }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
      foodObj.washroom();
   }else{
    update("Hungry")
    foodObj.display();
   }
   
   if(gameState!="Hungry"){
     feed.hide();
     addFood.hide();
     dog.remove();
   }else{
    feed.show();
    addFood.show();
    dog.addImage(sadDog);
   }
 
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


//function to update food stock and last fed time
function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour(),
    gameState:"Hungry"
  })
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

//update gameState
function update(state){
  database.ref('/').update({
    gameState:state
  })
}
