<template>
	<StackLayout ~drawerContent backgroundColor="#34495e">
		<Label class="drawer-header" text="Welcome" @tap="$goto('mainpage')"/>
		<Label class="drawer-item" text="Home"/>
		<Label class="drawer-item" text="List Download"/>
		<Label class="drawer-item" text="Keluar"/>
	</StackLayout>
</template>
 
<script>
const app = require("application");
export default {
    data () {
		return {
			
		};
    },
	methods:{
		exit(){
			confirm('Apakah anda ingin menutup aplikasi?')
			  .then(result => {
				if(result){
					android.os.Process.killProcess(android.os.Process.myPid())
				}else{
				
				}
			});
		}
	}
};
</script>

<style scoped>
.drawer-header {
	padding: 50 16 16 16;
	margin-bottom: 20;
	margin-top: 0;
	background-color: #2c3e50;
	color: #ffffff;
	font-size: 24;
}

.drawer-item {
	padding: 2 16;
	color: #fff;
	font-size: 16;
}
Label{
	color:#fff;
	margin:10px 0px;
}
.leftCls{
	font-weight:500;
	background: rgb(1,1,9);
	background: linear-gradient(0deg, rgba(1,1,9,1) 0%, rgba(180,182,182,0.700717787114846) 100%, rgba(212,212,219,0) 100%);
}
</style>
