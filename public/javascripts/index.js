/** @jsx React.DOM */
var Exoskeleton = require('exoskeleton'),
    Player = require('./player'),
    React = require('react-tools/build/modules/react');


var Form = React.createClass({
    _onSubmit: function (e) {
        e.preventDefault();
        this.props.model.set('roomId', this._input.value);
    },
    componentDidMount: function () {
        this._input = this.getDOMNode().querySelector('input');  
    },
    render: function () {
        return <form className="search" onSubmit={this._onSubmit}>
            <input placeholder="Paste youtube url or videoId here"/>
            <button type="submit">Start</button>
        </form>
    }
});

var App = React.createClass({
    getInitialState: function () {
        return {
            roomId: this.props.model.get('roomId')
        };
    },
    componentDidMount: function () {
        var _this = this;
        this.props.model.on('change:roomId', function (m, id) {
            console.log(1);
            _this.setState('roomId', id);
            console.log(2);
        });
    },
    render: function () {
        var className = ['app'];
        if (this.state.roomId) {
            className.push('room');
        }
        return <div className={className.join(' ')}>
            <Form model={this.props.model}/>
            <div className="app__content">
               {this.state.roomId && <Player roomId={this.state.roomId}/>}
            </div>
        </div>
    }
});

var appModel = new (Exoskeleton.Model.extend({
    defaults: {
        roomId: null
    }
}));

var router = new (Exoskeleton.Router.extend({
    routes: {
        '': function () {
            appModel.set('roomId', null);
        },
        'room/:id': function (id) {
            appModel.set('roomId', id);
        }
    }
}))();

window.addEventListener('load', function () {
    Exoskeleton.history.start({pushState: true, root: '/'});
    React.renderComponent(
        <App model={appModel}/>,
        document.body
    );
});
