var gameWidth = 1024,
    gameHeight = 800;

var game = new Phaser.Game(gameWidth, gameHeight, Phaser.AUTO, 'test', null, true, false);
var health = 100,
    score = 500,
    map = {};

var BasicGame = function (game) { };
BasicGame.Boot = function (game) { };

var isoGroup, cursorPos, cursor, healthBar;
var tiles  = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 
    0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 0, 0, 
    0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 
    0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
    0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
    0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
    0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
    0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 
    0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 
    0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
    0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
    0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
]
var tileTypes = {
    0: 'grass',
    1: 'road',
    3: 'tower',
    4: 'pickup-burning'
}
var mapW = 24;
var mapH = tiles.length / mapW;

function addActivist(tile) {
  if (score < 50 || [tile.isoBounds.x, tile.isoBounds.y] in map || tile.key != 'grass') return

  score -= 50;

  map[[tile.isoBounds.x, tile.isoBounds.y]] = 'activist';

  tile = game.add.isoSprite(tile.isoBounds.x + 10, tile.isoBounds.y + 10, 0, 'activist', 8, isoGroup);
  tile.anchor.set(0.5, 1);

  anim = tile.animations.add('post');
  anim.play(3, true);
}

BasicGame.Boot.prototype =
{
    preload: function () {
        game.load.image('road', '../img/road.png');
        game.load.image('grass', '../img/grass.png');
        game.load.image('tower', '../img/tower.png');
        game.load.image('pickup-burning', '../img/pickup-burning.png');
        game.load.image('devyatka', '../img/devyatka.png');
        game.load.spritesheet('activist', '../img/activist.png', 32, 64, 8);

        game.time.advancedTiming = true;
        game.plugins.add(new Phaser.Plugin.Isometric(game));

        // This is used to set a game canvas-based offset for the 0, 0, 0 isometric coordinate - by default
        // this point would be at screen coordinates 0, 0 (top left) which is usually undesirable.
        game.iso.anchor.setTo(0.5, 0.3);
    },
    create: function () {
        // Create a group for our tiles.
        isoGroup = game.add.group();

        // Let's make a load of tiles on a grid.
        this.spawnTiles();

        // Provide a 3D position for the cursor
        cursorPos = new Phaser.Plugin.Isometric.Point3();

        var barConfig = {
            width: 250,
            height: 20,
            x: gameWidth - 250,
            y: 40,
            bg: {
              color: '#F5F5F5'
            },
            bar: {
              color: '#D9534F'
            },
            animationDuration: 600,
            flipped: false
        };
        game.input.mouse.capture = true;
        healthBar = new HealthBar(this.game, barConfig);
        healthBar.setPercent(health);
        // window.e = new Enemy(100,200);
    },
    update: function () {
        // Update the cursor position.
        // It's important to understand that screen-to-isometric projection means you have to specify a z position manually, as this cannot be easily
        // determined from the 2D pointer position without extra trickery. By default, the z position is 0 if not set.
        game.iso.unproject(game.input.activePointer.position, cursorPos);

        // Loop through all tiles and test to see if the 3D position from above intersects with the automatically generated IsoSprite tile bounds.
        isoGroup.forEach(function (tile) {
            var inBounds = tile.isoBounds.containsXY(cursorPos.x, cursorPos.y);
            // If it does, do a little animation and tint change.
            if (!tile.selected && inBounds) {
                tile.selected = true;
                tile.tint = 0x86bfda;
            }
            // If not, revert back to how it was.
            else if (tile.selected && !inBounds) {
                tile.selected = false;
                tile.tint = 0xffffff;
            }

            if (tile.selected && game.input.activePointer.leftButton.isDown) {
              addActivist(tile);
              // window.e.target.x=game.input.activePointer.position.x;
              // window.e.target.y=game.input.activePointer.position.y;
            }
        });
    },
    render: function () {
        game.debug.text(game.time.fps || '--', 2, 14, "#a7aebe");
        game.debug.text(health + " / 100" || '--', gameWidth - 290, 44, "#fff");
        game.debug.text("Деньги госдепа: $ " + score || '--', 2, 54, "#a7aebe");
      },
    spawnTiles: function () {
        var tile;
        for (var i = 0; i < mapH; i += 1) {
            for (var j = 0; j < mapW; j += 1) {
                // Create a tile using the new game.add.isoSprite factory method at the specified position.
                // The last parameter is the group you want to add it to (just like game.add.sprite)
                var type = tiles[(i+1)*mapW-(j+1)];
                tile = game.add.isoSprite(i * 19, j * 19, 0, tileTypes[type], 0, isoGroup);
                tile.anchor.set(0.5, 1);
            }
        }

        tile = game.add.isoSprite(78, 450, 0, 'pickup-burning', 0, isoGroup);
        tile.anchor.set(0.5, 1);

        tile = game.add.isoSprite(140, 30, 0, 'devyatka', 0, isoGroup);
        tile.anchor.set(0.5, 1);

      }
};

game.state.add('Boot', BasicGame.Boot);
game.state.start('Boot');

/* Units */
function Enemy(x,y){
    var self = this;
    this.health = 100;
    this.speed = 1;
    this.sprite = game.add.sprite(x, y, 'activist');
    this.sprite.anchor.set(0.5, 1);
    this.target = {
        x: x,
        y: y,
    };
    this.move = function(){
        var vec = {
            x: this.target.x,
            y: this.target.y,
        }
        vec.x -= self.sprite.x;
        vec.y -= self.sprite.y;
        var len = Math.sqrt(vec.x*vec.x + vec.y*vec.y);

        if(len > 1){
            vec.x = vec.x/len;
            vec.y = vec.y/len;
            self.sprite.x += vec.x*self.speed;
            self.sprite.y += vec.y*self.speed;
        }

    };
    this.sprite.update = function() {
        self.move();
    }

}

/* Health */
function hurt(points) {
    var result = health - points;
    health = (result >= 0) ? result : 0;
    healthBar.setPercent(health);
}

function heal(points) {
    var result = health - points;
    health = (result < 100) ? result : 100;
    healthBar.setPercent(health);
}