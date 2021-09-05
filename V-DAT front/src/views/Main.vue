<template>
  <div>
    <header>
      <NavBar />
    </header>
    <body>
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
              <section>
                <h1 class="title">
                  E4 밴드의 이름, 서버 ip주소, 포트 번호를 입력 받는 부분 입니다(임시)
                </h1>
                <h3>
                  E4 band name
                  <b-form-input v-model="deviceId" placeholder="Please input E4 band Name"></b-form-input>
                  {{ deviceId }}
                </h3>
                <h3>
                  Server IP address
                  <b-form-input v-model="serverIp" placeholder="Please input E4 server IP"></b-form-input>
                  {{ serverIp }}
                </h3>
                <h3>
                  Port number
                  <b-form-input v-model="e4Port" placeholder="Please input E4 port number"></b-form-input>
                </h3>
                <div class="btn_contents">
                  <h1 class="title">Select sensor data</h1>
                  <div class="button">
                    <span v-for="sensor in sensors" :key="sensor.name" class="btn">
                      <!-- <b-button squared :pressed.sync="sensor.state" variant="primary">{{ sensor.name }}</b-button> -->
                      <b-form-checkbox v-model="sensor.state">{{ sensor.name }}</b-form-checkbox>
                    </span>
                  </div>
                </div>
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
              </section>
              <div class="horizontalLine"></div>
              <section>
                <h1 class="title">
                  HMD, Eye tracker와 연결을 준비하는 부분 입니다(임시)
                </h1>
                <div class="btn_contents">
                  <div class="button">
                    <span class="btn">
                      <b-button variant="dark">연결 시작</b-button>
                    </span>
                    <span class="btn">
                      <b-button variant="dark">연결 종료</b-button>
                    </span>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </section>
        <section>
          <router-link to="anal">
            <b-button>분석 시작</b-button>
          </router-link>
        </section>
      </section>
    </body>
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
      state: false,
      deviceId: "",
      serverIp: "",
      e4Port: null,
      sensors: [
        { name: "E4 ACC", state: false },
        { name: "E4 BVP", state: false },
        { name: "E4 TEMP", state: false },
        { name: "E4 GSR", state: false },
        { name: "E4 IBI", state: false },
      ],
    };
  },
  computed: {},
  methods: {
    connectStart: function() {
      let temp = new Array();
      this.sensors.forEach((element, index) => {
        if (element.state == true) {
          temp.push(index);
        }
      });

      this.$http
        .post("/connect/start", {
          state: !this.connection,
          deviceId: this.deviceId,
          serverIp: this.serverIp,
          e4Port: this.e4Port,
          sensor: temp,
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
  justify-content: center;
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
