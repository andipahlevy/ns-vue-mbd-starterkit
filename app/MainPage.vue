<template>
  <Page>
	<ActionBar :title="title">
		<Label :text="title" fontSize="20" paddingRight="10" />
		<NavigationButton android.systemIcon="ic_menu" @tap="$refs.drawer.nativeView.showDrawer()" />
			
	</ActionBar>
	<RadSideDrawer ref="drawer">
		
	 
		<leftside/>
		<ScrollView ~mainContent>
			<StackLayout>
				<StackLayout padding="20 10 10 10">
					  <Image @tap="ceki" src="~/assets/images/logo190.jpg" width="30%" marginBottom="10" />
					  <Label text="Download File Audio Mp3 Gratis!" textWrap="true" color="black" textAlignment="center" />
					  <Label text="Silahkan masukkan kata kunci anda" marginTop="4" textWrap="true" textAlignment="center" />
					  
					  <WrapLayout paddingTop="10">
							<StackLayout width="100%"  borderWidth="1" borderColor="#d8d8d8" >
								<TextField v-model="query" hint="Didi Kempot Pemer Bojo" paddingBottom="5" :borderBottomColor="active2 ? '#4285f4' : '#ced4da'" borderBottomWidth="1" @focus="active2 = true" @blur="active2 = false" />
							</StackLayout>
							<StackLayout width="100%">
								<MDBBtn text="Cari" backgroundColor="#2ed573" color="white" marginTop="15" horizontalAlignment="center" @tap.native="find" />
							</StackLayout>
					  </WrapLayout>
				</StackLayout>
				  

			</StackLayout>
		</ScrollView>
	</RadSideDrawer>
  </Page>
</template>

<script>
import { Navigation } from './views/Navigation'
import { MDBBtn } from './components/Components/Button'
import { MDBIcon } from './components/Content/Icon'
import { SnackBar, SnackBarOptions } from "@nstudio/nativescript-snackbar"
import search from './page/SearchResult'
import Leftside from './page/Leftside'
import * as fs from "tns-core-modules/file-system"
const permissions = require('nativescript-permissions');
import ModalComponent from "./page/Modal";

export default {
	name: 'Home',
	data(){
		return{
			title:'MP3 Music Downloader',
			query : '',
		}
	},
	components: {
		Navigation,
		MDBBtn,
		MDBIcon,
		Leftside
	},
	methods: {
		find(){
			console.log(223);
			this.$showModal(ModalComponent, { props: { id: 14 }, fullscreen: false});
		},
		findx(){
			console.log(123)
			if(this.query == '' || this.query === null){
				console.log(234)
				const snackbar = new SnackBar()
				snackbar.simple('Kolom pencarian masih kosong', 'white', 'red', 3, false)
			}else{
				console.log(222)
				this.$navigateTo(search,{props:{'query':this.query}});
				
				//this.$refs.drawer.nativeView.showDrawer() 
			}
		},
		onCloseDrawerTap() {
		  //this.$refs.drawer.closeDrawer();
		},
		
		onOpenDrawerTap() {
			console.log(2223)
			this.$refs.drawer.nativeView.showDrawer()
		},
		ceki(){
			console.log(123)
			var documents = fs.knownFolders.documents();
			let fileName = 'Didi Kempot - Cidro [OFFICIAL].mp3';
			var path = fs.path.join(documents.path, fileName);
			
			console.log(fs.File.fromPath(path))
			let downloadedFilePath = fs.path.join(android.os.Environment.getExternalStoragePublicDirectory(android.os.Environment.DIRECTORY_DOWNLOADS).getAbsolutePath(), fileName);
            console.log(downloadedFilePath)
			
			let mp3 = fs.File.fromPath(path)
			permissions.requestPermission(android.Manifest.permission.WRITE_EXTERNAL_STORAGE, "I need these permissions because I'm cool")
			  .then( () => {
				console.log("Woo Hoo, I have the power!");
				 let mp3ok = fs.File.fromPath('/storage/emulated/0/Download/Didi Kempot - Cidro [OFFICIAL].mp3')
				const binarySource = mp3.readSync((err) => {
					console.log(err);
				});
				console.log(binarySource);
				
				mp3ok.writeSync(binarySource, (err) => {
						console.log(err);
					});				
			  })
			  .catch( () => {
				 console.log("Uh oh, no permissions - plan B time!");
				 return false;
			  });
			
		},
	},
	created(){
		
	},
}
</script>

<style scoped>

</style>
