<template>
  <Page>
    <ActionBar :title="title">
		<Label :text="title" fontSize="20" paddingRight="10" />
		<NavigationButton android.systemIcon="ic_menu_back" @tap="$goto('mainpage', routerOptions)" />
			<ActionItem @tap="$goto('buttons')" v-if="$isAndroid" text="List Download" android.position="popup" />
	</ActionBar>
    <ScrollView>
		<StackLayout>
			<StackLayout padding="20 10 10 10">
				  <Label text="Hasil pencarian:" textWrap="true" color="black" textAlignment="center" />
				  <Label :text="query" marginTop="4" textWrap="true" textAlignment="center" />
				  <ActivityIndicator marginTop="10" v-if="busyIndicator" :busy="busyIndicator" @busyChange="onBusyChanged" />
			</StackLayout> 
			<WrapLayout v-for="(item,k) in listOfItems" :key="k" padding="10" borderWidth="0" borderColor="#d8d8d8">
				<MDBCard v-if="!clean(item.title)">
					<StackLayout>
					  <Label :text="item.title" fontSize="15" class="mdb-font-bold" color="black" />
					  <Label :text="item.duration" fontSize="12" paddingTop="2" />
					  <WrapLayout>
						<MDBBtn :text="item.download_text" backgroundColor="#2ed573" color="white" marginTop="15" padding="10" 
							horizontalAlignment="center" 
							@tap.native="download(item.vid, item.title, k)" />
					  </WrapLayout>
					</StackLayout>
				</MDBCard>
			</WrapLayout>
		</StackLayout>
    </ScrollView>
  </Page>
</template>

<script>
import { Navigation } from './../views/Navigation'
import { MDBBtn } from './../components/Components/Button'
import { MDBIcon } from './../components/Content/Icon'
import { SnackBar, SnackBarOptions } from "@nstudio/nativescript-snackbar"
import { MDBCard } from './../components/Components/Card'
import { DownloadProgress } from "nativescript-download-progress"
import * as fs from "tns-core-modules/file-system"
// import { ShareFile } from 'nativescript-share-file';
const permissions = require('nativescript-permissions');
const application = require("tns-core-modules/application");

const snackbar = new SnackBar()
const download = new DownloadProgress();
// let handleFile = new HandleFile();

export default {
	name: 'Search',
	data(){
		return{
			title:'Pencarian',
			listOfItems: [],
			busyIndicator: true
		}
	},
	props:['query'],
	components: {
		Navigation,
		MDBBtn,
		MDBIcon,
		MDBCard
	},
	methods: {
		fetcData(){
		
			console.log('Start fetc data')
			fetch("http://18.218.193.86:8890/youtube/search?q="+this.query)
				.then((response) => response.json())
				.then((r) => {
					console.log(r[0])
					if(r[0] === undefined){
						snackbar.simple('Terjadi kesalahan, tunggu beberapa saat', 'white', 'red', 3, false)
						this.busyIndicator =  false
						return false
					}
						r.forEach(v=>{
							if(v.duration && v.duration.length < 5 ){
								this.listOfItems.push(
									{
										title:this.capitalizeFirstLetter(v.title.replace(/[^a-zA-Z0-9\- ]/g, "")), 
										duration:v.duration, 
										vid:v.vid,
										download_text:'Download',
										downloaded:false,
										downloaded_path:null,
									}
								)
							}
						})
					
					console.log('end fetc data')
					this.busyIndicator =  false
				})
				.catch((e) => {
					this.busyIndicator =  false
					snackbar.simple('Terjadi kesalahan, tunggu beberapa saat', 'white', 'red', 3, false)
				});
		},
		download(id, title, k){
			//console.log(this.listOfItems[k]['downloaded'])
			if(this.listOfItems[k]['downloaded']){
				// let openf = new ShareFile();
				// openf.open( { 
					// path: this.listOfItems[k]['downloaded_path'], 
					// intentTitle: 'Open file with:', // optional Android
					// rect: { // optional iPad
						// x: 110,
						// y: 110,
						// width: 0,
						// height: 0
					// },
					// options: true, // optional iOS
					// animated: true // optional iOS
				// });
				// snackbar.simple('Mp3 tersimpan di folder Download', 'white', '#3498db', 3, false)
				return false
			}
			console.log('Start Download')
			console.log(title)
			this.listOfItems[k]['download_text'] = 'Preparing...'
			let url = "http://18.218.193.86:8889/ymp3?id=https://www.youtube.com/watch?v="+id+"&title="+title
			console.log(url)
			fetch(url)
				.then((response) => response.json())
				.then((r) => {
					if(r.file){
						this.listOfItems[k]['download_text'] = 'Downloading...'
						this.pull_file(title,k);
					}
				})
				.catch((e) => {
					this.listOfItems[k]['download_text'] = 'Download'
					snackbar.simple('Terjadi kesalahan, ketika generate mp3', 'white', 'red', 3, false)
				});
		},
		pull_file(filename, k){
			console.log(`download file ${filename}`)
			download.addProgressCallback(progress => {
				this.listOfItems[k]['download_text'] = 'Downloading '+(Math.round(progress*100))+'%'
			})
			download.downloadFile("http://18.218.193.86/converter/"+filename+".mp3").then(file => {
				console.log("Success", file);
				
				console.log(123)
				var documents = fs.knownFolders.documents();
				let fileName = file._name;
				var path = fs.path.join(documents.path, fileName);
				
				console.log(fs.File.fromPath(path))
				let downloadedFilePath = fs.path.join(android.os.Environment.getExternalStoragePublicDirectory(android.os.Environment.DIRECTORY_DOWNLOADS).getAbsolutePath(), fileName);
				console.log(downloadedFilePath)
				
				let mp3 = fs.File.fromPath(path)
				permissions.requestPermission(android.Manifest.permission.WRITE_EXTERNAL_STORAGE, "I need these permissions because I'm cool")
				  .then( () => {
					console.log("Woo Hoo, I have the power!");
					 let mp3ok = fs.File.fromPath(downloadedFilePath)
					const binarySource = mp3.readSync((err) => {
						console.log(err);
					});
					console.log(binarySource);
					
					mp3ok.writeSync(binarySource, (err) => {
							console.log(err);
						});		
					this.listOfItems[k]['downloaded'] = true
					this.listOfItems[k]['downloaded_path'] = downloadedFilePath
					
					snackbar.simple('Berhasil mendownload, mp3 tersimpan di folder Download', 'white', '#3498db', 3, false)
				  })
				  .catch( () => {
					 console.log("Uh oh, no permissions - plan B time!");
					 return false;
				  });
				
				this.listOfItems[k]['download_text'] = 'Open'
			}).catch(error => {
				this.listOfItems[k]['download_text'] = 'Download'
				snackbar.simple('Terjadi kesalahan, ketika mendownload mp3', 'white', 'red', 3, false)
			})
		},
		
		clean(str){
			return str.includes("Channel")
		},
		capitalizeFirstLetter(string) {
		  return string.charAt(0).toUpperCase() + string.slice(1);
		},
	},
	created(){		
		console.log('Mounted')
		this.fetcData()
		console.log('End Mounted');	
	},
	computed: {
		routerOptions() {
			return {
				transition: {
					name: 'slideRight'
				}
			}
		}
  }
}
</script>

<style scoped>
</style>
