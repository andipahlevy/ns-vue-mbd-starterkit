<template>
  <Page class="page">
    <ActionBar class="action-bar" title="Home"/>

	
	<StackLayout class="home-panel">
				<Slider v-model="time" :maxValue="maxTime" width="100%" @valueChange="changeTime"/>
						
				<Button class="playButton" v-show="pauseShow" width="100%" @tap="pause" :text="puaseText" />
				<Button class="playButton" v-show="playShow" width="100%" @tap="play" text="Putar" />
									<Button class="playButton" v-show="stopShow" width="100%" @tap="stop" text="Stop" />	
			</StackLayout>

  </Page>
</template>

<script>
import * as fs from "tns-core-modules/file-system" 
const audio = require('nativescript-audio-player');
const permissions = require('nativescript-permissions');
const player = new audio.TNSPlayer();
import { setInterval, clearInterval } from "tns-core-modules/timer";
const app = require("application");
let id;

export default {
	data() {
		return {
		mp3:'~/assets/long.mp3',
		sinMode:true,
		detMode:false,
		playing:false,
		playShow:true,
		pauseShow:false,
		stopShow:false,
		isPause:false,
		puaseText:'JEDA',
		time:0,
		maxTime:0,
		timeString:'--:--:--',
		}
	},
	methods: {
		play(){
			
			let dis = this
			this.setCond()
			
			const playerOptions = {
			  audioFile: this.mp3,
			  loop: false,
			};
			
			let dur = 0
			
			player
				.playFromUrl(playerOptions)
				.then(function(res) {
						player.getAudioTrackDuration().then(duration => {
						console.log(`song duration:`, duration);
						
						dur = duration / 1000
						dis.maxTime = dur
					});
				})
				.catch(function(err) {
					console.log('something went wrong...', err);
				});
				
			
			this.playShow = false
			this.pauseShow = true
			this.stopShow = true
			
			id = setInterval(() => {
				
				if(this.maxTime <= this.time){
					this.stop()
				}
				
				if(!this.isPause){
					this.time += 1
					this.timeString = this.sec2time(this.time)
				}
				console.log(this.time)
				console.log(Math.floor(player.currentTime/1000))
				console.log(this.sec2time(this.time))
				console.log(this.maxTime)
				
			}, 1000);	 
			
		},
		setCond(){
			app.android.on(app.AndroidApplication.activityBackPressedEvent, (args) => {
				this.stop()
			});
		},
		pause(){
			if(!this.isPause){
				player.pause()
				this.isPause = true
				this.puaseText = 'PUTAR'
			}else{
				player.resume()
				this.isPause = false
				this.puaseText = 'JEDA'
			}
		},
		stop(){
			clearInterval(id);
			this.time = 0
			this.timeString = '--:--:--'
			console.log(this.time)
			
			player.pause()
			this.playShow = true
			this.pauseShow = false
			this.stopShow = false
			this.isPause = false
			this.puaseText = 'JEDA'
		},
		changeTime(){
			if(this.time > (Math.floor(player.currentTime/1000)+1) || this.time < (Math.floor(player.currentTime/1000)-1)){
				player.seekTo(this.time*1000)
			}
		},
		sec2time(timeInSeconds) {
			var pad = function(num, size) { return ('000' + num).slice(size * -1); },
			time = parseFloat(timeInSeconds).toFixed(3),
			hours = Math.floor(time / 60 / 60),
			minutes = Math.floor(time / 60) % 60,
			seconds = Math.floor(time - minutes * 60),
			milliseconds = time.slice(-3);

			return pad(hours, 2) + ':' + pad(minutes, 2) + ':' + pad(seconds, 2);
		},
	},
	
	mounted(){
			
	},
	destroyed() {
		this.stop()
		clearInterval(this._checkInterval)
	},
	
};
</script>

<style scoped>

</style>