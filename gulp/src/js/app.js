(function(window, require, process){

	'use strict';

	var debug = require('debug');

	var React = require('react');
	var Router = require('react-router');
	var routes = require('./routes.js');
	var AppComponent = require('./components/AppComponent.js');

	var app = {};
	app.node = {};
	app.node.fs = require('fs');
	app.node.gui = require('nw.gui');
	app.node.os = require('os');

	var tray;

	var isTrayOn = false;

	app.init = function() {
		if(isTrayOn) {
			tray.remove();
			isTrayOn = false;
		}
		initMenu();
		initTray();
	}

	function initMenu() {
		var nativeMenuBar = new app.node.gui.Menu({ type: "menubar" });
		nativeMenuBar.createMacBuiltin("Qeewi");
		app.node.gui.Window.get().menu = nativeMenuBar
	}

	function initTray() {
		tray = new app.node.gui.Tray({icon: 'icons/tray_icon.png', tooltip: 'Qeewi'});

		var trayMenu = new app.node.gui.Menu();
		trayMenu.append(new app.node.gui.MenuItem({ type: 'normal', label: 'DevTool', click: function() { app.node.gui.Window.get().showDevTools(); } }));
		trayMenu.append(new app.node.gui.MenuItem({ type: 'normal', label: 'Reload', click: function() { app.node.gui.Window.get().reload(); } }));
		tray.menu = trayMenu;

		isTrayOn = true;
	}

	app.node.gui.Window.get().on('loaded', function(){
		app.init();
	});

	debug('React rendering');
	Router.run(routes, Router.HistoryLocation, function (Handler) {
		React.render( <AppComponent name="Emile"/>, document.getElementById('container'));
	});

})(window, require, process);
