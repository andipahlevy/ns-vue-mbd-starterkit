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
				  <Button v-if="reload" @tap="fetcData">
					  <FormattedString>
						<Span text="Reload" />
					  </FormattedString>
					</Button>
				  <ActivityIndicator marginTop="10" v-if="busyIndicator" :busy="busyIndicator" @busyChange="onBusyChanged" />
			</StackLayout> 
			<WrapLayout v-for="(item,k) in listOfItems" :key="k" padding="10" borderWidth="0" borderColor="#d8d8d8">
				<MDBCard v-if="!clean(item.title)">
					<StackLayout>
					  <Label :text="item.title" fontSize="15" class="mdb-font-bold" color="black" />
					  <Label :text="item.duration" fontSize="12" paddingTop="2" />
					  <WrapLayout>
						<MDBBtn :text="item.download_text" :backgroundColor="item.btn_color" color="white" marginTop="15" padding="10" 
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
import ModalComponent from "./Modal";
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
			busyIndicator: true,
			reload:false
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
			
			this.busyIndicator =  true
			this.reload = false
			console.log('Start fetc data')
			fetch("http://videv.online/cv/SHD/example/coba.php?token=c27e08db3072576643542c8a37dfdc07&q="+this.query)
				.then((response) => response.json())
				.then((r) => {
					if(r.code == 400){
						snackbar.simple('Terjadi kesalahan, tunggu beberapa saat', 'white', 'red', 3, false)
						this.busyIndicator =  false
						this.reload = true
						return false
					}else{
						this.busyIndicator =  false
							
						if(r.contents.length === 0){
							snackbar.simple('Tidak ada data ditemukan. Coba lagi', 'white', 'red', 3, false)
							this.reload = true
							return false
						}
						r.contents.forEach(v=>{
							let ceki = this.$store.state.data.filter(c => c.vid === v.vid)
							if(ceki.length === 0){
								this.listOfItems.push(
									{
										title:this.capitalizeFirstLetter(v.title.replace(/[^a-zA-Z0-9\- ]/g, "")), 
										duration:v.duration, 
										vid:v.vid,
										download_text:'Download',
										downloaded:false,
										downloaded_path:null,
										btn_color:'#7f8c8d',
										pic:v.img,
									}
								)
							}else{
								this.listOfItems.push(
									{
										title:this.capitalizeFirstLetter(v.title.replace(/[^a-zA-Z0-9\- ]/g, "")), 
										duration:v.duration, 
										vid:v.vid,
										download_text:'Play',
										downloaded:true,
										downloaded_path:ceki[0].path,
										btn_color:'#27ae60',
										pic:v.img,
									}
								)
							}							
						})
					}
					
					console.log('end fetc data')
					this.busyIndicator =  false
				})
				.catch((e) => {
					this.busyIndicator =  false
					snackbar.simple('Terjadi kesalahan, tunggu beberapa saat', 'white', 'red', 3, false)
				});
		},
		download(id, title, k){
			if(this.listOfItems[k]['downloaded']){
				this.$showModal(ModalComponent, { props: { mp3: this.listOfItems[k]['downloaded_path'], pic:this.listOfItems[k]['pic'] }, fullscreen: false});
				return false
			}
			console.log('Start Download')
			console.log(title)
			this.listOfItems[k]['download_text'] = 'Preparing...'
			let newTitle = title.replace(/[^a-zA-Z0-9\- ]/g, "").split(' ').join('-')
			let url = "http://18.218.193.86:8889/ymp3?id=https://www.youtube.com/watch?v="+id+"&title="+newTitle
			console.log(url)
			fetch(url)
				.then((response) => response.json())
				.then((r) => {
					if(r.file){
						this.listOfItems[k]['download_text'] = 'Downloading...'
						this.pull_file(newTitle,k);
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
			console.log("Cekidot:")
			console.log("http://videv.online/converter/"+filename+".mp3")
			download.downloadFile("http://videv.online/converter/"+filename+".mp3").then(file => { 
				console.log("Success", file);
				
				var documents = fs.knownFolders.documents();
				let fileName = file._name;
				var path = fs.path.join(documents.path, fileName);
				
				console.log(fs.File.fromPath(path))
				let downloadedFilePath = fs.path.join(android.os.Environment.getExternalStoragePublicDirectory(android.os.Environment.DIRECTORY_DOWNLOADS).getAbsolutePath(), fileName);
				console.log(downloadedFilePath)
				
				let mp3 = fs.File.fromPath(path)
				permissions.requestPermission(android.Manifest.permission.WRITE_EXTERNAL_STORAGE, "I need these permissions because I'm cool")
				  .then( () => {
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
					console.log('insert data:');
					console.log({vid:this.listOfItems[k]['vid'],title:fileName, path:downloadedFilePath});
					this.$store.dispatch("insert", {vid:this.listOfItems[k]['vid'],title:fileName, path:downloadedFilePath});
					// snackbar.simple('Berhasil mendownload, mp3 tersimpan di folder Download', 'white', '#3498db', 3, false)
				  })
				  .catch( () => {
					 console.log("Uh oh, no permissions - plan B time!");
					 return false;
				  });
				
				this.listOfItems[k]['download_text'] = 'Play'
				this.listOfItems[k]['btn_color'] = '#27ae60'
			}).catch(error => {
				this.listOfItems[k]['download_text'] = 'Download'
				snackbar.simple('Terjadi kesalahan, ketika mendownload mp3', 'white', 'red', 3, false)
			})
		},
		
		clean(str){
			return str.includes("Channel")
		},
		capitalizeFirstLetter(string) {
		  return this.replace_all(string.charAt(0).toUpperCase() + string.slice(1), {'lirik':'','Lirik':'','Lyrics':'','lyrics':'','lyric':'','Lyric':'','Official':'','official':''});
		},
		replace_all(str, obj) {
			var retStr = str;
			for (var x in obj) {
				retStr = retStr.replace(new RegExp(x, 'g'), obj[x]);
			}
			return retStr;
		}
	},
	created(){		
		this.fetcData()
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
