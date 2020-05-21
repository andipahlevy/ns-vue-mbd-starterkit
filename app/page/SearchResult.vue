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
			</StackLayout> 
			<WrapLayout v-for="item in listOfItems" key="i" padding="10" borderWidth="0" borderColor="#d8d8d8">
				<MDBCard v-if="!clean(item.title)">
					<StackLayout>
					  <Label :text="item.title" fontSize="15" class="mdb-font-bold" color="black" />
					  <Label :text="item.duration" fontSize="12" paddingTop="2" />
					  <WrapLayout>
						<MDBBtn text="Download" backgroundColor="#2980b9" color="white" marginTop="15" 
							horizontalAlignment="center" 
							@tap.native="download(item.vid, item.title)" />
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

export default {
	name: 'Search',
	data(){
		return{
			title:'Pencarian',
			listOfItems: []
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
			fetch("http://18.218.193.86:8889/youtube/search?q="+this.query)
				.then((response) => response.json())
				.then((r) => {
					console.log(r[0])
					this.listOfItems = r
					console.log('end fetc data')
				})
				.catch((e) => {
					console.log(e)
				});
		},
		download(id, title){
			console.log('Start Download')
			console.log(title)
			let url = "http://18.218.193.86:8890/ymp3?id=https://www.youtube.com/watch?v="+id+"&title="+title
			console.log(url)
			fetch(url)
				.then((response) => response.json())
				.then((r) => {
					if(r.file){
						
					}
				})
				.catch((e) => {
					console.log('error')
				});
		},
		pull_file(){
			
		},
		clean(str){
			return str.includes("Channel");
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
