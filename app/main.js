import Vue from 'nativescript-vue'
import router from './router'
import { isAndroid, isIOS } from 'tns-core-modules/platform'
import store from './store';


Vue.prototype.$isAndroid = isAndroid
Vue.prototype.$isIOS = isIOS

Vue.prototype.$router = router
Vue.prototype.$goto = function(to, options) {
  var options = options || { 
    backstackVisible: true, 
    transition: { 
      name: 'slideLeft',
      duration: 320
    }
  }
  this.$navigateTo(this.$router[to], options)
}

// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = (TNS_ENV === 'production')

Vue.registerElement('RadSideDrawer', () => require('nativescript-ui-sidedrawer').RadSideDrawer)

new Vue({
	store,
	render: h => h('frame', [h(router['mainpage'])])
}).$start()

store.dispatch("init");