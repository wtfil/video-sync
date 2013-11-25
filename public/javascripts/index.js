var Exoskeleton = require('exoskeleton'),
    Player = require('./player'),
    router,
    FormView,
    App, app;


FormView = Exoskeleton.View.extend({

    events: {
        'submit': 'onSubmit'
    },

    onSubmit: function (e) {
        var val = this.el.querySelector('input').value;
        e.preventDefault();
        this.trigger('submit', {val: val});
    }
});

App = Exoskeleton.View.extend({
    initialize: function () {
        var _this = this;
        this._content = this.el.querySelector('.app__content');
        this._form = new FormView({el: this.el.querySelector('.search')});
        this.showMain();
        this._form.on('submit', function (data) {
            if (!_this._roomId) {
                _this._newRoom(data.val);
            } else {
                _this._changeVideo(data.val);
            }
        })
    },

    _newRoom: function (videoUrl) {
        Exoskeleton.utils.ajax({
            type: 'POST',
            url: '/video?videoUrl=' +  encodeURIComponent(videoUrl),
            success: function (data) {
                router.navigate('room/' + data.roomId, {trigger: true});
            },
            error: function (data) {
                console.error(data.response);
            }
        });
    },

    _changeVideo: function (videoUrl) {
        var _this = this;
        Exoskeleton.utils.ajax({
            type: 'POST',
            url: '/video?roomId=' + this._roomId + '&videoUrl=' +  encodeURIComponent(videoUrl),
            success: function (data) {
                _this._player.changeVideo(data.videoId);
            },
            error: function (data) {
                console.error(data.response);
            }
        });
    },

    update: function (view) {
        var child = this._content.childNodes[0];
        if (child) {
            this._content.replaceChild(view.el, this._content.childNodes[0]);
        } else {
            this._content.appendChild(view.el);
        }
    },

    showRoom: function (id) {
        var player = new Player({id: id});
        this._roomId = id;
        this._player = player;
        this.update(player);
        this.el.classList.add('room');
        player.start();
    },

    showMain: function () {
        this.el.classList.remove('room');
        this._content.innerHTML = '';
        this._roomId = null;
    }
    
});


router = new (Exoskeleton.Router.extend({
    routes: {
        '': function () {
            app.showMain();
        },
        'room/:id': function (id) {
            app.showRoom(id);
        }
    }
}))();

window.addEventListener('load', function () {
    /*new FormView({el: document.querySelector('.search')});    */
    app = new App({el: document.querySelector('.app')});
    Exoskeleton.history.start({pushState: true, root: '/'});
});
