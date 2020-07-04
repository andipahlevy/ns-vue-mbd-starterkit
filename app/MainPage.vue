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
					  
					  <WrapLayout marginTop="10">
					  <MDBCard title="Kolom Pencarian" text="Silahkan masukkan kata kunci anda">
						<StackLayout width="100%">
							<TextField v-model="query" hint="Lagu Rock" paddingBottom="5" :borderBottomColor="active2 ? '#4285f4' : '#ced4da'" borderBottomWidth="1" @focus="active2 = true" @blur="active2 = false" />
						</StackLayout>
						<MDBBtn icon="search" @tap.native="find" text="Cari" mdbColor="primary" marginTop="15" />
						<MDBBtn text="Reset" @tap.native="reset" backgroundColor="#fff" color="#000" marginTop="15" />
					  </MDBCard>
					</WrapLayout>
					  
					  <WrapLayout marginTop="10">
						  <MDBCard img="~/assets/images/logo190.jpg" title="Daftar Lagu Tersimpan" text="Dengarkan Mp3 secara offline disini">
							<MDBBtn text="Lihat" mdbColor="primary" marginTop="15" />
						  </MDBCard>
					  </WrapLayout>
				</StackLayout>
				  

			</StackLayout>
		</ScrollView>
	</RadSideDrawer>
  </Page>
</template>

<script>


import { Navigation } from './views/Navigation'
import { MDBCard } from './components/Components/Card'
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
			query : 'Suara Ayam',
		}
	},
	components: {
		Navigation,
		MDBBtn,
		MDBCard,
		MDBIcon,
		Leftside,
	},
	methods: {
		reset(){
			this.query = ''
		},
		find(){
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
		this.$store.dispatch("query");
	},
}
</script>

<style scoped>

</style>
