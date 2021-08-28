<template>
  <div>
    <NavBar />
    <section>
      <section class="e4_band">
        <div class="container">
          <div class="e4_band_connect">
            <div class="header">
              <div class="e4_header">
                <h1 class="title">
                  E4 Band 설정
                  <span class="icon">
                    <b-icon icon="chevron-right"></b-icon>
                  </span>
                </h1>
                <p>E4 Band와 서버 간의 통신을 관리할 수 있습니다!!!</p>
              </div>
            </div>
            <div class="horizontalLine"></div>
            <div class="btn_contents">
              <div class="button">
                <span class="btn">
                  <b-button v-on:click="connectStart" size="" variant="dark">연결 시작</b-button>
                </span>
                <span class="btn">
                  <b-button v-on:click="connectEnd" size="" variant="dark">연결 종료</b-button>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>
  </div>
</template>

<script>
import NavBar from "@/components/NavBar";
// import Player from "@/components/Player";
// import Graph from "@/components/Graph";
// import LineChart from "@/components/LineChart";

export default {
  name: "Main",
  components: { NavBar },
  data() {
    return {
      videoUrl: "https://dt1amnyxy57si.cloudfront.net/videos/노태형_2.mp4",
      fetched: true,
    };
  },
  computed: {},
  methods: {
    connectStart: function() {
      this.$http
        .post("/connect/start", {
          state: !this.connection,
          name: this.selected,
        })
        .then((result) => {
          console.log(result.data);
        });
    },
    connectEnd: function() {
      this.$http
        .post("/connect/end", {
          state: this.connection,
        })
        .then((result) => {
          console.log(result.data);
        });
    },
  },
  beforeMount() {},
};
</script>

<style scoped>
.verticalLine {
  border-left: 1px solid darkgrey;
}

h1 {
  margin: 0;
}

img {
  width: 150px;
}

p {
  margin: 0;
  margin-top: 4px;
  color: #757575;
}

.content-wrapper {
  height: 150vh;
  background-color: #f0f0f0;
}

.e4_band {
  padding-top: 24px;
  padding-bottom: 24px;
  padding-right: 50px;
  padding-left: 50px;
}

.container {
  flex-grow: 1;
  margin: 0 auto;
  position: relative;
  width: auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 10px;
}

.title {
  font-size: 2rem;
  line-height: 1.5;
  font-weight: 700;
}

.button {
  /* border: solid; */
  display: flex;
  padding: 6px 0;
}
.icon {
  box-sizing: content-box;
  font-size: inherit;
  width: 1rem;
  height: 1rem;
  line-height: 1;
}
.horizontalLine {
  border-bottom: 1px solid black;
}
</style>
