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
					  <Image src="~/assets/images/logo.png" width="50%" />
					  <Label text="Download Mp3 File Gratis." textWrap="true" color="black" textAlignment="center" />
					  <Label text="Download file audio disini gratis. Anda sisa mencari menggunakan kata kunci pada kolom di bawah." marginTop="4" textWrap="true" textAlignment="center" />
					  
					  <WrapLayout paddingTop="10">
							<StackLayout width="100%"  borderWidth="1" borderColor="#d8d8d8" >
								<TextField v-model="query" hint="Didi Kempot Pemer Bojo" paddingBottom="5" :borderBottomColor="active2 ? '#4285f4' : '#ced4da'" borderBottomWidth="1" @focus="active2 = true" @blur="active2 = false" />
							</StackLayout>
							<StackLayout width="100%">
								<MDBBtn text="Cari" backgroundColor="#2980b9" color="white" marginTop="15" horizontalAlignment="center" @tap.native="find" />
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

export default {
	name: 'Home',
	data(){
		return{
			title:'Welcome',
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
	}
}
</script>

<style scoped>

</style>
