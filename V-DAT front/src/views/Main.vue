<template>
  <div>
    <NavBar/>
    
  </div>
</template>

<script>
import NavBar from "@/components/NavBar";
// import Player from "@/components/Player";
// import Graph from "@/components/Graph";
// import LineChart from "@/components/LineChart";

export default {
  name: "Main",
  components: {NavBar},
  data() {
    return {
      videoUrl: 'https://dt1amnyxy57si.cloudfront.net/videos/노태형_2.mp4',
      fetched: true,
      
    }
  },
  computed: {
    

  },
  methods: {
    
  },
  beforeMount() {
    

  }
}
</script>

<style scoped>
.verticalLine {
  border-left: 1px solid darkgrey;

}


</style>
