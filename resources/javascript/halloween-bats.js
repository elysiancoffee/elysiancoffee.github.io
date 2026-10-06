 (function () {
    'use strict';

    let innerWidth;
    let innerHeight;

    function Bat(body, options) {
        this._options = options;
        this._initialize(body);
    }

    Bat.prototype._initialize = function (body) {
        this._bat = document.createElement('div');
        this._bat.className = 'halloween-bat';

        this._x = this.randomPosition('horizontal');
        this._y = this.randomPosition('vertical');
        this._tx = this.randomPosition('horizontal');
        this._ty = this.randomPosition('vertical');

        this._dx = -5 + Math.random() * 10;
        this._dy = -5 + Math.random() * 10;

        this._positionUpdateTimer = this._getPositionUpdateTime();

        this._frame = Math.round(
            Math.random() * this._options.frames
        );

        Object.assign(this._bat.style, {
            position: 'absolute',
            left: this._x + 'px',
            top: this._y + 'px',
            zIndex: this._options.zIndex,
            width: this._options.width + 'px',
            height: this._options.height + 'px',
            backgroundImage: 'url("' + this._options.image + '")',
            backgroundRepeat: 'no-repeat'
        });

        body.appendChild(this._bat);
    };

    Bat.prototype._getPositionUpdateTime = function () {
        return 0.5 + Math.random();
    };

    Bat.prototype.randomPosition = function (direction) {
        let screenLength;
        let imageLength;

        if (direction === 'horizontal') {
            screenLength = innerWidth;
            imageLength = this._options.width;
        } else {
            screenLength = innerHeight;
            imageLength = this._options.height;
        }

        return Math.random() * Math.max(0, screenLength - imageLength);
    };

    Bat.prototype.move = function (deltaTime) {
        let left = this._tx - this._x;
        let top = this._ty - this._y;

        let length = Math.sqrt(left * left + top * top);
        length = Math.max(1, length);

        let dLeft = this._options.speed * (left / length);
        let dTop = this._options.speed * (top / length);

        let ddLeft =
            (dLeft - this._dx) / this._options.flickering;

        let ddTop =
            (dTop - this._dy) / this._options.flickering;

        this._dx += ddLeft * deltaTime * 25;
        this._dy += ddTop * deltaTime * 25;

        this._x += this._dx * deltaTime * 25;
        this._y += this._dy * deltaTime * 25;

        this._x = Math.max(
            0,
            Math.min(
                this._x,
                innerWidth - this._options.width
            )
        );

        this._y = Math.max(
            0,
            Math.min(
                this._y,
                innerHeight - this._options.height
            )
        );

        this.applyPosition();

        this._positionUpdateTimer -= deltaTime;

        if (this._positionUpdateTimer < 0) {
            this._tx = this.randomPosition('horizontal');
            this._ty = this.randomPosition('vertical');

            this._positionUpdateTimer =
                this._getPositionUpdateTime();
        }
    };

    Bat.prototype.applyPosition = function () {
        this._bat.style.left = this._x + 'px';
        this._bat.style.top = this._y + 'px';
    };

    Bat.prototype.animate = function (deltaTime) {
        this._frame += 5 * deltaTime;

        if (this._frame >= this._options.frames) {
            this._frame -= this._options.frames;
        }

        const frame = Math.floor(this._frame);

        this._bat.style.backgroundPosition =
            '0 ' + (frame * -this._options.height) + 'px';
    };

    window.halloweenBats = function (options) {

        const defaults = {
            image: 'https://www.jqueryscript.net/demo/halloween-bats-flying-around/bats.png',
            zIndex: 10000,
            amount: 5,
            width: 35,
            height: 20,
            frames: 4,
            speed: 20,
            flickering: 15,
            target: 'body'
        };

        options = Object.assign({}, defaults, options);

        const target =
            document.querySelector(options.target);

        if (!target) {
            console.error(
                'Halloween Bats: target not found:',
                options.target
            );
            return null;
        }

        innerWidth = target.clientWidth;
        innerHeight = target.clientHeight;

        let isRunning = false;
        let isActiveWindow = true;
        const bats = [];

        const plugin = {
            isRunning: false,

            start: function () {
                let lastTime = Date.now();

                isRunning = true;
                plugin.isRunning = true;

                function animate() {
                    const time = Date.now();
                    const deltaTime =
                        (time - lastTime) / 1000;

                    lastTime = time;

                    if (isActiveWindow) {
                        bats.forEach(function (bat) {
                            bat.move(deltaTime);
                            bat.animate(deltaTime);
                        });
                    }

                    if (isRunning) {
                        requestAnimationFrame(animate);
                    }
                }

                animate();
            },

            stop: function () {
                isRunning = false;
                plugin.isRunning = false;
            }
        };

        while (bats.length < options.amount) {
            bats.push(new Bat(target, options));
        }

        plugin.start();

        window.addEventListener('resize', function () {
            innerWidth = target.clientWidth;
            innerHeight = target.clientHeight;
        });

        window.addEventListener('focus', function () {
            isActiveWindow = true;
        });

        window.addEventListener('blur', function () {
            isActiveWindow = false;
        });

        return plugin;
    };

})();
