<template>
  <Page class="page">
    <ActionBar class="action-bar" title="Home"/>

	
	<StackLayout class="home-panel">
		
		<Image  
			:src="pic" 
			stretch="aspectFit" 
			width="90%"
			margin="5"
			/>
			
		<Label class="modalText center tebal" :text="title" 		textWrap="true"/>
		<Label class="modalText center" :text="timeString" 	textWrap="true"/>
		
		<Slider v-model="time" :maxValue="maxTime" width="100%" @valueChange="changeTime"/>
		
		<WrapLayout class="center" padding="10" borderWidth="1" borderColor="#d8d8d8">
          <MDBBtn v-show="playShow" icon="play" @tap.native="play" mdbColor="default" width="50" />
          <MDBBtn v-show="pauseShow" icon="pause" @tap.native="pause" mdbColor="secondary" width="50" />
          <MDBBtn v-show="stopShow" icon="stop" @tap.native="stop" mdbColor="info" width="50" />
        </WrapLayout>		
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
import { MDBBtn } from './../components/Components/Button'
let id;

export default {
	props: ['mp3','pic','title'],
	components: {
		MDBBtn,
	},
	data() {
		return {
		//mp3:'~/assets/long.mp3',
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
		timeString:'--:--',
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
					return false
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
			this.timeString = '--:--'
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

			return pad(minutes, 2) + ':' + pad(seconds, 2);
		},
	},
	
	mounted(){
		this.play()
	},
	destroyed() {
		this.stop()
		clearInterval(this._checkInterval)
	},
	
};
</script>

<style scoped>
.modalText{
	color:#000;
	font-size:12;
	height:30;
	margin:0 15;
	line-height: 1%;
}
.tebal{	
	font-weight:bold;
}
.center{	
	horizontal-align: center;
}
</style>