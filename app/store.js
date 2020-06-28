import Vue from 'vue';
import Vuex from 'vuex';
const Sqlite = require("nativescript-sqlite");

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
		database: null,
        data: []
  },
  mutations: {
		init(state, data) {
			state.database = data.database;
		},
		load(state, data) {
			state.data = [];
			for(var i = 0; i < data.data.length; i++) {
				state.data.push({
					vid: data.data[i][0],
					title: data.data[i][1],
					path: data.data[i][2],
				});
			}
		},
		save(state, data) {
			state.data.push({
				vid: data.data.vid,
				title: data.data.title,
				path: data.data.path,
			});
		},
		delete(state, data) {
			state.data = [];
			console.log('exe flush')
		},
  },
  actions: {
		
	init(context) {
        (new Sqlite("my.db")).then(db => {
            db.execSQL("CREATE TABLE IF NOT EXISTS download (id INTEGER PRIMARY KEY AUTOINCREMENT, vid TEXT, title TEXT, path TEXT)").then(id => {
                context.commit("init", { database: db });
            }, error => {
                console.log("CREATE TABLE ERROR", error);
            });
        }, error => {
            console.log("OPEN DB ERROR", error);
        });
    },
    insert(context, data) {
        context.state.database.execSQL("INSERT INTO download (vid, title, path) VALUES (?, ?, ?)", [data.vid, data.title, data.path]).then(id => {
            context.commit("save", { data: data });
			console.log("INSERTING....")
        }, error => {
            console.log("INSERT ERROR", error);
        });
    },
    query(context) {
        context.state.database.all("SELECT  vid, title, path FROM download", []).then(result => {
            context.commit("load", { data: result });
        }, error => {
            console.log("SELECT ERROR", error);
        });
    },
    flush(context) {
        context.state.database.all("DELETE FROM download", []).then(result => {
            context.commit("delete", { data: result });
			console.log('commit flush')
        }, error => {
            console.log("DELETE ERROR", error);
        });
    }
  }
});
